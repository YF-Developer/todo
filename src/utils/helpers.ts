export function formatDate(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' });
}

export function isOverdue(dueDate?: string): boolean {
  if (!dueDate) return false;
  return new Date(dueDate) < new Date(new Date().toDateString());
}

export function isDueSoon(dueDate?: string): boolean {
  if (!dueDate) return false;
  const due = new Date(dueDate);
  const now = new Date();
  const diff = due.getTime() - now.getTime();
  return diff >= 0 && diff <= 2 * 24 * 60 * 60 * 1000;
}
