# Phase 3 Spec: Draw Reveal Experience

## Overview

The Lucky Dip demo lottery has six cycles, each lasting 4 minutes.  
In each cycle, a set of 18 numbers (3 sets of 6) is revealed on screen in a timed, animated fashion.

---

### Drawn Numbers Reveal

- The drawn numbers area is a fixed grid of 3 rows and 6 columns (18 slots in total).
- When the timer is not ready to draw (before 0:45), all slots show filled black circles, and maintain their layout even when not filled.
- At 0:45, the reveal phase begins.

---

## Draw Sequence & Timing

### Phase Sequence

1. **Open phase:** (3:15) User can select/confirm numbers.
2. **Cut-off phase:** (1:00–0:45) No new selections accepted.
3. **Draw phase:** (0:45–0:36) Numbers are revealed in order.
4. **Result display:** (0:36–0:00) All drawn numbers are visible, result messages displayed.

### Reveal Timing and Priority

- **Start:** At 0:45 on the timer (when draw phase starts).
- **Reveal order:** Numbers are revealed row by row, starting with the first row, then the second, then the third.
  - The reveal proceeds by rows, starting with the first row, then second, then third.
  - Each number appears with a ~1-second interval.
  - From 0:45 to 0:36, one number is revealed every second until all 18 are shown (9 seconds total).
- **End:** At 0:36, all 18 numbers are visible. From 0:36 to 0:00, the drawn numbers remain on display.

---

## User Experience

### Winning Messages

- If the user has won credits, show: **"Congrats! You won [sum of winnings] credits!"**
- If the user has not won, show: **"No luck this time!"**
- Messages appear for **10 seconds starting at 0:30 on the timer and ending at 0:20**, then disappear.

---

## Demo Flow

**Cycle 1:**
- Open (number selection) → Cut Off → Reveal phase (0:45–0:36, numbers revealed at 1s intervals, prioritized by per-row matches first)
- From 0:27 to 0:00, all numbers remain visible.

**Cycles 2-6:**
- Same flow as above.
- After six cycles, app shows "Demo Complete."

---

## User Acceptance Criteria

- The user's confirmed numbers are always visible on the screen, regardless of the draw phase.
- The display of the drawn numbers never overshadows or obscures the user's confirmed numbers, and their space is never reduced or taken over by the draw results.
- The timer, drawn numbers, and confirmed numbers are presented in visually separate sections that do not overflow into each other's areas.
- Proper win/loss message (with credit sum if win) is shown for **10 seconds** above drawn numbers from timer 0:25 to 0:15 at the end of each draw, then disappears.

---

## Tests

- The drawn numbers are revealed sequentially row by row, from 0:45 to 0:36.
- All 18 drawn numbers are visible on screen from 0:36 to 0:00.
- Win/loss messages appear and disappear at the correct times.
- All 18 slots are always visible, even when not filled.
- "Demo Complete" overlay appears after six full cycles.