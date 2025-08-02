# Phase 1 Spec — Timer & Scheduler

## User Stories

- As a player, I want to know when the entry cut-off period starts and ends, so I am aware of the last chance to enter before the draw closes.
- As an observer, I want the timer UI to visually indicate the cut-off phase, so I can understand the transition from open entries to the reveal.

## Functional Requirements

### Timer Cycles

- The app timer runs for 6 cycles, each of exactly 4:00 minutes (as in Phase 1).
- The timer always starts from 4:00, counts to 0:00, and restarts for a new cycle after completion, up to 6 times.
- The system generates 18 number sets (6 cycles × 3 sets per cycle) to ensure sufficient numbers are available for all 6 cycles.

### State Phases

- Each cycle has the following phases determined by time remaining:
  - **OPEN:** 4:00 to 1:00 (inclusive)
  - **CUT_OFF:** 1:00 to 0:45 (inclusive)
  - **REVEAL/END:** 0:44 to 0:00
- States transition automatically according to seconds left.

### UI Updates

- The very top of the app contains a horizontal split section:
  - **Left side:** Prominently displays the current "Jackpot" amount, clearly labeled.
  - **Right side:** Shows the main countdown timer.
  - Both columns are aligned on the same row, above the rest of the app interface.
- The current phase (**OPEN**, **CUT_OFF**, or **REVEAL/END**) is visually indicated:
  - When in **CUT_OFF**, the timer UI displays a prominent warning or label (e.g., "Entries Closed" or "Cut-off! Last Chance!") and changes style/color to draw attention.
  - In **OPEN** and **REVEAL**, the label and color are normal/default.
- The countdown timer remains large and visible throughout.
- On completion of 6 cycles, an overlay "Demo Complete" is shown, with a reset button.

### Reset Behavior

- The reset button restarts the timer at the beginning of the first cycle in the **OPEN** phase.

## Acceptance Criteria

- [ ] The timer starts at 4:00 independently of system time each cycle and counts down to 0:00.
- [ ] The "cut-off" state is triggered and visually indicated when the timer reaches 1:00, lasting through 0:45 inclusive.
- [ ] The timer UI shows distinct visual styling (e.g., color or label) during the cut-off phase.
- [ ] The jackpot/timer split header is always present at the very top.
- [ ] After six cycles, "Demo Complete — 6 cycles finished." is shown, and the timer does not continue.
- [ ] Clicking reset restarts the timer and clears any overlays or labels, returning to the original OPEN state.

## Tests

### Timer State Test

- At 1:01, the state is "OPEN".
- At 1:00, the state transitions to "CUT_OFF".
- At 0:45, the state is still "CUT_OFF".
- At 0:44, the state becomes "REVEAL".

### UI Test

- The split top section with jackpot (left) and timer (right) appears above all other content.
- The cut-off label/color appear only between 1:00 and 0:45 in each cycle.
- Overlay appears exactly after the sixth cycle ends.
- Reset returns to 4:00 in OPEN phase, with no cut-off/reveal visuals.