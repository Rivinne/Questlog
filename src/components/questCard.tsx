import { FrogIcon } from './FrogIcon';
import { CheckSquare } from 'lucide-react';
import type { Task } from '../types';
import { calculateTaskXP } from '../utils/xpSystem';

const formatDate = (dateStr?: string) => dateStr ? new Date(dateStr).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) : '';

interface QuestCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onComplete: (taskId: string) => void;
}

const QuestCard = ({ task, onEdit, onComplete }: QuestCardProps) => {
  const xp = calculateTaskXP(task.priority, task.isFrog);
  const dateParts = task.endDate ? formatDate(task.endDate).split(' ') : ['--', ''];
  const projectLabel = task.projectTitle || 'Quête perso';

  return (
    <div
      className="bg-white rounded-2xl border shadow-sm p-4 flex items-center gap-4 hover:bg-slate-50 transition group relative overflow-hidden"
    >
      {/* Date/Mois à gauche */}
      <div className="w-16 flex flex-col items-center justify-center border-r border-slate-100 pr-4 shrink-0">
        <span className="text-xl font-bold leading-none text-slate-700">{dateParts[0]}</span>
        <span className="text-[9px] font-bold uppercase text-slate-400 leading-none mt-1">{dateParts[1]}</span>
      </div>

      {/* Main content: titre, cible prioritaire, projet */}
      <div className="flex-1 cursor-pointer" onClick={() => onEdit(task)}>
        <div className="flex items-center gap-2 mb-1">
          {task.isFrog && (
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded uppercase bg-emerald-100 text-emerald-700">CIBLE PRIORITAIRE</span>
          )}
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">{projectLabel}</span>
        </div>
        <p className="font-bold text-slate-800 text-sm leading-none group-hover:text-emerald-700 transition">{task.title}</p>
      </div>

      {/* Action: Frog = bouton, secondaire = case à cocher */}
      {task.isFrog ? (
        <div className="flex items-center gap-2">
          <button
            onClick={e => { e.stopPropagation(); onComplete(task.id); }}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-black uppercase rounded-lg shadow-md shadow-emerald-200 hover:shadow-emerald-300 transition flex items-center gap-1.5 transform active:scale-95"
          >
            <FrogIcon className="w-4 h-4" /> MANGER !
          </button>
          <div className="text-xs font-black text-emerald-200">+{xp} XP</div>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <button
            onClick={e => { e.stopPropagation(); onComplete(task.id); }}
            className="w-9 h-9 rounded-xl border-2 border-slate-200 hover:border-violet-500 hover:bg-violet-50 text-violet-500 transition flex items-center justify-center shrink-0"
            tabIndex={0}
            aria-label="Compléter la tâche"
          >
            <CheckSquare size={18} />
          </button>
          <div className="text-xs font-black text-violet-200">+{xp} XP</div>
        </div>
      )}
    </div>
  );
};

export default QuestCard;
