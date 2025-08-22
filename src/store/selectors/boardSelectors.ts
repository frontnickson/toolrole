import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../index';

// ===== БАЗОВЫЕ СЕЛЕКТОРЫ =====

export const selectBoardState = (state: RootState) => state.boards;

export const selectBoards = (state: RootState) => state.boards.boards;
export const selectCurrentBoard = (state: RootState) => state.boards.currentBoard;
export const selectTemplates = (state: RootState) => state.boards.templates;
export const selectBoardError = (state: RootState) => state.boards.error;
export const selectBoardLoading = (state: RootState) => state.boards.isLoading;

// ===== СЕЛЕКТОРЫ ДОСОК =====

// Получить доску по ID
export const selectBoardById = createSelector(
  [selectBoards, (_state: RootState, boardId: string) => boardId],
  (boards, boardId) => boards.find(board => board.id === boardId)
);

// Получить все доски пользователя
export const selectAllUserBoards = createSelector(
  [selectBoards],
  (boards) => [...boards]
);

// Получить количество досок
export const selectBoardsCount = createSelector(
  [selectBoards],
  (boards) => boards.length
);

// Получить доски по владельцу
export const selectBoardsByOwner = createSelector(
  [selectBoards, (_state: RootState, ownerId: string) => ownerId],
  (boards, ownerId) => boards.filter(board => board.ownerId === ownerId)
);

// Получить доски по команде
export const selectBoardsByTeam = createSelector(
  [selectBoards, (_state: RootState, teamId: string) => teamId],
  (boards, teamId) => boards.filter(board => board.teamId === teamId)
);

// ===== СЕЛЕКТОРЫ КОЛОНОК =====

// Получить колонки текущей доски
export const selectCurrentBoardColumns = createSelector(
  [selectCurrentBoard],
  (currentBoard) => currentBoard?.columns || []
);

// Получить колонку по ID
export const selectColumnById = createSelector(
  [selectCurrentBoard, (_state: RootState, columnId: string) => columnId],
  (currentBoard, columnId) => currentBoard?.columns.find(col => col.id === columnId)
);

// Получить колонки с задачами
export const selectColumnsWithTasks = createSelector(
  [selectCurrentBoardColumns],
  (columns) => columns.filter(col => col.tasks.length > 0)
);

// Получить колонки без задач
export const selectEmptyColumns = createSelector(
  [selectCurrentBoardColumns],
  (columns) => columns.filter(col => col.tasks.length === 0)
);

// ===== СЕЛЕКТОРЫ ЗАДАЧ =====

// Получить все задачи текущей доски
export const selectAllTasks = createSelector(
  [selectCurrentBoardColumns],
  (columns) => columns.flatMap(col => col.tasks)
);

// Получить задачу по ID
export const selectTaskById = createSelector(
  [selectAllTasks, (_state: RootState, taskId: string) => taskId],
  (tasks, taskId) => tasks.find(task => task.id === taskId)
);
