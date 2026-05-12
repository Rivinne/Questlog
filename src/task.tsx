// Note le "import type" ci-dessous pour éviter les erreurs rouges
import type { Task, Priority } from './types';
import { calculateTaskXP } from './utils/xpSystem';

function TestTaskLogic() {
  // Simulation d'une création de tâche
  const createDemoTask = () => {
    const priority: Priority = 'CRITICAL';
    const isFrog = true;

    const newTask: Task = {
      id: '1',
      title: 'Rédiger l\'offre irrésistible',
      isCompleted: false,
      createdAt: new Date().toISOString(),
      priority: priority,
      isFrog: isFrog,
      // Le calcul se fait ici automatiquement :
      xpValue: calculateTaskXP(priority, isFrog) 
    };

    console.log('Tâche créée :', newTask);
    // On affiche le résultat dans une alerte pour tester
    alert(`Tâche : ${newTask.title}\nXP Gagnée : ${newTask.xpValue} XP`);
  };

  return (
    <div className="p-10 border border-gray-300 rounded m-4">
      <h2 className="text-xl font-bold mb-4">Test du Moteur XP</h2>
      <button 
        onClick={createDemoTask}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
      >
        Générer une Tâche Critique + Frog
      </button>
      <p className="mt-4 text-sm text-gray-500">
        Clique pour voir le calcul d'XP dans une alerte.
      </p>
    </div>
  );
}

export default TestTaskLogic;
