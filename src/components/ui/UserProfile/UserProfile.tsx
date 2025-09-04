import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useAuth } from '../../../hooks/useAuth';
import type { RootState } from '../../../store';
import { useTranslation } from '../../../utils/translations';
import styles from './UserProfile.module.scss';

interface UserProfileProps {
  className?: string;
  onOpenProfile?: () => void;
  onOpenSettings?: () => void;
  onOpenSubscription?: () => void;
  onOpenHelp?: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ 
  className, 
  onOpenProfile, 
  onOpenSettings, 
  onOpenSubscription, 
  onOpenHelp 
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, logout, isLoading } = useAuth();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state: RootState) => state.user);
  
  // Переводы
  const { t } = useTranslation(currentUser?.language || 'ru');

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

  const handleLogout = async () => {
    try {
      setIsDropdownOpen(false);
      
      if (logout) {
        await logout();
      }
    } catch (error) {
      // Обработка ошибки
    }
  };

  const handleSettings = () => {
    if (onOpenSettings) {
      onOpenSettings();
    } else {
      try {
        navigate('/profile/settings');
      } catch (error) {
        console.error('⚙️ Ошибка при переходе в настройки:', error);
      }
    }
    setIsDropdownOpen(false);
  };

  const handleProfile = () => {
    if (onOpenProfile) {
      onOpenProfile();
    } else {
      try {
        if (typeof navigate === 'function') {
          navigate('/profile');
        } else {
          window.location.href = '/profile';
        }
      } catch (error) {
        console.error('👤 Ошибка при переходе в профиль:', error);
        window.location.href = '/profile';
      }
    }
    setIsDropdownOpen(false);
  };

  const handleSubscription = () => {
    if (onOpenSubscription) {
      onOpenSubscription();
    } else {
      try {
        navigate('/profile/subscription');
      } catch (error) {
        console.error('💎 Ошибка при переходе в подписку:', error);
      }
    }
    setIsDropdownOpen(false);
  };

  const handleHelp = () => {
    if (onOpenHelp) {
      onOpenHelp();
    } else {
      try {
        navigate('/profile/help');
      } catch (error) {
        console.error('🆘 Ошибка при переходе в помощь:', error);
      }
    }
    setIsDropdownOpen(false);
  };

  // Получаем имя пользователя из разных источников
  const getUserName = () => {
    if (user?.fullName) return user.fullName;
    if (user?.username) return user.username;
    if (user?.email) return user.email.split('@')[0];
    return t('user.user');
  };

  // Получаем аватар пользователя
  const getUserAvatar = () => {
    if (user?.avatarUrl) return user.avatarUrl;
    return getUserName().charAt(0).toUpperCase();
  };

  // Показываем состояние загрузки
  if (isLoading) {
    return (
      <div className={`${styles.userProfile} ${className || ''}`}>
        <div className={styles.loading}>{t('user.loading')}</div>
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
          {t('user.login')}
        </button>
      </div>
    );
  }

  return (
    <div className={`${styles.userProfile} ${className || ''}`}>
      <div
        className={styles.profileButton}
        onClick={handleProfileClick}
      >
        <div className={styles.avatar}>
          {user?.avatarUrl ? (
            <img src={user.avatarUrl} alt="Avatar" />
          ) : (
            <span>{getUserAvatar()}</span>
          )}
        </div>

        <div className={styles.userInfo}>
          <span className={styles.userName}>{getUserName()}</span>
          <span className={styles.userStatus}>{t('user.online')}</span>
        </div>

        <div className={`${styles.dropdownIcon} ${isDropdownOpen ? styles.rotated : ''}`}>
          ▼
        </div>
      </div>

      {isDropdownOpen && (
        <div 
          className={styles.dropdownMenu}
          ref={dropdownRef}
        >
          <div className={styles.menuItems}>
            <button className={styles.menuItem} onClick={handleProfile}>
              <span className={styles.menuIcon}>👤</span>
              {t('user.profile')}
            </button>

            <button className={styles.menuItem} onClick={handleSettings}>
              <span className={styles.menuIcon}>⚙️</span>
              {t('user.settings')}
            </button>

            <button className={styles.menuItem} onClick={handleSubscription}>
              <span className={styles.menuIcon}>💎</span>
              {t('user.subscription')}
            </button>

            <button className={styles.menuItem} onClick={handleHelp}>
              <span className={styles.menuIcon}>🆘</span>
              {t('user.help')}
            </button>
          </div>

          <div className={styles.menuDivider}></div>

          <button
            onClick={handleLogout}
            className={styles.logoutButton}
          >
            <span className={styles.menuIcon}>🚪</span>
            {t('user.logout')}
          </button>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
