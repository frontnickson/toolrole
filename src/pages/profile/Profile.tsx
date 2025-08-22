import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Button, BackButton } from '../../components/ui/Button';
import styles from './Profile.module.scss';

const Profile: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    bio: ''
  });

  useEffect(() => {
    console.log('👤 Страница профиля загружена');
    console.log('👤 Данные пользователя:', user);
    
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        username: user.username || '',
        email: user.email || '',
        bio: user.bio || ''
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    // Здесь будет логика сохранения изменений
    console.log('💾 Сохранение изменений:', formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        username: user.username || '',
        email: user.email || '',
        bio: user.bio || ''
      });
    }
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className={styles.profilePage}>
        <div className={styles.container}>
          <div className={styles.loading}>Загрузка профиля...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={styles.profilePage}>
        <div className={styles.container}>
          <div className={styles.error}>Пользователь не найден</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.profilePage}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.headerTop}>
            <BackButton>На главную</BackButton>
          </div>
          <div className={styles.headerContent}>
            <h1 className={styles.title}>Профиль пользователя</h1>
            <p className={styles.subtitle}>Управляйте своими личными данными и настройками</p>
          </div>
        </header>

        <div className={styles.content}>
          <div className={styles.profileSection}>
            <div className={styles.avatarSection}>
              <div className={styles.avatar}>
                {user?.avatarUrl ? (
                  <img src={user.avatarUrl} alt="Avatar" />
                ) : (
                  <span>{user?.fullName?.charAt(0) || user?.username?.charAt(0) || 'U'}</span>
                )}
              </div>
              <Button variant="secondary" size="sm">
                Изменить фото
              </Button>
            </div>

            <div className={styles.infoSection}>
              <div className={styles.formGroup}>
                <label htmlFor="fullName" className={styles.label}>
                  Полное имя
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className={styles.input}
                    placeholder="Введите полное имя"
                  />
                ) : (
                  <div className={styles.value}>{user?.fullName || 'Не указано'}</div>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="username" className={styles.label}>
                  Имя пользователя
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className={styles.input}
                    placeholder="Введите имя пользователя"
                  />
                ) : (
                  <div className={styles.value}>{user?.username || 'Не указано'}</div>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="email" className={styles.label}>
                  Email
                </label>
                <div className={styles.value}>{user?.email || 'Не указано'}</div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="bio" className={styles.label}>
                  О себе
                </label>
                {isEditing ? (
                  <textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    className={styles.textarea}
                    placeholder="Расскажите о себе"
                    rows={3}
                  />
                ) : (
                  <div className={styles.value}>{user?.bio || 'Не указано'}</div>
                )}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Статус</label>
                <div className={styles.status}>
                  <span className={styles.statusDot}></span>
                  <div className={styles.value}>
                    {user?.isActive ? 'Активен' : 'Неактивен'}
                  </div>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Дата регистрации</label>
                <div className={styles.value}>
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('ru-RU') : 'Не указано'}
                </div>
              </div>
            </div>
          </div>

          <div className={styles.actions}>
            {isEditing ? (
              <>
                <Button variant="primary" onClick={handleSave}>
                  Сохранить
                </Button>
                <Button variant="secondary" onClick={handleCancel}>
                  Отмена
                </Button>
              </>
            ) : (
              <Button variant="primary" onClick={() => setIsEditing(true)}>
                Редактировать профиль
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
