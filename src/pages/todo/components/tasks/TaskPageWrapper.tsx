import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../../store';
import { useTranslation } from '../../../../utils/translations';
import TaskPage from './TaskPage';
import { useTaskContext } from '../../context/TaskContext';

const TaskPageWrapper: React.FC = () => {
  const { tasks, onUpdateTask, onDeleteTask } = useTaskContext();
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state: RootState) => state.user);
  
  // Переводы
  const { t } = useTranslation(currentUser?.language || 'ru');

  useEffect(() => {
    // Если нет задач, перенаправляем на главную страницу
    if (!tasks || tasks.length === 0) {
      navigate('/todo');
      return;
    }

    // Если нет ID задачи, перенаправляем на главную страницу
    if (!taskId) {
      navigate('/todo');
      return;
    }

    // Проверяем, существует ли задача
    const taskExists = tasks.some(task => task.id === taskId);
    if (!taskExists) {
      navigate('/todo');
      return;
    }
  }, [tasks, taskId, navigate]);

  // Если нет задач или ID задачи, показываем загрузку
  if (!tasks || tasks.length === 0 || !taskId) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>{t('tasks.loading')}</h2>
      </div>
    );
  }

  // Проверяем, существует ли задача
  const taskExists = tasks.some(task => task.id === taskId);
  if (!taskExists) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>{t('tasks.task_not_found')}</h2>
      </div>
    );
  }

  return (
    <TaskPage
      tasks={tasks}
      onUpdateTask={onUpdateTask}
      onDeleteTask={onDeleteTask}
    />
  );
};

export default TaskPageWrapper;
