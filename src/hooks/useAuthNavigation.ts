import { useNavigate } from 'react-router-dom';

export const useAuthNavigation = () => {
  const navigate = useNavigate();

  const navigateToTodo = () => {
    navigate('/todo');
  };

  const navigateToLogin = () => {
    navigate('/auth');
  };

  const navigateToHome = () => {
    navigate('/');
  };

  return {
    navigateToTodo,
    navigateToLogin,
    navigateToHome
  };
};
