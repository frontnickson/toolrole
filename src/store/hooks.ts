import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './index';
import { clearCurrentUser } from './slices/userSlice';
import { clearBoards } from './slices/boardSlice';

// Типизированные хуки для использования в компонентах
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Хуки для работы с persist
export const usePersistState = () => {
  // Функция для очистки всего состояния
  const clearAllState = () => {
    // Здесь можно добавить логику для очистки состояния
  };
  
  // Функция для очистки конкретного слайса
  const clearSliceState = (_sliceName: string) => {
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

// Селекторы для досок
export const useBoards = () => useAppSelector((state) => state.boards.boards);
export const useCurrentBoard = () => useAppSelector((state) => state.boards.currentBoard);
export const useBoardsLoading = () => useAppSelector((state) => state.boards.isLoading);
export const useBoardsError = () => useAppSelector((state) => state.boards.error);
export const useBoardTemplates = () => useAppSelector((state) => state.boards.templates);

export const useClearStore = () => {
  const dispatch = useAppDispatch();
  
  const clearAllStore = () => {
    dispatch(clearCurrentUser());
    dispatch(clearBoards());
  };
  
  const clearSlice = (sliceName: string) => {
    switch (sliceName) {
      case 'user':
        dispatch(clearCurrentUser());
        break;
      case 'boards':
        dispatch(clearBoards());
        break;
      default:
        break;
    }
  };
  
  return { clearAllStore, clearSlice };
};
