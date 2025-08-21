// Простой тест для проверки работы boardSlice
// Этот файл можно запустить в браузере для проверки

import { configureStore } from '@reduxjs/toolkit';
import boardReducer, { createLocalBoard, setCurrentBoard } from './boardSlice';
import type { Board } from '../../types/board';

// Создаем тестовый store
const testStore = configureStore({
  reducer: {
    boards: boardReducer
  }
});

// Тестовая доска
const testBoard: Board = {
  id: 'test-board-1',
  title: 'Тестовая доска',
  description: 'Доска для тестирования',
  icon: '🧪',
  color: '#FF0000',
  ownerId: 'test-user-1',
  teamId: undefined,
  members: [],
  columns: [],
  settings: {
    allowMemberInvites: true,
    allowPublicView: false,
    allowComments: true,
    allowAttachments: true,
    allowTaskCreation: true,
    allowTaskEditing: true,
    defaultColumnTemplate: ['planning', 'in_progress', 'completed'],
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
    showTaskDetails: 'members',
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
    lastActivity: new Date(),
    completionRate: 0,
    averageTaskDuration: 0,
    totalComments: 0,
    totalAttachments: 0
  },
  isTemplate: false,
  templateId: undefined,
  createdAt: new Date(),
  updatedAt: new Date(),
  isArchived: false,
  isPublic: false
};

// Функция для запуска тестов
export function runBoardSliceTests() {
  console.log('🧪 Запуск тестов boardSlice...');
  
  // Тест 1: Проверяем начальное состояние
  console.log('📊 Тест 1: Начальное состояние');
  const initialState = testStore.getState();
  console.log('Количество досок:', initialState.boards.boards.length);
  console.log('Текущая доска:', initialState.boards.currentBoard);
  
  // Тест 2: Создаем доску
  console.log('\n📊 Тест 2: Создание доски');
  testStore.dispatch(createLocalBoard(testBoard));
  const stateAfterCreate = testStore.getState();
  console.log('Количество досок после создания:', stateAfterCreate.boards.boards.length);
  console.log('Доска в массиве:', stateAfterCreate.boards.boards[0]);
  
  // Тест 3: Устанавливаем как текущую
  console.log('\n📊 Тест 3: Установка текущей доски');
  testStore.dispatch(setCurrentBoard(testBoard));
  const stateAfterSetCurrent = testStore.getState();
  console.log('Текущая доска:', stateAfterSetCurrent.boards.currentBoard);
  
  // Тест 4: Проверяем кэш
  console.log('\n📊 Тест 4: Проверка кэша');
  console.log('Доска в кэше:', stateAfterSetCurrent.boards.boardCache[testBoard.id]);
  
  // Тест 5: Проверяем статистику
  console.log('\n📊 Тест 5: Проверка статистики');
  console.log('Глобальная статистика:', stateAfterSetCurrent.boards.globalStatistics);
  
  console.log('\n✅ Все тесты завершены!');
  
  return {
    initialState,
    stateAfterCreate,
    stateAfterSetCurrent
  };
}

// Автоматический запуск тестов в браузере
if (typeof window !== 'undefined') {
  // @ts-ignore
  window.runBoardSliceTests = runBoardSliceTests;
  console.log('🧪 Тесты boardSlice готовы к запуску. Вызовите window.runBoardSliceTests() в консоли браузера');
}
