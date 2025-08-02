
import { useTimer } from "./timer-context";

const LOGICAL_HEIGHT = 874;
const JACKPOT_TIMER_HEIGHT = 0.15;

export default function TimerSection() {
  const { countdown } = useTimer();
  return (
    <div
      className="w-full flex flex-row items-center justify-end px-0 pt-4 pb-0"
      style={{
        minHeight: Math.floor(LOGICAL_HEIGHT * JACKPOT_TIMER_HEIGHT),
        maxHeight: Math.ceil(LOGICAL_HEIGHT * JACKPOT_TIMER_HEIGHT),
        height: `${JACKPOT_TIMER_HEIGHT * 100}%`
      }}
      data-testid="timer-header"
    >
      <span
        className="font-mono font-extrabold tracking-widest text-robinhood-green select-none animate-fade-in"
        style={{ fontSize: "clamp(1.3rem, 4vw, 2rem)", lineHeight: 1.1 }}
        data-testid="timer"
      >
        {countdown}
      </span>
    </div>
  );
}
