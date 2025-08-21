import type { ExtendedUser } from './user';
import type { Board, BoardTemplate } from './board';

// Состояние пользователя (теперь определено в userSlice)
export interface UserState {
  // Основные данные пользователя
  currentUser: ExtendedUser | null;
  
  // Статус аутентификации
  isAuthenticated: boolean;
  
  // Статус загрузки
  isLoading: boolean;
  
  // Ошибки
  error: string | null;
  
  // Временные данные для форм (не сохраняются в store)
  tempUserData: Partial<ExtendedUser>;
}

// Состояние досок
export interface BoardState {
  boards: Board[];
  currentBoard: Board | null;
  isLoading: boolean;
  error: string | null;
  templates: BoardTemplate[];
}
