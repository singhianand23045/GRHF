
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RouletteBallGrid from "./RouletteBallGrid";
import PlayAssistant from "@/features/assistant/PlayAssistant";

// 18 numbers pool for demo
const DEMO_NUMBERS = Array.from({ length: 18 }, (_, i) => i + 1);

function getRandomNumbers(amount = 6, max = 27) {
  const arr = Array.from({ length: max }, (_, i) => i + 1);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice(0, amount).sort((a, b) => a - b);
}

const TestComponent = () => {
  const [userPicks, setUserPicks] = useState<number[]>(getRandomNumbers());
  const [numbersToReveal, setNumbersToReveal] = useState<number[]>(DEMO_NUMBERS);
  const [reveal, setReveal] = useState(false);
  const [done, setDone] = useState(false);

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <Tabs defaultValue="play-assistant" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="play-assistant">Play Assistant</TabsTrigger>
          <TabsTrigger value="roulette-demo">Roulette Demo</TabsTrigger>
        </TabsList>
        
        <TabsContent value="play-assistant" className="mt-6">
          <PlayAssistant />
        </TabsContent>
        
        <TabsContent value="roulette-demo" className="mt-6">
          <div className="p-6 bg-yellow-50 rounded-xl shadow border max-w-sm mx-auto flex flex-col gap-4 items-center">
            <h2 className="font-bold text-lg mb-1 text-yellow-900">Roulette Ball Draw Demo</h2>
            <div className="text-yellow-800 text-sm mb-3">
              <strong>User picks:</strong>{" "}
              <span className="font-mono">
                {userPicks.join(", ")}
              </span>
              <br />
              <strong>Drawn numbers:</strong>{" "}
              <span className="font-mono">
                {numbersToReveal.join(", ")}
              </span>
            </div>
            <RouletteBallGrid
              numbersToReveal={numbersToReveal}
              reveal={reveal}
              userPicks={userPicks}
              onDone={() => setDone(true)}
            />
            <div className="flex gap-2 flex-wrap justify-center mt-2">
              <button
                className="px-3 py-1 rounded bg-yellow-300 font-bold hover:bg-yellow-400 transition"
                onClick={() => {
                  setReveal(false);
                  setDone(false);
                  setNumbersToReveal(getRandomNumbers(18, 27));
                  setUserPicks(getRandomNumbers());
                }}
              >
                New Numbers
              </button>
              <button
                className="px-3 py-1 rounded bg-blue-500 text-white font-bold hover:bg-blue-600 transition"
                onClick={() => {
                  setReveal(true);
                  setDone(false);
                }}
                disabled={reveal && !done}
              >
                {reveal ? (done ? "Re-Draw" : "Revealing...") : "Reveal"}
              </button>
            </div>
            <div className="border-t pt-3 mt-3 text-[13px] text-yellow-700 opacity-70">
              <p>
                Prototype for <span className="font-bold">Phase 6: Roulette Ball Draw Animation</span>.<br />
                Press <b>Reveal</b> to watch each ball stop spinning and show its number!
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TestComponent;

