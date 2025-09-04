import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import type { Task } from '../../../../types';
import { TaskStatus, TaskPriority } from '../../../../types';
import type { RootState } from '../../../../store';
import { useTranslation } from '../../../../utils/translations';
import styles from './TodoCalendar.module.scss';

interface TodoCalendarProps {
  tasks: Task[];
  onTaskClick?: (taskId: string) => void;
  showAllTasks?: boolean; // Новый пропс для показа всех задач
}

const TodoCalendar: React.FC<TodoCalendarProps> = ({ tasks, onTaskClick, showAllTasks = false }) => {

  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const { currentUser } = useSelector((state: RootState) => state.user);
  
  // Переводы
  const { t } = useTranslation(currentUser?.language || 'ru');

  // Автоматически переходим на сегодняшний день при инициализации
  React.useEffect(() => {
    if (showAllTasks) {
      setCurrentDate(new Date());
      setViewMode('day'); // Показываем дневной вид для Today
    }
  }, [showAllTasks]);

  // Отладочная информация
  
  // Проверяем, что tasks является массивом
  if (!Array.isArray(tasks)) {
    return (
      <div className={styles.todoCalendar}>
        <div className={styles.calendarHeader}>
          <h2>{showAllTasks ? t('calendar.today_tasks') : t('calendar.title')}</h2>
          <div className={styles.taskCountInfo}>
            <span>Ошибка: неверный формат данных</span>
          </div>
        </div>
        <div className={styles.content}>
          <p>Получены некорректные данные о задачах.</p>
        </div>
      </div>
    );
  }
  
  // Фильтруем только валидные задачи
  const validTasks = tasks.filter(task => task && typeof task === 'object');
  
  // Если нет валидных задач, показываем сообщение
  if (validTasks.length === 0) {
    return (
      <div className={styles.todoCalendar}>
        <div className={styles.calendarHeader}>
          <h2>{showAllTasks ? t('calendar.today_tasks') : t('calendar.title')}</h2>
          <div className={styles.taskCountInfo}>
            <span>Нет задач для отображения</span>
          </div>
        </div>
        <div className={styles.content}>
          <p>Задачи не найдены или еще не загружены.</p>
        </div>
      </div>
    );
  }

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
    
    try {
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
    } catch (error) {
      console.error('Error in getDaysInMonth:', error);
      // Возвращаем пустой массив в случае ошибки
      return [];
    }
    
    return days;
  };

  // Получаем неделю для текущей даты
  const getWeekDays = () => {
    try {
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
    } catch (error) {
      console.error('Error in getWeekDays:', error);
      // Возвращаем пустой массив в случае ошибки
      return [];
    }
  };

  // Получаем задачи для конкретной даты
  const getTasksForDate = (date: Date) => {
    if (!Array.isArray(validTasks) || validTasks.length === 0) {
      return [];
    }
    
    return validTasks.filter(task => {
      // Проверяем наличие dueDate
      if (!task || !task.dueDate) return false;
      
      try {
        // Обрабатываем разные форматы dueDate
        let taskDate: Date;
        
        if (typeof task.dueDate === 'number') {
          // Если dueDate это timestamp
          taskDate = new Date(task.dueDate);
        } else if (task.dueDate && typeof task.dueDate === 'object' && 'getTime' in task.dueDate) {
          // Если dueDate это Date объект
          taskDate = task.dueDate as Date;
        } else {
          // Если dueDate это строка
          taskDate = new Date(task.dueDate);
        }
        
        // Проверяем валидность даты
        if (isNaN(taskDate.getTime())) {
          console.warn('Invalid dueDate for task:', task.id, task.dueDate);
          return false;
        }
        
        // Сравниваем даты (только день, месяц, год)
        const taskDateString = taskDate.toDateString();
        const targetDateString = date.toDateString();
        
        return taskDateString === targetDateString;
      } catch (error) {
        console.error('Error processing dueDate for task:', task.id, task.dueDate, error);
        return false;
      }
    });
  };

  // Навигация по месяцам/неделям/дням
  const goToPrevious = () => {
    try {
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
    } catch (error) {
      console.error('Error in goToPrevious:', error);
    }
  };

  const goToNext = () => {
    try {
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
    } catch (error) {
      console.error('Error in goToNext:', error);
    }
  };

  const goToToday = () => {
    try {
      setCurrentDate(new Date());
    } catch (error) {
      console.error('Error in goToToday:', error);
    }
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
      case TaskStatus.PLANNING:
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
      case TaskStatus.BLOCKED:
        return styles.blockedStatus;
      case TaskStatus.ON_HOLD:
        return styles.onHoldStatus;
      case TaskStatus.OVERDUE:
        return styles.overdueStatus;
      default:
        return '';
    }
  };

  // Получаем цвет для приоритета
  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case TaskPriority.CRITICAL:
        return styles.criticalPriority;
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
    
    if (!Array.isArray(days) || days.length === 0) {
      return (
        <div className={styles.calendarGrid}>
          <p>Ошибка загрузки календаря</p>
        </div>
      );
    }

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
            const dayTasks = getTasksForDate(day.date);
            
            return (
              <div
                key={index}
                className={`${styles.dayCell} ${
                  !day.isCurrentMonth ? styles.otherMonth : ''
                } ${day.date.toDateString() === today.toDateString() ? styles.today : ''}`}
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
                          {task.priority === TaskPriority.CRITICAL ? '💥' :
                           task.priority === TaskPriority.URGENT ? '🔥' : 
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
    
    if (!Array.isArray(weekDays) || weekDays.length === 0) {
      return (
        <div className={styles.calendarGrid}>
          <p>Ошибка загрузки недельного вида</p>
        </div>
      );
    }

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
                          {task.priority === TaskPriority.CRITICAL ? '💥' :
                           task.priority === TaskPriority.URGENT ? '🔥' : 
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
                    {task.priority === TaskPriority.CRITICAL ? '💥' :
                     task.priority === TaskPriority.URGENT ? '🔥' : 
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
      case 'month': {
        return `${getMonthName(currentMonth)} ${currentYear}`;
      }
      case 'week': {
        const weekStart = new Date(currentDate);
        const dayOfWeek = currentDate.getDay();
        weekStart.setDate(currentDate.getDate() - dayOfWeek);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        return `${weekStart.getDate()} ${getMonthName(weekStart.getMonth())} - ${weekEnd.getDate()} ${getMonthName(weekEnd.getMonth())} ${currentYear}`;
      }
      case 'day': {
        return `${currentDate.getDate()} ${getMonthName(currentDate.getMonth())} ${currentYear}`;
      }
      default:
        return '';
    }
  };

  return (
    <div className={styles.todoCalendar}>
      {/* Заголовок календаря */}
      <div className={styles.calendarHeader}>
        <div className={styles.headerLeft}>
          <h2>{showAllTasks ? t('calendar.today_tasks') : t('calendar.title')}</h2>
          <div className={styles.taskCountInfo}>
            <span>{t('calendar.total_tasks')}: {validTasks.length}</span>
            <span>{t('calendar.with_date')}: {validTasks.filter(t => t.dueDate).length}</span>
          </div>
          <div className={styles.viewModeToggle}>
            <button
              className={`${styles.viewBtn} ${viewMode === 'month' ? styles.active : ''}`}
              onClick={() => setViewMode('month')}
            >
              {t('calendar.month')}
            </button>
            <button
              className={`${styles.viewBtn} ${viewMode === 'week' ? styles.active : ''}`}
              onClick={() => setViewMode('week')}
            >
              {t('calendar.week')}
            </button>
            <button
              className={`${styles.viewBtn} ${viewMode === 'day' ? styles.active : ''}`}
              onClick={() => setViewMode('day')}
            >
              {t('calendar.day')}
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
            {showAllTasks ? 'Сегодня' : getViewTitle()}
          </div>
        </div>
      </div>

      {/* Контент календаря */}
      {showAllTasks ? (
        // В режиме Today показываем выбранный вид, но по умолчанию дневной
        <>
          {viewMode === 'month' && renderMonthView()}
          {viewMode === 'week' && renderWeekView()}
          {viewMode === 'day' && renderDayView()}
        </>
      ) : (
        // Для обычного режима показываем выбранный вид
        <>
          {viewMode === 'month' && renderMonthView()}
          {viewMode === 'week' && renderWeekView()}
          {viewMode === 'day' && renderDayView()}
        </>
      )}

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
