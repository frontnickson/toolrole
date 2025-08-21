import React, { useState } from 'react';
import type { Task } from '../../../../types';
import { TaskStatus, TaskPriority } from '../../../../types';  
import styles from './TodoCalendar.module.scss';

interface TodoCalendarProps {
  tasks: Task[];
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
  onToggleStatus: (id: string) => void;
  onTaskClick?: (taskId: string) => void;
}

const TodoCalendar: React.FC<TodoCalendarProps> = ({
  tasks,
  onUpdateTask,
  onDeleteTask,
  onToggleStatus,
  onTaskClick
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');

  // Получаем текущий месяц
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  // Получаем первый день месяца
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  
  // Получаем день недели первого дня (0 = воскресенье)
  const firstDayWeekday = firstDayOfMonth.getDay();
  
  // Создаем массив дней для отображения
  const getDaysInMonth = () => {
    const days = [];
    
    // Добавляем дни предыдущего месяца
    for (let i = firstDayWeekday - 1; i >= 0; i--) {
      const date = new Date(currentYear, currentMonth, -i);
      days.push({ date, isCurrentMonth: false });
    }
    
    // Добавляем дни текущего месяца
    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
      const date = new Date(currentYear, currentMonth, i);
      days.push({ date, isCurrentMonth: true });
    }
    
    // Добавляем дни следующего месяца для заполнения сетки
    const remainingDays = 42 - days.length; // 6 недель * 7 дней
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(currentYear, currentMonth + 1, i);
      days.push({ date, isCurrentMonth: false });
    }
    
    return days;
  };

  // Получаем неделю для текущей даты
  const getWeekDays = () => {
    const weekStart = new Date(currentDate);
    const dayOfWeek = currentDate.getDay();
    weekStart.setDate(currentDate.getDate() - dayOfWeek);
    
    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + i);
      weekDays.push({ date, isCurrentWeek: true });
    }
    return weekDays;
  };

  // Получаем задачи для конкретной даты
  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      return taskDate.toDateString() === date.toDateString();
    });
  };

  // Навигация по месяцам/неделям/дням
  const goToPrevious = () => {
    const newDate = new Date(currentDate);
    switch (viewMode) {
      case 'month':
        newDate.setMonth(currentDate.getMonth() - 1);
        break;
      case 'week':
        newDate.setDate(currentDate.getDate() - 7);
        break;
      case 'day':
        newDate.setDate(currentDate.getDate() - 1);
        break;
    }
    setCurrentDate(newDate);
  };

  const goToNext = () => {
    const newDate = new Date(currentDate);
    switch (viewMode) {
      case 'month':
        newDate.setMonth(currentDate.getMonth() + 1);
        break;
      case 'week':
        newDate.setDate(currentDate.getDate() + 7);
        break;
      case 'day':
        newDate.setDate(currentDate.getDate() + 1);
        break;
    }
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Получаем название месяца
  const getMonthName = (month: number) => {
    const months = [
      'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
      'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
    ];
    return months[month];
  };

  // Получаем название дня недели
  const getWeekdayName = (weekday: number) => {
    const weekdays = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
    return weekdays[weekday];
  };

  // Получаем цвет для статуса задачи
  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.TODO:
        return styles.todoStatus;
      case TaskStatus.IN_PROGRESS:
        return styles.inProgressStatus;
      case TaskStatus.REVIEW:
        return styles.reviewStatus;
      case TaskStatus.TESTING:
        return styles.testingStatus;
      case TaskStatus.COMPLETED:
        return styles.completedStatus;
      case TaskStatus.CANCELLED:
        return styles.cancelledStatus;
      default:
        return '';
    }
  };

  // Получаем цвет для приоритета
  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case TaskPriority.URGENT:
        return styles.urgentPriority;
      case TaskPriority.HIGH:
        return styles.highPriority;
      case TaskPriority.MEDIUM:
        return styles.mediumPriority;
      case TaskPriority.LOW:
        return styles.lowPriority;
      default:
        return '';
    }
  };

  // Рендерим месячный вид
  const renderMonthView = () => {
    const days = getDaysInMonth();
    const today = new Date();

    return (
      <div className={styles.calendarGrid}>
        <div className={styles.weekdayHeaders}>
          {[0, 1, 2, 3, 4, 5, 6].map(weekday => (
            <div key={weekday} className={styles.weekdayHeader}>
              {getWeekdayName(weekday)}
            </div>
          ))}
        </div>

        <div className={styles.daysGrid}>
          {days.map((day, index) => {
            const isToday = day.date.toDateString() === today.toDateString();
            const dayTasks = getTasksForDate(day.date);
            
            return (
              <div
                key={index}
                className={`${styles.dayCell} ${
                  !day.isCurrentMonth ? styles.otherMonth : ''
                } ${isToday ? styles.today : ''}`}
              >
                <div className={styles.dayHeader}>
                  <span className={styles.dayNumber}>{day.date.getDate()}</span>
                  {dayTasks.length > 0 && (
                    <span className={styles.taskCount}>{dayTasks.length}</span>
                  )}
                </div>
                
                <div className={styles.dayTasks}>
                  {dayTasks.slice(0, 3).map(task => (
                    <div
                      key={task.id}
                      className={`${styles.calendarTask} ${getStatusColor(task.status)}`}
                      title={`${task.title} - ${task.description || 'Без описания'}`}
                      onClick={() => onTaskClick?.(task.id)}
                      style={{ cursor: onTaskClick ? 'pointer' : 'default' }}
                    >
                      <div className={styles.taskHeader}>
                        <span className={styles.taskTitle}>{task.title}</span>
                        <span className={`${styles.taskPriority} ${getPriorityColor(task.priority)}`}>
                          {task.priority === TaskPriority.URGENT ? '🔥' : 
                           task.priority === TaskPriority.HIGH ? '🔴' : 
                           task.priority === TaskPriority.MEDIUM ? '🟡' : '🟢'}
                        </span>
                      </div>
                      {task.description && (
                        <div className={styles.taskDescription}>{task.description}</div>
                      )}
                    </div>
                  ))}
                  
                  {dayTasks.length > 3 && (
                    <div className={styles.moreTasks}>
                      +{dayTasks.length - 3} еще
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Рендерим недельный вид
  const renderWeekView = () => {
    const weekDays = getWeekDays();
    const today = new Date();

    return (
      <div className={styles.calendarGrid}>
        <div className={styles.weekdayHeaders}>
          {weekDays.map((day, index) => (
            <div key={index} className={styles.weekdayHeader}>
              <div className={styles.weekdayName}>{getWeekdayName(day.date.getDay())}</div>
              <div className={styles.weekdayDate}>{day.date.getDate()}</div>
            </div>
          ))}
        </div>

        <div className={styles.weekGrid}>
          {weekDays.map((day, index) => {
            const isToday = day.date.toDateString() === today.toDateString();
            const dayTasks = getTasksForDate(day.date);
            
            return (
              <div
                key={index}
                className={`${styles.weekDayCell} ${isToday ? styles.today : ''}`}
              >
                <div className={styles.dayHeader}>
                  <span className={styles.dayNumber}>{day.date.getDate()}</span>
                  {dayTasks.length > 0 && (
                    <span className={styles.taskCount}>{dayTasks.length}</span>
                  )}
                </div>
                
                <div className={styles.dayTasks}>
                  {dayTasks.map(task => (
                    <div
                      key={task.id}
                      className={`${styles.calendarTask} ${getStatusColor(task.status)}`}
                      title={`${task.title} - ${task.description || 'Без описания'}`}
                      onClick={() => onTaskClick?.(task.id)}
                      style={{ cursor: onTaskClick ? 'pointer' : 'default' }}
                    >
                      <div className={styles.taskHeader}>
                        <span className={styles.taskTitle}>{task.title}</span>
                        <span className={`${styles.taskPriority} ${getPriorityColor(task.priority)}`}>
                          {task.priority === TaskPriority.URGENT ? '🔥' : 
                           task.priority === TaskPriority.HIGH ? '🔴' : 
                           task.priority === TaskPriority.MEDIUM ? '🟡' : '🟢'}
                        </span>
                      </div>
                      {task.description && (
                        <div className={styles.taskDescription}>{task.description}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Рендерим дневной вид
  const renderDayView = () => {
    const today = new Date();
    const isToday = currentDate.toDateString() === today.toDateString();
    const dayTasks = getTasksForDate(currentDate);

    return (
      <div className={styles.dayView}>
        <div className={styles.dayViewHeader}>
          <div className={styles.dayViewDate}>
            <span className={styles.dayViewDay}>{currentDate.getDate()}</span>
            <span className={styles.dayViewMonth}>{getMonthName(currentDate.getMonth())}</span>
            <span className={styles.dayViewYear}>{currentDate.getFullYear()}</span>
          </div>
          <div className={styles.dayViewWeekday}>
            {getWeekdayName(currentDate.getDay())}
          </div>
        </div>

        <div className={styles.dayViewTasks}>
          {dayTasks.length === 0 ? (
            <div className={styles.emptyDay}>
              <span className={styles.emptyIcon}>📅</span>
              <h3>Нет задач на этот день</h3>
              <p>Отличный день для отдыха или планирования!</p>
            </div>
          ) : (
            dayTasks.map(task => (
              <div
                key={task.id}
                className={`${styles.dayViewTask} ${getStatusColor(task.status)}`}
                onClick={() => onTaskClick?.(task.id)}
                style={{ cursor: onTaskClick ? 'pointer' : 'default' }}
              >
                <div className={styles.taskHeader}>
                  <span className={styles.taskTitle}>{task.title}</span>
                  <span className={`${styles.taskPriority} ${getPriorityColor(task.priority)}`}>
                    {task.priority === TaskPriority.URGENT ? '🔥' : 
                     task.priority === TaskPriority.HIGH ? '🔴' : 
                     task.priority === TaskPriority.MEDIUM ? '🟡' : '🟢'}
                  </span>
                </div>
                {task.description && (
                  <div className={styles.taskDescription}>{task.description}</div>
                )}
                <div className={styles.taskMeta}>
                  <span className={styles.taskStatus}>{task.status}</span>
                  {task.assigneeId && (
                    <span className={styles.taskAssignee}>👤 {task.assigneeId}</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  // Получаем заголовок для текущего вида
  const getViewTitle = () => {
    switch (viewMode) {
      case 'month':
        return `${getMonthName(currentMonth)} ${currentYear}`;
      case 'week':
        const weekStart = new Date(currentDate);
        const dayOfWeek = currentDate.getDay();
        weekStart.setDate(currentDate.getDate() - dayOfWeek);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        return `${weekStart.getDate()} ${getMonthName(weekStart.getMonth())} - ${weekEnd.getDate()} ${getMonthName(weekEnd.getMonth())} ${currentYear}`;
      case 'day':
        return `${currentDate.getDate()} ${getMonthName(currentDate.getMonth())} ${currentYear}`;
      default:
        return '';
    }
  };

  return (
    <div className={styles.todoCalendar}>
      {/* Заголовок календаря */}
      <div className={styles.calendarHeader}>
        <div className={styles.headerLeft}>
          <h2>Календарь задач</h2>
          <div className={styles.viewModeToggle}>
            <button
              className={`${styles.viewBtn} ${viewMode === 'month' ? styles.active : ''}`}
              onClick={() => setViewMode('month')}
            >
              Месяц
            </button>
            <button
              className={`${styles.viewBtn} ${viewMode === 'week' ? styles.active : ''}`}
              onClick={() => setViewMode('week')}
            >
              Неделя
            </button>
            <button
              className={`${styles.viewBtn} ${viewMode === 'day' ? styles.active : ''}`}
              onClick={() => setViewMode('day')}
            >
              День
            </button>
          </div>
        </div>
        
        <div className={styles.headerRight}>
          <div className={styles.navigation}>
            <button onClick={goToPrevious} className={styles.navBtn}>
              ◀
            </button>
            <button onClick={goToToday} className={styles.todayBtn}>
              Сегодня
            </button>
            <button onClick={goToNext} className={styles.navBtn}>
              ▶
            </button>
          </div>
          <div className={styles.currentMonth}>
            {getViewTitle()}
          </div>
        </div>
      </div>

      {/* Контент календаря */}
      {viewMode === 'month' && renderMonthView()}
      {viewMode === 'week' && renderWeekView()}
      {viewMode === 'day' && renderDayView()}

      {/* Легенда */}
      <div className={styles.calendarLegend}>
        <div className={styles.legendItem}>
          <span className={`${styles.legendColor} ${styles.todoStatus}`}></span>
          <span>К выполнению</span>
        </div>
        <div className={styles.legendItem}>
          <span className={`${styles.legendColor} ${styles.inProgressStatus}`}></span>
          <span>В работе</span>
        </div>
        <div className={styles.legendItem}>
          <span className={`${styles.legendColor} ${styles.reviewStatus}`}></span>
          <span>На проверке</span>
        </div>
        <div className={styles.legendItem}>
          <span className={`${styles.legendColor} ${styles.testingStatus}`}></span>
          <span>Тестирование</span>
        </div>
        <div className={styles.legendItem}>
          <span className={`${styles.legendColor} ${styles.completedStatus}`}></span>
          <span>Завершено</span>
        </div>
      </div>
    </div>
  );
};

export default TodoCalendar;
