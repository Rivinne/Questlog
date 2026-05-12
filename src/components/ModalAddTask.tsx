import React, { useState, useEffect } from 'react';
import { X, Zap } from 'lucide-react';
import type { Task } from '../types';

interface ModalAddTaskProps {
  isOpen: boolean;
  isFrog?: boolean;
  editingTask?: Task | null;
  onClose: () => void;
  onSubmit: (task: { 
    title: string; 
    notes: string; 
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'; 
    isFrog: boolean;
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
  }) => void;
  onDelete?: (taskId: string) => void;
}

export function ModalAddTask({ isOpen, isFrog = false, editingTask = null, onClose, onSubmit, onDelete }: ModalAddTaskProps) {
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'>('MEDIUM');
  const [isTaskFrog, setIsTaskFrog] = useState(isFrog);
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');

  // Initialiser les champs avec les données de la tâche si en mode édition
  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setNotes(editingTask.description || '');
      setPriority(editingTask.priority);
      setIsTaskFrog(editingTask.isFrog);
      setStartDate(editingTask.startDate || '');
      setStartTime(editingTask.startTime || '');
      setEndDate(editingTask.endDate || '');
      setEndTime(editingTask.endTime || '');
    } else {
      setTitle('');
      setNotes('');
      setPriority('MEDIUM');
      setIsTaskFrog(isFrog);
      setStartDate('');
      setStartTime('');
      setEndDate('');
      setEndTime('');
    }
  }, [editingTask, isFrog, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    onSubmit({ title, notes, priority, isFrog: isTaskFrog, startDate, startTime, endDate, endTime });
    setTitle('');
    setNotes('');
    setPriority('MEDIUM');
    setIsTaskFrog(isFrog);
    setStartDate('');
    setStartTime('');
    setEndDate('');
    setEndTime('');
  };

  const handleDelete = () => {
    if (editingTask && onDelete) {
      onDelete(editingTask.id);
    }
  };

  if (!isOpen) return null;

  const isEditMode = !!editingTask;
  const modalTitle = isEditMode ? 'Modifier la Quête' : 'Nouvelle Quête';

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-2xl shadow-lg max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">{modalTitle}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Titre */}
          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">TITRE DE LA QUÊTE</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Ex: Apprendre Katakana"
            />
          </div>

          {/* Dates et Heures - 2 colonnes */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">DÉBUT</label>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">FIN</label>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Priorité et Frog Mode - 2 colonnes */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">PRIORITÉ</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="LOW">Basse</option>
                <option value="MEDIUM">Moyenne</option>
                <option value="HIGH">Haute</option>
                <option value="CRITICAL">Critique</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">MODE GRENOUILLE</label>
              <button
                type="button"
                onClick={() => setIsTaskFrog(!isTaskFrog)}
                className={`w-full py-2 rounded-lg font-bold text-xs transition-all flex items-center justify-center gap-2 ${
                  isTaskFrog 
                    ? 'bg-emerald-500 text-white' 
                    : 'bg-gray-200 text-gray-700 border border-gray-300'
                }`}
              >
                <Zap size={14} />
                {isTaskFrog ? 'ACTIVÉ' : 'DÉSACTIVÉ'}
              </button>
            </div>
          </div>

          {/* Notes - en bas */}
          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">NOTES</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
              rows={3}
              placeholder="Informations supplémentaires..."
            />
          </div>

          {/* Boutons */}
          <div className="flex gap-2 pt-3">
            <button
              type="button"
              onClick={() => {
                if (editingTask && onDelete) {
                  handleDelete();
                } else {
                  onClose();
                }
              }}
              className={`flex-1 font-bold py-2 border rounded-lg transition text-sm ${
                editingTask
                  ? 'text-red-600 border-red-200 hover:bg-red-50 cursor-pointer'
                  : 'text-red-600 border-red-200 hover:bg-red-50 cursor-pointer'
              }`}
            >
              Supprimer
            </button>
            <button
              type="submit"
              className="flex-1 bg-emerald-600 text-white font-bold py-2 rounded-lg hover:bg-emerald-700 transition text-sm"
            >
              Sauvegarder
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
