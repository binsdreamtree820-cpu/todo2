export type ImportanceScore = 1 | 2 | 3 | 4 | 5;

export type UrgencyLevel = 'critical' | 'warning' | 'normal';

export type NavTab = 'today' | 'all' | 'completed';

export type UrgencyFilter = 'all' | 'critical' | 'warning' | 'normal';

export type DurationTieBreaker = 'shortest' | 'longest';

export interface TaskItem {
  id: string;
  title: string;
  importance: ImportanceScore;
  dueDate: string; // YYYY-MM-DD (local date)
  estimatedMinutes: number;
  progress: number; // 0 to 100
  completed: boolean;
  createdAt: string;
  completedAt?: string;
}

export interface TaskFormValues {
  title: string;
  importance: ImportanceScore;
  dueDate: string;
  estimatedMinutes: number;
  progress: number;
}
