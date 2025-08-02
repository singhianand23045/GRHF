# Phase 10: Number Picking Strategies - Analytical Tools

## Overview

This phase defines the specialized analytical tools that the Play Assistant will leverage to generate sophisticated number recommendations. These tools provide precise, data-driven insights, which the Assistant will then interpret and present to the player.

## User Stories

*   As a player, I want the Assistant to help me find numbers that frequently appear together or are long overdue, so I can pick combinations with a higher "momentum" or "potential."
*   As a player, I want to use systematic methods like "wheeling" to generate multiple number sets from a larger pool of my chosen numbers, to increase my chances of hitting a prize.
*   As a player, I want to get number recommendations based on personal lucky factors like my astrological sign, to add a unique touch to my picks.
*   As a player, I want the Assistant to analyze my past entries and draw results to suggest numbers that might improve my future performance, turning "near misses" into wins.
*   As a player, when the Assistant recommends multiple sets of numbers (e.g., from a wheeling strategy), I want to see them clearly presented with individual options to confirm each set.

## Core Functional Requirements (Tools)

*   **Tool Invocation:** These tools are designed to be called by an orchestrating system (e.g., an LLM or a client-side logic layer) to generate precise number recommendations.
*   **Output Format:** Each tool will return its results in a structured format, typically an array of 6-number arrays, or a single 6-number array.
*   **Number Range Constraint:** All generated numbers must be strictly within the 1-27 range. The tools must prevent any numbers outside this range from being generated.

## Specific Strategy Tools

### 1. Hot/Cold Combinations (Pairs & Triplets)

*   **Description:** Identifies numbers that have frequently appeared together ("hot pairs/triplets") or have been absent for a long time ("cold pairs/triplets") in recent draw history.
*   **Tool/Function Concept:** `getFrequentCombinations(type: 'pair' | 'triplet', status: 'hot' | 'cold', count: number)`
    *   **Input:**
        *   `type`: Specifies whether to find 'pair' or 'triplet' combinations.
        *   `status`: Specifies whether to find 'hot' (most frequent) or 'cold' (least frequent/overdue) combinations.
        *   `count`: The number of top combinations to return.
    *   **Logic:** Analyzes `drawHistory` to calculate co-occurrence frequencies.
    *   **Output Format:** Returns a `number[][]` (array of number arrays), where each inner array represents a combination (e.g., `[[1, 5], [10, 22], [7, 14, 21]]`).
*   **Acceptance Criteria:**
    *   [ ] The tool can identify and return hot/cold pairs and triplets.
    *   [ ] Results are based solely on the provided `drawHistory` data.

### 2. Wheeling Strategies (Jackpot Blueprint)

*   **Description:** Generates multiple 6-number sets from a larger pool of user-selected numbers, based on a pre-defined wheeling system, to provide specific prize guarantees if a certain number of drawn numbers fall within the pool.
*   **Tool/Function Concept:** `generateWheelingSets(strategy: 'basic_7_3' | 'basic_8_4', pool: number[])`
    *   **Input:**
        *   `strategy`: The specific wheeling system to apply (e.g., 'basic_7_3' for 7 numbers, guarantee 3 if 3 hit; 'basic_8_4' for 8 numbers, guarantee 4 if 4 hit).
        *   `pool`: An array of numbers provided by the user (e.g., 7 or 8 numbers).
    *   **Logic:** Applies the specified wheeling system to the input `pool` to generate combinations.
    *   **Output Format:** Returns a `number[][]` (array of 6-number arrays, e.g., `[[3,7,11,15,19,23], [3,7,11,15,19,27], [7,11,15,19,23,27]]`).
*   **Acceptance Criteria:**
    *   [ ] The tool can generate multiple 6-number sets based on user-provided numbers and a selected wheeling strategy.
    *   [ ] Each generated set contains exactly 6 numbers.

### 3. Horoscope/Lucky Numbers (Cosmic Alignment)

*   **Description:** Provides a set of 6 numbers based on the user's astrological sign or other pre-defined "lucky" factors.
*   **Tool/Function Concept:** `getHoroscopeNumbers(zodiacSign: string)`
    *   **Input:**
        *   `zodiacSign`: The astrological sign (e.g., 'Leo', 'Aries').
    *   **Logic:** Performs a lookup or deterministic calculation to return 6 numbers associated with the given sign.
    *   **Output Format:** Returns a `number[]` (a single array of 6 numbers, e.g., `[3, 7, 12, 21, 25, 27]`).
*   **Acceptance Criteria:**
    *   [ ] The tool can provide horoscope-based number recommendations.
    *   [ ] The recommendations are consistent for a given input (e.g., "Leo" always yields the same numbers).

### 4. User History-Based Suggestions (Battle-Tested Insights)

*   **Description:** Analyzes the player's past entries and draw results to identify personal patterns, "near misses," or numbers that have historically performed well (or poorly) in conjunction with their picks.
*   **Tool/Function Concept:** `analyzeUserPerformance(walletHistory: EntryType[], drawHistory: DrawHistoryEntry[])`
    *   **Input:**
        *   `walletHistory`: The user's past lottery entries.
        *   `drawHistory`: The historical draw results.
    *   **Logic:** Processes `walletHistory` and `drawHistory` to extract insights (e.g., most frequent user picks, numbers that appeared in 5/6 matches, numbers that consistently appeared *around* user's picks). Generates a new 6-number set based on these insights.
    *   **Output Format:** Returns a `number[]` (a single array of 6 numbers, e.g., `[5, 10, 18, 22, 24, 27]`).
*   **Acceptance Criteria:**
    *   [ ] The tool can generate number recommendations based on the user's historical play data.
    *   [ ] The recommendations are derived from actual past performance data.