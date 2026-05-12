import { useState, useEffect } from 'react';
import QuestCard from './questCard';
import { ModalAddTask } from './ModalAddTask';
import type { Task } from '../types';
import { Plus, BookOpen, BookMarked, Clock, Zap, TrendingUp, ChevronLeft, ChevronRight, Sun } from 'lucide-react';
import { FrogIcon } from './FrogIcon';
import { subscribeTasks, createTask, completeTask, deleteTask, updateTask } from '../services/tasksService';
import type { User } from 'firebase/auth';

interface DashboardProps {
  user: User;
}

export function Dashboard({ user }: DashboardProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalFrogMode, setModalFrogMode] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // S'abonner aux tâches en temps réel
  useEffect(() => {
    if (!user) return;

    const unsubscribe = subscribeTasks(user.uid, (tasks) => {
      setTasks(tasks);
    });

    return () => unsubscribe();
  }, [user]);

  const handleTaskComplete = async (taskId: string) => {
    try {
      await completeTask(taskId);
    } catch (error) {
      console.error('Erreur lors de la complétion de la tâche:', error);
    }
  };

  const handleAddTask = async (taskData: { 
    title: string; 
    notes: string; 
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'; 
    isFrog: boolean;
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
  }) => {
    if (!user) return;
    try {
      if (editingTask) {
        // Mode édition
        await updateTask(editingTask.id, {
          title: taskData.title,
          description: taskData.notes,
          priority: taskData.priority,
          isFrog: taskData.isFrog,
          startDate: taskData.startDate || undefined,
          startTime: taskData.startTime || undefined,
          endDate: taskData.endDate || undefined,
          endTime: taskData.endTime || undefined,
        });
      } else {
        // Mode création
        await createTask(user.uid, {
          title: taskData.title,
          description: taskData.notes,
          isCompleted: false,
          priority: taskData.priority,
          isFrog: taskData.isFrog,
          xpValue: taskData.isFrog ? 100 : 15,
          startDate: taskData.startDate || undefined,
          startTime: taskData.startTime || undefined,
          endDate: taskData.endDate || undefined,
          endTime: taskData.endTime || undefined,
        });
      }
      setModalOpen(false);
      setEditingTask(null);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de la tâche:', error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId);
      setModalOpen(false);
      setEditingTask(null);
    } catch (error) {
      console.error('Erreur lors de la suppression de la tâche:', error);
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setModalFrogMode(task.isFrog);
    setModalOpen(true);
  };

  // Séparer les frogs des quêtes normales
  const frogsToEat = tasks.filter(t => t.isFrog && !t.isCompleted);
  const dailyQuests = tasks.filter(t => !t.isFrog && !t.isCompleted);

  return (
    <>
      <ModalAddTask 
        isFrog={modalFrogMode} 
        editingTask={editingTask}
        isOpen={modalOpen} 
        onClose={() => {
          setModalOpen(false);
          setEditingTask(null);
        }} 
        onSubmit={handleAddTask}
        onDelete={handleDeleteTask}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-2">
      
      {/* COLONNE GAUCHE (3/4) : Quêtes */}
      <div className="lg:col-span-3 space-y-2">
        
        {/* SECTION 1: FROGS TO EAT */}
        <div className="bg-emerald-50 border-2 border-emerald-300 rounded-lg p-2.5">
          
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1">
              <FrogIcon size={20} />
              <h2 className="text-sm font-bold text-emerald-900">FROGS TO EAT</h2>
            </div>
            <span className="bg-emerald-200 text-emerald-800 font-bold px-1.5 py-0 rounded-full text-xs">
              {frogsToEat.length} ACTIVE(S)
            </span>
          </div>

          {/* Tasks List */}
          {frogsToEat.length === 0 ? (
            <div className="text-center py-3 mb-2">
              <p className="text-emerald-600 text-xs">Aucune grenouille en vue... Pour l'instant.</p>
            </div>
          ) : (
            <div className="space-y-1 mb-2">
              {frogsToEat.map((task) => (
                <QuestCard 
                  key={task.id} 
                  task={task} 
                  onComplete={handleTaskComplete}
                  onEdit={handleEditTask}
                />
              ))}
            </div>
          )}

          {/* Footer */}
          <div className="flex gap-2 pt-1.5 border-t border-emerald-200">
            <button
              className="flex-1 text-emerald-700 font-bold py-0.5 flex items-center justify-center gap-0.5 text-xs hover:bg-emerald-100 rounded transition"
            >
              VOIR TOUT
            </button>
            <button 
              onClick={() => {
                setModalFrogMode(true);
                setModalOpen(true);
              }}
              className="flex-1 text-emerald-700 font-bold py-0.5 flex items-center justify-center gap-0.5 text-xs border border-emerald-300 rounded hover:bg-emerald-100 transition">
              <Plus size={12} />
              AJOUTER
            </button>
          </div>

        </div>

        {/* SECTION 2: QUÊTES DU JOUR */}
        <div className="bg-white border border-gray-200 rounded-lg p-2.5">
          
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1">
              <BookOpen size={20} className="text-gray-700" />
              <h2 className="text-sm font-bold text-gray-900">QUÊTES DU JOUR</h2>
            </div>
            <span className="text-purple-600 font-bold px-1.5 py-0 rounded-full text-xs">
              {dailyQuests.length} ACTIVE(S)
            </span>
          </div>

          {/* Tasks List or Empty State */}
          {dailyQuests.length === 0 ? (
            <div className="text-center py-3">
              <p className="text-gray-400 text-xs">Aucune quête active. Le calme avant la tempête ?</p>
            </div>
          ) : (
            <div className="space-y-1 mb-2">
              {dailyQuests.map((task) => (
                <QuestCard 
                  key={task.id} 
                  task={task} 
                  onComplete={handleTaskComplete}
                  onEdit={handleEditTask}
                />
              ))}
            </div>
          )}

          {/* Bouton Ajouter */}
          <button 
            onClick={() => {
              setModalFrogMode(false);
              setModalOpen(true);
            }}
            className="w-full text-emerald-700 font-bold py-1 flex items-center justify-center gap-1 border border-emerald-300 rounded hover:bg-emerald-50 transition text-xs">
            <Plus size={12} />
            AJOUTER
          </button>

        </div>

        {/* SECTION 3: CAMPAGNES EN COURS */}
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <BookMarked size={24} className="text-gray-700" />
            <h2 className="text-base font-bold text-gray-900">CAMPAGNES EN COURS</h2>
          </div>
          <p className="text-gray-500 text-xs">À développer...</p>
        </div>

      </div>

      {/* COLONNE DROITE (1/4) : Mode Focus & Rituels */}
      <div className="space-y-4">
        
        {/* MODE FOCUS */}
        <div className="bg-white border border-gray-200 rounded-xl p-3">
          <div className="flex items-center gap-2 mb-3">
            <Clock size={18} className="text-gray-700" />
            <h3 className="font-bold text-gray-900 text-sm">MODE FOCUS</h3>
          </div>
          <div className="space-y-1.5">
            <div className="bg-yellow-50 rounded-lg p-2 text-center">
              <Zap size={20} className="mx-auto font-bold text-yellow-600" />
              <p className="text-xs font-bold text-yellow-700 mt-0.5">5 min</p>
              <p className="text-xs text-gray-500">AMORÇAGE</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-2 text-center">
              <TrendingUp size={20} className="mx-auto font-bold text-purple-600" />
              <p className="text-xs font-bold text-purple-700 mt-0.5">25 min</p>
              <p className="text-xs text-gray-500">DEEP WORK</p>
            </div>
          </div>
        </div>

        {/* RITUELS DE PUISSANCE */}
        <div className="bg-white border border-gray-200 rounded-xl p-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sun size={18} className="text-gray-700" />
              <h3 className="font-bold text-gray-900 text-sm">RITUELS</h3>
            </div>
            <span className="text-xs text-gray-500">3% du mois</span>
          </div>
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-3.5 h-3.5 rounded" />
              <span className="text-xs text-gray-700">Affirmations Positives</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-3.5 h-3.5 rounded" />
              <span className="text-xs text-gray-700">Cohérence Cardiaque</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-3.5 h-3.5 rounded" />
              <span className="text-xs text-gray-700">Yoga / Mouvement</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-3.5 h-3.5 rounded" />
              <span className="text-xs text-gray-700">Luminothérapie</span>
            </label>
          </div>
          <div className="mt-3 pt-3 border-t">
            <p className="text-xs text-gray-500 font-bold">VOLUME MENSUEL</p>
            <p className="text-xs text-teal-600 font-bold flex items-center gap-1"><TrendingUp size={14} /> 1 réalisés (+1 vs M-1)</p>
          </div>
        </div>

        {/* CALENDRIER */}
        <div className="bg-white border border-gray-200 rounded-xl p-3">
          <div className="flex items-center justify-between mb-2">
            <button className="text-gray-600 hover:text-gray-900"><ChevronLeft size={16} /></button>
            <h3 className="font-bold text-gray-900 text-xs">DÉCEMBRE 2025</h3>
            <button className="text-gray-600 hover:text-gray-900"><ChevronRight size={16} /></button>
          </div>
          <div className="grid grid-cols-7 gap-0.5 text-center text-xs mb-2">
            <div className="font-bold text-gray-500">L</div>
            <div className="font-bold text-gray-500">M</div>
            <div className="font-bold text-gray-500">M</div>
            <div className="font-bold text-gray-500">J</div>
            <div className="font-bold text-gray-500">V</div>
            <div className="font-bold text-gray-500">S</div>
            <div className="font-bold text-gray-500">D</div>
            {[1,2,3,4,5,6,7,8,9].map(day => (
              <div key={day} className="py-0.5 text-gray-600 text-xs">{day}</div>
            ))}
          </div>
          <p className="text-xs text-gray-500">PLANNING DU 9 déc.</p>
        </div>

      </div>
      </div>

    </>
  );
}
