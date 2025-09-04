import { apiService } from './index';
import type { Board } from '../../types/board';
import type { ApiResponse } from '../../types';

/**
 * API сервис для работы с досками
 */
export const boardsApi = {
  /**
   * Получить все доски пользователя
   */
  async getUserBoards(): Promise<ApiResponse<Board[]>> {
    console.log('📋 boardsApi: Запрашиваем доски пользователя...');
    const response = await apiService.get<Board[]>('/boards');
    console.log('📋 boardsApi: Получен ответ:', response);
    return response;
  },

  /**
   * Получить доску по ID
   */
  async getBoard(boardId: string): Promise<ApiResponse<Board>> {
    return apiService.get<Board>(`/boards/${boardId}`);
  },

  /**
   * Создать новую доску
   */
  async createBoard(boardData: Partial<Board>): Promise<ApiResponse<Board>> {
    return apiService.post<Board>('/boards', boardData);
  },

  /**
   * Обновить доску
   */
  async updateBoard(boardId: string, updates: Partial<Board>): Promise<ApiResponse<Board>> {
    return apiService.put<Board>(`/boards/${boardId}`, updates);
  },

  /**
   * Удалить доску
   */
  async deleteBoard(boardId: string): Promise<ApiResponse<{ message: string }>> {
    console.log('🗑️ boardsApi: Удаляем доску с ID:', boardId);
    return apiService.delete<{ message: string }>(`/boards/${boardId}`);
  },

  /**
   * Переключить статус избранного
   */
  async toggleFavorite(boardId: string): Promise<ApiResponse<Board>> {
    return apiService.patch<Board>(`/boards/${boardId}/toggle-favorite`);
  },

  /**
   * Получить статистику доски
   */
  async getBoardStatistics(boardId: string): Promise<ApiResponse<any>> {
    return apiService.get<any>(`/boards/${boardId}/statistics`);
  },

  /**
   * Добавить участника на доску
   */
  async addBoardMember(boardId: string, memberData: { userId: string; role: string }): Promise<ApiResponse<any>> {
    return apiService.post<any>(`/boards/${boardId}/members`, memberData);
  },

  /**
   * Удалить участника с доски
   */
  async removeBoardMember(boardId: string, memberId: string): Promise<ApiResponse<{ message: string }>> {
    return apiService.delete<{ message: string }>(`/boards/${boardId}/members/${memberId}`);
  },

  /**
   * Обновить роль участника
   */
  async updateMemberRole(boardId: string, memberId: string, role: string): Promise<ApiResponse<any>> {
    return apiService.patch<any>(`/boards/${boardId}/members/${memberId}`, { role });
  }
};
