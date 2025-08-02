
import { DrawEngineProvider } from "./DrawEngineContext";
import RevealPanel from "./RevealPanel";
import { useTimer } from "../timer/timer-context";

const LOGICAL_HEIGHT = 874;
const DRAW_SECTION_HEIGHT = 0.30;

export default function DrawNumbersSection() {
  const { state } = useTimer();

  return (
    <DrawEngineProvider>
      <div className="flex flex-col w-full h-full">
        <div
          className="flex flex-col items-center justify-center w-full flex-shrink-0 flex-grow-0 overflow-y-hidden"
          style={{
            height: `${DRAW_SECTION_HEIGHT * 100}%`,
            minHeight: Math.floor(LOGICAL_HEIGHT * DRAW_SECTION_HEIGHT),
            maxHeight: `${DRAW_SECTION_HEIGHT * 100}%`,
            flexBasis: `${DRAW_SECTION_HEIGHT * 100}%`,
          }}
        >
          <RevealPanel />
        </div>
      </div>
    </DrawEngineProvider>
  );
}
