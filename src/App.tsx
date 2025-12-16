import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import { FinanceProvider } from "./context/FinanceContext";
import { ThemeProvider } from "./context/ThemeContext";
import { ProfileProvider } from "./context/ProfileContext";
import AddTransaction from "./pages/AddTransaction";
import Index from "./pages/Index"; // Import the Index page
import { DeviceModeProvider } from "./context/DeviceModeContext"; // Import DeviceModeProvider

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <ProfileProvider>
        <FinanceProvider>
          <DeviceModeProvider> {/* Wrap with DeviceModeProvider */}
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Dashboard />} /> {/* Changed to Dashboard */}
                  <Route path="/index" element={<Index />} /> {/* Index page moved to /index */}
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/add-transaction" element={<AddTransaction />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </DeviceModeProvider>
        </FinanceProvider>
      </ProfileProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;