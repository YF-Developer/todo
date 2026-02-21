export interface Subtask {
  id: string;
  text: string;
  completed: boolean;
}

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  category: string;
  dueDate?: string;
  createdAt: string;
  subtasks: Subtask[];
}

export type FilterStatus = 'all' | 'active' | 'completed';
export type FilterPriority = 'all' | 'high' | 'medium' | 'low';
export type SortField = 'createdAt' | 'dueDate' | 'priority';

export interface Filters {
  status: FilterStatus;
  priority: FilterPriority;
  category: string;
  search: string;
  sort: SortField;
}
