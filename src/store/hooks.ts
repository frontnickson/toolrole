import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './index';

// Типизированные хуки для использования в компонентах
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Хуки для работы с persist
export const usePersistState = () => {
  const dispatch = useAppDispatch();
  
  // Функция для очистки всего состояния
  const clearAllState = () => {
    // Здесь можно добавить логику для очистки состояния
    console.log('🧹 Очистка всего состояния');
  };
  
  // Функция для очистки конкретного слайса
  const clearSliceState = (sliceName: string) => {
    console.log(`🧹 Очистка состояния слайса: ${sliceName}`);
  };
  
  return {
    clearAllState,
    clearSliceState,
  };
};

// Селекторы для пользователя
export const useCurrentUser = () => useAppSelector((state) => state.user.currentUser);
export const useIsAuthenticated = () => useAppSelector((state) => state.user.isAuthenticated);
export const useUserLoading = () => useAppSelector((state) => state.user.isLoading);
export const useUserError = () => useAppSelector((state) => state.user.error);
export const useUserPreferences = () => useAppSelector((state) => state.user.preferences);
export const useFriends = () => useAppSelector((state) => state.user.friends);
export const useFriendRequests = () => useAppSelector((state) => state.user.friendRequests);
export const useTeams = () => useAppSelector((state) => state.user.teams);
export const useNotifications = () => useAppSelector((state) => state.user.notifications);
export const useUnreadNotificationsCount = () => useAppSelector((state) => state.user.unreadCount);

// Селекторы для досок
export const useBoards = () => useAppSelector((state) => state.boards.boards);
export const useCurrentBoard = () => useAppSelector((state) => state.boards.currentBoard);
export const useBoardsLoading = () => useAppSelector((state) => state.boards.isLoading);
export const useBoardsError = () => useAppSelector((state) => state.boards.error);
export const useBoardTemplates = () => useAppSelector((state) => state.boards.templates);
export const useArchivedBoards = () => useAppSelector((state) => state.boards.archivedBoards);
export const useSharedBoards = () => useAppSelector((state) => state.boards.sharedBoards);

// Селекторы для текущей доски
export const useCurrentBoardColumns = () => useAppSelector((state) => state.boards.currentBoard?.columns || []);
export const useCurrentBoardMembers = () => useAppSelector((state) => state.boards.currentBoard?.members || []);
export const useCurrentBoardSettings = () => useAppSelector((state) => state.boards.currentBoard?.settings);
export const useCurrentBoardOwner = () => useAppSelector((state) => state.boards.currentBoard?.ownerId);

// Селекторы для задач (будут добавлены позже)
// export const useTasks = () => useAppSelector((state) => state.tasks.tasks);
// export const useCurrentTask = () => useAppSelector((state) => state.tasks.currentTask);
// export const useTaskFilters = () => useAppSelector((state) => state.tasks.filters);
// export const useTaskSearchQuery = () => useAppSelector((state) => state.tasks.searchQuery);

// Селекторы для UI (будут добавлены позже)
// export const useTheme = () => useAppSelector((state) => state.ui.theme);
// export const useSidebarCollapsed = () => useAppSelector((state) => state.ui.sidebarCollapsed);
// export const useModal = () => useAppSelector((state) => state.ui.modal);
// export const useToast = () => useAppSelector((state) => state.ui.toast);
// export const useLoading = () => useAppSelector((state) => state.ui.loading);
