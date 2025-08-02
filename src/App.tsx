
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Playground from "./pages/Playground";
import { JackpotProvider } from "@/features/jackpot/JackpotContext";
import { WalletProvider } from "@/features/wallet/WalletContext";
import { TimerProvider } from "@/features/timer/timer-context";
import { NumberSelectionProvider } from "@/features/number-select/NumberSelectionContext";
import { DrawHistoryProvider } from "@/features/draw/DrawHistoryContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <JackpotProvider>
        <WalletProvider>
          <DrawHistoryProvider>
            <TimerProvider>
              <NumberSelectionProvider>
                <BrowserRouter>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/playground" element={<Playground />} />
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </BrowserRouter>
              </NumberSelectionProvider>
            </TimerProvider>
          </DrawHistoryProvider>
        </WalletProvider>
      </JackpotProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
