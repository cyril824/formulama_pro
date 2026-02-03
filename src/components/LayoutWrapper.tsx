import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import DesktopSidebar from "@/components/DesktopSidebar";

interface LayoutWrapperProps {
  children: React.ReactNode;
}

const LayoutWrapper = ({ children }: LayoutWrapperProps) => {
  const isMobile = useIsMobile();

  // MOBILE : Pas de wrapper, juste le contenu orignal du Dashboard
  if (isMobile) {
    return <>{children}</>;
  }

  // DESKTOP : Sidebar fixe à gauche + contenu à droite
  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar desktop */}
      <DesktopSidebar />

      {/* Contenu principal décalé */}
      <div className="flex-1 ml-64 overflow-y-auto">
        {children}
      </div>
    </div>
  );
};

export default LayoutWrapper;
