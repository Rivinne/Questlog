import { useState, useEffect } from "react";
import { auth } from "./firebase";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  onAuthStateChanged, 
  signOut,
  sendPasswordResetEmail
} from "firebase/auth";

function App() {
  // On utilise "any" pour éviter l'erreur technique que tu as eue
  const [user, setUser] = useState<any>(null);
  
  // Variables pour le formulaire
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // L'interrupteur : true = mode Connexion, false = mode Inscription
  const [isLogin, setIsLogin] = useState(true);

  // Surveillance de la connexion
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Fonction principale (Connexion ou Inscription)
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        alert("Compte créé avec succès !");
      }
    } catch (error: any) {
      if (error.code === 'auth/invalid-credential') {
         alert("Email ou mot de passe incorrect.");
      } else if (error.code === 'auth/email-already-in-use') {
         alert("Cet email est déjà utilisé.");
      } else {
         alert("Erreur : " + error.message);
      }
    }
  };

  // Fonction mot de passe oublié
  const motDePasseOublie = async () => {
    if (!email) {
      alert("Veuillez entrer votre email d'abord.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Email envoyé ! Vérifie tes spams.");
    } catch (error: any) {
      alert("Erreur : " + error.message);
    }
  };

  // --- ECRAN 1 : SI CONNECTÉ ---
  if (user) {
    return (
      <div style={{ padding: "50px", fontFamily: "Arial", textAlign: "center" }}>
        <h1>Bienvenue, Aventurier !</h1>
        <p>Tu es connecté : <strong>{user.email}</strong></p>
        <button 
          onClick={() => signOut(auth)} 
          style={{ padding: "10px 20px", background: "#ff4444", color: "white", border: "none", cursor: "pointer", marginTop: "20px" }}
        >
          Se déconnecter
        </button>
      </div>
    );
  }

  // --- ECRAN 2 : FORMULAIRE ---
  return (
    <div style={{ padding: "50px", fontFamily: "Arial", maxWidth: "400px", margin: "0 auto" }}>
      <h1 style={{textAlign: "center"}}>{isLogin ? "Connexion" : "Inscription"}</h1>
      
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <input 
          type="email" 
          placeholder="Email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ padding: "10px", fontSize: "16px" }}
        />
        
        <input 
          type="password" 
          placeholder="Mot de passe" 
          value={password}
          onChange={(e) => setPassword(e.target.value)} 
          style={{ padding: "10px", fontSize: "16px" }}
        />

        <button type="submit" style={{ padding: "12px", cursor: "pointer", background: "black", color: "white", fontSize: "16px", fontWeight: "bold" }}>
          {isLogin ? "Se connecter" : "S'inscrire"}
        </button>
      </form>

      <div style={{ marginTop: "20px", textAlign: "center" }}>
        {isLogin && (
          <button 
            onClick={motDePasseOublie}
            style={{ background: "none", border: "none", color: "blue", textDecoration: "underline", cursor: "pointer", display: "block", margin: "0 auto 10px auto" }}
          >
            Mot de passe oublié ?
          </button>
        )}

        <button 
          onClick={() => setIsLogin(!isLogin)}
          style={{ background: "none", border: "none", cursor: "pointer", color: "#555" }}
        >
          {isLogin ? "Pas de compte ? Créer un compte" : "Déjà un compte ? Se connecter"}
        </button>
      </div>
    </div>
  );
}

export default App;
