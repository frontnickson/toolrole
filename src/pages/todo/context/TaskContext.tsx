import React, { createContext, useContext, ReactNode } from 'react';
import type { Task } from '../../../types';

interface TaskContextType {
  tasks: Task[];
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

interface TaskProviderProps {
  children: ReactNode;
  tasks: Task[];
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
}

export const TaskProvider: React.FC<TaskProviderProps> = ({
  children,
  tasks,
  onUpdateTask,
  onDeleteTask
}) => {
  return (
    <TaskContext.Provider value={{ tasks, onUpdateTask, onDeleteTask }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};
