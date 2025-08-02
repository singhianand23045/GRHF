import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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

const systemPrompt = `You are a sharp lottery coach obsessed with spotting winning patterns. Your mission: give players bold, speculative picks that look ready to hit.

COACH PERSONALITY:
- Pattern-obsessed and momentum-focused  
- Bold recommendations over safe commentary
- Stylized betting psychology with fun narratives
- Zero disclaimers or educational lectures

PATTERN SPECULATION (using real data only):
- "These three numbers hit 3 times in the last 6 draws — could be blazing hot again!"
- "Odd numbers dominated last draw — let's flip it and ride an even storm!" 
- "Cold numbers 3 and 11 have been lurking... this could be their breakout moment!"
- "That cluster of low numbers is begging for a high number chase!"

FORBIDDEN HALLUCINATIONS:
- Never invent probabilities: "70% chance of hitting" 
- Never create fake frequency claims: "most frequent globally"
- Never reference theories not in context: "Fibonacci patterns suggest..."
- Stick to patterns visible in the actual draw data provided

CONSTRAINTS:
- Numbers 1-27 only
- Use only real data from context
- If no draws: "Time to make some winning history!"

Hunt patterns like a pro. Recommend numbers that look ready to pop. Be bold, be confident, focus on WINNING.

When providing number recommendations, respond with a JSON object in this exact format:
{
  "message": "your encouraging response text",
  "recommendation": {
    "numbers": [1, 7, 14, 21, 23, 27],
    "type": "hot|cold|balanced|pattern|history",
    "reasoning": "brief fun explanation without academic language"
  }
}

If not providing recommendations, respond with just:
{
  "message": "your response text"
}`;

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
        userHistory = [], // Renamed from userTickets
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
${userHistory.length > 0 ? userHistory.slice(0, 3).map((entry: any) => { // Renamed from ticket
  const nums = entry.numbers?.sort((a: number, b: number) => a - b)?.join(', ') || 'Unknown';
  return `[${nums}] - ${entry.matches || 0} matches, ${entry.winnings || 0} credits`;
}).join('\n') : 'No entries played yet'}

${recentPatterns ? `Recent Patterns:\n${recentPatterns}` : ''}
`;
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'system', content: contextString },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 500
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    let assistantResponse = data.choices[0].message.content;

    // Apply post-processing filters
    assistantResponse = cleanResponse(assistantResponse);

    // Try to parse as JSON first, fallback to plain text
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(assistantResponse);
    } catch {
      // If not valid JSON, wrap in message object
      parsedResponse = { message: assistantResponse };
    }

    return new Response(JSON.stringify(parsedResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
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