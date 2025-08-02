# Phase 5 Spec: Rolling Jackpot (Simplified)

---

## 1. User Stories

- **As a player**, I want my balance and the jackpot pool to persist between sessions, so my progress and the potential prize never disappear.
- **As a player**, I want the app to clearly show if I won the jackpot or regular prizes, never both, so I always know my biggest possible win each draw.

---

## 2. Functional Requirements

- The jackpot pool starts at a **base value** (e.g., $1000).
- For every confirmed, valid set of numbers in a draw, **$1 is added to the jackpot**.
- If any player matches all 6 numbers in any single row, they win **the full jackpot amount for that draw**.
- If the jackpot is won, the pool immediately resets to the base value for the next draw.
- When the jackpot is won, **the user receives ONLY the jackpot amount**—NO regular per-row credit prizes are given for that entry/draw.
- If no jackpot is won, regular per-row credit payouts apply:
  - 5 matches: **+100 credits**
  - 4 matches: **+40 credits**
  - 3 matches: **+20 credits**
  - 2 matches: **+10 credits**
  - 1 or 0 matches: **0 credits**
  - **These prizes are summed across all rows, additive per entry.**
- Only confirmed sets with exactly 6 selected numbers before cut-off are eligible for entry; others are ignored and not charged.
- **Each confirmed, valid entry now costs 30 credits (was 10 previously).**
- **Both wallet balance and jackpot pool must persist** across page reloads (localStorage).
- After each draw, the number selection resets, but wallet and jackpot do not (unless jackpot is won).
- The UI/UX must:
  - Display the user's credit balance, an "Add credits" button, and the current jackpot prominently.
  - Show a feedback banner for 5 seconds:
    - If jackpot is won: "Congrats! You won the jackpot of $X!"
    - Else if credits are won: "Congrats! You won [total] credits!"
    - Else: "Try again. Win next time!"
  - **Never display both jackpot and credit wins for the same entry/draw.**

---

## UI Display/Placement

- At the top of the app, include a horizontal section split into two columns:
  - **Left side:** Shows the current “Jackpot” amount, with clear labeling and prominent styling.
  - **Right side:** Shows the draw timer as before.
- This section should be visually balanced, sitting above the main game interface.
- All other sections (draw numbers, credits bar, confirmed numbers, etc.) remain in their existing locations.
- **The result feedback message (jackpot/credits/try again) must display for 10 seconds, from timer 0:30 to 0:20.**

---

## 3. Acceptance Criteria

- [ ] Only sets with exactly 6 confirmed selections are entered; others are ignored and do not affect wallet/jackpot.
- [ ] Each valid entry deducts **30 credits** and increases jackpot pool by $1.
- [ ] If 6/6 is matched in any row, user wins jackpot only (credits user with jackpot, resets pool, no regular credits).
- [ ] If no 6/6 match, user receives the sum of regular credit payouts per row, if any.
- [ ] A draw result never grants both the jackpot and additional credit prizes for the same entry.
- [ ] Wallet and jackpot pool values persist on reload.
- [ ] Credit bar and jackpot display always visible except on demo restart.
- [ ] Result feedback appears at draw’s end for **10 seconds, always showing only the highest applicable win, and exactly during timer 0:30–0:20**.
- [ ] Number selection resets after each draw.

---

## 4. Tests

### Logic/Unit Tests
- [ ] Submitting a set of <6 numbers does not deduct credits or add to jackpot.
- [ ] Confirmed set with 6 picks deducts **30 credits**, adds $1 to jackpot, and records entry.
- [ ] Entry matching 6/6 in any row wins jackpot only (credits user with jackpot, resets pool, no regular credits).
- [ ] Entry matching less than 6 in all rows gets appropriate sum of regular credit payouts.
- [ ] Both wallet balance and jackpot persist after reload.
- [ ] Never possible to win both jackpot and regular credits in the same draw for same entry.

### UI/UX Tests
- [ ] Credit and jackpot bar always visible (except on demo reset), correctly positioned.
- [ ] Jackpot value increases correctly between draws with new entries, resets on jackpot win.
- [ ] Correct result feedback banner displays for jackpot win, credit win, or loss, with correct values and only one type of win per entry, and is visible for **10 seconds during timer 0:30–0:20**.
- [ ] Selection panel resets after each draw.