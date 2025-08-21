import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Board } from '../../types';
import type { BoardState } from '../../types/state';

// ===== НАЧАЛЬНОЕ СОСТОЯНИЕ =====

const initialState: BoardState = {
  boards: [],
  currentBoard: null,
  templates: [],
  isLoading: false,
  error: null,
};

// ===== BOARD SLICE =====

const boardSlice = createSlice({
  name: 'boards',
  initialState,
  reducers: {
    // ===== УПРАВЛЕНИЕ ДОСКАМИ =====
    
    // Установка текущей доски
    setCurrentBoard: (state, action: PayloadAction<Board | null>) => {
      state.currentBoard = action.payload;
    },

    // Добавление новой доски
    addBoard: (state, action: PayloadAction<Board>) => {
      const board = action.payload;
      state.boards.push(board);
    },

    // Переключение статуса избранного
    toggleFavorite: (state, action: PayloadAction<string>) => {
      const boardId = action.payload;
      const board = state.boards.find(b => b.id === boardId);
      if (board) {
        board.isFavorite = !board.isFavorite;
      }
    },

    // Удаление доски
    deleteBoard: (state, action: PayloadAction<string>) => {
      const boardId = action.payload;
      state.boards = state.boards.filter(b => b.id !== boardId);
      
      // Если удаляемая доска была текущей, сбрасываем currentBoard
      if (state.currentBoard?.id === boardId) {
        state.currentBoard = null;
      }
    },
  },
});

// ===== ЭКСПОРТ ДЕЙСТВИЙ =====

export const {
  // Управление досками
  setCurrentBoard,
  addBoard,
  toggleFavorite,
  deleteBoard,
} = boardSlice.actions;

export default boardSlice.reducer;

