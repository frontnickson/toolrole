import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../../store';
import { TaskStatus, TaskPriority, TaskType } from '../../../../types';
import styles from './DetailedStatistics.module.scss';
import { useTranslation } from '../../../../utils/translations';

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string[];
    borderColor: string[];
    borderWidth: number;
  }[];
}

interface PieChartData {
  labels: string[];
  data: number[];
  backgroundColor: string[];
  borderColor: string[];
}

interface CandleChartData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

const DetailedStatistics: React.FC = () => {
  const { boards } = useSelector((state: RootState) => state.boards);
  const { currentUser } = useSelector((state: RootState) => state.user);
  const { t } = useTranslation(currentUser?.language || 'ru');
  
  // Отладочная информация для понимания доступных статусов
  // console.log('Available TaskStatus values:', TaskStatus);
  // console.log('Available TaskPriority values:', TaskPriority);
  // console.log('Available TaskType values:', TaskType);
  
  // Отладочная информация для понимания Redux store
  // console.log('Debug Redux store:', {
  //   boardsCount: boards.length,
  //   boards: boards.map(board => ({
  //     id: board.id,
  //     title: board.title,
  //     columnsCount: board.columns?.length || 0,
  //     columns: board.columns?.map(col => ({
  //       id: col.id,
  //       title: col.title,
  //     tasksCount: col.tasks?.length || 0,
  //       sampleTasks: col.tasks?.slice(0, 2).map(t => ({
  //         id: t.id,
  //         status: t.status,
  //         title: t.title?.substring(0, 30)
  //       })) || []
  //     })) || []
  //   }))
  // });
  
  // Расширенные фильтры
  const [selectedTimeRange, setSelectedTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [selectedBoard, setSelectedBoard] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<TaskStatus | 'all'>('all');
  const [selectedPriority, setSelectedPriority] = useState<TaskPriority | 'all'>('all');
  const [selectedType, setSelectedType] = useState<TaskType | 'all'>('all');
  const [selectedAssignee, setSelectedAssignee] = useState<string>('all');

  // Получаем все задачи из всех досок
  const allTasks = useMemo(() => {
    const tasks = boards.flatMap(board =>
      (board.columns || []).flatMap(column => column.tasks || [])
    );
    
    // Отладочная информация для понимания структуры данных
    // console.log('Debug allTasks:', {
    //   boardsCount: boards.length,
    //   totalTasks: tasks.length,
    //   sampleTasks: tasks.slice(0, 3).map(t => ({
    //     id: t.id,
    //     status: t.status,
    //     priority: t.priority,
    //     type: t.type,
    //     title: t.title?.substring(0, 30)
    //   }))
    // });
    
    return tasks;
  }, [boards]);

  // Применяем все фильтры к задачам
  const filteredTasks = useMemo(() => {
    let filtered = allTasks;

    // Фильтр по доске
    if (selectedBoard !== 'all') {
      const board = boards.find(b => b.id === selectedBoard);
      if (board && board.columns) {
        filtered = board.columns.flatMap(column => column.tasks || []);
        
        // Отладочная информация для фильтра по доске
        // console.log('Debug board filter:', {
        //   selectedBoard,
        //   boardFound: !!board,
        //   boardTitle: board?.title,
        //   columnsCount: board?.columns?.length,
        //   tasksCount: filtered.length,
        //   sampleTasks: filtered.slice(0, 3).map(t => ({
        //     id: t.id,
        //     status: t.status,
        //     title: t.title?.substring(0, 30)
        //   }))
        // });
      } else {
        filtered = [];
        // console.log('Debug board filter: board not found or no columns');
      }
    }

    // Фильтр по статусу
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(task => task.status && task.status === selectedStatus);
    }

    // Фильтр по приоритету
    if (selectedPriority !== 'all') {
      filtered = filtered.filter(task => task.priority && task.priority === selectedPriority);
    }

    // Фильтр по типу
    if (selectedType !== 'all') {
      filtered = filtered.filter(task => task.type && task.type === selectedType);
    }

    // Фильтр по исполнителю
    if (selectedAssignee !== 'all') {
      filtered = filtered.filter(task => task.assigneeId && task.assigneeId === selectedAssignee);
    }

    // Отладочная информация для понимания работы фильтров
    // console.log('Debug filteredTasks:', {
    //   originalCount: allTasks.length,
    //   filteredCount: filtered.length,
    //   filters: {
    //     board: selectedBoard,
    //     status: selectedStatus,
    //     priority: selectedPriority,
    //     type: selectedType,
    //     assignee: selectedAssignee
    //   },
    //   sampleFilteredTasks: filtered.slice(0, 3).map(t => ({
    //     id: t.id,
    //     status: t.status,
    //     priority: t.priority,
    //     type: t.type
    //   }))
    // });

    return filtered;
  }, [allTasks, selectedBoard, selectedStatus, selectedPriority, selectedType, selectedAssignee, boards]);

  // Получаем уникальных исполнителей для фильтра
  const assignees = useMemo(() => {
    const assigneeMap = new Map<string, { id: string; name: string }>();
    
    allTasks.forEach(task => {
      if (task.assigneeId) {
        // Ищем участника в досках
        let member = null;
        for (const board of boards) {
          member = board.members?.find(m => m.userId === task.assigneeId);
          if (member) break;
        }
        
        if (member && !assigneeMap.has(member.userId)) {
          assigneeMap.set(member.userId, {
            id: member.userId,
            name: member.userId ? `${t('home.participant')} ${member.userId.slice(0, 8)}` : t('home.unknown_participant')
          });
        }
      }
    });

    return Array.from(assigneeMap.values());
  }, [allTasks, boards, t]);

  // Основные метрики
  const mainMetrics = useMemo(() => {
    const totalTasks = filteredTasks.length;
    
    // Детальная отладка для понимания проблемы со статусами
    // console.log('Debug TaskStatus constants:', TaskStatus);
    // console.log('Debug all unique statuses in filteredTasks:', [...new Set(filteredTasks.map(t => t.status).filter(Boolean))]);
    
    const completedTasks = filteredTasks.filter(t => t.status && t.status === TaskStatus.COMPLETED).length;
    
    // Более гибкая логика для определения статуса "В работе"
    const inProgressTasks = filteredTasks.filter(t => {
      if (!t.status) return false;
      // Проверяем различные варианты статуса "В работе"
      const status = String(t.status).toLowerCase();
      return status === TaskStatus.IN_PROGRESS || 
             status === 'in_progress' || 
             status === 'in-progress' || 
             status === 'inprogress' ||
             status === 'work' ||
             status === 'working' ||
             status === 'active';
    }).length;
    
    const planningTasks = filteredTasks.filter(t => t.status && t.status === TaskStatus.PLANNING).length;
    const reviewTasks = filteredTasks.filter(t => t.status && t.status === TaskStatus.REVIEW).length;
    const testingTasks = filteredTasks.filter(t => t.status && t.status === TaskStatus.TESTING).length;
    const cancelledTasks = filteredTasks.filter(t => t.status && t.status === TaskStatus.CANCELLED).length;
    const blockedTasks = filteredTasks.filter(t => t.status && t.status === TaskStatus.BLOCKED).length;
    const onHoldTasks = filteredTasks.filter(t => t.status && t.status === TaskStatus.ON_HOLD).length;

    // Отладочная информация для понимания проблемы с "В работе"
    // console.log('Debug mainMetrics:', {
    //   totalTasks,
    //   completedTasks,
    //   inProgressTasks,
    //   planningTasks,
    //   reviewTasks,
    //   testingTasks,
    //   cancelledTasks,
    //   blockedTasks,
    //   onHoldTasks,
    //   filteredTasksLength: filteredTasks.length,
    //   sampleTaskStatuses: filteredTasks.slice(0, 5).map(t => ({ id: t.id, status: t.status })),
    //   allTaskStatuses: filteredTasks.map(t => ({ id: t.id, status: t.status, title: t.title?.substring(0, 30) }))
    // });

    // Безопасные вычисления процентов
    const safeDivision = (numerator: number, denominator: number) => 
      denominator > 0 ? (numerator / denominator) * 100 : 0;

    return {
      total: totalTasks,
      completed: completedTasks,
      inProgress: inProgressTasks,
      planning: planningTasks,
      review: reviewTasks,
      testing: testingTasks,
      cancelled: cancelledTasks,
      blocked: blockedTasks,
      onHold: onHoldTasks,
      completionRate: safeDivision(completedTasks, totalTasks),
      inProgressRate: safeDivision(inProgressTasks, totalTasks),
      planningRate: safeDivision(planningTasks, totalTasks)
    };
  }, [filteredTasks]);

  // Статистика по приоритетам
  const priorityStats = useMemo(() => {
    const stats = {
      low: 0,
      medium: 0,
      high: 0,
      urgent: 0,
      critical: 0
    };

    filteredTasks.forEach(task => {
      if (task.priority && task.priority in stats) {
        stats[task.priority as keyof typeof stats]++;
      }
    });

    return stats;
  }, [filteredTasks]);

  // Статистика по типам задач
  const typeStats = useMemo(() => {
    const stats = {
      task: 0,
      bug: 0,
      feature: 0,
      story: 0,
      epic: 0,
      subtask: 0
    };

    filteredTasks.forEach(task => {
      if (task.type && task.type in stats) {
        stats[task.type as keyof typeof stats]++;
      }
    });

    return stats;
  }, [filteredTasks]);

  // Статистика по времени выполнения
  const timeStats = useMemo(() => {
    const completedTasks = filteredTasks.filter(task => task.status && task.status === TaskStatus.COMPLETED);
    
    // Безопасные вычисления для времени
    const safeAverage = (tasks: typeof completedTasks) => {
      if (tasks.length === 0) return 0;
      const totalHours = tasks.reduce((sum, task) => sum + (task.actualHours || 0), 0);
      return totalHours / tasks.length;
    };

    const totalEstimated = filteredTasks.reduce((sum, task) => sum + (task.estimatedHours || 0), 0);
    const totalActual = filteredTasks.reduce((sum, task) => sum + (task.actualHours || 0), 0);

    // Безопасное вычисление эффективности - новая формула
    const safeEfficiency = (estimated: number, actual: number) => {
      if (estimated <= 0) return 0;
      
      // Эффективность = (запланированное время / фактическое время) * 100
      // Если фактическое время меньше запланированного - это хорошо (высокая эффективность > 100%)
      // Если больше - это плохо (низкая эффективность < 100%)
      // 100% означает, что план выполнен точно
      const efficiency = (estimated / Math.max(actual, 1)) * 100;
      
      // Ограничиваем эффективность от 0% до 200%
      return Math.min(Math.max(efficiency, 0), 200);
    };

    return {
      averageTime: safeAverage(completedTasks),
      totalEstimated,
      totalActual,
      efficiency: safeEfficiency(totalEstimated, totalActual)
    };
  }, [filteredTasks]);

  // Временная статистика (свечевые диаграммы)
  const timeSeriesData = useMemo(() => {
    const now = new Date();
    const data: CandleChartData[] = [];
    
    // Генерируем данные для выбранного периода
    let days = 7;
    if (selectedTimeRange === 'month') days = 30;
    else if (selectedTimeRange === 'quarter') days = 90;
    else if (selectedTimeRange === 'year') days = 365;

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      // Фильтруем задачи по дате с безопасной проверкой
      const dayTasks = filteredTasks.filter(task => {
        if (!task.createdAt) return false;
        
        try {
          // Проверяем, является ли createdAt числом (timestamp) или строкой
          const taskDate = typeof task.createdAt === 'number' 
            ? new Date(task.createdAt) 
            : new Date(task.createdAt);
          
          if (isNaN(taskDate.getTime())) return false;
          
          return taskDate.toDateString() === date.toDateString();
        } catch {
          console.warn('Invalid date for task:', task.id, task.createdAt);
          return false;
        }
      });

      const completed = dayTasks.filter(t => t.status && t.status === TaskStatus.COMPLETED).length;
      
      // Более гибкая логика для определения статуса "В работе" в временной статистике
      const inProgress = dayTasks.filter(t => {
        if (!t.status) return false;
        const status = String(t.status).toLowerCase();
        return status === TaskStatus.IN_PROGRESS || 
               status === 'in_progress' || 
               status === 'in-progress' || 
               status === 'inprogress' ||
               status === 'work' ||
               status === 'working' ||
               status === 'active';
      }).length;
      
      const planning = dayTasks.filter(t => t.status && t.status === TaskStatus.PLANNING).length;

      // Безопасные вычисления для high и low
      const values = [completed, inProgress, planning].filter(v => v > 0);
      const high = values.length > 0 ? Math.max(...values) : 0;
      const low = values.length > 0 ? Math.min(...values) : 0;

      data.push({
        date: date.toLocaleDateString('ru-RU', { month: 'short', day: 'numeric' }),
        open: planning,
        high,
        low,
        close: completed
      });
    }

    // Отладочная информация для временной статистики
    // console.log('Debug timeSeriesData:', {
    //   selectedTimeRange,
    //   totalDays: data.length,
    //   sampleData: data.slice(0, 3),
    //   totalCompleted: data.reduce((sum, d) => sum + d.close, 0),
    //   totalInProgress: data.reduce((sum, d) => sum + (d.high - d.close), 0),
    //   totalPlanning: data.reduce((sum, d) => sum + d.open, 0)
    // });

    return data;
  }, [filteredTasks, selectedTimeRange]);

  // Данные для круговых диаграмм
  const statusPieData: PieChartData = useMemo(() => ({
    labels: [t('tasks.completed'), t('tasks.in_progress'), t('tasks.planning'), t('tasks.review'), t('tasks.testing'), t('tasks.cancelled'), t('tasks.blocked'), t('tasks.on_hold')],
    data: [
      mainMetrics.completed,
      mainMetrics.inProgress,
      mainMetrics.planning,
      mainMetrics.review,
      mainMetrics.testing,
      mainMetrics.cancelled,
      mainMetrics.blocked,
      mainMetrics.onHold
    ],
    backgroundColor: [
      '#10B981', '#3B82F6', '#F59E0B', '#8B5CF6', '#EF4444', '#6B7280', '#DC2626', '#F97316'
    ],
    borderColor: [
      '#059669', '#2563EB', '#D97706', '#7C3AED', '#DC2626', '#4B5563', '#B91C1C', '#EA580C'
    ]
  }), [mainMetrics, t]);

  // Проверяем, есть ли данные для отображения
  const hasStatusData = statusPieData.data.some(value => value > 0);
  const hasPriorityData = Object.values(priorityStats).some(value => value > 0);
  const hasTypeData = Object.values(typeStats).some(value => value > 0);

  const priorityPieData: PieChartData = useMemo(() => ({
    labels: [t('tasks.low'), t('tasks.medium'), t('tasks.high'), t('tasks.urgent'), t('tasks.critical')],
    data: [
      priorityStats.low,
      priorityStats.medium,
      priorityStats.high,
      priorityStats.urgent,
      priorityStats.critical
    ],
    backgroundColor: ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'],
    borderColor: ['#059669', '#2563EB', '#D97706', '#DC2626', '#7C3AED']
  }), [priorityStats, t]);

  const typePieData: PieChartData = useMemo(() => ({
    labels: [t('tasks.task'), t('tasks.bug'), t('tasks.feature'), t('tasks.story'), t('tasks.epic'), t('tasks.subtask')],
    data: [
      typeStats.task,
      typeStats.bug,
      typeStats.feature,
      typeStats.story,
      typeStats.epic,
      typeStats.subtask
    ],
    backgroundColor: ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#6B7280'],
    borderColor: ['#2563EB', '#DC2626', '#059669', '#D97706', '#7C3AED', '#4B5563']
  }), [typeStats, t]);

  // Данные для столбчатых диаграмм
  const statusBarData: ChartData = useMemo(() => ({
    labels: [t('tasks.completed'), t('tasks.in_progress'), t('tasks.planning'), t('tasks.review'), t('tasks.testing'), t('tasks.cancelled'), t('tasks.blocked'), t('tasks.on_hold')],
    datasets: [{
      label: t('home.task_count'),
      data: [
        mainMetrics.completed,
        mainMetrics.inProgress,
        mainMetrics.planning,
        mainMetrics.review,
        mainMetrics.testing,
        mainMetrics.cancelled,
        mainMetrics.blocked,
        mainMetrics.onHold
      ],
      backgroundColor: [
        '#10B981', '#3B82F6', '#F59E0B', '#8B5CF6', '#EF4444', '#6B7280', '#DC2626', '#F97316'
      ],
      borderColor: [
        '#059669', '#2563EB', '#D97706', '#7C3AED', '#DC2626', '#4B5563', '#B91C1C', '#EA580C'
      ],
      borderWidth: 2
    }]
  }), [mainMetrics, t]);

  const priorityBarData: ChartData = useMemo(() => ({
    labels: [t('tasks.low'), t('tasks.medium'), t('tasks.high'), t('tasks.urgent'), t('tasks.critical')],
    datasets: [{
      label: t('home.task_count'),
      data: [
        priorityStats.low,
        priorityStats.medium,
        priorityStats.high,
        priorityStats.urgent,
        priorityStats.critical
      ],
      backgroundColor: ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'],
      borderColor: ['#059669', '#2563EB', '#D97706', '#DC2626', '#7C3AED'      ],
      borderWidth: 2
    }]
  }), [priorityStats, t]);

  // Функция для сброса всех фильтров
  const resetFilters = () => {
    setSelectedBoard('all');
    setSelectedStatus('all');
    setSelectedPriority('all');
    setSelectedType('all');
    setSelectedAssignee('all');
  };

  // Функция для создания настоящей круговой диаграммы
  const createPieChart = (data: PieChartData, size: number = 200, chartId: string) => {
    const total = data.data.reduce((sum, value) => sum + value, 0);
    if (total === 0) {
      return (
        <div className={styles.emptyChart}>
          <div className={styles.emptyChartIcon}>📊</div>
          <div className={styles.emptyChartText}>{t('home.no_data_to_display')}</div>
          <div className={styles.emptyChartHint}>
            {t('home.try_changing_filters')}
          </div>
        </div>
      );
    }

    // Проверяем, есть ли только один тип данных
    const nonZeroData = data.data.filter(value => value > 0);
    if (nonZeroData.length === 1) {
      const singleValue = nonZeroData[0];
      const singleIndex = data.data.findIndex(value => value === singleValue);
      const singleLabel = data.labels[singleIndex];
      
      return (
        <div className={styles.singleValueChart}>
          <div className={styles.singleValueIcon}>🎯</div>
          <div className={styles.singleValueNumber}>{singleValue}</div>
          <div className={styles.singleValueLabel}>{singleLabel}</div>
          <div className={styles.singleValuePercentage}>100%</div>
        </div>
      );
    }

    let currentAngle = 0;
    const radius = size / 2;
    const center = size / 2;

    return (
      <svg width={size} height={size} className={styles.pieChartSvg}>
        {data.data.map((value, index) => {
          if (value === 0) return null;
          
          const percentage = value / total;
          const angle = percentage * 360;
          const startAngle = currentAngle;
          const endAngle = currentAngle + angle;
          
          const x1 = center + radius * Math.cos((startAngle - 90) * Math.PI / 180);
          const y1 = center + radius * Math.sin((startAngle - 90) * Math.PI / 180);
          const x2 = center + radius * Math.cos((endAngle - 90) * Math.PI / 180);
          const y2 = center + radius * Math.sin((endAngle - 90) * Math.PI / 180);
          
          const largeArcFlag = angle > 180 ? 1 : 0;
          
          const pathData = [
            `M ${center} ${center}`,
            `L ${x1} ${y1}`,
            `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
            'Z'
          ].join(' ');
          
          currentAngle += angle;
          
          return (
            <g key={index}>
              <title>{`${data.labels[index]}: ${value} (${(percentage * 100).toFixed(1)}%)`}</title>
              <path
                d={pathData}
                fill={data.backgroundColor[index]}
                stroke={data.borderColor[index]}
                strokeWidth="2"
                className={styles.pieSlicePath}
                data-slice-index={index}
                data-chart-id={chartId}
              />
            </g>
          );
        })}
        <circle
          cx={center}
          cy={center}
          r={radius * 0.3}
          fill="white"
          className={styles.pieCenter}
        />
        <text
          x={center}
          y={center + 5}
          textAnchor="middle"
          className={styles.pieCenterText}
          fontSize="14"
          fontWeight="600"
          fill="#172b4d"
        >
          {total}
        </text>
      </svg>
    );
  };

  return (
    <div className={styles.detailedStatistics}>
      {/* Заголовок страницы */}
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderContent}>
          <div className={styles.pageHeaderInfo}>
            <h1 className={styles.pageTitle}>{t('home.statistics')}</h1>
            <p className={styles.pageSubtitle}>
              {t('home.productivity_analysis')}
            </p>
          </div>
        </div>
      </div>

      {/* Панель фильтров */}
      <div className={styles.filtersPanel}>
        <div className={styles.filtersHeader}>
          <h3 className={styles.filtersTitle}>{t('home.filters')}</h3>
          <button onClick={resetFilters} className={styles.resetButton}>
            {t('home.reset')}
          </button>
        </div>
        
        <div className={styles.filtersGrid}>
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>{t('home.period')}</label>
            <select
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value as 'week' | 'month' | 'quarter' | 'year')}
              className={styles.filterSelect}
            >
              <option value="week">{t('home.week')}</option>
              <option value="month">{t('home.month')}</option>
              <option value="quarter">{t('home.quarter')}</option>
              <option value="year">{t('home.year')}</option>
            </select>
          </div>
          
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>{t('tasks.board_label')}</label>
            <select
              value={selectedBoard}
              onChange={(e) => setSelectedBoard(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="all">{t('home.all_boards')}</option>
              {boards.map(board => (
                <option key={board.id} value={board.id}>
                  {board.title}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>{t('tasks.status')}</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as TaskStatus | 'all')}
              className={styles.filterSelect}
            >
              <option value="all">{t('home.all_statuses')}</option>
              <option value={TaskStatus.PLANNING}>{t('tasks.planning')}</option>
              <option value={TaskStatus.IN_PROGRESS}>{t('tasks.in_progress')}</option>
              <option value={TaskStatus.REVIEW}>{t('tasks.review')}</option>
              <option value={TaskStatus.TESTING}>{t('tasks.testing')}</option>
              <option value={TaskStatus.COMPLETED}>{t('tasks.completed')}</option>
              <option value={TaskStatus.CANCELLED}>{t('tasks.cancelled')}</option>
              <option value={TaskStatus.BLOCKED}>{t('tasks.blocked')}</option>
              <option value={TaskStatus.ON_HOLD}>{t('tasks.on_hold')}</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>{t('tasks.priority')}</label>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value as TaskPriority | 'all')}
              className={styles.filterSelect}
            >
              <option value="all">{t('home.all_priorities')}</option>
              <option value={TaskPriority.LOW}>{t('tasks.low')}</option>
              <option value={TaskPriority.MEDIUM}>{t('tasks.medium')}</option>
              <option value={TaskPriority.HIGH}>{t('tasks.high')}</option>
              <option value={TaskPriority.URGENT}>{t('tasks.urgent')}</option>
              <option value={TaskPriority.CRITICAL}>{t('tasks.critical')}</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>{t('tasks.type')}</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as TaskType | 'all')}
              className={styles.filterSelect}
            >
              <option value="all">{t('home.all_types')}</option>
              <option value={TaskType.TASK}>{t('tasks.task')}</option>
              <option value={TaskType.BUG}>{t('tasks.bug')}</option>
              <option value={TaskType.FEATURE}>{t('tasks.feature')}</option>
              <option value={TaskType.STORY}>{t('tasks.story')}</option>
              <option value={TaskType.EPIC}>{t('tasks.epic')}</option>
              <option value={TaskType.SUBTASK}>{t('tasks.subtask')}</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>{t('tasks.assignee')}</label>
            <select
              value={selectedAssignee}
              onChange={(e) => setSelectedAssignee(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="all">{t('home.all_assignees')}</option>
              {assignees.map(assignee => (
                <option key={assignee.id} value={assignee.id}>
                  {assignee.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className={styles.content}>
        {/* Основные метрики */}
        <div className={styles.metricsSection}>
          <h3 className={styles.sectionTitle}>{t('home.key_metrics')}</h3>
          <div className={styles.metricsGrid}>
            <div className={styles.metricCard}>
              <div className={`${styles.icon} ${styles.blue}`}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 3v18h18"/>
                  <path d="m9 9 3 3 3-3"/>
                  <path d="m9 15 3-3 3 3"/>
                </svg>
              </div>
              <div className={styles.content}>
                <div className={styles.value}>{mainMetrics.total || 0}</div>
                <div className={styles.label}>{t('home.total_tasks')}</div>
                <div className={`${styles.change} ${mainMetrics.total > 0 ? styles.positive : styles.neutral}`}>
                  {mainMetrics.total > 0 ? t('home.active') : t('home.no_tasks')}
                </div>
              </div>
            </div>

            <div className={styles.metricCard}>
              <div className={`${styles.icon} ${styles.green}`}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 6 9 17l-5-5"/>
                </svg>
              </div>
              <div className={styles.content}>
                <div className={styles.value}>
                  {mainMetrics.completed || 0}
                </div>
                <div className={styles.label}>{t('tasks.completed')}</div>
                <div className={`${styles.change} ${mainMetrics.completionRate > 0 ? styles.positive : styles.neutral}`}>
                  {mainMetrics.completionRate ? mainMetrics.completionRate.toFixed(1) : '0.0'}%
                </div>
              </div>
            </div>

            <div className={styles.metricCard}>
              <div className={`${styles.icon} ${styles.orange}`}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12,6 12,12 16,14"/>
                </svg>
              </div>
              <div className={styles.content}>
                <div className={styles.value}>
                  {timeStats.averageTime ? timeStats.averageTime.toFixed(1) : '0.0'}{t('home.hours_short')}
                </div>
                <div className={styles.label}>{t('home.average_time')}</div>
                <div className={`${styles.change} ${timeStats.averageTime > 0 ? styles.positive : styles.neutral}`}>
                  {timeStats.averageTime > 0 ? t('home.per_task') : t('home.no_data')}
                </div>
              </div>
            </div>

            <div className={styles.metricCard}>
              <div className={`${styles.icon} ${styles.purple}`}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <div className={styles.content}>
                <div className={styles.value}>
                  {(() => {
                    if (timeStats.efficiency === 0) return '0.0%';
                    if (timeStats.efficiency >= 100) return `${timeStats.efficiency.toFixed(1)}%`;
                    return `${timeStats.efficiency.toFixed(1)}%`;
                  })()}
                </div>
                <div className={styles.label}>{t('home.productivity')}</div>
                <div className={`${styles.change} ${timeStats.efficiency >= 100 ? styles.positive : timeStats.efficiency > 0 ? styles.negative : styles.neutral}`}>
                  {timeStats.efficiency >= 100 ? t('home.plan_overfulfilled') : timeStats.efficiency > 0 ? t('home.plan_not_fulfilled') : t('home.no_data')}
                </div>
              </div>
            </div>

            <div className={styles.metricCard}>
              <div className={`${styles.icon} ${styles.blue}`}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <div className={styles.content}>
                <div className={styles.value}>
                  {mainMetrics.inProgress || 0}
                </div>
                <div className={styles.label}>{t('tasks.in_progress')}</div>
                <div className={`${styles.change} ${mainMetrics.inProgressRate > 0 ? styles.positive : styles.neutral}`}>
                  {mainMetrics.inProgressRate ? mainMetrics.inProgressRate.toFixed(1) : '0.0'}%
                </div>
              </div>
            </div>

            <div className={styles.metricCard}>
              <div className={`${styles.icon} ${styles.orange}`}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14,2 14,8 20,8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                  <polyline points="10,9 9,9 8,9"/>
                </svg>
              </div>
              <div className={styles.content}>
                <div className={styles.value}>
                  {mainMetrics.planning || 0}
                </div>
                <div className={styles.label}>{t('tasks.planning')}</div>
                <div className={`${styles.change} ${mainMetrics.planningRate > 0 ? styles.positive : styles.neutral}`}>
                  {mainMetrics.planningRate ? mainMetrics.planningRate.toFixed(1) : '0.0'}%
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Круговые диаграммы */}
        <div className={styles.chartsSection}>
          <h3 className={styles.sectionTitle}>
            {t('home.task_distribution')}
            {!hasStatusData && !hasPriorityData && !hasTypeData && (
              <span className={styles.noDataSectionBadge}>{t('home.no_data_for_analysis')}</span>
            )}
          </h3>
          <div className={styles.chartsGrid}>
            <div className={styles.chartCard}>
              <div className={styles.chartTitle}>
                {t('home.status_distribution')}
                {!hasStatusData && <span className={styles.noDataBadge}>{t('home.no_data')}</span>}
              </div>
              <div className={styles.chartContainer}>
                <div className={styles.pieChartWrapper}>
                  {createPieChart(statusPieData, 250, 'status')}
                  <div className={styles.pieLegend}>
                    {statusPieData.labels.map((label, index) => {
                      const total = statusPieData.data.reduce((sum, value) => sum + value, 0);
                      const percentage = total > 0 ? (statusPieData.data[index] / total) * 100 : 0;
                      const value = statusPieData.data[index];
                      
                      // Показываем только элементы с данными
                      if (value === 0) return null;
                      
                      return (
                        <div 
                          key={label} 
                          className={styles.legendItem}
                        >
                          <span 
                            className={styles.legendColor} 
                            style={{ backgroundColor: statusPieData.backgroundColor[index] }}
                          />
                          <span className={styles.legendLabel}>
                            {label}: {value}
                          </span>
                          <span className={styles.legendPercentage}>
                            ({percentage.toFixed(1)}%)
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.chartCard}>
              <div className={styles.chartTitle}>
                {t('home.priority_distribution')}
                {!hasPriorityData && <span className={styles.noDataBadge}>{t('home.no_data')}</span>}
              </div>
              <div className={styles.chartContainer}>
                <div className={styles.pieChartWrapper}>
                  {createPieChart(priorityPieData, 250, 'priority')}
                  <div className={styles.pieLegend}>
                    {priorityPieData.labels.map((label, index) => {
                      const total = priorityPieData.data.reduce((sum, value) => sum + value, 0);
                      const percentage = total > 0 ? (priorityPieData.data[index] / total) * 100 : 0;
                      const value = priorityPieData.data[index];
                      
                      // Показываем только элементы с данными
                      if (value === 0) return null;
                      
                      return (
                        <div 
                          key={label} 
                          className={styles.legendItem}
                        >
                          <span 
                            className={styles.legendColor} 
                            style={{ backgroundColor: priorityPieData.backgroundColor[index] }}
                          />
                          <span className={styles.legendLabel}>
                            {label}: {value}
                          </span>
                          <span className={styles.legendPercentage}>
                            ({percentage.toFixed(1)}%)
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.chartCard}>
              <div className={styles.chartTitle}>
                {t('home.type_distribution')}
                {!hasTypeData && <span className={styles.noDataBadge}>{t('home.no_data')}</span>}
              </div>
              <div className={styles.chartContainer}>
                <div className={styles.pieChartWrapper}>
                  {createPieChart(typePieData, 250, 'type')}
                  <div className={styles.pieLegend}>
                    {typePieData.labels.map((label, index) => {
                      const total = typePieData.data.reduce((sum, value) => sum + value, 0);
                      const percentage = total > 0 ? (typePieData.data[index] / total) * 100 : 0;
                      const value = typePieData.data[index];
                      
                      // Показываем только элементы с данными
                      if (value === 0) return null;
                      
                      return (
                        <div 
                          key={label} 
                          className={styles.legendItem}
                        >
                          <span 
                            className={styles.legendColor} 
                            style={{ backgroundColor: typePieData.backgroundColor[index] }}
                          />
                          <span className={styles.legendLabel}>
                            {label}: {value}
                          </span>
                          <span className={styles.legendPercentage}>
                            ({percentage.toFixed(1)}%)
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Столбчатые диаграммы */}
        <div className={styles.chartsSection}>
          <h3 className={styles.sectionTitle}>{t('home.detailization')}</h3>
          <div className={styles.chartsGrid}>
            <div className={styles.chartCard}>
              <div className={styles.chartTitle}>{t('home.task_statuses')}</div>
              <div className={styles.chartContainer}>
                <div className={styles.chart}>
                  {statusBarData.labels.map((label, index) => {
                    const value = statusBarData.datasets[0].data[index];
                    
                    // Показываем только элементы с данными
                    if (value === 0) return null;
                    
                    return (
                      <div key={label} className={styles.chartBar}>
                        <div className={styles.barLabel}>{label}</div>
                        <div className={styles.barContainer}>
                          <div
                            className={styles.bar}
                            style={{
                              width: `${(() => {
                                const maxValue = Math.max(...statusBarData.datasets[0].data);
                                if (maxValue === 0) return '20%';
                                return `${Math.max((value / maxValue) * 80, 20)}%`;
                              })()}`,
                              backgroundColor: statusBarData.datasets[0].backgroundColor[index]
                            }}
                          />
                        </div>
                        <div className={styles.barValue}>
                          {value}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className={styles.chartCard}>
              <div className={styles.chartTitle}>{t('home.task_priorities')}</div>
              <div className={styles.chartContainer}>
                <div className={styles.chart}>
                  {priorityBarData.labels.map((label, index) => {
                    const value = priorityBarData.datasets[0].data[index];
                    
                    // Показываем только элементы с данными
                    if (value === 0) return null;
                    
                    return (
                      <div key={label} className={styles.chartBar}>
                        <div className={styles.barLabel}>{label}</div>
                        <div className={styles.barContainer}>
                          <div
                            className={styles.bar}
                            style={{
                              width: `${(() => {
                                const maxValue = Math.max(...priorityBarData.datasets[0].data);
                                if (maxValue === 0) return '20%';
                                return `${Math.max((value / maxValue) * 80, 20)}%`;
                              })()}`,
                              backgroundColor: priorityBarData.datasets[0].backgroundColor[index]
                              }}
                            />
                          </div>
                          <div className={styles.barValue}>
                            {value}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Временная статистика */}
        <div className={styles.chartsSection}>
          <h3 className={styles.sectionTitle}>
            {t('home.time_statistics')}
            <span className={styles.timeRangeBadge}>{selectedTimeRange}</span>
          </h3>
          
          <div className={styles.timeStatsGrid}>
            {/* Основные метрики времени */}
            <div className={styles.timeMetricCard}>
              <div className={styles.timeMetricHeader}>
                <div className={styles.timeMetricIcon}>📅</div>
                <div className={styles.timeMetricInfo}>
                  <div className={styles.timeMetricLabel}>{t('home.analysis_period')}</div>
                  <div className={styles.timeMetricValue}>
                    {selectedTimeRange === 'week' && `7 ${t('home.days')}`}
                    {selectedTimeRange === 'month' && `30 ${t('home.days')}`}
                    {selectedTimeRange === 'quarter' && `90 ${t('home.days')}`}
                    {selectedTimeRange === 'year' && `365 ${t('home.days')}`}
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.timeMetricCard}>
              <div className={styles.timeMetricHeader}>
                <div className={styles.timeMetricIcon}>✅</div>
                <div className={styles.timeMetricInfo}>
                  <div className={styles.timeMetricLabel}>{t('home.total_completed')}</div>
                  <div className={styles.timeMetricValue}>
                    {(() => {
                      const totalCompleted = timeSeriesData.reduce((sum, candle) => sum + candle.close, 0);
                      return `${totalCompleted} ${t('home.task_count')}`;
                    })()}
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.timeMetricCard}>
              <div className={styles.timeMetricHeader}>
                <div className={styles.timeMetricIcon}>📊</div>
                <div className={styles.timeMetricInfo}>
                  <div className={styles.timeMetricLabel}>{t('home.average_per_day')}</div>
                  <div className={styles.timeMetricValue}>
                    {(() => {
                      if (timeSeriesData.length === 0) return `0 ${t('home.task_count')}`;
                      
                      const totalCompleted = timeSeriesData.reduce((sum, candle) => sum + candle.close, 0);
                      const average = totalCompleted / timeSeriesData.length;
                      
                      return `${average.toFixed(1)} ${t('home.task_count')}`;
                    })()}
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.timeMetricCard}>
              <div className={styles.timeMetricHeader}>
                <div className={styles.timeMetricIcon}>🎯</div>
                <div className={styles.timeMetricInfo}>
                  <div className={styles.timeMetricLabel}>{t('home.efficiency')}</div>
                  <div className={styles.timeMetricValue}>
                    {(() => {
                      if (timeSeriesData.length === 0) return '0%';
                      
                      const totalCompleted = timeSeriesData.reduce((sum, candle) => sum + candle.close, 0);
                      const totalHigh = timeSeriesData.reduce((sum, candle) => sum + candle.high, 0);
                      
                      if (totalHigh <= 0) return '0%';
                      
                      const efficiency = (totalCompleted / totalHigh) * 100;
                      return `${Math.min(efficiency, 999.9).toFixed(1)}%`;
                    })()}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* График продуктивности */}
          <div className={styles.chartCard}>
            <div className={styles.chartTitle}>
              <span>📈 {t('home.productivity_by_days')}</span>
              <div className={styles.chartLegend}>
                <div className={styles.legendDot}>
                  <span className={styles.dot} style={{ backgroundColor: '#10B981' }}></span>
                  <span>{t('tasks.completed')}</span>
                </div>
                <div className={styles.legendDot}>
                  <span className={styles.dot} style={{ backgroundColor: '#3B82F6' }}></span>
                  <span>{t('tasks.in_progress')}</span>
                </div>
                <div className={styles.legendDot}>
                  <span className={styles.dot} style={{ backgroundColor: '#F59E0B' }}></span>
                  <span>{t('tasks.planning')}</span>
                </div>
              </div>
            </div>
            
            <div className={styles.chartContainer}>
              <div className={styles.productivityChart}>
                {/* График */}
                <div className={styles.chartArea}>
                  {timeSeriesData.length > 0 ? (
                    <>
                      <div className={styles.chartBars}>
                        {timeSeriesData.map((candle, index) => (
                          <div key={index} className={styles.chartBarGroup}>
                            <div className={styles.barStack}>
                              {/* Завершенные задачи */}
                              <div 
                                className={styles.barSegment}
                                style={{ 
                                  height: `${(() => {
                                    const completed = candle.close;
                                    return Math.max(completed * 4, 8);
                                  })()}px`,
                                  backgroundColor: '#10B981'
                                }}
                                title={`${t('tasks.completed')}: ${candle.close} ${t('home.task_count')}`}
                              />
                              {/* Задачи в работе */}
                              <div 
                                className={styles.barSegment}
                                style={{ 
                                  height: `${(() => {
                                    const inProgress = Math.max(candle.high - candle.close, 0);
                                    return Math.max(inProgress * 4, 8);
                                  })()}px`,
                                  backgroundColor: '#3B82F6'
                                }}
                                title={`${t('tasks.in_progress')}: ${Math.max(candle.high - candle.close, 0)} ${t('home.task_count')}`}
                              />
                              {/* Задачи в планировании */}
                              <div 
                                className={styles.barSegment}
                                style={{ 
                                  height: `${(() => {
                                    const planning = candle.open;
                                    return Math.max(planning * 4, 8);
                                  })()}px`,
                                  backgroundColor: '#F59E0B'
                                }}
                                title={`${t('tasks.planning')}: ${candle.open} ${t('home.task_count')}`}
                              />
                            </div>
                            <div className={styles.barDate}>
                              {candle.date || 'Н/Д'}
                            </div>
                            <div className={styles.barTotal}>
                              {(() => {
                                const total = candle.high;
                                return total > 0 ? total : '-';
                              })()}
                            </div>
                          </div>
                        ))}
                      </div>
                      {timeSeriesData.length > 7 && (
                        <div className={styles.scrollHint}>
                          <span>{t('home.scroll_to_view')}</span>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className={styles.emptyChart}>
                      <div className={styles.emptyChartIcon}>📊</div>
                      <div className={styles.emptyChartText}>{t('home.no_data_to_display')}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Детальная статистика */}
          <div className={styles.detailedStatsGrid}>
            <div className={styles.statsCard}>
              <div className={styles.statsHeader}>
                <h4 className={styles.statsTitle}>📊 {t('home.status_distribution')}</h4>
              </div>
              <div className={styles.statsContent}>
                <div className={styles.statRow}>
                  <div className={styles.statLabel}>
                    <span className={styles.statColor} style={{ backgroundColor: '#10B981' }}></span>
                    {t('tasks.completed')}
                  </div>
                  <div className={styles.statValue}>
                    {(() => {
                      const totalCompleted = timeSeriesData.reduce((sum, candle) => sum + candle.close, 0);
                      return totalCompleted;
                    })()}
                  </div>
                </div>
                <div className={styles.statRow}>
                  <div className={styles.statLabel}>
                    <span className={styles.statColor} style={{ backgroundColor: '#3B82F6' }}></span>
                    {t('tasks.in_progress')}
                  </div>
                  <div className={styles.statValue}>
                    {(() => {
                      const totalInProgress = timeSeriesData.reduce((sum, candle) => 
                        sum + Math.max(candle.high - candle.close, 0), 0
                      );
                      return totalInProgress;
                    })()}
                  </div>
                </div>
                <div className={styles.statRow}>
                  <div className={styles.statLabel}>
                    <span className={styles.statColor} style={{ backgroundColor: '#F59E0B' }}></span>
                    {t('tasks.planning')}
                  </div>
                  <div className={styles.statValue}>
                    {(() => {
                      const totalPlanning = timeSeriesData.reduce((sum, candle) => sum + candle.open, 0);
                      return totalPlanning;
                    })()}
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.statsCard}>
              <div className={styles.statsHeader}>
                <h4 className={styles.statsTitle}>🎯 {t('home.key_indicators')}</h4>
              </div>
              <div className={styles.statsContent}>
                <div className={styles.statRow}>
                  <div className={styles.statLabel}>{t('home.best_day')}</div>
                  <div className={styles.statValue}>
                    {(() => {
                      if (timeSeriesData.length === 0) return `0 ${t('home.task_count')}`;
                      const bestDay = timeSeriesData.reduce((max, candle) => 
                        candle.close > max.close ? candle : max
                      );
                      return `${bestDay.close} ${t('home.task_count')}`;
                    })()}
                  </div>
                  <div className={styles.statSubtitle}>
                    {(() => {
                      if (timeSeriesData.length === 0) return '-';
                      const bestDay = timeSeriesData.reduce((max, candle) => 
                        candle.close > max.close ? candle : max
                      );
                      return bestDay.date;
                    })()}
                  </div>
                </div>
                <div className={styles.statRow}>
                  <div className={styles.statLabel}>{t('home.average_load')}</div>
                  <div className={styles.statValue}>
                    {(() => {
                      if (timeSeriesData.length === 0) return `0 ${t('home.task_count')}`;
                      
                      const totalHigh = timeSeriesData.reduce((sum, candle) => sum + candle.high, 0);
                      const average = totalHigh / timeSeriesData.length;
                      
                      return `${average.toFixed(1)} ${t('home.task_count')}`;
                    })()}
                  </div>
                  <div className={styles.statSubtitle}>{t('home.per_day')}</div>
                </div>
                <div className={styles.statRow}>
                  <div className={styles.statLabel}>{t('home.peak_activity')}</div>
                  <div className={styles.statValue}>
                    {(() => {
                      if (timeSeriesData.length === 0) return `0 ${t('home.task_count')}`;
                      
                      const maxHigh = Math.max(...timeSeriesData.map(candle => candle.high));
                      return `${maxHigh} ${t('home.task_count')}`;
                    })()}
                  </div>
                  <div className={styles.statSubtitle}>{t('home.max_per_day')}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Временные метрики */}
        <div className={styles.timeMetrics}>
          <h3>{t('home.time_metrics')}</h3>
          <div className={styles.timeGrid}>
            <div className={styles.timeCard}>
              <div className={styles.timeIcon}>⏳</div>
              <div className={styles.timeContent}>
                <div className={styles.timeValue}>
                  {timeStats.totalEstimated ? timeStats.totalEstimated.toFixed(1) : '0.0'}{t('home.hours_short')}
                </div>
                <div className={styles.timeLabel}>{t('home.planned_time')}</div>
              </div>
            </div>

            <div className={styles.timeCard}>
              <div className={styles.timeIcon}>✅</div>
              <div className={styles.timeContent}>
                <div className={styles.timeValue}>
                  {timeStats.totalActual ? timeStats.totalActual.toFixed(1) : '0.0'}{t('home.hours_short')}
                </div>
                <div className={styles.timeLabel}>{t('home.actual_time')}</div>
              </div>
            </div>

            <div className={styles.timeCard}>
              <div className={styles.timeIcon}>📊</div>
              <div className={styles.timeContent}>
                <div className={styles.timeValue}>
                  {(() => {
                    if (timeStats.totalEstimated <= 0) return '0%';
                    const percentage = (timeStats.totalActual / timeStats.totalEstimated) * 100;
                    return `${Math.min(percentage, 999.9).toFixed(1)}%`;
                  })()}
                </div>
                <div className={styles.timeLabel}>{t('home.plan_execution')}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailedStatistics;
