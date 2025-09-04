import { useNavigate } from 'react-router-dom';

export const useAuthNavigation = () => {
  const navigate = useNavigate();

  const navigateToTodo = (mode: 'list' | 'board' | 'calendar' = 'board', boardId?: string) => {
    let path = '/todo';
    if (mode) {
      path += `/${mode}`;
      if (boardId) {
        path += `/${boardId}`;
      }
    }
    navigate(path);
  };

  const navigateToLogin = () => {
    navigate('/auth');
  };

  const navigateToHome = () => {
    navigate('/');
  };

  const navigateToSection = (section: 'inbox' | 'today' | 'home') => {
    navigate(`/todo/${section}`);
  };

  return {
    navigateToTodo,
    navigateToLogin,
    navigateToHome,
    navigateToSection
  };
};
