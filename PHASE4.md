## Phase 4 Spec: Result & Wallet

### 1. User Stories

- **As a player**, I want my confirmed numbers’ outcome (number of matches) to be evaluated after each draw, so I know if I won or lost.
- **As a player**, I want the app to automatically keep track of my balance, awarding credits according to how many numbers I match, and deducting a participation fee on entry, so my spending/winnings are always clear.
- **As a player**, I want my balance to be preserved if I reload or reopen the app, so my progress is never lost.
- **As a player**, I want my number selection to reset for the next draw cycle, so I can choose new numbers each round.
- **As a player**, I want my credits/balance to be visible in a dedicated section between the drawn numbers and my confirmed numbers, where I can always see and easily add to my balance.
- **As a player**, I want a clear, timely message after each draw stating if I won and how much, or encouraging me to try again if I lost.

---

### 2. Functional Requirements

- Define CoreData entities:
  - `Wallet(balance: Int)`
  - `Entry(date: string, numbers: [Int], matches: Int, creditChange: Int)`

- **Entry Rules:**
  - For a set of numbers to be valid in a draw, the user must select **and confirm** exactly 6 numbers before the cut-off.  
  - If the user selects fewer than 6 numbers by the cut-off, the entry is **discarded**—no credits are deducted, no entry is recorded.
  - If the user selects 6 numbers but **does not confirm** before cut-off, the entry is **discarded**—no credits are deducted, no entry is recorded.

- **Balance Management:**
  - Start with `balance = 200` credits for every new player/session.
  - For each draw in which the player participates (i.e., submits and confirms a 6-number set):
    - **Deduct 30 credits** from the balance upon confirmation, regardless of results.  
    - **Winnings Calculation:** 
      - For each row, count how many confirmed numbers match the 6 numbers from that row only.
      - For each row, award credits according to payout rules:
        - 5 matches: **+100 credits**
        - 4 matches: **+40 credits**
        - 3 matches: **+20 credits**
        - 2 matches: **+10 credits**
        - 1 or 0 matches: **0 credits**
      - **Sum the total winnings across all three rows for the cycle.**
    - No credits are deducted for non-valid entries (unconfirmed or <6 selections).
    - Balance is updated after each result.
  - **Each confirmed, valid entry now costs 30 credits (was 10 previously).**

- **Persistence:**
  - Wallet balance must persist between app reloads (e.g., use localStorage).

- **Reset Behavior:**
  - After each draw cycle, the user’s number selection and confirmation are reset (balance remains).

- **UI/UX:**
  - There must be a separate "Credits" section inserted between the drawn numbers and confirmed numbers, occupying 5% of the total screen height.
  - This Credits section must show an "Add credits" label aligned to the extreme left, and the credits/balance remaining (e.g., "1750 credits") aligned to the extreme right.
  - The visual layout should resemble the "add to balance" bar in the Robinhood app.
  - The Credits section must always be visible except during demo restart.
  - After each draw, a feedback message appears above drawn numbers for **10 seconds starting at 0:30 on the timer and ending at 0:20**, summarizing the result:
    - If credits are won: "Congrats! You won [sum of winnings] credits!"
    - If not: "Try again. Win next time!" (if lost).
  - Winnings are computed per row and then summed.

---

### 3. Acceptance Criteria

- [ ] Submitting fewer than 6 numbers for a draw does **not** deduct credits or submit an entry.
- [ ] Submitting and **confirming 6 numbers** for a draw deducts **30 credits** regardless of outcome; entry is recorded and eligible for winnings.
- [ ] Submitting a set of 6 numbers but **does not confirm** before cut-off results in **no deduction**, entry is discarded, and no entry is recorded.
- [ ] After each draw, the user's confirmed numbers are checked **independently against each of the 3 rows in the grid**.
  - [ ] For each row, number of matches is used to determine the credits awarded (as above), and total winnings are summed.
- [ ] Multiple wins in multiple draws are credited to balance additively.
- [ ] The wallet balance is restored correctly on app reload.
- [ ] Number selection resets automatically at the start of each new draw cycle; previous balance remains unchanged.
- [ ] The Credits section always appears, takes up 5% of the total logical height, and "Add credits", the balance are properly positioned.
- [ ] The correct feedback message is displayed for **10 seconds, from timer 0:30 to 0:20**, with correct text and duration, and does not interfere with grid layout.
- [ ] Feedback message and credited amount are correct for the sum of row winnings as appropriate.

---

### 4. Tests

#### Unit/Logic Tests

- [ ] Submitting a set of <6 numbers does not affect balance.
- [ ] Submitting and confirming a set of exactly 6 numbers immediately subtracts **30 credits** from balance and records the entry.
- [ ] Submitting an entry with no 6/6 matches:
    - [ ] Regular row credit winnings are computed and summed.
    - [ ] If the user matches in multiple rows, total regular winnings are credited.
- [ ] The result message and credited amount reflect the summed regular winnings for the entry.
- [ ] Balance is restored after app reload.
- [ ] After the draw, number selection resets but balance does not.

#### UI/UX Tests

- [ ] On app launch or reload, wallet is consistent with prior play.
- [ ] The credits section always appears, takes up 5% of the total logical height, and "Add credits", the balance are properly positioned.
- [ ] The correct feedback message is displayed at the right time, with the correct text and duration (**10 seconds from timer 0:30 to 0:20**), and does not interfere with grid layout.
- [ ] Feedback message and credited amount are correct for the sum of row winnings, as appropriate.