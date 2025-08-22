import React, { useState } from 'react';
import styles from './NewBoardModal.module.scss';
import { addBoard } from '../../../../store/slices/boardSlice';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../../../store';

interface NewBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateBoard?: (boardId: string) => void;
}

const NewBoardModal: React.FC<NewBoardModalProps> = ({ isOpen, onClose, onCreateBoard }) => {
  
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: RootState) => state.user);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    template: 'blank',
    color: '#3B82F6',
    icon: '📋'
  });

  const board = {
    id: '',
    title: '',
    description: '',
    icon: '',
    color: '',
    ownerId: '',
    teamId: '',
    members: [],
    columns: [],
    settings: {
      allowMemberInvites: true,
      allowPublicView: false,
      allowComments: true,
      allowAttachments: true,
      allowTaskCreation: true,
      allowTaskEditing: true,
      defaultColumnTemplate: ['planning', 'in_progress', 'review', 'testing', 'completed'],
      allowColumnCustomization: true,
      maxColumns: 10,
      allowSubtaskCreation: true,
      allowTaskAssignment: true,
      allowDueDateSetting: true,
      allowPrioritySetting: true,
      allowTagging: true,
      autoArchiveCompleted: true,
      archiveAfterDays: 30,
      autoAssignTasks: false,
      autoNotifyAssignees: true,
      emailNotifications: true,
      pushNotifications: true,
      desktopNotifications: true,
      showTaskDetails: 'members' as const,
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
      lastActivity: new Date().getTime(),
      completionRate: 0,
      averageTaskDuration: 0,
      totalComments: 0,
      totalAttachments: 0
    },
    createdAt: new Date().getTime(),
    updatedAt: new Date().getTime(),
    isArchived: false,
    isPublic: false,
    isTemplate: false,
    templateId: '',
    isFavorite: false
  }

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Шаблоны досок по умолчанию
  const defaultTemplates = [
    {
      id: 'blank',
      name: 'Пустая доска',
      description: 'Начните с чистого листа',
      icon: '📋',
      color: '#3B82F6',
      category: 'custom'
    },
    {
      id: 'kanban',
      name: 'Kanban',
      description: 'Классическая система управления задачами',
      icon: '📊',
      color: '#8B5CF6',
      category: 'software_development'
    },
    {
      id: 'scrum',
      name: 'Scrum',
      description: 'Для agile разработки со спринтами',
      icon: '🔄',
      color: '#F59E0B',
      category: 'software_development'
    }
  ];

  const colorOptions = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
    '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1'
  ];

  const iconOptions = ['📋', '📊', '🔄', '🎯', '🧪', '✅', '🐛', '📈', '🚀', '💡'];

  const handleSubmit = (e: React.FormEvent) => {
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

    // Создаем новую доску, используя данные из formData и остальные параметры из board
    const newBoard = {
      ...board,
      id: `board_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: formData.title.trim(),
      description: formData.description.trim(),
      icon: formData.icon,
      color: formData.color,
      ownerId: currentUser?.id?.toString() || '',
      // Создаем 4 стандартные колонки по умолчанию, которые защищены от изменений
      columns: [
        {
          id: `col_${Date.now()}_planning`,
          boardId: `board_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          title: 'Начало работы',
          description: 'Задачи, которые нужно начать выполнять',
          icon: '📋',
          color: '#3b82f6',
          order: 0,
          isLocked: false,
          isCollapsed: false,
          isStandard: true,
          taskLimit: undefined,
          wipLimit: undefined,
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
          boardId: `board_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          title: 'В работе',
          description: 'Задачи, которые выполняются в данный момент',
          icon: '⚡',
          color: '#f59e0b',
          order: 1,
          isLocked: false,
          isCollapsed: false,
          isStandard: true,
          taskLimit: undefined,
          wipLimit: undefined,
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
          boardId: `board_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          title: 'Проверка',
          description: 'Задачи, готовые к проверке и тестированию',
          icon: '👀',
          color: '#8b5cf6',
          order: 2,
          isLocked: false,
          isCollapsed: false,
          isStandard: true,
          taskLimit: undefined,
          wipLimit: undefined,
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
          boardId: `board_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          title: 'Завершение',
          description: 'Завершенные задачи',
          icon: '✅',
          color: '#10b981',
          order: 3,
          isLocked: false,
          isCollapsed: false,
          isStandard: true,
          taskLimit: undefined,
          wipLimit: undefined,
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
        }
      ],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    console.log('Создаем новую доску:', newBoard);
    console.log('Текущий пользователь:', currentUser);
    console.log('OwnerId доски:', newBoard.ownerId);
    
    // Отправляем доску в Redux store
    dispatch(addBoard(newBoard));
    
    // Вызываем callback для уведомления родительского компонента
    if (onCreateBoard) {
      onCreateBoard(newBoard.id);
    }
    
    // Закрываем модальное окно
    onClose();
    
    // Очищаем форму
    setFormData({
      title: '',
      description: '',
      template: 'blank',
      color: '#3B82F6',
      icon: '📋'
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleTemplateSelect = (templateId: string) => {
    const template = defaultTemplates.find(t => t.id === templateId);
    if (template) {
      setFormData(prev => ({
        ...prev,
        template: templateId,
        color: template.color,
        icon: template.icon || '📋'
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
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
              Описание *
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className={`${styles.textarea} ${errors.description ? styles.error : ''}`}
              placeholder="Опишите назначение доски"
              rows={3}
            />
            {errors.description && <span className={styles.errorText}>{errors.description}</span>}
            {formData.description && (
              <div className={styles.preview}>
                <strong>Предварительный просмотр:</strong> {formData.description}
              </div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Иконка доски</label>
            <div className={styles.iconGrid}>
              {iconOptions.map(icon => (
                <button
                  key={icon}
                  type="button"
                  className={`${styles.iconOption} ${
                    formData.icon === icon ? styles.selected : ''
                  }`}
                  onClick={() => handleInputChange('icon', icon)}
                  title={icon}
                >
                  {icon}
                </button>
              ))}
            </div>
            <div className={styles.selectedPreview}>
              <strong>Выбрано:</strong> {formData.icon}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Шаблон доски</label>
            <div className={styles.templateGrid}>
              {defaultTemplates.map(template => (
                <div
                  key={template.id}
                  className={`${styles.templateOption} ${
                    formData.template === template.id ? styles.selected : ''
                  }`}
                  onClick={() => handleTemplateSelect(template.id)}
                >
                  <div className={styles.templateIcon}>
                    {template.icon}
                  </div>
                  <div className={styles.templateInfo}>
                    <h4>{template.name}</h4>
                    <p>{template.description}</p>
                    {template.category && (
                      <span className={styles.templateCategory}>
                        {template.category.replace('_', ' ')}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className={styles.selectedPreview}>
              <strong>Выбран шаблон:</strong> {defaultTemplates.find(t => t.id === formData.template)?.name}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Цвет доски</label>
            <div className={styles.colorGrid}>
              {colorOptions.map(color => (
                <button
                  key={color}
                  type="button"
                  className={`${styles.colorOption} ${
                    formData.color === color ? styles.selected : ''
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => handleInputChange('color', color)}
                  title={color}
                />
              ))}
            </div>
            <div className={styles.selectedPreview}>
              <strong>Выбран цвет:</strong> 
              <span 
                style={{ 
                  backgroundColor: formData.color, 
                  width: '20px', 
                  height: '20px', 
                  display: 'inline-block', 
                  marginLeft: '8px',
                  borderRadius: '4px'
                }}
              />
              {formData.color}
            </div>
          </div>

          {/* Итоговый предварительный просмотр */}
          {(formData.title || formData.description) && (
            <div className={styles.finalPreview}>
              <h4>Итоговый вид доски:</h4>
              <div className={styles.boardPreview}>
                <div 
                  className={styles.boardHeader}
                  style={{ backgroundColor: formData.color }}
                >
                  <span className={styles.boardIcon}>{formData.icon}</span>
                  <div className={styles.boardInfo}>
                    <h3>{formData.title || 'Название доски'}</h3>
                    <p>{formData.description || 'Описание доски'}</p>
                  </div>
                </div>
                <div className={styles.boardTemplate}>
                  <strong>Шаблон:</strong> {defaultTemplates.find(t => t.id === formData.template)?.name}
                </div>
              </div>
            </div>
          )}

          <div className={styles.formActions}>
            <button type="button" onClick={onClose} className={styles.cancelBtn}>
              Отмена
            </button>
            <button 
              type="submit" 
              className={styles.createBtn}
            >
              Создать доску
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewBoardModal;

