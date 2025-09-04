import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Todo from '../../Todo';

const TodoLayout: React.FC = () => {
  return (
    <Routes>
      {/* Основные маршруты */}
      <Route path="/" element={<Todo />} />
      
      {/* Режимы просмотра */}
      <Route path="/list" element={<Todo />} />
      <Route path="/board" element={<Todo />} />
      <Route path="/calendar" element={<Todo />} />
      
      {/* Режимы с досками */}
      <Route path="/list/:boardId" element={<Todo />} />
      <Route path="/board/:boardId" element={<Todo />} />
      <Route path="/calendar/:boardId" element={<Todo />} />
      
      {/* Режимы с задачами */}
      <Route path="/list/:boardId/task/:taskId" element={<Todo />} />
      <Route path="/board/:boardId/task/:taskId" element={<Todo />} />
      <Route path="/calendar/:boardId/task/:taskId" element={<Todo />} />
      
      {/* Разделы */}
      <Route path="/inbox" element={<Todo />} />
      <Route path="/today" element={<Todo />} />
      <Route path="/home" element={<Todo />} />
      
      {/* Разделы с задачами */}
      <Route path="/inbox/task/:taskId" element={<Todo />} />
      <Route path="/today/task/:taskId" element={<Todo />} />
      <Route path="/home/task/:taskId" element={<Todo />} />
      
      {/* Обратная совместимость */}
      <Route path="/task/:taskId" element={<Todo />} />
    </Routes>
  );
};

export default TodoLayout;
