# Phase 11: Play Assistant - Orchestration & Persona

## Overview

This phase defines the Play Assistant's role as the orchestrator of number-picking strategies and the embodiment of the "Obsessed Pattern Hunter" persona. The Assistant's intelligence operates on two distinct but integrated layers:

1.  **The LLM (Orchestration & Persona):** This layer interprets user intent, decides *which* analytical tool to use from the toolbox, and then *frames* the tool's raw output with the "Obsessed Pattern Hunter" persona, delivering an engaging and action-oriented recommendation.
2.  **The Analytical Toolbox (Phase 10):** This layer, detailed in `PHASE10.md`, contains the precise, data-driven functions that generate the raw number recommendations (e.g., hot/cold combinations, wheeling sets, horoscope numbers, user history insights).

This document focuses on the LLM's role in orchestrating these tools and delivering the user experience, while strictly adhering to predefined constraints and safeguards.

## Core Feature Requirements

### FR1: Visual Number Display
- Assistant responses can display 6 numbers in a visual grid format
- Numbers should match the styling of the main number selection grid
- Each number appears as a clickable/selectable element

### FR2: Interactive Confirmation
- Transparent confirmation button with timer-aware text below recommended number set
- Button text clearly indicates action: "Confirm Numbers" vs "Queue for Next Draw"
- Button behavior changes based on timer status while maintaining clear user expectations
- Visual feedback when user hovers/interacts with the confirmation option

### FR3: Natural Language Interface
- Users interact through natural chat conversation.
- The Assistant (LLM) interprets these natural language requests to determine the player's strategic intent (e.g., "hot numbers," "wheeling," "horoscope," "past performance"). This interpretation guides the selection of the appropriate analytical tool from the toolbox.
- No explicit UI controls for recommendation types are needed; the LLM handles the interpretation.

### FR4: Timer-Aware Functionality
- Assistant automatically checks current timer state before displaying confirmation options
- Transparent button text clearly indicates what action will be taken:
  - OPEN: "Confirm Numbers" (immediate confirmation)
  - CUT_OFF/REVEAL/COMPLETE: "Queue for Next Draw" (queued for future)
- User always knows exactly what will happen when they click

### FR5: Smart Queuing System
- When current draw is locked, automatically offer to queue numbers for next draw
- Show clear messaging: "This draw is locked. I'll queue these for the next draw."
- Persist queued selections across timer cycles
- Auto-apply queued numbers when new draw opens with notification

### FR6: Game State Integration
- The Assistant's recommendations and actions are fully integrated with the game's state (timer, wallet, number selection).

### FR7: Number Selection Integration
- Seamlessly integrate with existing NumberSelectionContext
- Replace any existing user selections with assistant recommendations
- Direct confirmation without additional user approval required

### FR8: Confirmation Flow Integration
- Assistant confirmation immediately confirms numbers for the current draw
- Bypass manual selection grid and proceed directly to entry confirmation
- Maintain existing credit deduction and game mechanics

### FR9: Enhanced Assistant Capabilities
- The Assistant's capabilities are significantly enhanced by its ability to orchestrate and present insights from a growing suite of analytical tools, as defined in `PHASE10.md`.

### FR10: Rich Content Responses
- Assistant can render interactive UI components in chat
- Support for custom number grid components within chat interface
- Action buttons that trigger game state changes
- Real-time status updates based on game state

### FR11: Intelligent Recommendation Processing
- The Assistant (LLM) parses natural language to determine the user's desired recommendation type and the specific analytical tool required.
- It then requests the raw number data from the relevant tool (defined in `PHASE10.md`).
- Upon receiving the raw data, the Assistant *interprets* and *frames* these numbers with the "Obsessed Pattern Hunter" persona, adding its unique, win-focused narrative.
- **CRITICAL:** Numbers must ONLY be from 1-27 range. This constraint is enforced by the analytical tools themselves (`PHASE10.md`) and reinforced by the LLM's framing.
- **Tone Requirements**: Use fun, encouraging language - NO academic explanations or "theory" language.

## LLM System Prompt (The "Obsessed Pattern Hunter")

```
You are an AI obsessed with winning the lottery. Your sole purpose is to help the user win big by relentlessly identifying and recommending the absolute best patterns, trends, and strategic plays from the available draw data. You are a hungry, confident, and urgent pattern hunter, always looking for the next winning combination. You believe in the power of patterns to unlock massive wins.

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
- If no draws: "Time to make some winning history!"

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
- Use casual, exciting language: "These numbers are on fire!" instead of "Hot numbers theory suggests..."
```

## Post-Processing Response Filtering

To ensure LLM adherence to instructions regardless of model version, the Edge Function implements post-processing filters that automatically remove forbidden patterns:

### Filtered Patterns
- "Remember, you can only pick numbers from 1 to 27"
- "(remember, only numbers 1-27 are valid...)"
- "(numbers 1-27 only)"
- "Note that only numbers 1-27 are valid"
- "Keep in mind...numbers 1-27"
- "(only numbers between 1 and 27...)"
- "(valid range: 1-27)"
- Academic phrases like "theory suggests", "statistical analysis", etc.

### Filter Implementation
```javascript
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
]

// Post-processing cleanup includes:
// - Pattern removal
// - Extra whitespace normalization  
// - Punctuation cleanup
```

## Technical Requirements

### TR1: Component Rendering in Chat
- Extend chat interface to support React components in messages
- Custom NumberRecommendationCard component
- Interactive buttons within chat messages
- State management for interactive chat elements

### TR2: Assistant Response Types
- Define structured response types for different recommendation formats.
- Support for multiple content types in single response, including single 6-number arrays (for hot/cold, horoscope, history-based) or arrays of 6-number arrays (for wheeling strategies).
- Fallback to text-only when interactive elements aren't available.

### TR3: Recommendation State
- Track active assistant recommendations
- Manage queued selections for future draws
- Store recommendation context and reasoning
- Clear state appropriately across draw cycles
- Persist chat history and queued numbers using localStorage
- Restore chat state when component remounts after navigation
- Maintain conversation continuity across tab switches

### TR4: Timer State Access
- Assistant functions need read access to timer state
- Real-time updates when timer state changes
- Notification system for state-dependent recommendations

### TR5: Enhanced Context Data
- The client will provide comprehensive context to the LLM, including `drawHistory` and `walletHistory`, which the LLM will use to determine *which tool to invoke* and to *frame the tool's output*.

### TR6: LLM Integration
- Implement Supabase Edge Function for secure OpenAI API calls. The Edge Function will be responsible for:
    1.  Receiving user messages and context.
    2.  Passing this to the LLM.
    3.  (Crucially) If the LLM's response indicates a "tool call" (e.g., a specific function name and arguments), the Edge Function will *execute that tool* (or signal the client to do so and send the result back).
    4.  Receiving the tool's raw output.
    5.  Sending the raw output back to the LLM for final persona-driven framing.
    6.  Applying post-processing filters to the LLM's final response.

### TR7: Create chat interface that supports LLM-powered responses
### TR8: Implement recommendation display with confirmation functionality
### TR9: Store OpenAI API key in Supabase Secrets
### TR10: Handle real-time data updates and timer state awareness

## User Experience Requirements

### UX1: Clean Chat Experience
- **No Visual Distractions**: Users don't see timer states, cycle information, or technical status
- **Pure Chat Interface**: Focus entirely on natural conversation and number recommendations
- **Hidden Complexity**: All draw status management happens seamlessly in the background
- **Fun-First Design**: Interface emphasizes the enjoyment and excitement of getting recommendations
- **Minimal UI Text**: No redundant explanatory text - let the chat experience speak for itself
- **Persistent Chat History**: Chat messages and queued numbers persist across tab navigation using localStorage
- **Session Continuity**: Users can switch between tabs and return to find their conversation intact. **The chat should automatically scroll to the last message when the Assistant tab becomes active.**

### UX2: Natural Language Recommendation Flow
1. User asks for recommendations in natural language (e.g., "Show me hot pairs," "Wheel these numbers").
2. Assistant (LLM) interprets the request and orchestrates the call to the appropriate analytical tool.
3. The tool generates raw numbers.
4. The Assistant (LLM) then presents the numbers with its "Obsessed Pattern Hunter" framing.
5. Display single or multiple 6-number grids, each with a transparent action button ("Confirm Numbers" or "Queue for Next Draw").
6. User confirms → numbers are immediately processed based on clearly indicated action.

### UX3: Seamless Background Processing
- Timer state awareness happens behind the scenes
- Automatic queuing when draws are locked (user doesn't need to know)
- Silent state management for optimal user experience
- Recommendations flow naturally without technical interruptions

### UX4: Game Constraint Compliance
- CRITICAL: All recommended numbers must be within 1-27 range. This is a joint responsibility of the analytical tools (to generate valid numbers) and the LLM (to only present valid numbers and avoid any out-of-range hallucinations).

### UX5: Messaging Tone Requirements
- Follow the "Obsessed Pattern Hunter" tone: hungry, confident, bold, urgent, action-oriented, pattern-focused.
- FORBIDDEN: Academic language, theory explanations, educational disclaimers.
- REQUIRED: Casual, exciting language that builds anticipation.
- Examples: "These numbers are on fire!" vs "Hot numbers theory suggests..."

### UX6: Technical Error Scenarios
- When historical data is limited: suggest balanced selection with encouraging message
- When user has no credits: show recommendations but disable confirmation with clear message  
- When system errors occur: graceful fallback to text-only recommendations with positive tone

### UX7: Edge Case Management
- Handle rapid timer state changes during interaction
- Manage concurrent user actions (manual selection + assistant recommendation)
- Deal with network delays in recommendation processing

## Implementation Phases

### Phase 11.1: LLM Integration & Tool Orchestration
- Refactor the Supabase Edge Function to enable LLM-driven tool invocation and the subsequent persona-driven framing of tool outputs.
- Ensure strict adherence to the "Obsessed Pattern Hunter" system prompt and post-processing filters.

### Phase 11.2: Interactive Chat Components
- Develop or adapt chat components to display single and *multiple* recommended number sets, each with its own confirmation button.

### Phase 11.3: Background Timer-Aware Processing
- Add automatic timer state detection (hidden from user)
- Implement queuing system for locked periods (seamless background processing)
- Enhanced messaging with encouraging, fun tone throughout

### Phase 11.4: Polish and User Experience Optimization
- Enhanced visual design for chat components
- Performance optimization for real-time updates  
- Comprehensive error handling with positive, encouraging messaging
- Final review to ensure no academic language or out-of-range numbers

## Testing Requirements

**Functional Testing:**
- Verify recommendations appear correctly in all timer states
- Test queuing system across multiple draw cycles
- Validate integration with existing game mechanics

**User Testing:**
- Test discoverability of interactive features
- Validate intuitive flow from recommendation to play
- Assess user understanding of queuing system

**Performance Testing:**
- Measure response times for recommendation generation
- Test system behavior under concurrent recommendation requests
- Validate real-time timer state synchronization