import { useState, useRef } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  GripVertical,
  Trash2,
  ChevronDown,
  ChevronUp,
  Plus,
  X,
  Pencil,
  Check,
  CalendarDays,
  AlertTriangle,
} from 'lucide-react';
import type { Todo } from '../types/todo';
import { CategoryBadge } from './CategoryBadge';
import { formatDate, isOverdue, isDueSoon } from '../utils/helpers';

interface Props {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, changes: Partial<Omit<Todo, 'id' | 'createdAt' | 'subtasks'>>) => void;
  onAddSubtask: (todoId: string, text: string) => void;
  onToggleSubtask: (todoId: string, subtaskId: string) => void;
  onDeleteSubtask: (todoId: string, subtaskId: string) => void;
}

const PRIORITY_COLORS: Record<Todo['priority'], string> = {
  high: 'bg-red-500',
  medium: 'bg-yellow-400',
  low: 'bg-emerald-400',
};

export function TodoItem({
  todo,
  onToggle,
  onDelete,
  onUpdate,
  onAddSubtask,
  onToggleSubtask,
  onDeleteSubtask,
}: Props) {
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const [subtaskText, setSubtaskText] = useState('');
  const editRef = useRef<HTMLInputElement>(null);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: todo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : undefined,
  };

  function commitEdit() {
    if (editText.trim() && editText.trim() !== todo.text) {
      onUpdate(todo.id, { text: editText.trim() });
    } else {
      setEditText(todo.text);
    }
    setEditing(false);
  }

  function handleEditKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') commitEdit();
    if (e.key === 'Escape') {
      setEditText(todo.text);
      setEditing(false);
    }
  }

  function handleAddSubtask(e: React.FormEvent) {
    e.preventDefault();
    if (!subtaskText.trim()) return;
    onAddSubtask(todo.id, subtaskText);
    setSubtaskText('');
  }

  const overdue = isOverdue(todo.dueDate) && !todo.completed;
  const dueSoon = isDueSoon(todo.dueDate) && !todo.completed;
  const completedSubtasks = todo.subtasks.filter((s) => s.completed).length;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group bg-white dark:bg-gray-800 rounded-2xl shadow-sm border transition-all duration-200 ${
        todo.completed
          ? 'border-gray-100 dark:border-gray-700/50 opacity-60'
          : overdue
          ? 'border-red-200 dark:border-red-900/40'
          : 'border-gray-100 dark:border-gray-700 hover:border-violet-200 dark:hover:border-violet-700/50'
      }`}
    >
      {/* Main row */}
      <div className="flex items-start gap-3 p-4">
        {/* Drag handle */}
        <button
          {...attributes}
          {...listeners}
          className="mt-0.5 text-gray-300 dark:text-gray-600 hover:text-gray-400 dark:hover:text-gray-500 cursor-grab active:cursor-grabbing touch-none flex-shrink-0"
          aria-label="ドラッグして並び替え"
        >
          <GripVertical className="w-4 h-4" />
        </button>

        {/* Priority dot */}
        <div className={`w-2 h-2 mt-1.5 rounded-full flex-shrink-0 ${PRIORITY_COLORS[todo.priority]}`} />

        {/* Checkbox */}
        <button
          onClick={() => onToggle(todo.id)}
          className={`mt-0.5 w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${
            todo.completed
              ? 'border-violet-500 bg-violet-500'
              : 'border-gray-300 dark:border-gray-600 hover:border-violet-400'
          }`}
          aria-label={todo.completed ? '未完了にする' : '完了にする'}
        >
          {todo.completed && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
        </button>

        {/* Text area */}
        <div className="flex-1 min-w-0">
          {editing ? (
            <input
              ref={editRef}
              autoFocus
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={handleEditKeyDown}
              onBlur={commitEdit}
              className="w-full text-sm text-gray-900 dark:text-white bg-transparent border-b border-violet-400 outline-none pb-0.5"
            />
          ) : (
            <p
              className={`text-sm leading-relaxed break-words ${
                todo.completed ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-800 dark:text-gray-200'
              }`}
            >
              {todo.text}
            </p>
          )}

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-2 mt-1.5">
            {todo.category && <CategoryBadge category={todo.category} />}
            {todo.dueDate && (
              <span
                className={`flex items-center gap-1 text-xs ${
                  overdue
                    ? 'text-red-500 dark:text-red-400'
                    : dueSoon
                    ? 'text-yellow-500 dark:text-yellow-400'
                    : 'text-gray-400 dark:text-gray-500'
                }`}
              >
                {overdue && <AlertTriangle className="w-3 h-3" />}
                <CalendarDays className="w-3 h-3" />
                {formatDate(todo.dueDate)}
                {overdue && ' 期限切れ'}
                {dueSoon && !overdue && ' もうすぐ'}
              </span>
            )}
            {todo.subtasks.length > 0 && (
              <span className="text-xs text-gray-400 dark:text-gray-500">
                {completedSubtasks}/{todo.subtasks.length} サブタスク
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
          <button
            onClick={() => {
              setEditing(true);
              setEditText(todo.text);
            }}
            className="p-1 rounded-lg text-gray-400 hover:text-violet-500 hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-all"
            aria-label="編集"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setExpanded((v) => !v)}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
            aria-label="詳細"
          >
            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => onDelete(todo.id)}
            className="p-1 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
            aria-label="削除"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Subtasks */}
      {expanded && (
        <div className="px-4 pb-4 space-y-2">
          <div className="ml-11 space-y-1.5">
            {todo.subtasks.map((s) => (
              <div key={s.id} className="flex items-center gap-2 group/sub">
                <button
                  onClick={() => onToggleSubtask(todo.id, s.id)}
                  className={`w-4 h-4 rounded border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                    s.completed
                      ? 'border-violet-400 bg-violet-400'
                      : 'border-gray-300 dark:border-gray-600 hover:border-violet-400'
                  }`}
                >
                  {s.completed && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
                </button>
                <span
                  className={`flex-1 text-sm ${
                    s.completed
                      ? 'line-through text-gray-400 dark:text-gray-500'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {s.text}
                </span>
                <button
                  onClick={() => onDeleteSubtask(todo.id, s.id)}
                  className="opacity-0 group-hover/sub:opacity-100 text-gray-300 hover:text-red-400 transition-all"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}

            {/* Add subtask */}
            <form onSubmit={handleAddSubtask} className="flex items-center gap-2 mt-2">
              <Plus className="w-4 h-4 text-gray-300 flex-shrink-0" />
              <input
                type="text"
                value={subtaskText}
                onChange={(e) => setSubtaskText(e.target.value)}
                placeholder="サブタスクを追加..."
                className="flex-1 text-xs bg-transparent text-gray-600 dark:text-gray-400 placeholder-gray-300 dark:placeholder-gray-600 outline-none border-b border-transparent focus:border-gray-200 dark:focus:border-gray-600 pb-0.5"
              />
              {subtaskText && (
                <button
                  type="submit"
                  className="text-xs text-violet-500 hover:text-violet-600 font-medium"
                >
                  追加
                </button>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
