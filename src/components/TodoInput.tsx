import { useState, useRef } from 'react';
import { Plus, ChevronDown, ChevronUp } from 'lucide-react';
import type { Todo } from '../types/todo';

interface Props {
  onAdd: (text: string, priority: Todo['priority'], category: string, dueDate?: string) => void;
  categories: string[];
}

const PRIORITY_OPTS: { value: Todo['priority']; label: string; color: string }[] = [
  { value: 'high', label: '高', color: 'text-red-500' },
  { value: 'medium', label: '中', color: 'text-yellow-500' },
  { value: 'low', label: '低', color: 'text-emerald-500' },
];

export function TodoInput({ onAdd, categories }: Props) {
  const [text, setText] = useState('');
  const [priority, setPriority] = useState<Todo['priority']>('medium');
  const [category, setCategory] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [expanded, setExpanded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    if (!text.trim()) return;
    onAdd(text, priority, category, dueDate || undefined);
    setText('');
    setPriority('medium');
    setCategory('');
    setDueDate('');
    inputRef.current?.focus();
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') {
      setText('');
      setExpanded(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 mb-5 transition-all"
    >
      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="新しいタスクを追加... (Enter で追加)"
          className="flex-1 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none text-sm"
          autoFocus
        />
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          aria-label="オプションを開閉"
        >
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        <button
          type="submit"
          disabled={!text.trim()}
          className="flex items-center gap-1 px-3 py-1.5 bg-violet-500 hover:bg-violet-600 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-sm font-medium transition-all"
        >
          <Plus className="w-4 h-4" />
          追加
        </button>
      </div>

      {expanded && (
        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 grid grid-cols-3 gap-3">
          {/* Priority */}
          <div>
            <label className="block text-xs text-gray-400 mb-1">優先度</label>
            <div className="flex gap-1">
              {PRIORITY_OPTS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setPriority(opt.value)}
                  className={`flex-1 text-xs py-1 rounded-lg border transition-all ${
                    priority === opt.value
                      ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 font-medium'
                      : 'border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-gray-300'
                  }`}
                >
                  <span className={opt.color}>●</span> {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs text-gray-400 mb-1">カテゴリ</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              list="category-list"
              placeholder="カテゴリ..."
              className="w-full text-xs bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-2 py-1.5 text-gray-700 dark:text-gray-300 outline-none focus:border-violet-400"
            />
            <datalist id="category-list">
              {categories.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-xs text-gray-400 mb-1">期日</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full text-xs bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-2 py-1.5 text-gray-700 dark:text-gray-300 outline-none focus:border-violet-400"
            />
          </div>
        </div>
      )}
    </form>
  );
}
