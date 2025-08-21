import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './Button.module.scss';

interface BackButtonProps {
  className?: string;
  children?: React.ReactNode;
  fallbackPath?: string;
}

const BackButton: React.FC<BackButtonProps> = ({ 
  className, 
  children = '← Назад',
  fallbackPath = '/'
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleSmartBack = () => {
    const path = location.pathname;
    
    // Логика навигации в зависимости от текущей страницы
    if (path.startsWith('/profile/') && path !== '/profile') {
      // Если мы на подстранице профиля, идем на главную страницу профиля
      navigate('/todo');
    } else if (path === '/profile') {
      // Если мы на главной странице профиля, идем на главную страницу приложения
      navigate('/todo');
    } else if (path.startsWith('/todo/')) {
      // Если мы на подстранице todo, идем на главную страницу todo
      navigate('/todo');
    } else {
      // Для всех остальных случаев используем fallback
      navigate(fallbackPath);
    }
  };

  return (
    <button
      className={`${styles.btn} ${styles['btn--secondary']} ${styles['btn--sm']} ${styles['btn--back']} ${className || ''}`}
      onClick={handleSmartBack}
    >
      {children}
    </button>
  );
};

export default BackButton;
