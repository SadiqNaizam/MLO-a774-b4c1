import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Import new pages
import HomePageFeedPage from "./pages/HomePageFeedPage";
import PinDetailPage from "./pages/PinDetailPage";
import UserProfilePage from "./pages/UserProfilePage";
import CreatePinPage from "./pages/CreatePinPage";
import SearchAndDiscoveryPage from "./pages/SearchAndDiscoveryPage";

import NotFound from "./pages/NotFound"; // Always Must Include

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePageFeedPage />} />
          <Route path="/pin/:pinId" element={<PinDetailPage />} />
          <Route path="/profile" element={<UserProfilePage />} /> {/* For current user */}
          <Route path="/profile/:username" element={<UserProfilePage />} /> {/* For specific user */}
          <Route path="/create-pin" element={<CreatePinPage />} />
          <Route path="/search" element={<SearchAndDiscoveryPage />} />
          <Route path="/explore" element={<SearchAndDiscoveryPage />} /> {/* Alias for search/discovery */}
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} /> {/* Always Include This Line As It Is. */}
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;