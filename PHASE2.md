# Phase 2 Spec: Number Selection UI

## User Stories

- As a user, I want to pick exactly 6 numbers from a grid of 27, so I can participate in the lottery round.
- As a user, I want to confirm my chosen numbers so I know they are locked in for the draw and can’t change them accidentally.
- As a user, once my numbers are confirmed, I want to see them clearly displayed in a visually appealing set of confirmed numbers, formatted in a way that is readable on any device.
- As a user, I don’t want to have to scroll or zoom to see all of my numbers, even on a mobile screen.

## Functional Requirements

- The number selection grid shows numbers 1 through 27.
- User can select/deselect numbers while the timer state is "OPEN."
- User may only select up to 6 numbers; the "Confirm Numbers" button activates only when all 6 are selected.
- Confirming locks the selection until the next round or cycle.
- After confirmation (or when timer is "CUT_OFF"), display the selected numbers in a confirmed set of numbers.

## Acceptance Criteria

### Confirmed Numbers Display

- After confirming, the chosen numbers appear in a single horizontal line—no number is hidden, truncated, or scrollable on any device.
- Numbers are immediately sorted in ascending order before display.
- Each number appears in a perfectly circular chip—never an oval—with the following style:
  - Use aspect-square, and always keep width and height equal.
  - Numbers are set in a small enough font size that even two-digit numbers fit comfortably inside the chip without distorting the aspect ratio.
- Chips are evenly spaced, visually centered, with consistent sizing and spacing.
- No horizontal scrolling is allowed, regardless of screen width.
- Visual design: green background, white text, subtle shadow, matching the app theme.
- Chips are responsive: on smaller screens, both chip and font size shrink as needed, but all 6 numbers remain visible and inside circles.
- When confirmed or locked, numbers cannot be changed until the next round.
- Text is always centered within each chip, and circles remain perfectly round regardless of resizing.