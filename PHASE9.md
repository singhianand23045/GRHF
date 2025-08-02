# Phase 9: Multiple Sets of Numbers

## Overview

This phase introduces the ability for players to submit multiple sets of numbers (up to three) for a single draw cycle. This enhances player engagement by allowing more chances to win and introduces a dynamic visual reveal for each set's matches during the draw phase.

## User Stories

*   As a player, I want to submit more than one set of numbers for a single draw, so I can increase my chances of winning.
*   As a player, I want to clearly see all my confirmed sets of numbers displayed on screen, so I can keep track of my entries.
*   As a player, I want to easily add additional sets of numbers after confirming my first one, without losing sight of my previous selections.
*   As a player, I want to see a distinct visual highlight for matches from each of my confirmed sets of numbers during the draw reveal, so I can understand how each set performed.
*   As a player, I want the final result message to summarize the winnings for all my confirmed sets of numbers in a draw.

## Functional Requirements

### 1. Number Set Submission & Management

*   **Maximum Sets:** A user can confirm and submit a maximum of **three (3)** sets of numbers per draw cycle.
*   **Confirmation Flow:**
    *   When the timer is in the "OPEN" phase (2:00 to 1:00), the user can select 6 numbers from the grid.
    *   Upon clicking "Confirm Numbers":
        *   The selected 6 numbers are recorded as a confirmed set of numbers.
        *   **30 credits** are immediately deducted from the user's wallet for each confirmed set.
        *   The `picked` numbers in the selection grid are cleared, and the grid is **hidden**.
        *   The newly confirmed set is displayed as a **row of circular chips**.
    *   If fewer than 3 sets are confirmed and the timer is still in the "OPEN" phase, an "Add next set of numbers" button appears below the displayed sets.
    *   Clicking "Add next set of numbers" makes the number selection grid reappear (empty), allowing the user to select a new set of 6 numbers for a subsequent entry. The previously confirmed sets remain visible above the grid.
    *   Once 3 sets are confirmed, the "Add next set of numbers" button disappears.
*   **Invalid Entries:** If the user selects fewer than 6 numbers or does not confirm their selection before the "CUT_OFF" phase, the entry is discarded, and no credits are deducted.
*   **Reset on New Cycle:** At the start of each new draw cycle (when `cycleIndex` changes), all confirmed sets for the previous cycle are cleared, and the number selection state resets to allow new entries.

### 2. Draw Reveal & Highlighting

*   **Initial Reveal (0:45 – 0:36):**
    *   The draw begins at 0:45. All 18 drawn numbers are revealed sequentially (row by row, matches first, then non-matches within each row) over 9 seconds (0.5s per number).
    *   Numbers matching the **first confirmed set** are highlighted in **green** as they appear.
*   **Set 1 Result Message & Crediting (0:35 – 0:33):**
    *   A message appears for 2 seconds: "Congrats! You won \[xyz] credits!" or "No matches. Wait for next set!".
    *   **The wallet is credited with winnings for Set 1 immediately when this message is displayed.**
*   **Second Set Overlay (0:32 – 0:26):**
    *   Numbers matching the **second confirmed set** are highlighted in **blue**. The highlights for these numbers will appear sequentially for each drawn number over this 6-second period.
    *   If a number matches both the first and second sets, its visual representation splits into two semi-circles (left half green, right half blue).
    *   **These highlights persist until the next game round.**
*   **Set 2 Result Message & Crediting (0:25 – 0:23):**
    *   A message appears for 2 seconds: "Congrats! You won \[xyz] credits!" or "No matches. Wait for next set!".
    *   **The wallet is credited with winnings for Set 2 immediately when this message is displayed.**
*   **Third Set Overlay (0:22 – 0:16):**
    *   If a third set exists, numbers matching the **third confirmed set** are highlighted in **orange**. The highlights for these numbers will appear sequentially for each drawn number over this 6-second period.
    *   For overlaps:
        *   If a number matches all three sets, its visual representation divides into three equal wedges (green/blue/orange).
        *   If it matches the third set and one other (e.g., Set 1 & 3, or Set 2 & 3), its visual representation splits into two halves (e.g., left half green, right half orange for Set 1 & 3).
    *   **These highlights persist until the next game round.**
*   **Set 3 Result Message & Crediting (0:15 – 0:13):**
    *   A message appears for 2 seconds: "Congrats! You won \[xyz] credits!" or "No matches. Wait for final result!".
    *   **The wallet is credited with winnings for Set 3 immediately when this message is displayed.**
*   **Persistence:** All revealed numbers and their final highlight states remain visible until the next game round.

### 3. Prize Evaluation & Result Messaging

*   **Evaluation:** After the overlays complete (at 0:13), the system evaluates winnings for **each confirmed set** independently against the drawn numbers.
*   **Winnings Calculation:** The existing `calculateWinnings()` logic (including jackpot rules from Phase 5) is applied to each set.
*   **Final Result Message (0:12 – 0:02):**
    *   A feedback message appears above the drawn numbers for 10 seconds.
    *   This message will be **one consolidated message which sums up all the winning amount and show as the final winning amount**. If a jackpot is won by any set, the message prioritizes the jackpot win, and no regular credit winnings are displayed for that specific set.

## UI/UX Requirements

*   **Number Selection Panel:**
    *   Initially displays the 1-27 number grid and "Confirm Numbers" button.
    *   After a set is confirmed, the grid hides, and the confirmed set (**row of circular chips**) appears.
    *   The "Add next set of numbers" button appears below confirmed sets if fewer than 3 are submitted and the timer is "OPEN".
    *   Clicking "Add next set of numbers" reveals an empty grid for new selection. The previously confirmed sets remain visible above the grid.
    *   Confirmed sets are displayed in a vertical stack, each as a compact `ConfirmedNumbersDisplay` row.
    *   The entire confirmed sets section (including the grid when visible) should be wrapped in a vertical scroll container if its content exceeds its allotted height, ensuring no horizontal scrolling and fixed UI elements (draw grid, credits bar) remain in place.
*   **`Ball3D` Component:**
    *   Must support rendering with multiple highlight colors (green, blue, orange) and combinations thereof (split circles, wedges).
    *   Maintain perfectly circular chip shape and centered numbers regardless of highlight state or resizing.
*   **Result Bar:**
    *   The `ResultBar` component will be updated to display **one consolidated message** summarizing the total winnings across all confirmed sets for the current draw.

## Acceptance Criteria

*   [ ] User can confirm up to 3 distinct sets of numbers per draw cycle.
*   [ ] Each confirmed set deducts 30 credits from the wallet.
*   [ ] The number selection grid clears and hides after each set confirmation, reappearing only when "Add next set of numbers" is clicked.
*   [ ] "Add next set of numbers" button is visible only when fewer than 3 sets are confirmed and the timer is "OPEN".
*   [ ] Confirmed sets are displayed as compact rows of chips, stacked vertically.
*   [ ] The confirmed sets section handles vertical overflow gracefully with scrolling, without affecting other UI sections.
*   [ ] During the reveal phase (0:45-0:36), numbers matching Set 1 are highlighted green.
*   [ ] From 0:35-0:33, a message for Set 1 results is shown, and **wallet is credited for Set 1's winnings**.
*   [ ] From 0:32-0:26, numbers matching Set 2 are highlighted blue, with split circles for overlaps with Set 1. **These highlights appear sequentially over 6 seconds and persist.**
*   [ ] From 0:25-0:23, a message for Set 2 results is shown, and **wallet is credited for Set 2's winnings**.
*   [ ] From 0:22-0:16, numbers matching Set 3 are highlighted orange, with split circles/wedges for overlaps with Set 1 and/or Set 2. **These highlights appear sequentially over 6 seconds and persist.**
*   [ ] From 0:15-0:13, a message for Set 3 results is shown, and **wallet is credited for Set 3's winnings**.
*   [ ] The final result message (0:12-0:02) accurately summarizes winnings for all confirmed sets, prioritizing jackpot wins.
*   [ ] All confirmed sets are cleared at the start of a new draw cycle.

## Technical Considerations

*   **`NumberSelectionContext.tsx`**: Introduce `confirmedPicksSets: number[][]` state. Refactor `confirm()` and add `startNewPickSetSelection()` for managing multiple entries.
*   **`WalletContext.tsx`**: `addConfirmedEntry` will be called multiple times per cycle. `processEntryResult` will need to process all unprocessed entries for the current cycle.
*   **`Ball3D.tsx`**: Significant refactor required to support multi-color highlighting (e.g., using SVG or advanced CSS gradients for split circles/wedges).
*   **`useRevealAnimation.ts`**: Update to manage timed highlight overlays for Set 2 and Set 3, requiring a more complex state for `drawnNumbers` (e.g., `number` + `matchStatus`).
*   **New Component**: `ConfirmedPicksList.tsx` to display the stack of confirmed sets, potentially using `shadcn/ui`'s `ScrollArea`.
*   **`useDrawPrizes.ts`**: Adapt to iterate through all confirmed sets for the current cycle to calculate and award prizes.
*   **`ResultBar.tsx`**: Update to display a summary of multiple set outcomes.