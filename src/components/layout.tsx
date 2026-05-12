import type { ReactNode } from "react";
// Assurez-vous que lucide-react est bien installé
import { LayoutDashboard, Sword, Settings, LogOut, User } from "lucide-react";

interface LayoutProps {
  children: ReactNode; // Contenu de la page (Quêtes, War Room, etc.)
  userEmail: string;
  onLogout: () => void;
  activeTab: string; // Pour mettre en évidence le bon bouton
  setActiveTab: (tab: string) => void;
}

export function Layout({ children, userEmail, onLogout, activeTab, setActiveTab }: LayoutProps) {
  
  // Définition des éléments du Menu
  const navItems = [
    { id: 'DASHBOARD', label: 'Tableau de Bord', icon: LayoutDashboard },
    { id: 'WARROOM', label: 'Salle de Guerre', icon: Sword },
    { id: 'PREPARATION', label: 'Préparation', icon: Settings },
    { id: 'ARCANES', label: 'Arcanes', icon: Settings },
    { id: 'VISION', label: 'Vision Annuelle', icon: Settings },
    { id: 'IDENTITY', label: 'Identité', icon: User },
  ];

  return (
    // Structure globale : Flexbox pour Sidebar + Main Content (strictement h-screen pour la barre fixe)
    <div className="flex h-screen bg-gray-50 font-sans">
      
      {/* 1. BARRE LATÉRALE (SIDEBAR) - DESIGN STABLE */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col shadow-xl border-r border-slate-800">
        
        {/* Logo QUESLTOG */}
        <div className="p-6 border-b border-slate-800 shrink-0">
          <h1 className="text-2xl font-black tracking-tighter text-yellow-500 flex items-center gap-2">
            <Sword className="h-6 w-6" /> QUESTLOG
          </h1>
        </div>

        {/* Menu de Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => (
            <MenuButton 
              key={item.id}
              icon={<item.icon size={20} />} 
              label={item.label}
              active={activeTab === item.id}
              onClick={() => setActiveTab(item.id)}
            />
          ))}
        </nav>

        {/* Pied du menu : Profil simple */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-purple-600 flex items-center justify-center text-xs font-bold">
                {userEmail.charAt(0).toUpperCase()}
              </div>
              <div className="text-sm font-medium text-white truncate max-w-[100px]">{userEmail}</div>
            </div>
            <button onClick={onLogout} title="Déconnexion" className="p-2 text-slate-400 hover:text-red-500 transition">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </aside>

      {/* 2. ZONE PRINCIPALE (MAIN CONTENT) */}
      <main className="flex-1 flex flex-col overflow-hidden">
        
        {/* Barre du Haut (Top Bar) - Contenu minimal pour l'instant */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-8 shadow-sm shrink-0">
          <h2 className="text-xl font-black text-gray-800 tracking-tight">
            {navItems.find(item => item.id === activeTab)?.label || "Dashboard"}
          </h2>
        </header>

        {/* Le Contenu de la Page (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
          {children}
        </div>

      </main>
    </div>
  );
}

// Composant pour les boutons du menu
function MenuButton({ icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm ${
      active 
        ? "bg-purple-600 text-white shadow-lg shadow-purple-900/50 font-bold" 
        : "text-slate-400 hover:bg-slate-800 hover:text-white"
    }`}>
      {icon}
      <span>{label}</span>
    </button>
  );
}