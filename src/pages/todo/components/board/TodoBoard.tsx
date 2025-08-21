import React, { useState } from 'react';
import type { Task } from '../../../../types';
import { TaskStatus, TaskPriority } from '../../../../types';
import TodoCard from '../tasks/TodoCard';
import styles from './TodoBoard.module.scss';

interface TodoBoardProps {
  tasks: Task[];
  onAddTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
  onToggleStatus: (id: string) => void;
  onTaskClick?: (taskId: string) => void;
}

const TodoBoard: React.FC<TodoBoardProps> = ({
  tasks,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onToggleStatus,
  onTaskClick
}) => {
  const [isAddingTask, setIsAddingTask] = useState<string | null>(null);
  const [newTaskData, setNewTaskData] = useState({
    title: '',
    description: '',
    priority: TaskPriority.MEDIUM,
    dueDate: '',
    tags: [] as string[]
  });

  const columns = [
    {
      id: TaskStatus.PLANNING,
      title: 'Planning',
      icon: '📅',
      color: '#FF6B6B'
    },
    {
      id: TaskStatus.IN_PROGRESS,
      title: 'In Progress',
      icon: '⚡',
      color: '#4ECDC4'
    },
    {
      id: TaskStatus.REVIEW,
      title: 'Review',
      icon: '👀',
      color: '#FFA726'
    },
    {
      id: TaskStatus.TESTING,
      title: 'Testing',
      icon: '🧪',
      color: '#AB47BC'
    },
    {
      id: TaskStatus.COMPLETED,
      title: 'Completed',
      icon: '✅',
      color: '#45B7D1'
    }
  ];

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter(task => task.status === status);
  };

  const handleAddTask = (status: TaskStatus) => {
    if (newTaskData.title.trim()) {
      onAddTask({
        boardId: 'board1',
        columnId: 'col1',
        title: newTaskData.title,
        description: newTaskData.description,
        status: status,
        priority: newTaskData.priority,
        assigneeId: undefined,
        reporterId: 'user1',
        dueDate: newTaskData.dueDate ? new Date(newTaskData.dueDate) : undefined,
        startDate: undefined,
        estimatedHours: undefined,
        actualHours: 0,
        tags: newTaskData.tags,
        attachments: [],
        subtasks: [],
        comments: [],
        activity: [],
        watchers: ['user1'],
        isArchived: false
      });
      setNewTaskData({
        title: '',
        description: '',
        priority: TaskPriority.MEDIUM,
        dueDate: '',
        tags: []
      });
      setIsAddingTask(null);
    }
  };

  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    onUpdateTask(taskId, { status: newStatus });
  };

  return (
    <div className={styles.board}>
      {columns.map((column) => (
        <div key={column.id} className={styles.column}>
          <div className={styles.columnHeader} style={{ borderTop: `4px solid ${column.color}` }}>
            <div className={styles.columnTitle}>
              <span className={styles.columnIcon}>{column.icon}</span>
              <h3>{column.title}</h3>
            </div>
            <span className={styles.taskCount}>{getTasksByStatus(column.id).length}</span>
          </div>

          <div className={styles.columnContent}>
            {getTasksByStatus(column.id).map((task) => (
              <TodoCard
                key={task.id}
                task={task}
                onUpdate={onUpdateTask}
                onDelete={onDeleteTask}
                onToggleStatus={onToggleStatus}
                onStatusChange={handleStatusChange}
                onTaskClick={onTaskClick}
              />
            ))}

            {/* Add Task Button */}
            {isAddingTask === column.id ? (
              <div className={styles.addTaskForm}>
                <input
                  type="text"
                  placeholder="Task title..."
                  value={newTaskData.title}
                  onChange={(e) => setNewTaskData({ ...newTaskData, title: e.target.value })}
                  className={styles.taskTitleInput}
                />
                <textarea
                  placeholder="Description..."
                  value={newTaskData.description}
                  onChange={(e) => setNewTaskData({ ...newTaskData, description: e.target.value })}
                  className={styles.taskDescriptionInput}
                  rows={2}
                />
                <div className={styles.taskFormActions}>
                  <button
                    onClick={() => handleAddTask(column.id)}
                    className={styles.addTaskBtn}
                  >
                    Add Task
                  </button>
                  <button
                    onClick={() => setIsAddingTask(null)}
                    className={styles.cancelBtn}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                className={styles.addTaskButton}
                onClick={() => setIsAddingTask(column.id)}
              >
                + Add task
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TodoBoard;
