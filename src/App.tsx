import { useEffect } from 'react';
import { useTodos } from './hooks/useTodos';
import { Header } from './components/Header';
import { ProgressBar } from './components/ProgressBar';
import { TodoInput } from './components/TodoInput';
import { FilterBar } from './components/FilterBar';
import { TodoList } from './components/TodoList';

export default function App() {
  const {
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
  } = useTodos();

  // Apply dark mode class to <html>
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-2xl mx-auto px-4 py-10">
        <Header
          darkMode={darkMode}
          onToggleDark={() => setDarkMode((v) => !v)}
          activeCount={stats.active}
          completedCount={stats.completed}
          onClearCompleted={clearCompleted}
        />

        <ProgressBar total={stats.total} completed={stats.completed} />

        <TodoInput onAdd={addTodo} categories={categories} />

        <FilterBar
          filters={filters}
          onChange={(partial) => setFilters((prev) => ({ ...prev, ...partial }))}
          categories={categories}
        />

        <TodoList
          todos={filteredTodos}
          allTodos={todos}
          onReorder={reorderTodos}
          onToggle={toggleTodo}
          onDelete={deleteTodo}
          onUpdate={updateTodo}
          onAddSubtask={addSubtask}
          onToggleSubtask={toggleSubtask}
          onDeleteSubtask={deleteSubtask}
        />
      </div>
    </div>
  );
}
