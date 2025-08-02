import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send } from "lucide-react";
import { useTimer } from "@/features/timer/timer-context";
import { useNumberSelection } from "@/features/number-select/NumberSelectionContext";
import { useWallet } from "@/features/wallet/WalletContext";
import { useDrawHistory } from "@/features/draw/DrawHistoryContext";
import ConfirmedNumbersDisplay from "@/features/number-select/ConfirmedNumbersDisplay"; // Import for displaying confirmed sets
import { useTab } from "@/components/MainTabs"; // Import useTab to get activeTab

type RecommendationType = "hot" | "cold" | "balanced" | "pattern" | "history" | "horoscope" | "wheeling" | "combination" | "tool_based";

interface NumberRecommendation {
  numbers: number[] | number[][]; // Can be a single set or multiple sets
  type: RecommendationType;
  reasoning: string;
  confidence?: number; // Optional confidence
}

interface ChatMessage {
  id: string;
  type: "user" | "assistant" | "recommendation";
  content: string;
  recommendation?: NumberRecommendation;
  timestamp: Date;
  isActedUpon?: boolean; // Track if recommendation has been acted upon
}

// Call the LLM edge function for intelligent responses
async function callPlayAssistantAPI(message: string, context: any) {
  try {
    const response = await fetch('https://xtjbjypjlodzhjbdfuyc.supabase.co/functions/v1/chat-assistant', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        context
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Handle both string and object responses
    if (typeof data === 'string') {
      try {
        return JSON.parse(data);
      } catch {
        return { message: data };
      }
    }
    
    return data;
  } catch (error) {
    console.error('Play Assistant API error:', error);
    return {
      message: "I'm having trouble right now. Let me suggest some numbers anyway!",
      recommendation: generateFallbackRecommendation()
    };
  }
}

// Fallback recommendation generator for when API fails
function generateFallbackRecommendation(): NumberRecommendation {
  const validNumbers = Array.from({ length: 27 }, (_, i) => i + 1);
  const shuffled = validNumbers.sort(() => 0.5 - Math.random());
  const numbers = shuffled.slice(0, 6).sort((a, b) => a - b);
  
  return {
    numbers,
    type: "balanced",
    reasoning: "A nice balanced mix for you!",
    confidence: 0.75
  };
}

// Number grid component for displaying recommendations
function NumberRecommendationDisplay({ recommendation, onConfirm, buttonText, isActedUpon, messageId }: {
  recommendation: NumberRecommendation, 
  onConfirm: (numbers: number[], messageId: string) => void,
  buttonText: string,
  isActedUpon?: boolean,
  messageId: string
}) {
  const { numbers } = recommendation; // Removed 'reasoning' from destructuring

  const renderSingleSet = (set: number[], index: number = 0) => (
    <div key={index} className="border rounded-lg p-4 bg-gradient-to-br from-blue-50 to-indigo-50 mb-2 last:mb-0">
      <div className="grid grid-cols-6 gap-2 mb-4">
        {set.map((number) => (
          <div
            key={number}
            className="w-10 h-10 rounded-full bg-primary text-primary-foreground font-semibold flex items-center justify-center text-sm"
          >
            {number}
          </div>
        ))}
      </div>
      <Button 
        onClick={() => onConfirm(set, messageId)}
        className={`w-full ${isActedUpon 
          ? 'bg-gray-400 hover:bg-gray-400 cursor-not-allowed' 
          : 'bg-green-600 hover:bg-green-700'
        } text-white`}
        size="sm"
        disabled={isActedUpon}
      >
        {isActedUpon ? '✓ Confirmed' : buttonText}
      </Button>
    </div>
  );

  return (
    <div className="mt-3">
      {/* Removed: {reasoning && <p className="text-xs text-gray-600 mb-2">{reasoning}</p>} */}
      {Array.isArray(numbers[0]) ? ( // Check if it's an array of arrays (multiple sets)
        (numbers as number[][]).map((set, index) => renderSingleSet(set, index))
      ) : (
        renderSingleSet(numbers as number[])
      )}
    </div>
  );
}

export default function PlayAssistant() {
  // Load messages from localStorage on component mount
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const savedMessages = localStorage.getItem('playAssistantMessages');
    if (savedMessages) {
      const parsed = JSON.parse(savedMessages);
      // Convert timestamp strings/numbers back to Date objects
      return parsed.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }));
    }
    return [];
  });
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [queuedNumbers, setQueuedNumbers] = useState<number[]>(() => {
    const savedQueued = localStorage.getItem('playAssistantQueuedNumbers');
    return savedQueued ? JSON.parse(savedQueued) : [];
  });
  
  const chatRef = useRef<HTMLDivElement>(null);
  const { state: timerState, countdown, cycleIndex } = useTimer();
  const { setPicked, confirm, confirmedPicksSets, startNewPickSetSelection, setShouldAutoConfirm } = useNumberSelection(); // Get setShouldAutoConfirm
  const wallet = useWallet();
  const { drawHistory, getHotNumbers, getColdNumbers, getRecentPatterns } = useDrawHistory();
  const { activeTab } = useTab(); // Get activeTab from context

  // Effect 1: Scroll to bottom when new messages are added (if tab is active)
  useEffect(() => {
    console.log("[Scroll Debug] Effect 1: Messages or activeTab changed. Active tab:", activeTab);
    if (chatRef.current && activeTab === "assistant") {
      console.log("[Scroll Debug] Effect 1: chatRef.current exists and tab is assistant. Scheduling scroll.");
      // Use setTimeout to ensure scroll happens after DOM updates
      setTimeout(() => {
        if (chatRef.current) { // Check again in case component unmounted
          console.log(`[Scroll Debug] Effect 1: Performing scroll. scrollHeight: ${chatRef.current.scrollHeight}, clientHeight: ${chatRef.current.clientHeight}`);
          chatRef.current.scrollTop = chatRef.current.scrollHeight;
        } else {
          console.log("[Scroll Debug] Effect 1: chatRef.current is null on setTimeout callback.");
        }
      }, 0); 
    }
  }, [messages, activeTab]); // Added activeTab to dependencies

  // Effect 2: Scroll to bottom specifically when the Assistant tab becomes active
  useEffect(() => {
    console.log("[Scroll Debug] Effect 2: activeTab changed. Active tab:", activeTab);
    if (activeTab === "assistant" && chatRef.current) {
      console.log("[Scroll Debug] Effect 2: Tab is assistant and chatRef.current exists. Initiating requestAnimationFrame loop.");
      const scrollToBottomWhenReady = () => {
        if (!chatRef.current) {
          console.log("[Scroll Debug] Effect 2: chatRef.current is null in requestAnimationFrame. Stopping loop.");
          return;
        }
        // Check if the element is visible and has content height
        if (chatRef.current.clientHeight > 0 && chatRef.current.scrollHeight > chatRef.current.clientHeight) {
          console.log(`[Scroll Debug] Effect 2: Performing scroll. scrollHeight: ${chatRef.current.scrollHeight}, clientHeight: ${chatRef.current.clientHeight}`);
          chatRef.current.scrollTop = chatRef.current.scrollHeight;
        } else {
          console.log(`[Scroll Debug] Effect 2: Not ready to scroll yet. scrollHeight: ${chatRef.current.scrollHeight}, clientHeight: ${chatRef.current.clientHeight}. Retrying.`);
          // If not ready, try again on the next animation frame
          requestAnimationFrame(scrollToBottomWhenReady);
        }
      };
      // Start the check on the next animation frame
      requestAnimationFrame(scrollToBottomWhenReady);
    }
  }, [activeTab]); // Only depend on activeTab here

  // Persist messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('playAssistantMessages', JSON.stringify(messages));
  }, [messages]);

  // Persist queued numbers to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('playAssistantQueuedNumbers', JSON.stringify(queuedNumbers));
  }, [queuedNumbers]);

  // Handle queued numbers when timer opens
  useEffect(() => {
    if (timerState === "OPEN" && queuedNumbers.length === 6) {
      // Check if there's space for a new pick set
      if (confirmedPicksSets.length < 3) {
        startNewPickSetSelection(); // Prepare for new selection
        setShouldAutoConfirm(true); // Set auto-confirm for queued numbers
        setPicked(() => queuedNumbers);
        setQueuedNumbers([]);
        addMessage("assistant", "✅ Your queued numbers have been applied to the current draw! Don't forget to confirm them!");
      } else {
        addMessage("assistant", "🚫 Cannot apply queued numbers. You've already confirmed 3 sets for this draw.");
        setQueuedNumbers([]); // Clear queued numbers if they can't be applied
      }
    }
  }, [timerState, queuedNumbers, confirmedPicksSets, setPicked, startNewPickSetSelection, setShouldAutoConfirm]);

  const addMessage = (type: ChatMessage["type"], content: string, recommendation?: NumberRecommendation) => {
    console.log(`[Add Message Debug] Adding message: Type: ${type}, Content: "${content.substring(0, 30)}..."`);
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      type,
      content,
      recommendation,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const clearChatHistory = () => {
    setMessages([]);
    localStorage.removeItem('playAssistantMessages');
    localStorage.removeItem('playAssistantQueuedNumbers');
    setQueuedNumbers([]);
  };

  const getConfirmButtonText = () => {
    switch (timerState) {
      case "OPEN":
        return "Confirm Numbers";
      case "CUT_OFF":
      case "REVEAL":
      case "COMPLETE":
        return "Queue for Next Draw";
      default:
        return "Confirm Numbers";
    }
  };

  const handleRecommendationRequest = async (message: string) => {
    // Prepare enhanced context for LLM with real data
    const context = {
      timerState,
      selectedNumbers: confirmedPicksSets.flat(), // Send all confirmed numbers
      balance: wallet.balance,
      userHistory: wallet.history.slice(0, 10), // Last 10 user entries
      drawHistory: drawHistory.slice(0, 10), // Last 10 actual draws
      hotNumbers: getHotNumbers(10),
      coldNumbers: getColdNumbers(10),
      recentPatterns: getRecentPatterns(),
      cycleIndex
    };

    try {
      const response = await callPlayAssistantAPI(message, context);
      
      if (response.recommendation) {
        addMessage("recommendation", response.message || "Here are some numbers for you:", response.recommendation);
      } else {
        addMessage("assistant", response.message || "I'm here to help with number recommendations!");
      }
    } catch (error) {
      console.error('Error calling Play Assistant:', error);
      const fallback = generateFallbackRecommendation();
      addMessage("recommendation", "Let me suggest some numbers for you:", fallback);
    }
  };

  const handleConfirmRecommendation = (numbers: number[], messageId: string) => {
    console.log("[PlayAssistant] handleConfirmRecommendation called for messageId:", messageId, "Numbers:", numbers);
    // Mark this recommendation as acted upon
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, isActedUpon: true } : msg
    ));

    if (timerState === "OPEN") {
      if (confirmedPicksSets.length < 3) {
        console.log("[PlayAssistant] Timer is OPEN and space available. Preparing to set numbers for auto-confirmation.");
        startNewPickSetSelection(); // Prepare for new selection (clears picked, unlocks, sets isAddingNewPickSet=true)
        setShouldAutoConfirm(true); // Explicitly set auto-confirm for assistant recommendations
        setPicked(() => numbers); // Set the numbers to the grid
        // The actual confirm() call will now happen in NumberSelectionContext via useEffect
        addMessage("assistant", "🎯 Perfect! Your numbers are set and will be automatically confirmed. Good luck!");
      } else {
        console.log("[PlayAssistant] Max sets confirmed. Cannot add more.");
        addMessage("assistant", "🚫 You've already confirmed 3 sets for this draw. Cannot add more.");
      }
    } else {
      console.log("[PlayAssistant] Timer not OPEN. Queuing numbers for next draw.");
      setQueuedNumbers(numbers);
      addMessage("assistant", "✨ Great choice! Your numbers are all set for the next draw!");
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setIsLoading(true);

    // Add user message
    addMessage("user", userMessage);

    setTimeout(async () => {
      await handleRecommendationRequest(userMessage);
      setIsLoading(false);
    }, 500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* Clean Chat Interface - No Status Distractions */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Chat Messages */}
        <div
          ref={chatRef}
          className="flex-1 overflow-y-auto p-2 space-y-3 min-h-0"
        >
          {messages.length === 0 && (
            <div className="text-center text-gray-400 py-8">
              <p className="mb-2">Ask me for number recommendations!</p>
              <div className="text-sm space-y-1">
                <p>"Show me hot numbers"</p>
                <p>"Give me cold numbers"</p>
                <p>"Help me pick 6 numbers"</p>
                <p>"Wheel these 7 numbers: 1, 5, 9, 13, 17, 21, 25"</p>
                <p>"What are my lucky numbers for Leo?"</p>
                <p>"Analyze my past performance"</p>
              </div>
            </div>
          )}
          
          {messages.map((message) => (
            <div key={message.id} className={`${message.type === "user" ? "text-right" : "text-left"}`}>
              <div className={`inline-block max-w-[85%] rounded-lg p-3 ${
                message.type === "user" 
                  ? "bg-blue-500 text-white" 
                  : message.type === "recommendation"
                  ? "bg-white border-2 border-blue-200"
                  : "bg-white border border-gray-200"
              }`}>
                <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                
                {message.recommendation && (
                  <NumberRecommendationDisplay
                    recommendation={message.recommendation}
                    onConfirm={handleConfirmRecommendation}
                    buttonText={getConfirmButtonText()}
                    isActedUpon={message.isActedUpon}
                    messageId={message.id}
                  />
                )}
                
                <div className="text-xs opacity-70 mt-2">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="text-left">
              <div className="inline-block bg-white border rounded-lg p-3">
                <div className="flex items-center gap-2 text-sm">
                  <div className="animate-spin w-3 h-3 border border-gray-300 border-t-gray-600 rounded-full"></div>
                  Processing...
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t bg-white">
          <div className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask for number recommendations..."
              className="min-h-[40px] max-h-[100px] resize-none flex-1"
              disabled={isLoading}
            />
            <Button 
              onClick={sendMessage} 
              size="sm"
              disabled={!input.trim() || isLoading}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}