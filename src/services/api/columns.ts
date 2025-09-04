import { apiService } from './index';
import type { Column } from '../../types/board';
import type { ApiResponse } from '../../types';

/**
 * API сервис для работы с колонками
 */
export const columnsApi = {
  /**
   * Создать новую колонку
   */
  async createColumn(boardId: string, columnData: Partial<Column>): Promise<ApiResponse<Column>> {
    return apiService.post<Column>(`/boards/${boardId}/columns`, columnData);
  },

  /**
   * Обновить колонку
   */
  async updateColumn(boardId: string, columnId: string, updates: Partial<Column>): Promise<ApiResponse<Column>> {
    return apiService.put<Column>(`/boards/${boardId}/columns/${columnId}`, updates);
  },

  /**
   * Удалить колонку
   */
  async deleteColumn(boardId: string, columnId: string): Promise<ApiResponse<{ message: string }>> {
    return apiService.delete<{ message: string }>(`/boards/${boardId}/columns/${columnId}`);
  }
};

