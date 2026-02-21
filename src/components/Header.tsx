import { Moon, Sun, CheckSquare } from 'lucide-react';

interface Props {
  darkMode: boolean;
  onToggleDark: () => void;
  activeCount: number;
  onClearCompleted: () => void;
  completedCount: number;
}

export function Header({ darkMode, onToggleDark, activeCount, onClearCompleted, completedCount }: Props) {
  return (
    <header className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-2">
        <CheckSquare className="w-8 h-8 text-violet-500" strokeWidth={2} />
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white leading-none">
            My Todos
          </h1>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
            {activeCount} 件残り
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {completedCount > 0 && (
          <button
            onClick={onClearCompleted}
            className="text-xs text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors px-2 py-1 rounded"
          >
            完了済みを削除
          </button>
        )}
        <button
          onClick={onToggleDark}
          className="p-2 rounded-xl text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
          aria-label="テーマ切り替え"
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>
    </header>
  );
}
