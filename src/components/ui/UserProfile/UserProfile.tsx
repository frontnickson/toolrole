import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import styles from './UserProfile.module.scss';

interface UserProfileProps {
  className?: string;
}

const UserProfile: React.FC<UserProfileProps> = ({ className }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, logout, isLoading } = useAuth();
  const navigate = useNavigate();

  // Закрываем dropdown при клике вне его
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        // Добавляем небольшую задержку, чтобы не мешать кнопкам внутри меню
        setTimeout(() => {
          setIsDropdownOpen(false);
        }, 100);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleProfileClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    console.log('🚪 Выход из системы - начало');
    console.log('🚪 Функция handleLogout вызвана!');
    console.log('🚪 Текущее состояние dropdown:', isDropdownOpen);
    
    try {
      // Сначала выполняем logout, а потом закрываем dropdown
      if (typeof logout === 'function') {
        console.log('🚪 Выполняем logout...');
        logout();
        console.log('🚪 Logout выполнен');
        
        // Переходим на landing
        console.log('🚪 Переходим на landing...');
        navigate('/');
      } else {
        console.error('🚪 logout не является функцией!');
      }
      
      // Закрываем dropdown после выполнения logout
      setIsDropdownOpen(false);
      
    } catch (error) {
      console.error('🚪 Ошибка при выходе:', error);
      // Fallback
      window.location.href = '/';
    }
  };

  const handleSettings = () => {
    try {
      navigate('/profile/settings');
      setIsDropdownOpen(false);
    } catch (error) {
      console.error('⚙️ Ошибка при переходе в настройки:', error);
    }
  };

  const handleProfile = () => {
    try {
      // Пробуем разные способы навигации
      if (typeof navigate === 'function') {
        navigate('/profile');
      } else {
        // Альтернативный способ - через window.location
        window.location.href = '/profile';
      }

      setIsDropdownOpen(false);
    } catch (error) {
      console.error('👤 Ошибка при переходе в профиль:', error);
      // Fallback - прямой переход
      window.location.href = '/profile';
    }
  };

  const handleSubscription = () => {
    try {
      navigate('/profile/subscription');
      setIsDropdownOpen(false);
    } catch (error) {
      console.error('💎 Ошибка при переходе в подписку:', error);
    }
  };

  const handleNotifications = () => {
    try {
      navigate('/profile/notifications');
      setIsDropdownOpen(false);
    } catch (error) {
      console.error('🔔 Ошибка при переходе в уведомления:', error);
    }
  };

  const handleHelp = () => {
    try {
      navigate('/profile/help');
      setIsDropdownOpen(false);
    } catch (error) {
      console.error('🆘 Ошибка при переходе в помощь:', error);
    }
  };

  // Получаем имя пользователя из разных источников
  const getUserName = () => {
    if (user?.full_name) return user.full_name;
    if (user?.username) return user.username;
    if (user?.email) return user.email.split('@')[0];
    return 'Пользователь';
  };

  // Получаем аватар пользователя
  const getUserAvatar = () => {
    if (user?.avatar_url) return user.avatar_url;
    return getUserName().charAt(0).toUpperCase();
  };

  // Показываем состояние загрузки
  if (isLoading) {
    return (
      <div className={`${styles.userProfile} ${className || ''}`}>
        <div className={styles.loading}>Загрузка...</div>
      </div>
    );
  }

  // Если пользователь не авторизован, показываем кнопку входа
  if (!user) {
    return (
      <div className={`${styles.userProfile} ${className || ''}`}>
        <button 
          className={styles.loginButton}
          onClick={() => navigate('/auth')}
        >
          <span className={styles.loginIcon}>🔐</span>
          Войти
        </button>
      </div>
    );
  }

  return (
    <div className={`${styles.userProfile} ${className || ''}`}>
      <div
        className={styles.profileButton}
        onClick={handleProfileClick}
        ref={dropdownRef}
      >
        <div className={styles.avatar}>
          {user?.avatar_url ? (
            <img src={user.avatar_url} alt="Avatar" />
          ) : (
            <span>{getUserAvatar()}</span>
          )}
        </div>

        <div className={styles.userInfo}>
          <span className={styles.userName}>{getUserName()}</span>
          <span className={styles.userStatus}>Онлайн</span>
        </div>

        <div className={`${styles.dropdownIcon} ${isDropdownOpen ? styles.rotated : ''}`}>
          ▼
        </div>
      </div>

      {isDropdownOpen && (
        <div className={styles.dropdownMenu}>
          <div className={styles.menuHeader}>
            <div className={styles.menuAvatar}>
              {user?.avatar_url ? (
                <img src={user.avatar_url} alt="Avatar" />
              ) : (
                <span>{getUserAvatar()}</span>
              )}
            </div>
            <div className={styles.menuUserInfo}>
              <span className={styles.menuUserName}>{getUserName()}</span>
              <span className={styles.menuUserEmail}>{user?.email || 'email@example.com'}</span>
            </div>
          </div>

          <div className={styles.menuDivider}></div>

          <div className={styles.menuItems}>
            <button className={styles.menuItem} onClick={handleProfile}>
              <span className={styles.menuIcon}>👤</span>
              Профиль
            </button>

            <button className={styles.menuItem} onClick={handleSettings}>
              <span className={styles.menuIcon}>⚙️</span>
              Настройки
            </button>

            <button className={styles.menuItem} onClick={handleSubscription}>
              <span className={styles.menuIcon}>💎</span>
              Подписка
            </button>

            <button className={styles.menuItem} onClick={handleNotifications}>
              <span className={styles.menuIcon}>🔔</span>
              Уведомления
            </button>

            <button className={styles.menuItem} onClick={handleHelp}>
              <span className={styles.menuIcon}>🆘</span>
              Помощь
            </button>
          </div>

          <div className={styles.menuDivider}></div>

          <button className={`${styles.menuItem} ${styles.logoutButton}`} onClick={() => {
            console.log('🚪 Кнопка Выйти кликнута!');
            handleLogout();
          }}>
            <span className={styles.menuIcon}>🚪</span>
            Выйти
          </button>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
