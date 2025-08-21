import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { TaskProvider } from '../../context/TaskContext';
import Todo from '../../Todo';
import { TaskPageWrapper } from '../tasks';
import type { TodoItem } from '../../types/index';

const TodoLayout: React.FC = () => {
    // Состояние для задач
  const [tasks, setTasks] = useState<Task[]>([]);

  // Функция обновления задачи
  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === id ? { ...task, ...updates, updatedAt: new Date() } : task
      )
    );
  };

  // Функция удаления задачи
  const deleteTask = (id: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
  };

  return (
    <TaskProvider
      tasks={tasks}
      onUpdateTask={updateTask}
      onDeleteTask={deleteTask}
    >
      <Routes>
        <Route path="/" element={<Todo tasks={tasks} setTasks={setTasks} />} />
        <Route path="/task/:taskId" element={<TaskPageWrapper />} />
      </Routes>
    </TaskProvider>
  );
};

export default TodoLayout;
