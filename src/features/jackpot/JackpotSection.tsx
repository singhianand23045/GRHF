
import JackpotBar from "./JackpotBar";

const LOGICAL_HEIGHT = 874;
const JACKPOT_TIMER_HEIGHT = 0.15;

export default function JackpotSection() {
  return (
    <div
      className="w-full flex flex-row items-center justify-start"
      style={{
        minHeight: Math.floor(LOGICAL_HEIGHT * JACKPOT_TIMER_HEIGHT),
        maxHeight: Math.ceil(LOGICAL_HEIGHT * JACKPOT_TIMER_HEIGHT),
        height: `${JACKPOT_TIMER_HEIGHT * 100}%`
      }}
      data-testid="jackpot-section"
    >
      <JackpotBar />
    </div>
  );
}
