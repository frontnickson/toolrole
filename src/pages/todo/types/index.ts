export enum TodoStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed'
}

export interface TodoItem {
  id: number;
  title: string;
  description: string;
  status: TodoStatus;
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  dueDate?: Date;
  completedAt?: Date;
  tags: string[];
}

export interface TodoFormData {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  tags: string[];
}
