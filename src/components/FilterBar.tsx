import { Search, X } from 'lucide-react';
import type { Filters, FilterStatus, FilterPriority, SortField } from '../types/todo';

interface Props {
  filters: Filters;
  onChange: (f: Partial<Filters>) => void;
  categories: string[];
}

const STATUS_TABS: { value: FilterStatus; label: string }[] = [
  { value: 'all', label: 'すべて' },
  { value: 'active', label: '未完了' },
  { value: 'completed', label: '完了' },
];

const PRIORITY_TABS: { value: FilterPriority; label: string; dot: string }[] = [
  { value: 'all', label: 'すべて', dot: '' },
  { value: 'high', label: '高', dot: 'text-red-500' },
  { value: 'medium', label: '中', dot: 'text-yellow-500' },
  { value: 'low', label: '低', dot: 'text-emerald-500' },
];

const SORT_OPTS: { value: SortField; label: string }[] = [
  { value: 'createdAt', label: '作成日' },
  { value: 'dueDate', label: '期日' },
  { value: 'priority', label: '優先度' },
];

export function FilterBar({ filters, onChange, categories }: Props) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 mb-5 space-y-3">
      {/* Search */}
      <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700 rounded-xl px-3 py-2">
        <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
        <input
          type="text"
          value={filters.search}
          onChange={(e) => onChange({ search: e.target.value })}
          placeholder="タスクを検索..."
          className="flex-1 bg-transparent text-sm text-gray-700 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-500 outline-none"
        />
        {filters.search && (
          <button onClick={() => onChange({ search: '' })} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        {/* Status tabs */}
        <div className="flex rounded-xl bg-gray-100 dark:bg-gray-700 p-0.5 gap-0.5">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => onChange({ status: tab.value })}
              className={`text-xs px-3 py-1 rounded-lg font-medium transition-all ${
                filters.status === tab.value
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Priority filter */}
        <div className="flex rounded-xl bg-gray-100 dark:bg-gray-700 p-0.5 gap-0.5">
          {PRIORITY_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => onChange({ priority: tab.value })}
              className={`text-xs px-3 py-1 rounded-lg font-medium transition-all ${
                filters.priority === tab.value
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              {tab.dot && <span className={tab.dot}>● </span>}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Category filter */}
        {categories.length > 0 && (
          <select
            value={filters.category}
            onChange={(e) => onChange({ category: e.target.value })}
            className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-xl px-3 py-1.5 border-none outline-none cursor-pointer"
          >
            <option value="">カテゴリ: すべて</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        )}

        {/* Sort */}
        <div className="flex items-center gap-1 ml-auto">
          <span className="text-xs text-gray-400">並び替え:</span>
          <select
            value={filters.sort}
            onChange={(e) => onChange({ sort: e.target.value as SortField })}
            className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-xl px-3 py-1.5 border-none outline-none cursor-pointer"
          >
            {SORT_OPTS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
