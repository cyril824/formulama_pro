import { Archive, FileCheck, HelpCircle, Home, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { getBaseUrl } from "@/lib/urlHelper";

const DesktopSidebar = () => {
  const navigate = useNavigate();
  const [stats] = useState({ total: 5, archives: 2, supportes: 3 });

  const menuItems = [
    { icon: Home, label: "Accueil", path: "/dashboard" },
    { icon: FileCheck, label: "Documents supportés", path: "/dashboard?view=Documents supportés" },
    { icon: Archive, label: "Documents archivés", path: "/dashboard?view=Documents archivés" },
  ];

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-card flex flex-col border-r">
      {/* Header */}
      <div className="px-6 py-6 border-b">
        <h1 className="text-lg font-bold text-foreground">Formulama</h1>
        <p className="text-xs text-muted-foreground mt-2">Gestion Pro</p>
      </div>

      {/* Navigation principale */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <p className="text-xs font-semibold text-muted-foreground uppercase px-2 mb-4">Navigation</p>
        <div className="space-y-1">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => navigate(item.path)}
              className="w-full flex items-center gap-3 px-3 py-2 rounded text-sm text-foreground hover:bg-muted active:bg-muted/60"
            >
              <item.icon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Statistiques - Simples et utiles */}
      <div className="px-4 py-5 border-b space-y-2">
        <div className="flex items-center justify-between p-2 rounded bg-muted/40 text-sm">
          <span className="font-medium text-muted-foreground">Documents</span>
          <span className="font-bold text-foreground">{stats.total}</span>
        </div>
        <div className="flex items-center justify-between p-2 rounded bg-muted/40 text-sm">
          <span className="font-medium text-muted-foreground">Signés</span>
          <span className="font-bold text-foreground">{stats.supportes}</span>
        </div>
        <div className="flex items-center justify-between p-2 rounded bg-muted/40 text-sm">
          <span className="font-medium text-muted-foreground">Archivés</span>
          <span className="font-bold text-foreground">{stats.archives}</span>
        </div>
      </div>

      {/* Compte - En bas */}
      <div className="px-3 py-4 border-t space-y-1">
        <p className="text-xs font-semibold text-muted-foreground uppercase px-2 mb-3">Compte</p>
        <div className="space-y-1">
          <button
            onClick={() => navigate("/aide")}
            className="w-full flex items-center gap-3 px-3 py-2 rounded text-sm text-foreground hover:bg-muted"
          >
            <HelpCircle className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <span className="font-medium">Aide</span>
          </button>
          <button
            onClick={() => window.location.href = getBaseUrl()}
            className="w-full flex items-center gap-3 px-3 py-2 rounded text-sm text-destructive hover:bg-destructive/10"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            <span className="font-medium">Déconnexion</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DesktopSidebar;
