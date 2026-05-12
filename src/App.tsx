import { useState, useEffect } from "react";
import { auth } from "./firebase";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";

import { Layout } from "./components/layout"; 
// --- Import du nouveau Dashboard ---
import { Dashboard } from "./components/Dashboard"; 
// ----------------------------------

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('DASHBOARD');
  
  // États simplifiés pour le formulaire
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  // Surveillance de la connexion
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = () => signOut(auth);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (error: any) {
      alert("Erreur d'authentification : " + error.message);
    }
  };

  // --- ECRAN LOGIN (Non modifié) ---
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
        <div className="max-w-md w-full bg-gray-800 p-8 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold text-center mb-6 text-yellow-500">QUESTLOG</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 bg-gray-700 rounded" />
            <input type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 bg-gray-700 rounded" />
            <button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 rounded">
              {isLogin ? "Se connecter" : "S'inscrire"}
            </button>
          </form>
          <button onClick={() => setIsLogin(!isLogin)} className="w-full mt-4 text-sm text-gray-400 hover:text-white underline">
            {isLogin ? "Nouveau joueur ? Créer un compte" : "J'ai déjà un compte ? Se connecter"}
          </button>
        </div>
      </div>
    );
  }

  // --- ECRAN PRINCIPAL AVEC LAYOUT ---
  return (
    <Layout 
      userEmail={user.email || ''} 
      onLogout={handleLogout}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
    >
      {/* AFFICHAGE DU CONTENU SELON L'ONGLET */}
      
      {/* ⚠️ NOTE: On utilise le composant Dashboard pour TOUT ce qui est à l'intérieur */}
      
      {activeTab === 'DASHBOARD' && (
        // --- Le Dashboard s'affiche ici ---
        <Dashboard user={user} /> 
      )}
      
      {activeTab === 'WARROOM' && (
        <div className="max-w-7xl mx-auto p-4">
            <h2 className="text-2xl font-bold text-gray-800">⚔️ Salle de Guerre</h2>
            <p className="mt-4 text-red-500">Le plateau de tri Kanban arrive ici.</p>
        </div>
      )}
      
      {/* On peut ajouter ici les autres onglets... */}

    </Layout>
  );
}

export default App;