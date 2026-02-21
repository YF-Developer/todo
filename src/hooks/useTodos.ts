import { useCallback, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type { Todo, Subtask, Filters, SortField } from '../types/todo';

const PRIORITY_ORDER: Record<string, number> = { high: 0, medium: 1, low: 2 };

function generateId(): string {
  return crypto.randomUUID();
}

export function useTodos() {
  const [todos, setTodos] = useLocalStorage<Todo[]>('todos-v1', []);
  const [filters, setFilters] = useLocalStorage<Filters>('filters-v1', {
    status: 'all',
    priority: 'all',
    category: '',
    search: '',
    sort: 'createdAt',
  });
  const [darkMode, setDarkMode] = useLocalStorage<boolean>('darkMode', false);

  // --- CRUD ---

  const addTodo = useCallback(
    (
      text: string,
      priority: Todo['priority'] = 'medium',
      category = '',
      dueDate?: string,
    ) => {
      const newTodo: Todo = {
        id: generateId(),
        text: text.trim(),
        completed: false,
        priority,
        category: category.trim(),
        dueDate,
        createdAt: new Date().toISOString(),
        subtasks: [],
      };
      setTodos((prev) => [newTodo, ...prev]);
    },
    [setTodos],
  );

  const deleteTodo = useCallback(
    (id: string) => {
      setTodos((prev) => prev.filter((t) => t.id !== id));
    },
    [setTodos],
  );

  const toggleTodo = useCallback(
    (id: string) => {
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
      );
    },
    [setTodos],
  );

  const updateTodo = useCallback(
    (id: string, changes: Partial<Omit<Todo, 'id' | 'createdAt' | 'subtasks'>>) => {
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...changes } : t)),
      );
    },
    [setTodos],
  );

  const clearCompleted = useCallback(() => {
    setTodos((prev) => prev.filter((t) => !t.completed));
  }, [setTodos]);

  // --- Subtasks ---

  const addSubtask = useCallback(
    (todoId: string, text: string) => {
      const subtask: Subtask = { id: generateId(), text: text.trim(), completed: false };
      setTodos((prev) =>
        prev.map((t) =>
          t.id === todoId ? { ...t, subtasks: [...t.subtasks, subtask] } : t,
        ),
      );
    },
    [setTodos],
  );

  const toggleSubtask = useCallback(
    (todoId: string, subtaskId: string) => {
      setTodos((prev) =>
        prev.map((t) =>
          t.id === todoId
            ? {
                ...t,
                subtasks: t.subtasks.map((s) =>
                  s.id === subtaskId ? { ...s, completed: !s.completed } : s,
                ),
              }
            : t,
        ),
      );
    },
    [setTodos],
  );

  const deleteSubtask = useCallback(
    (todoId: string, subtaskId: string) => {
      setTodos((prev) =>
        prev.map((t) =>
          t.id === todoId
            ? { ...t, subtasks: t.subtasks.filter((s) => s.id !== subtaskId) }
            : t,
        ),
      );
    },
    [setTodos],
  );

  // --- Reorder (DnD) ---

  const reorderTodos = useCallback(
    (fromIndex: number, toIndex: number) => {
      setTodos((prev) => {
        const next = [...prev];
        const [moved] = next.splice(fromIndex, 1);
        next.splice(toIndex, 0, moved);
        return next;
      });
    },
    [setTodos],
  );

  // --- Categories ---

  const categories = useMemo(
    () => Array.from(new Set(todos.map((t) => t.category).filter(Boolean))).sort(),
    [todos],
  );

  // --- Filtered & Sorted todos ---

  const filteredTodos = useMemo(() => {
    let result = todos.filter((t) => {
      if (filters.status === 'active' && t.completed) return false;
      if (filters.status === 'completed' && !t.completed) return false;
      if (filters.priority !== 'all' && t.priority !== filters.priority) return false;
      if (filters.category && t.category !== filters.category) return false;
      if (
        filters.search &&
        !t.text.toLowerCase().includes(filters.search.toLowerCase())
      )
        return false;
      return true;
    });

    result = [...result].sort((a, b) => {
      const s: SortField = filters.sort;
      if (s === 'priority') return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
      if (s === 'dueDate') {
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return a.dueDate.localeCompare(b.dueDate);
      }
      return b.createdAt.localeCompare(a.createdAt);
    });

    return result;
  }, [todos, filters]);

  // --- Stats ---

  const stats = useMemo(() => {
    const total = todos.length;
    const completed = todos.filter((t) => t.completed).length;
    return { total, completed, active: total - completed };
  }, [todos]);

  return {
    todos,
    filteredTodos,
    filters,
    setFilters,
    darkMode,
    setDarkMode,
    categories,
    stats,
    addTodo,
    deleteTodo,
    toggleTodo,
    updateTodo,
    clearCompleted,
    addSubtask,
    toggleSubtask,
    deleteSubtask,
    reorderTodos,
  };
}
