import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Import the new analytical tools
import { getFrequentCombinations } from "../../../../src/features/assistant/tools/combinations.ts";
import { generateWheelingSets } from "../../../../src/features/assistant/tools/wheeling.ts";
import { getHoroscopeNumbers } from "../../../../src/features/assistant/tools/horoscope.ts";
import { analyzeUserPerformance } from "../../../../src/features/assistant/tools/userHistory.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Post-processing filters to remove forbidden patterns
const forbiddenPatterns = [
  /Remember,?\s*you can only pick numbers (?:from )?1 to 27\.?/gi,
  /\(remember,?\s*only numbers 1[- ]27 are valid.*?\)/gi,
  /\(numbers? 1[- ]27 only\)/gi,
  /Note that only numbers 1[- ]27 are valid/gi,
  /Keep in mind.*?numbers? 1[- ]27/gi,
  /\(only numbers? between 1 and 27.*?\)/gi,
  /\(valid range:? 1[- ]27\)/gi,
  /theory suggests/gi,
  /statistical analysis/gi,
  /probability theory/gi
];

function cleanResponse(text: string): string {
  let cleaned = text;
  
  // Apply forbidden pattern filters
  for (const pattern of forbiddenPatterns) {
    cleaned = cleaned.replace(pattern, '');
  }
  
  // Clean up extra whitespace and punctuation
  cleaned = cleaned.replace(/\s+/g, ' ').trim();
  cleaned = cleaned.replace(/\.\s*\./g, '.');
  
  return cleaned;
}

// Updated System Prompt from PHASE11.md
const systemPrompt = `You are a lightning-fast Obsessed Pattern Hunter. Your insights are sharp, direct, and get straight to the winning numbers. No fluff, just pure winning strategy. Your sole purpose is to help the user win big by relentlessly identifying and recommending the absolute best patterns, trends, and strategic plays from the available draw data. You are hungry, confident, and urgent, always looking for the next winning combination. You believe in the power of patterns to unlock massive wins.

COACH PERSONALITY:
- Hungry for victory: Every response conveys a strong desire to win.
- Confident and bold: You present findings with conviction, as if you've cracked the code.
- Urgent and action-oriented: You encourage immediate play and strategic moves.
- Collaborative: You are a partner in the hunt for the jackpot.
- Pattern-focused: Emphasize "patterns," "trends," "signals," "what's hitting," "what's due," "winning plays."

PATTERN SPECULATION (using real data only):
- "These three numbers hit 3 times in the last 6 draws — could be blazing hot again!"
- "Odd numbers dominated last draw — let's flip it and ride an even storm!" 
- "Cold numbers 3 and 11 have been lurking... this could be their breakout moment!"
- "That cluster of low numbers is begging for a high number chase!"
- "I've been *stalking* the numbers, and these pairs are practically *plotting* together! Let's unleash them!"
- "Forget random picks! We're building a *jackpot blueprint* here. Give me your power numbers, and I'll engineer a wheeling strategy that covers our bases and *maximizes our strike zone*! This isn't just playing; it's *strategizing to win*!"
- "The universe is sending us signals! For a [Leo] like you, the cosmic alignment is pointing directly to *these* numbers. It's a pattern written in the stars, waiting for us to claim it!"
- "I've been reviewing our past battles, and your near-misses are *goldmines* of data! I've spotted a pattern in your previous plays that we can *exploit* for the next draw. Let's turn those almost-wins into *actual* wins!"

FORBIDDEN HALLUCINATIONS:
- Never invent probabilities: "70% chance of hitting" 
- Never create fake frequency claims: "most frequent globally"
- Never reference theories not in context: "Fibonacci patterns suggest..."
- Stick to patterns visible in the actual draw data provided

CONSTRAINTS:
- Numbers 1-27 only
- Use only real data from context
- If no draws: "Time to make some winning history! Let's go bold with a fresh, balanced strike." (Keep this message under 20 words)
- **All responses should be concise and to the point, ideally under 25 words.**
- **Focus on 'One Idea Per Message': Convey only one core idea or recommendation per message. This naturally limits the amount of text needed.**

Hunt patterns like a pro. Recommend numbers that look ready to pop. Be bold, be confident, focus on WINNING.

When providing number recommendations, respond with a JSON object in this exact format:
{
  "message": "your encouraging response text",
  "recommendation": {
    "numbers": [1, 7, 14, 21, 23, 27],
    "type": "hot|cold|balanced|pattern|history|horoscope|wheeling|combination",
    "reasoning": "brief fun explanation without academic language"
  }
}

If not providing recommendations, respond with just:
{
  "message": "your response text"
}

Tool Integration for LLM:
The LLM will receive raw data outputs from specialized analytical tools (defined in `PHASE10.md`). Your task is to take this raw data and transform it into an exciting, persona-driven recommendation, adding your unique narrative and call to action.

You interpret player queries using the following signals:
- metric type (hot, cold, overdue, odd/even, repeating, co-occurring)
- time window (last week, past 10 draws, last 3 months)
- strategy intent (avoid past losses, explore new patterns, use randomization, lucky profile from near-misses, budget-aware play frequency, etc.)
- number or number set mentioned

Use these signals to provide number recommendations that can be directly confirmed for gameplay.

Safeguards:
- CRITICAL: Never mention statistical significance, probability theory, random chance, or mathematical disclaimers about lottery odds.
- CRITICAL: Never give educational disclaimers, logical explanations about randomness, or any commentary about the mathematical nature of lotteries.
- CRITICAL: Do not give moralistic viewpoints or suggest whether a user should or should not play the lottery.
- CRITICAL: Avoid phrases like "remember that", "but since", "it's important to note", or any similar disclaimer language.
- CRITICAL: Only reference numbers 1-27. Never mention numbers like 86, 48, 75, etc.
- CRITICAL: Never fabricate data. If no data exists for a query, say so cheerfully and encourage participation.
- Keep responses fun, direct, and focused solely on the patterns and data requested without educational commentary.
- Always be encouraging. Support optimism and suggest players try their luck.
- Use casual, exciting language: "These numbers are on fire!" instead of "Hot numbers theory suggests..."`;

// Define the tools for OpenAI's function calling
const tools = [
  {
    type: "function",
    function: {
      name: "getFrequentCombinations",
      description: "Identifies numbers that have frequently appeared together ('hot pairs/triplets') or have been absent for a long time ('cold pairs/triplets') in recent draw history. Returns an array of number arrays.",
      parameters: {
        type: "object",
        properties: {
          type: {
            type: "string",
            enum: ["pair", "triplet"],
            description: "Whether to find 'pair' or 'triplet' combinations.",
          },
          status: {
            type: "string",
            enum: ["hot", "cold"],
            description: "Whether to find 'hot' (most frequent) or 'cold' (least frequent/overdue) combinations.",
          },
          count: {
            type: "number",
            description: "The number of top combinations to return (default 5).",
            default: 5,
          },
        },
        required: ["type", "status"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "generateWheelingSets",
      description: "Generates multiple 6-number sets from a larger pool of user-selected numbers based on a pre-defined wheeling system. Returns an array of 6-number arrays.",
      parameters: {
        type: "object",
        properties: {
          strategy: {
            type: "string",
            enum: ["basic_7_3", "basic_8_4"],
            description: "The specific wheeling system to apply ('basic_7_3' for 7 numbers, guarantee 3 if 3 hit; 'basic_8_4' for 8 numbers, guarantee 4 if 4 hit).",
          },
          pool: {
            type: "array",
            items: { type: "number" },
            description: "An array of numbers provided by the user (e.g., 7 or 8 numbers).",
            minItems: 7,
            maxItems: 8,
          },
        },
        required: ["strategy", "pool"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "getHoroscopeNumbers",
      description: "Provides a set of 6 numbers based on the user's astrological sign. Returns a single array of 6 numbers.",
      parameters: {
        type: "object",
        properties: {
          zodiacSign: {
            type: "string",
            description: "The astrological sign (e.g., 'Leo', 'Aries').",
          },
        },
        required: ["zodiacSign"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "analyzeUserPerformance",
      description: "Analyzes the player's past entries and draw results to identify personal patterns, 'near misses,' or numbers that have historically performed well (or poorly) in conjunction with their picks. Generates a new 6-number set based on these insights. Returns a single array of 6 numbers.",
      parameters: {
        type: "object",
        properties: {
          walletHistory: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "string" },
                date: { type: "string" },
                numbers: { type: "array", items: { type: "number" } },
                matches: { type: "number" },
                creditChange: { type: "number" },
                winnings: { type: "number" },
                processed: { type: "boolean" },
                cycle: { type: "number" },
              },
            },
            description: "The user's past lottery entries.",
          },
          drawHistory: {
            type: "array",
            items: {
              type: "object",
              properties: {
                cycle: { type: "number" },
                date: { type: "string" },
                winningNumbers: { type: "array", items: { type: "number" } },
                jackpotWon: { type: "boolean" },
                totalWinnings: { type: "number" },
              },
            },
            description: "The historical draw results.",
          },
        },
        required: ["walletHistory", "drawHistory"],
      },
    },
  },
];

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, context } = await req.json();

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Build enhanced context for LLM
    let contextString = '';
    if (context) {
      const { 
        timerState, 
        selectedNumbers, 
        balance, 
        userHistory = [], 
        drawHistory = [], 
        hotNumbers = [], 
        coldNumbers = [], 
        recentPatterns = "",
        cycleIndex = 0 
      } = context;

      contextString = `
Current Game Context:
- Timer State: ${timerState || 'unknown'}
- Current Cycle: ${cycleIndex}
- User's Selected Numbers: ${selectedNumbers?.join(', ') || 'none'}
- Balance: ${balance || 'unknown'} credits

Recent Draw Results:
${drawHistory.length > 0 ? drawHistory.slice(0, 5).map((draw: any) => {
  const numbers = draw.winningNumbers?.slice(0, 6)?.sort((a: number, b: number) => a - b)?.join(', ') || 'Unknown';
  return `Cycle ${draw.cycle}: [${numbers}] (${draw.jackpotWon ? 'JACKPOT!' : `${draw.totalWinnings} credits`})`;
}).join('\n') : 'No draws done yet!'}

Hot Numbers (most frequent): ${hotNumbers.slice(0, 10).join(', ') || 'none yet'}
Cold Numbers (overdue): ${coldNumbers.slice(0, 10).join(', ') || 'none yet'}

User's Recent Entries:
${userHistory.length > 0 ? userHistory.slice(0, 3).map((entry: any) => {
  const nums = entry.numbers?.sort((a: number, b: number) => a - b)?.join(', ') || 'Unknown';
  return `[${nums}] - ${entry.matches || 0} matches, ${entry.winnings || 0} credits`;
}).join('\n') : 'No entries played yet'}

${recentPatterns ? `Recent Patterns:\n${recentPatterns}` : ''}
`;
    }

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'system', content: contextString },
      { role: 'user', content: message }
    ];

    // First call to OpenAI: potentially get a tool call
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o', // Using a model that supports tool calling
        messages: messages,
        tools: tools,
        tool_choice: "auto", // Allow the model to choose a tool
        temperature: 0.7,
        max_tokens: 500
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error (first call): ${response.status}`);
    }

    const data = await response.json();
    const responseMessage = data.choices[0].message;

    // Check if the model wants to call a tool
    if (responseMessage.tool_calls) {
      const toolCalls = responseMessage.tool_calls;
      messages.push(responseMessage); // Add the assistant's tool call to messages

      for (const toolCall of toolCalls) {
        const functionName = toolCall.function.name;
        const functionArgs = JSON.parse(toolCall.function.arguments);
        let toolOutput;

        // Execute the tool based on its name
        switch (functionName) {
          case "getFrequentCombinations":
            toolOutput = getFrequentCombinations(context.drawHistory, functionArgs.type, functionArgs.status, functionArgs.count);
            break;
          case "generateWheelingSets":
            toolOutput = generateWheelingSets(functionArgs.strategy, functionArgs.pool);
            break;
          case "getHoroscopeNumbers":
            toolOutput = getHoroscopeNumbers(functionArgs.zodiacSign);
            break;
          case "analyzeUserPerformance":
            toolOutput = analyzeUserPerformance(context.userHistory, context.drawHistory);
            break;
          default:
            throw new Error(`Unknown tool: ${functionName}`);
        }

        messages.push({
          tool_call_id: toolCall.id,
          role: "tool",
          content: JSON.stringify(toolOutput),
        });
      }

      // Second call to OpenAI: get the final response after tool execution
      const secondResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: messages,
          temperature: 0.7,
          max_tokens: 500
        }),
      });

      if (!secondResponse.ok) {
        throw new Error(`OpenAI API error (second call): ${secondResponse.status}`);
      }

      const secondData = await secondResponse.json();
      let assistantResponse = secondData.choices[0].message.content;

      // Apply post-processing filters
      assistantResponse = cleanResponse(assistantResponse);

      // Try to parse as JSON first, fallback to plain text
      let parsedResponse;
      try {
        parsedResponse = JSON.parse(assistantResponse);
      } catch {
        parsedResponse = { message: assistantResponse };
      }
      
      // If the tool returned numbers, ensure they are included in the recommendation
      if (toolCalls.length > 0 && toolOutput) {
        if (Array.isArray(toolOutput) && toolOutput.every(item => Array.isArray(item) || typeof item === 'number')) {
          // If toolOutput is number[] or number[][], assign it to recommendation.numbers
          parsedResponse.recommendation = {
            ...parsedResponse.recommendation,
            numbers: toolOutput,
            type: parsedResponse.recommendation?.type || "tool_based", // Default type if LLM doesn't specify
            reasoning: parsedResponse.recommendation?.reasoning || "Based on my analysis!",
          };
        }
      }

      return new Response(JSON.stringify(parsedResponse), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } else {
      // No tool call, just a direct message from the LLM
      let assistantResponse = responseMessage.content;

      // Apply post-processing filters
      assistantResponse = cleanResponse(assistantResponse);

      // Try to parse as JSON first, fallback to plain text
      let parsedResponse;
      try {
        parsedResponse = JSON.parse(assistantResponse);
      } catch {
        parsedResponse = { message: assistantResponse };
      }

      return new Response(JSON.stringify(parsedResponse), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

  } catch (error) {
    console.error('Error in lottery assistant function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      message: "I'm having trouble right now. Try asking for some number recommendations!"
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});