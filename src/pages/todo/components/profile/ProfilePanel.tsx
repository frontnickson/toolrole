import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../../../store';
import { updateUserProfile } from '../../../../store/slices/userSlice';
import { updateUserProfile as updateProfileAPI, uploadUserAvatar } from '../../../../services/api/users';
import styles from './ProfilePanel.module.scss';

interface ProfilePanelProps {
  onClose: () => void;
}

const ProfilePanel: React.FC<ProfilePanelProps> = ({ onClose }) => {
  
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: RootState) => state.user);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Состояние для редактирования
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tempData, setTempData] = useState({
    firstName: currentUser?.firstName || '',
    lastName: currentUser?.lastName || '',
    middleName: currentUser?.middleName || '',
    bio: currentUser?.bio || '',
    phoneNumber: currentUser?.phoneNumber || '',
    country: currentUser?.country || '',
    city: currentUser?.city || '',
    occupation: currentUser?.occupation || '',
    company: currentUser?.company || '',
    website: currentUser?.website || '',
  });

  // Обновляем временные данные при изменении currentUser
  useEffect(() => {
    if (currentUser) {
      setTempData({
        firstName: currentUser.firstName || '',
        lastName: currentUser.lastName || '',
        middleName: currentUser.middleName || '',
        bio: currentUser.bio || '',
        phoneNumber: currentUser.phoneNumber || '',
        country: currentUser.country || '',
        city: currentUser.city || '',
        occupation: currentUser.occupation || '',
        company: currentUser.company || '',
        website: currentUser.website || '',
      });
    }
  }, [currentUser]);

  // Обработчик изменения полей формы
  const handleInputChange = (field: string, value: string) => {
    setTempData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Обработчик загрузки фото
  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Проверяем размер файла (максимум 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Размер файла не должен превышать 5MB');
      return;
    }

    // Проверяем тип файла
    if (!file.type.startsWith('image/')) {
      alert('Пожалуйста, выберите изображение');
      return;
    }

    setIsLoading(true);
    try {
      // Отправляем файл на сервер
      const response = await uploadUserAvatar(file);
      
      // Обновляем аватар в store
      dispatch(updateUserProfile({ avatarUrl: response.avatarUrl }));
      
      alert('Фото успешно загружено!');
    } catch (error) {
      console.error('Ошибка при загрузке фото:', error);
      
      // Обрабатываем различные типы ошибок
      let errorMessage = 'Ошибка при загрузке фото. Попробуйте еще раз.';
      
      if (error instanceof Error) {
        if (error.message.includes('401')) {
          errorMessage = 'Сессия истекла. Пожалуйста, войдите в систему заново.';
        } else if (error.message.includes('413')) {
          errorMessage = 'Файл слишком большой. Максимальный размер: 5MB.';
        } else if (error.message.includes('415')) {
          errorMessage = 'Неподдерживаемый формат файла. Выберите изображение.';
        } else if (error.message.includes('500')) {
          errorMessage = 'Ошибка сервера. Попробуйте позже.';
        } else {
          errorMessage = `Ошибка: ${error.message}`;
        }
      }
      
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Обработчик сохранения изменений
  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Отладочная информация
      console.log('🔍 ProfilePanel: currentUser:', currentUser);
      console.log('🔍 ProfilePanel: accessToken:', currentUser?.accessToken);
      console.log('🔍 ProfilePanel: tempData:', tempData);
      
      // Отправляем изменения на сервер
      const updatedUser = await updateProfileAPI(tempData);
      
      // Обновляем профиль в store
      dispatch(updateUserProfile(updatedUser));
      
      setIsEditing(false);
      alert('Профиль успешно обновлен!');
    } catch (error) {
      console.error('Ошибка при обновлении профиля:', error);
      
      // Обрабатываем различные типы ошибок
      let errorMessage = 'Ошибка при обновлении профиля. Попробуйте еще раз.';
      
      if (error instanceof Error) {
        if (error.message.includes('401')) {
          errorMessage = 'Сессия истекла. Пожалуйста, войдите в систему заново.';
        } else if (error.message.includes('403')) {
          errorMessage = 'Недостаточно прав для обновления профиля.';
        } else if (error.message.includes('404')) {
          errorMessage = 'Профиль не найден.';
        } else if (error.message.includes('500')) {
          errorMessage = 'Ошибка сервера. Попробуйте позже.';
        } else {
          errorMessage = `Ошибка: ${error.message}`;
        }
      }
      
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Обработчик отмены изменений
  const handleCancel = () => {
    setTempData({
      firstName: currentUser?.firstName || '',
      lastName: currentUser?.lastName || '',
      middleName: currentUser?.middleName || '',
      bio: currentUser?.bio || '',
      phoneNumber: currentUser?.phoneNumber || '',
      country: currentUser?.country || '',
      city: currentUser?.city || '',
      occupation: currentUser?.occupation || '',
      company: currentUser?.company || '',
      website: currentUser?.website || '',
    });
    setIsEditing(false);
  };

  // Получаем имя пользователя для отображения
  const getDisplayName = () => {
    if (currentUser?.firstName && currentUser?.lastName) {
      return `${currentUser.firstName} ${currentUser.lastName}`;
    }
    if (currentUser?.fullName) {
      return currentUser.fullName;
    }
    if (currentUser?.username) {
      return currentUser.username;
    }
    return 'Пользователь';
  };

  // Получаем аватар пользователя
  const getAvatar = () => {
    if (currentUser?.avatarUrl) {
      return currentUser.avatarUrl;
    }
    return getDisplayName().charAt(0).toUpperCase();
  };

  if (!currentUser) {
    return (
      <div className={styles.profilePanel}>
        <div className={styles.header}>
          <h2>Профиль пользователя</h2>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>
        <div className={styles.content}>
          <p>Пользователь не найден</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.profilePanel}>
      <div className={styles.header}>
        <h2>Профиль пользователя</h2>
        <button className={styles.closeBtn} onClick={onClose}>✕</button>
      </div>
      
      <div className={styles.content}>
        {/* Секция аватара и основной информации */}
        <div className={styles.profileSection}>
          <div className={styles.avatarSection}>
            <div className={styles.avatarContainer}>
              <div className={styles.avatar}>
                {currentUser.avatarUrl ? (
                  <img src={currentUser.avatarUrl} alt="Avatar" />
                ) : (
                  <span>{getAvatar()}</span>
                )}
                {isLoading && <div className={styles.avatarLoader}>⏳</div>}
              </div>
              <button 
                className={styles.uploadBtn}
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
              >
                📷
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                style={{ display: 'none' }}
              />
            </div>
            <div className={styles.userInfo}>
              <h3>{getDisplayName()}</h3>
              <p className={styles.email}>{currentUser.email}</p>
              <span className={`${styles.status} ${currentUser.isOnline ? styles.online : styles.offline}`}>
                {currentUser.isOnline ? '🟢 Онлайн' : '🔴 Офлайн'}
              </span>
              {currentUser.lastSeen && (
                <p className={styles.lastSeen}>
                  Последний раз: {new Date(currentUser.lastSeen).toLocaleString('ru-RU')}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Секция личной информации */}
        <div className={styles.infoSection}>
          <div className={styles.sectionHeader}>
            <h4>Личная информация</h4>
            <button 
              className={styles.editBtn}
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? '✕' : '✏️'}
            </button>
          </div>
          
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <label>Имя *</label>
              {isEditing ? (
                <input
                  type="text"
                  value={tempData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  placeholder="Введите имя"
                />
              ) : (
                <span>{currentUser.firstName || 'Не указано'}</span>
              )}
            </div>
            
            <div className={styles.infoItem}>
              <label>Фамилия *</label>
              {isEditing ? (
                <input
                  type="text"
                  value={tempData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  placeholder="Введите фамилию"
                />
              ) : (
                <span>{currentUser.lastName || 'Не указано'}</span>
              )}
            </div>
            
            <div className={styles.infoItem}>
              <label>Отчество</label>
              {isEditing ? (
                <input
                  type="text"
                  value={tempData.middleName}
                  onChange={(e) => handleInputChange('middleName', e.target.value)}
                  placeholder="Введите отчество"
                />
              ) : (
                <span>{currentUser.middleName || 'Не указано'}</span>
              )}
            </div>
            
            <div className={styles.infoItem}>
              <label>Email</label>
              <span className={styles.readonly}>{currentUser.email}</span>
            </div>
            
            <div className={styles.infoItem}>
              <label>Телефон</label>
              {isEditing ? (
                <input
                  type="tel"
                  value={tempData.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  placeholder="+7 (999) 123-45-67"
                />
              ) : (
                <span>{currentUser.phoneNumber || 'Не указано'}</span>
              )}
            </div>
            
            <div className={styles.infoItem}>
              <label>Страна</label>
              {isEditing ? (
                <input
                  type="text"
                  value={tempData.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  placeholder="Введите страну"
                />
              ) : (
                <span>{currentUser.country || 'Не указано'}</span>
              )}
            </div>
            
            <div className={styles.infoItem}>
              <label>Город</label>
              {isEditing ? (
                <input
                  type="text"
                  value={tempData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="Введите город"
                />
              ) : (
                <span>{currentUser.city || 'Не указано'}</span>
              )}
            </div>
            
            <div className={styles.infoItem}>
              <label>Профессия</label>
              {isEditing ? (
                <input
                  type="text"
                  value={tempData.occupation}
                  onChange={(e) => handleInputChange('occupation', e.target.value)}
                  placeholder="Введите профессию"
                />
              ) : (
                <span>{currentUser.occupation || 'Не указано'}</span>
              )}
            </div>
            
            <div className={styles.infoItem}>
              <label>Компания</label>
              {isEditing ? (
                <input
                  type="text"
                  value={tempData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  placeholder="Введите название компании"
                />
              ) : (
                <span>{currentUser.company || 'Не указано'}</span>
              )}
            </div>
            
            <div className={styles.infoItem}>
              <label>Веб-сайт</label>
              {isEditing ? (
                <input
                  type="url"
                  value={tempData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  placeholder="https://example.com"
                />
              ) : (
                <span>{currentUser.website || 'Не указано'}</span>
              )}
            </div>
          </div>
          
          <div className={styles.infoItem}>
            <label>О себе</label>
            {isEditing ? (
              <textarea
                value={tempData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                placeholder="Расскажите о себе..."
                rows={3}
              />
            ) : (
              <span>{currentUser.bio || 'Не указано'}</span>
            )}
          </div>
        </div>

        {/* Секция статистики */}
        <div className={styles.statsSection}>
          <h4>Статистика</h4>
          <div className={styles.statsGrid}>
            <div className={styles.statItem}>
              <span className={styles.statValue}>{currentUser.teams.length}</span>
              <span className={styles.statLabel}>Команд</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>{currentUser.friends.length}</span>
              <span className={styles.statLabel}>Друзей</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>{currentUser.unreadNotificationsCount}</span>
              <span className={styles.statLabel}>Уведомлений</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>
                {new Date(currentUser.createdAt).getFullYear()}
              </span>
              <span className={styles.statLabel}>Год регистрации</span>
            </div>
          </div>
        </div>

        {/* Секция действий */}
        {isEditing && (
          <div className={styles.actionsSection}>
            <button 
              className={styles.saveBtn}
              onClick={handleSave}
              disabled={isLoading}
            >
              {isLoading ? 'Сохранение...' : '💾 Сохранить изменения'}
            </button>
            <button 
              className={styles.cancelBtn}
              onClick={handleCancel}
              disabled={isLoading}
            >
              ❌ Отмена
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePanel;
