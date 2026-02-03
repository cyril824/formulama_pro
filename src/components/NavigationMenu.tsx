import { Archive, FileCheck, HelpCircle, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

const NavigationMenu = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ total: 5, archives: 2, supportes: 3 });

  const menuItems = [
    { icon: Home, label: "Accueil", path: "/dashboard" },
    { icon: FileCheck, label: "Documents supportés", path: "/dashboard?view=Documents supportés" },
    { icon: Archive, label: "Documents archivés", path: "/dashboard?view=Documents archivés" },
  ];

  return (
    <div className="flex flex-col h-full bg-card">
      <div className="p-6 border-b border-border">
        <h2 className="text-xl font-bold text-foreground">Formulama</h2>
        <p className="text-sm text-muted-foreground mt-1">Menu de navigation</p>
      </div>

      {/* Section Statistiques en haut */}
      <div className="px-4 py-4 space-y-2 border-b border-border bg-primary/5">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Statistiques</p>
        <div className="grid grid-cols-3 gap-2">
          <div className="text-center p-2 rounded-lg bg-background/50">
            <p className="text-xs text-muted-foreground">Total</p>
            <p className="text-lg font-bold text-primary">{stats.total}</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-background/50">
            <p className="text-xs text-muted-foreground">Archivés</p>
            <p className="text-lg font-bold text-primary">{stats.archives}</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-background/50">
            <p className="text-xs text-muted-foreground">Supportés</p>
            <p className="text-lg font-bold text-primary">{stats.supportes}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item, index) => (
          <button
            key={index}
            onClick={() => navigate(item.path)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 hover:bg-primary/10 hover:text-primary group"
          >
            <item.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}

        <Separator className="my-4" />

        <button
          onClick={() => navigate("/aide")}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 hover:bg-primary/10 hover:text-primary group"
        >
          <HelpCircle className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
          <span className="font-medium">Aide</span>
        </button>
      </nav>
    </div>
  );
};

export default NavigationMenu;
