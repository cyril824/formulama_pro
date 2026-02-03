import React, { Suspense } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "@/context/ThemeContext";
import { AudioProvider } from "@/context/AudioContext";
import { DocumentProvider } from "@/context/DocumentContext";
import LayoutWrapper from "@/components/LayoutWrapper";

// Utilisation de React.lazy pour les imports dynamiques, plus robustes pour la résolution de chemin.
const Login = React.lazy(() => import("./pages/Login"));
const Register = React.lazy(() => import("./pages/Register"));
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const Profile = React.lazy(() => import("./pages/Profile"));
const Settings = React.lazy(() => import("./pages/Settings"));
const NotFound = React.lazy(() => import("./pages/NotFound"));
const HelpPage = React.lazy(() => import("./pages/Help")); 

const queryClient = new QueryClient();

// Composant de chargement simple
const FallbackLoader = () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-primary animate-pulse">Chargement en cours...</div>
    </div>
);

// Composant interne pour gérer les routes avec layout
const AppRoutes = () => {
  const location = useLocation();
  
  // Les routes de connexion n'ont pas besoin du layout
  const isAuthPage = location.pathname === "/" || location.pathname === "/register";

  if (isAuthPage) {
    return (
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    );
  }

  // Les autres routes utilisent le LayoutWrapper
  return (
    <LayoutWrapper>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/aide" element={<HelpPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </LayoutWrapper>
  );
};

const App = () => (
  <ThemeProvider>
    <AudioProvider>
      <DocumentProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              {/* Suspense permet d'afficher un indicateur de chargement pendant le chargement dynamique du composant */}
              <Suspense fallback={<FallbackLoader />}>
                <AppRoutes />
              </Suspense>
            </BrowserRouter>
          </TooltipProvider>
        </QueryClientProvider>
      </DocumentProvider>
    </AudioProvider>
  </ThemeProvider>
);

export default App;