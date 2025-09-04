import { apiService } from './index';
import type { ExtendedUser } from '../../types/user';

// Интерфейс для обновления профиля
export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  middleName?: string;
  bio?: string;
  phoneNumber?: string;
  country?: string;
  city?: string;
  occupation?: string;
  profession?: string;
  company?: string;
  website?: string;
  avatarUrl?: string;
}

// Интерфейс для обновления настроек
export interface UpdateSettingsData {
  theme?: 'light' | 'dark' | 'auto';
  language?: 'en' | 'ru';
  emailNotifications?: boolean;
  pushNotifications?: boolean;
  desktopNotifications?: boolean;
}

// Интерфейс для загрузки аватара
export interface UploadAvatarResponse {
  avatarUrl: string;
  message: string;
}

// Получение профиля пользователя
export const getUserProfile = async (): Promise<ExtendedUser> => {
  try {
    const response = await apiService.get<ExtendedUser>('/users/profile');
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Не удалось получить профиль пользователя');
    }
    return response.data;
  } catch (error) {
    console.error('Ошибка при получении профиля пользователя:', error);
    throw new Error('Не удалось получить профиль пользователя');
  }
};

// Обновление профиля пользователя
export const updateUserProfile = async (data: UpdateProfileData): Promise<ExtendedUser> => {
  try {
    const response = await apiService.put<ExtendedUser>('/users/profile', data);
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Не удалось обновить профиль');
    }
    return response.data;
  } catch (error) {
    console.error('Ошибка при обновлении профиля:', error);
    throw new Error('Не удалось обновить профиль');
  }
};

// Обновление настроек пользователя
export const updateUserSettings = async (data: UpdateSettingsData): Promise<ExtendedUser> => {
  try {
    const response = await apiService.put<ExtendedUser>('/users/settings', data);
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Не удалось обновить настройки');
    }
    return response.data;
  } catch (error) {
    console.error('Ошибка при обновлении настроек:', error);
    throw new Error('Не удалось обновить настройки');
  }
};

// Загрузка аватара пользователя
export const uploadUserAvatar = async (file: File): Promise<UploadAvatarResponse> => {
  try {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await apiService.post<UploadAvatarResponse>('/users/avatar', formData);
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Не удалось загрузить аватар');
    }
    return response.data;
  } catch (error) {
    console.error('Ошибка при загрузке аватара:', error);
    throw new Error('Не удалось загрузить аватар');
  }
};

// Удаление аватара пользователя
export const deleteUserAvatar = async (): Promise<void> => {
  try {
    await apiService.delete('/users/avatar');
  } catch (error) {
    console.error('Ошибка при удалении аватара:', error);
    throw new Error('Не удалось удалить аватар');
  }
};

// Отправка тестового email
export const sendTestEmail = async (email: string): Promise<{ message: string }> => {
  try {
    const response = await apiService.post<{ message: string }>('/users/send-test-email', { email });
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Не удалось отправить тестовый email');
    }
    return response.data;
  } catch (error) {
    console.error('Ошибка при отправке тестового email:', error);
    throw new Error('Не удалось отправить тестовый email');
  }
};

// Получение статистики пользователя
export const getUserStats = async (): Promise<{
  totalTasks: number;
  completedTasks: number;
  totalBoards: number;
  totalTeams: number;
  lastActivity: string;
}> => {
  try {
    const response = await apiService.get<{
      totalTasks: number;
      completedTasks: number;
      totalBoards: number;
      totalTeams: number;
      lastActivity: string;
    }>('/users/stats');
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Не удалось получить статистику');
    }
    return response.data;
  } catch (error) {
    console.error('Ошибка при получении статистики пользователя:', error);
    throw new Error('Не удалось получить статистику');
  }
};

// Изменение пароля
export const changePassword = async (data: {
  currentPassword: string;
  newPassword: string;
}): Promise<{ message: string }> => {
  try {
    const response = await apiService.put<{ message: string }>('/users/change-password', data);
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Не удалось изменить пароль');
    }
    return response.data;
  } catch (error) {
    console.error('Ошибка при изменении пароля:', error);
    throw new Error('Не удалось изменить пароль');
  }
};

// Экспорт пользователей (для администраторов)
export const exportUsers = async (format: 'csv' | 'json' = 'csv'): Promise<Blob> => {
  try {
    const response = await apiService.get<Blob>(`/users/export?format=${format}`);
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Не удалось экспортировать пользователей');
    }
    return response.data;
  } catch (error) {
    console.error('Ошибка при экспорте пользователей:', error);
    throw new Error('Не удалось экспортировать пользователей');
  }
};

// Получение списка пользователей (для администраторов)
export const getUsersList = async (): Promise<{
  users: ExtendedUser[];
  total: number;
  page: number;
  limit: number;
}> => {
  try {
    const response = await apiService.get<{
      users: ExtendedUser[];
      total: number;
      page: number;
      limit: number;
    }>('/users');
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Не удалось получить список пользователей');
    }
    return response.data;
  } catch (error) {
    console.error('Ошибка при получении списка пользователей:', error);
    throw new Error('Не удалось получить список пользователей');
  }
};

// Блокировка/разблокировка пользователя (для администраторов)
export const toggleUserStatus = async (userId: number, isActive: boolean): Promise<ExtendedUser> => {
  try {
    const response = await apiService.put<ExtendedUser>(`/users/${userId}/status`, { isActive });
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Не удалось изменить статус пользователя');
    }
    return response.data;
  } catch (error) {
    console.error('Ошибка при изменении статуса пользователя:', error);
    throw new Error('Не удалось изменить статус пользователя');
  }
};

// Удаление пользователя (для администраторов)
export const deleteUser = async (userId: number): Promise<{ message: string }> => {
  try {
    const response = await apiService.delete<{ message: string }>(`/users/${userId}`);
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Не удалось удалить пользователя');
    }
    return response.data;
  } catch (error) {
    console.error('Ошибка при удалении пользователя:', error);
    throw new Error('Не удалось удалить пользователя');
  }
};
