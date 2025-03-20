
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Registration from "./pages/Registration";
import AptitudeTest from "./pages/AptitudeTest";
import CareerRecommendations from "./pages/CareerRecommendations";
import CareerRoadmap from "./pages/CareerRoadmap";
import Colleges from "./pages/Colleges";
import About from "./pages/About";
import Assessment from "./pages/Assessment";
import NotFound404 from "./pages/NotFound404";
import Index from "./pages/Index";
import Exams from "./pages/Exams";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/index" element={<Index />} />
              <Route path="/assessment" element={<Assessment />} />
              <Route path="/registration" element={<Registration />} />
              <Route path="/aptitude-test" element={<AptitudeTest />} />
              <Route path="/career-recommendations" element={<CareerRecommendations />} />
              <Route path="/career-roadmap/:careerId" element={<CareerRoadmap />} />
              <Route path="/colleges" element={<Colleges />} />
              <Route path="/exams" element={<Exams />} />
              <Route path="/about" element={<About />} />
              <Route path="*" element={<NotFound404 />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
