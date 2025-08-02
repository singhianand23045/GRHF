import MainTabs, { TabProvider, useTab } from "@/components/MainTabs";
import FlexibleLayout from "@/layout/FlexibleLayout";
import PlayAssistant from "@/features/assistant/PlayAssistant";

const LOGICAL_WIDTH = 393;  // iPhone 16  logical width
const LOGICAL_HEIGHT = 852; // iPhone 16  logical height

function AppContent() {
  const { activeTab } = useTab();

  return (
    <div className="min-h-screen min-w-full flex flex-col items-center justify-center bg-gradient-to-tr from-blue-100 via-indigo-100 to-blue-50">
      <div
        className="relative flex flex-col items-center justify-center shadow-xl rounded-2xl border border-gray-200 bg-white overflow-hidden"
        style={{
          width: "min(100vw, 402px)",
          height: "100vh",
          maxWidth: "100vw",
          maxHeight: "100vh",
        }}
      >
        {/* MAIN CONTENT: subtract bottom nav height (4rem) from viewport height */}
        <main 
          className="flex flex-col w-full items-center h-full overflow-hidden" // Main is now a fixed-height flex container, no overflow here
          style={{
            height: "calc(100vh - 4rem)", // Fixed height for main content area
          }}
        >
          {/* Home Tab Content - NO CHANGES TO THIS DIV */}
          <div style={{ display: activeTab === "home" ? "block" : "none" }} className="px-4 py-2 w-full h-full">
            <FlexibleLayout />
          </div>

          {/* Assistant Tab Content - ONLY CHANGES HERE */}
          <div 
            className="flex flex-col flex-1 w-full min-h-0 px-2 py-2 pb-24" // Changed py-8 to py-2
            style={{ display: activeTab === "assistant" ? "flex" : "none" }}
          >
            <h1 className="text-3xl font-bold mt-4 mb-1 text-slate-700">
              Play Assistant
            </h1>
            <PlayAssistant />
          </div>
        </main>
        {/* Bottom Tabs */}
        <MainTabs />
      </div>
    </div>
  );
}

const Index = () => {
  return (
    <TabProvider>
      <AppContent />
    </TabProvider>
  );
};

export default Index;