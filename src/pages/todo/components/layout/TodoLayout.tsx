import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Todo from '../../Todo';
import TaskPage from '../tasks/TaskPage';

const TodoLayout: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Todo />} />
      <Route path="/task/:taskId" element={<TaskPage />} />
    </Routes>
  );
};

export default TodoLayout;
