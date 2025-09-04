import { apiService } from './index';
import type { Task, TaskStatus, TaskPriority } from '../../types/board';
import type { ApiResponse } from '../../types';

/**
 * API сервис для работы с задачами
 */
export const tasksApi = {
  /**
   * Получить все задачи пользователя
   */
  async getUserTasks(): Promise<ApiResponse<Task[]>> {
    return apiService.get<Task[]>('/tasks');
  },

  /**
   * Получить задачи по доске
   */
  async getBoardTasks(boardId: string): Promise<ApiResponse<Task[]>> {
    return apiService.get<Task[]>(`/boards/${boardId}/tasks`);
  },

  /**
   * Получить задачу по ID
   */
  async getTask(taskId: string): Promise<ApiResponse<Task>> {
    return apiService.get<Task>(`/tasks/${taskId}`);
  },

  /**
   * Создать новую задачу
   */
  async createTask(taskData: Partial<Task>): Promise<ApiResponse<Task>> {
    return apiService.post<Task>('/tasks', taskData);
  },

  /**
   * Обновить задачу
   */
  async updateTask(taskId: string, updates: Partial<Task>): Promise<ApiResponse<Task>> {
    return apiService.put<Task>(`/tasks/${taskId}`, updates);
  },

  /**
   * Удалить задачу
   */
  async deleteTask(taskId: string): Promise<ApiResponse<{ message: string }>> {
    return apiService.delete<{ message: string }>(`/tasks/${taskId}`);
  },

  /**
   * Переместить задачу между колонками
   */
  async moveTask(taskId: string, data: { 
    fromColumnId: string; 
    toColumnId: string; 
    newStatus: TaskStatus;
    newOrder?: number;
  }): Promise<ApiResponse<Task>> {
    return apiService.patch<Task>(`/tasks/${taskId}/move`, data);
  },

  /**
   * Изменить статус задачи
   */
  async changeTaskStatus(taskId: string, newStatus: TaskStatus): Promise<ApiResponse<Task>> {
    return apiService.patch<Task>(`/tasks/${taskId}/status`, { status: newStatus });
  },

  /**
   * Изменить приоритет задачи
   */
  async changeTaskPriority(taskId: string, newPriority: TaskPriority): Promise<ApiResponse<Task>> {
    return apiService.patch<Task>(`/tasks/${taskId}/priority`, { priority: newPriority });
  },

  /**
   * Назначить исполнителя
   */
  async assignTask(taskId: string, assigneeId: string): Promise<ApiResponse<Task>> {
    return apiService.patch<Task>(`/tasks/${taskId}/assign`, { assigneeId });
  },

  /**
   * Снять назначение
   */
  async unassignTask(taskId: string): Promise<ApiResponse<Task>> {
    return apiService.patch<Task>(`/tasks/${taskId}/unassign`);
  },

  /**
   * Добавить подзадачу
   */
  async addSubtask(taskId: string, subtaskData: Partial<Task>): Promise<ApiResponse<Task>> {
    return apiService.post<Task>(`/tasks/${taskId}/subtasks`, subtaskData);
  },

  /**
   * Добавить комментарий к задаче
   */
  async addComment(taskId: string, commentData: { content: string }): Promise<ApiResponse<any>> {
    return apiService.post<any>(`/tasks/${taskId}/comments`, commentData);
  },

  /**
   * Добавить вложение к задаче
   */
  async addAttachment(taskId: string, file: File): Promise<ApiResponse<any>> {
    const formData = new FormData();
    formData.append('file', file);
    return apiService.post<any>(`/tasks/${taskId}/attachments`, formData);
  },

  /**
   * Получить статистику задач пользователя
   */
  async getUserTaskStatistics(): Promise<ApiResponse<any>> {
    return apiService.get<any>('/tasks/statistics');
  },

  /**
   * Получить статистику задач по доске
   */
  async getBoardTaskStatistics(boardId: string): Promise<ApiResponse<any>> {
    return apiService.get<any>(`/boards/${boardId}/tasks/statistics`);
  }
};
