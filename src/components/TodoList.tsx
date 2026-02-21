import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import type { Todo } from '../types/todo';
import { TodoItem } from './TodoItem';
import { ClipboardList } from 'lucide-react';

interface Props {
  todos: Todo[];
  allTodos: Todo[];
  onReorder: (fromIndex: number, toIndex: number) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, changes: Partial<Omit<Todo, 'id' | 'createdAt' | 'subtasks'>>) => void;
  onAddSubtask: (todoId: string, text: string) => void;
  onToggleSubtask: (todoId: string, subtaskId: string) => void;
  onDeleteSubtask: (todoId: string, subtaskId: string) => void;
}

export function TodoList({
  todos,
  allTodos,
  onReorder,
  onToggle,
  onDelete,
  onUpdate,
  onAddSubtask,
  onToggleSubtask,
  onDeleteSubtask,
}: Props) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const fromIndex = allTodos.findIndex((t) => t.id === active.id);
    const toIndex = allTodos.findIndex((t) => t.id === over.id);
    if (fromIndex !== -1 && toIndex !== -1) {
      onReorder(fromIndex, toIndex);
    }
  }

  if (todos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-300 dark:text-gray-600">
        <ClipboardList className="w-12 h-12 mb-3" />
        <p className="text-sm">タスクがありません</p>
      </div>
    );
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={todos.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-3">
          {todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={onToggle}
              onDelete={onDelete}
              onUpdate={onUpdate}
              onAddSubtask={onAddSubtask}
              onToggleSubtask={onToggleSubtask}
              onDeleteSubtask={onDeleteSubtask}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
