import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  onSnapshot,
  getDocs
} from "firebase/firestore";
import { db } from "../firebase";
import type { Task } from "../types";

const TASKS_COLLECTION = "tasks";

// Créer une tâche
export const createTask = async (userId: string, task: Omit<Task, 'id' | 'createdAt'>): Promise<string> => {
  const docRef = await addDoc(collection(db, TASKS_COLLECTION), {
    ...task,
    userId,
    createdAt: new Date().toISOString(),
  });
  return docRef.id;
};

// Récupérer toutes les tâches d'un utilisateur
export const getTasks = async (userId: string): Promise<Task[]> => {
  const q = query(collection(db, TASKS_COLLECTION), where("userId", "==", userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as Task[];
};

// S'abonner aux tâches en temps réel
export const subscribeTasks = (userId: string, callback: (tasks: Task[]) => void) => {
  const q = query(collection(db, TASKS_COLLECTION), where("userId", "==", userId));
  
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const tasks = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Task[];
    callback(tasks);
  });

  return unsubscribe;
};

// Mettre à jour une tâche
export const updateTask = async (taskId: string, updates: Partial<Task>) => {
  const taskRef = doc(db, TASKS_COLLECTION, taskId);
  await updateDoc(taskRef, updates);
};

// Supprimer une tâche
export const deleteTask = async (taskId: string) => {
  const taskRef = doc(db, TASKS_COLLECTION, taskId);
  await deleteDoc(taskRef);
};

// Marquer une tâche comme complétée
export const completeTask = async (taskId: string) => {
  await updateTask(taskId, { isCompleted: true });
};
