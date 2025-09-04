import React, { useState } from 'react';
import styles from './NewBoardModal.module.scss';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../../store';
import { useBoards } from '../../../../hooks/useBoards';

interface NewBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateBoard?: (boardId: string) => void;
}

const NewBoardModal: React.FC<NewBoardModalProps> = ({ isOpen, onClose, onCreateBoard }) => {
  
  // const dispatch = useDispatch();
  const { currentUser } = useSelector((state: RootState) => state.user);
  const { createBoard } = useBoards();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    template: 'blank',
    color: '#3B82F6',
    icon: '📋'
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const colorOptions = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
    '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1'
  ];

  const iconOptions = ['📋', '📊', '🔄', '🎯', '🧪', '✅', '🐛', '📈', '🚀', '💡'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Валидация
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Название доски обязательно';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Описание доски обязательно';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Создаем данные для новой доски
    const boardData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      icon: formData.icon,
      color: formData.color,
      ownerId: currentUser?.id?.toString() || '1',
      members: [], // Пустой массив участников
      settings: {
        allowMemberInvites: true,
        allowPublicView: false,
        allowComments: true,
        allowAttachments: true,
        allowTaskCreation: true,
        allowTaskEditing: true,
        defaultColumnTemplate: ['planning', 'in_progress', 'review', 'completed'],
        allowColumnCustomization: true,
        maxColumns: 10,
        allowSubtaskCreation: true,
        allowTaskAssignment: true,
        allowDueDateSetting: true,
        allowPrioritySetting: true,
        allowTagging: true,
        autoArchiveCompleted: false,
        archiveAfterDays: 30,
        autoAssignTasks: false,
        autoNotifyAssignees: true,
        emailNotifications: true,
        pushNotifications: true,
        desktopNotifications: true,
        showTaskDetails: 'all' as const,
        showMemberActivity: true,
        showTaskHistory: true
      },
      statistics: {
        totalTasks: 0,
        completedTasks: 0,
        inProgressTasks: 0,
        overdueTasks: 0,
        totalMembers: 1,
        activeMembers: 1,
        lastActivity: Date.now(),
        completionRate: 0,
        averageTaskDuration: 0,
        totalComments: 0,
        totalAttachments: 0
      },
      isArchived: false,
      isPublic: false,
      isTemplate: false,
      isFavorite: false,
      // Создаем 4 стандартные колонки по умолчанию
      columns: [
        {
          id: `col_${Date.now()}_planning`,
          boardId: '', // Будет установлен на бэкенде
          title: 'Начало работы',
          description: 'Задачи, которые нужно начать выполнять',
          icon: '📋',
          color: '#3b82f6',
          order: 0,
          isLocked: false,
          isCollapsed: false,
          isStandard: true,
          tasks: [],
          settings: {
            allowTaskCreation: true,
            allowTaskEditing: true,
            allowTaskMoving: true,
            allowTaskDeletion: true,
            allowSubtaskCreation: true,
            allowCommentCreation: true,
            allowAttachmentUpload: true,
            autoSortTasks: false,
            sortBy: 'order' as const,
            sortDirection: 'asc' as const
          },
          statistics: {
            totalTasks: 0,
            completedTasks: 0,
            inProgressTasks: 0,
            overdueTasks: 0,
            averageTaskDuration: 0,
            totalComments: 0,
            totalAttachments: 0,
            lastTaskUpdate: Date.now()
          },
          createdAt: Date.now(),
          updatedAt: Date.now()
        },
        {
          id: `col_${Date.now()}_progress`,
          boardId: '', // Будет установлен на бэкенде
          title: 'В работе',
          description: 'Задачи, которые выполняются в данный момент',
          icon: '⚡',
          color: '#f59e0b',
          order: 1,
          isLocked: false,
          isCollapsed: false,
          isStandard: true,
          tasks: [],
          settings: {
            allowTaskCreation: true,
            allowTaskEditing: true,
            allowTaskMoving: true,
            allowTaskDeletion: true,
            allowSubtaskCreation: true,
            allowCommentCreation: true,
            allowAttachmentUpload: true,
            autoSortTasks: false,
            sortBy: 'order' as const,
            sortDirection: 'asc' as const
          },
          statistics: {
            totalTasks: 0,
            completedTasks: 0,
            inProgressTasks: 0,
            overdueTasks: 0,
            averageTaskDuration: 0,
            totalComments: 0,
            totalAttachments: 0,
            lastTaskUpdate: Date.now()
          },
          createdAt: Date.now(),
          updatedAt: Date.now()
        },
        {
          id: `col_${Date.now()}_review`,
          boardId: '', // Будет установлен на бэкенде
          title: 'Проверка',
          description: 'Задачи, готовые к проверке и тестированию',
          icon: '👀',
          color: '#8b5cf6',
          order: 2,
          isLocked: false,
          isCollapsed: false,
          isStandard: true,
          tasks: [],
          settings: {
            allowTaskCreation: true,
            allowTaskEditing: true,
            allowTaskMoving: true,
            allowTaskDeletion: true,
            allowSubtaskCreation: true,
            allowCommentCreation: true,
            allowAttachmentUpload: true,
            autoSortTasks: false,
            sortBy: 'order' as const,
            sortDirection: 'asc' as const
          },
          statistics: {
            totalTasks: 0,
            completedTasks: 0,
            inProgressTasks: 0,
            overdueTasks: 0,
            averageTaskDuration: 0,
            totalComments: 0,
            totalAttachments: 0,
            lastTaskUpdate: Date.now()
          },
          createdAt: Date.now(),
          updatedAt: Date.now()
        },
        {
          id: `col_${Date.now()}_completed`,
          boardId: '', // Будет установлен на бэкенде
          title: 'Завершение',
          description: 'Завершенные задачи',
          icon: '✅',
          color: '#10b981',
          order: 3,
          isLocked: false,
          isCollapsed: false,
          isStandard: true,
          tasks: [],
          settings: {
            allowTaskCreation: true,
            allowTaskEditing: true,
            allowTaskMoving: true,
            allowTaskDeletion: true,
            allowSubtaskCreation: true,
            allowCommentCreation: true,
            allowAttachmentUpload: true,
            autoSortTasks: false,
            sortBy: 'order' as const,
            sortDirection: 'asc' as const
          },
          statistics: {
            totalTasks: 0,
            completedTasks: 0,
            inProgressTasks: 0,
            overdueTasks: 0,
            averageTaskDuration: 0,
            totalComments: 0,
            totalAttachments: 0,
            lastTaskUpdate: Date.now()
          },
          createdAt: Date.now(),
          updatedAt: Date.now()
        },
        {
          id: `col_${Date.now()}_overdue`,
          boardId: '', // Будет установлен на бэкенде
          title: 'Просрочено',
          description: 'Просроченные задачи',
          icon: '⚠️',
          color: '#DC2626',
          order: 4,
          isLocked: false,
          isCollapsed: false,
          isStandard: true,
          tasks: [],
          settings: {
            allowTaskCreation: false, // Нельзя создавать новые задачи в колонке просроченных
            allowTaskEditing: true,
            allowTaskMoving: true,
            allowTaskDeletion: true,
            allowSubtaskCreation: false,
            allowCommentCreation: true,
            allowAttachmentUpload: true,
            autoSortTasks: false,
            sortBy: 'dueDate' as const,
            sortDirection: 'asc' as const
          },
          statistics: {
            totalTasks: 0,
            completedTasks: 0,
            inProgressTasks: 0,
            overdueTasks: 0,
            averageTaskDuration: 0,
            totalComments: 0,
            totalAttachments: 0,
            lastTaskUpdate: Date.now()
          },
          createdAt: Date.now(),
          updatedAt: Date.now()
        }
      ]
    };

    try {
      console.log('📋 NewBoardModal: Отправляем данные доски:', boardData);
      
      // Создаем доску через API
      const result = await createBoard(boardData);
      
      console.log('📋 NewBoardModal: Результат создания доски:', result);
      
      if (result.success && result.board) {
        console.log('📋 NewBoardModal: Доска успешно создана:', result.board.title);
        
        // Вызываем callback для уведомления родительского компонента
        if (onCreateBoard) {
          onCreateBoard(result.board.id);
        }
        
        // Закрываем модальное окно
        onClose();
        
        // Сбрасываем форму
        setFormData({
          title: '',
          description: '',
          template: 'blank',
          color: '#3B82F6',
          icon: '📋'
        });
        setErrors({});
      } else {
        console.error('📋 NewBoardModal: Ошибка создания доски:', result.error);
        // Показываем ошибку
        setErrors({ general: result.error || 'Ошибка создания доски' });
      }
    } catch (error) {
      console.error('📋 NewBoardModal: Исключение при создании доски:', error);
      setErrors({ general: 'Произошла ошибка при создании доски' });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Очищаем ошибку для этого поля
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleColorSelect = (color: string) => {
    setFormData(prev => ({ ...prev, color }));
  };

  const handleIconSelect = (icon: string) => {
    setFormData(prev => ({ ...prev, icon }));
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>Создать новую доску</h2>
          <button onClick={onClose} className={styles.closeBtn}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="title" className={styles.label}>
              Название доски *
            </label>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className={`${styles.input} ${errors.title ? styles.error : ''}`}
              placeholder="Введите название доски"
            />
            {errors.title && <span className={styles.errorText}>{errors.title}</span>}
            {formData.title && (
              <div className={styles.preview}>
                <strong>Предварительный просмотр:</strong> {formData.title}
              </div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description" className={styles.label}>
              Описание доски *
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className={`${styles.textarea} ${errors.description ? styles.error : ''}`}
              placeholder="Введите описание доски"
              rows={3}
            />
            {errors.description && <span className={styles.errorText}>{errors.description}</span>}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Цвет доски</label>
            <div className={styles.colorGrid}>
              {colorOptions.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`${styles.colorOption} ${formData.color === color ? styles.selected : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => handleColorSelect(color)}
                  title={color}
                />
              ))}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Иконка доски</label>
            <div className={styles.iconGrid}>
              {iconOptions.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  className={`${styles.iconOption} ${formData.icon === icon ? styles.selected : ''}`}
                  onClick={() => handleIconSelect(icon)}
                  title={icon}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {errors.general && (
            <div className={styles.errorMessage}>
              {errors.general}
            </div>
          )}

          <div className={styles.formActions}>
            <button type="button" onClick={onClose} className={styles.cancelBtn}>
              Отмена
            </button>
            <button type="submit" className={styles.createBtn}>
              Создать доску
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewBoardModal;