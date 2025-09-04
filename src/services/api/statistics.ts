import { apiService } from './index';
import type { ApiResponse } from '../../types';

/**
 * API сервис для работы со статистикой
 */
export const statisticsApi = {
  /**
   * Получить общую статистику пользователя
   */
  async getUserStatistics(): Promise<ApiResponse<any>> {
    return apiService.get<any>('/statistics/user/');
  },

  /**
   * Получить статистику по доскам
   */
  async getBoardsStatistics(): Promise<ApiResponse<any>> {
    return apiService.get<any>('/statistics/boards/');
  },

  /**
   * Получить статистику по задачам
   */
  async getTasksStatistics(): Promise<ApiResponse<any>> {
    return apiService.get<any>('/statistics/tasks/');
  },

  /**
   * Получить статистику активности
   */
  async getActivityStatistics(period?: 'day' | 'week' | 'month' | 'year'): Promise<ApiResponse<any>> {
    const params = period ? `?period=${period}` : '';
    return apiService.get<any>(`/statistics/activity/${params}`);
  },

  /**
   * Получить статистику производительности
   */
  async getPerformanceStatistics(): Promise<ApiResponse<any>> {
    return apiService.get<any>('/statistics/performance/');
  },

  /**
   * Получить статистику по времени
   */
  async getTimeStatistics(): Promise<ApiResponse<any>> {
    return apiService.get<any>('/statistics/time/');
  },

  /**
   * Получить статистику по командам
   */
  async getTeamStatistics(): Promise<ApiResponse<any>> {
    return apiService.get<any>('/statistics/teams/');
  },

  /**
   * Получить статистику по проектам
   */
  async getProjectStatistics(): Promise<ApiResponse<any>> {
    return apiService.get<any>('/statistics/projects/');
  },

  /**
   * Получить детальную статистику по конкретной доске
   */
  async getBoardDetailedStatistics(boardId: string): Promise<ApiResponse<any>> {
    return apiService.get<any>(`/statistics/boards/${boardId}/detailed/`);
  },

  /**
   * Получить статистику по конкретному пользователю в команде
   */
  async getUserTeamStatistics(userId: string): Promise<ApiResponse<any>> {
    return apiService.get<any>(`/statistics/users/${userId}/team/`);
  }
};
