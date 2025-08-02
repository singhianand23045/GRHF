import React from "react";
import MainTabs from "@/components/MainTabs";
import PlayAssistant from "@/features/assistant/PlayAssistant";

export default function AssistantPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-tr from-blue-100 via-indigo-100 to-blue-50 items-center justify-center">
      <div
        className="relative flex flex-col items-center justify-center shadow-xl rounded-2xl border border-gray-200 bg-white overflow-hidden"
        style={{
          width: "min(100vw, 402px)",
          height: "100vh",
          maxWidth: "100vw",
          maxHeight: "100vh",
        }}
      >
        <main className="flex flex-col flex-1 items-center w-full px-2 py-8 h-full pb-24 overflow-y-auto">
          <h1 className="text-3xl font-bold mt-4 mb-1 text-slate-700">
            Play Assistant
          </h1>
          <PlayAssistant />
        </main>
        <MainTabs />
      </div>
    </div>
  );
}