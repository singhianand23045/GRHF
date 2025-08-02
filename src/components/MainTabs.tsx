
import { Home, Activity } from "lucide-react";
import { createContext, useContext, useState } from "react";

const TABS = [
  {
    value: "home",
    label: "Home",
    icon: Home,
  },
  {
    value: "assistant",
    label: "Assistant",
    icon: Activity,
  },
];

type TabValue = "home" | "assistant";

interface TabContextType {
  activeTab: TabValue;
  setActiveTab: (tab: TabValue) => void;
}

const TabContext = createContext<TabContextType | undefined>(undefined);

export function TabProvider({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState<TabValue>("home");
  
  return (
    <TabContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </TabContext.Provider>
  );
}

export function useTab() {
  const context = useContext(TabContext);
  if (!context) {
    throw new Error("useTab must be used within TabProvider");
  }
  return context;
}

export default function MainTabs() {
  const { activeTab, setActiveTab } = useTab();

  return (
    <nav
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[402px] z-30 bg-white h-16 flex items-center border-t border-gray-200"
      // removed rounded-b-2xl and ensured border for visual separation, but flush with edge
      style={{
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        marginBottom: 0,
        paddingBottom: 0,
      }}
    >
      <ul className="flex w-full justify-around items-center">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.value;
          return (
            <li key={tab.value} className="flex-1">
              <button
                className={`flex flex-col items-center justify-center w-full h-full py-1.5 transition text-xs ${
                  isActive
                    ? "text-indigo-600 font-semibold"
                    : "text-gray-400 hover:text-indigo-500"
                }`}
                aria-label={tab.label}
                onClick={() => setActiveTab(tab.value as TabValue)}
              >
                <Icon
                  size={26}
                  className={`mb-1 transition ${
                    isActive ? "text-indigo-600" : "text-gray-400"
                  }`}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                {tab.label}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
