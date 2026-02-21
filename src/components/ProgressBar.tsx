interface Props {
  total: number;
  completed: number;
}

export function ProgressBar({ total, completed }: Props) {
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className="mb-6">
      <div className="flex justify-between mb-1 text-sm text-gray-500 dark:text-gray-400">
        <span>進捗</span>
        <span>{completed} / {total} 完了 ({pct}%)</span>
      </div>
      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
