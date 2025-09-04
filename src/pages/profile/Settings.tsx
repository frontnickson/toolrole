import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Button, BackButton } from '../../components/ui/Button';
import styles from './Settings.module.scss';

const Settings: React.FC = () => {
  
  const { user, isLoading, updateUserProfile } = useAuth();

  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    darkMode: false,
    language: 'ru',
    timezone: 'Europe/Moscow'
  });

  useEffect(() => {
    if (user) {
      setSettings({
        theme: user.preferences?.theme || 'light',
        notifications: {
          email: user.preferences?.notifications?.email ?? true,
          push: user.preferences?.notifications?.push ?? true,
          sms: user.preferences?.notifications?.sms ?? false
        },
        privacy: {
          profile_visible: user.preferences?.privacy?.profile_visible ?? true,
          activity_visible: user.preferences?.privacy?.activity_visible ?? true
        }
      });
    }
  }, [user]);

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = () => {
    if (updateUserProfile) {
      updateUserProfile({ preferences: settings });
    }
  };

  if (isLoading) {
    return (
      <div className={styles.settingsPage}>
        <div className={styles.container}>
          <div className={styles.loading}>Загрузка настроек...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={styles.settingsPage}>
        <div className={styles.container}>
          <div className={styles.error}>Пользователь не найден</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.settingsPage}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.headerTop}>
            <BackButton>К профилю</BackButton>
          </div>
          <div className={styles.headerContent}>
            <h1 className={styles.title}>Настройки</h1>
            <p className={styles.subtitle}>Настройте приложение под свои предпочтения</p>
          </div>
        </header>

        <div className={styles.content}>
          {/* Внешний вид */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Внешний вид</h2>
            <div className={styles.settingGroup}>
              <label className={styles.settingLabel}>Тема</label>
              <div className={styles.settingControl}>
                <select
                  value={settings.darkMode ? 'dark' : 'light'}
                  onChange={(e) => handleSettingChange('darkMode', e.target.value === 'dark')}
                  className={styles.select}
                >
                  <option value="light">Светлая</option>
                  <option value="dark">Темная</option>
                  <option value="auto">Автоматически</option>
                </select>
              </div>
            </div>

            <div className={styles.settingGroup}>
              <label className={styles.settingLabel}>Язык</label>
              <div className={styles.settingControl}>
                <select
                  value={settings.language}
                  onChange={(e) => handleSettingChange('language', e.target.value)}
                  className={styles.select}
                >
                  <option value="ru">Русский</option>
                  <option value="en">English</option>
                  <option value="es">Español</option>
                </select>
              </div>
            </div>
          </div>

          {/* Уведомления */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Уведомления</h2>
            <div className={styles.settingGroup}>
              <label className={styles.settingLabel}>Email уведомления</label>
              <div className={styles.settingControl}>
                <label className={styles.switch}>
                  <input
                    type="checkbox"
                    checked={settings.emailNotifications}
                    onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                  />
                  <span className={styles.slider}></span>
                </label>
              </div>
            </div>

            <div className={styles.settingGroup}>
              <label className={styles.settingLabel}>Push уведомления</label>
              <div className={styles.settingControl}>
                <label className={styles.switch}>
                  <input
                    type="checkbox"
                    checked={settings.pushNotifications}
                    onChange={(e) => handleSettingChange('pushNotifications', e.target.checked)}
                  />
                  <span className={styles.slider}></span>
                </label>
              </div>
            </div>

            <div className={styles.settingGroup}>
              <label className={styles.settingLabel}>Desktop уведомления</label>
              <div className={styles.settingControl}>
                <label className={styles.switch}>
                  <input
                    type="checkbox"
                    checked={false} // This setting is not in the new state, so it's hardcoded to false
                    onChange={() => {}}
                  />
                  <span className={styles.slider}></span>
                </label>
              </div>
            </div>
          </div>

          {/* Приватность */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Приватность</h2>
            <div className={styles.settingGroup}>
              <label className={styles.settingLabel}>Видимость профиля</label>
              <div className={styles.settingControl}>
                <select
                  value="public" // This setting is not in the new state, so it's hardcoded
                  onChange={() => {}}
                  className={styles.select}
                >
                  <option value="public">Публичный</option>
                  <option value="friends">Только друзья</option>
                  <option value="private">Приватный</option>
                </select>
              </div>
            </div>

            <div className={styles.settingGroup}>
              <label className={styles.settingLabel}>Показывать email</label>
              <div className={styles.settingControl}>
                <label className={styles.switch}>
                  <input
                    type="checkbox"
                    checked={false} // This setting is not in the new state, so it's hardcoded
                    onChange={() => {}}
                  />
                  <span className={styles.slider}></span>
                </label>
              </div>
            </div>

            <div className={styles.settingGroup}>
              <label className={styles.settingLabel}>Показывать статус</label>
              <div className={styles.settingControl}>
                <label className={styles.switch}>
                  <input
                    type="checkbox"
                    checked={false} // This setting is not in the new state, so it's hardcoded
                    onChange={() => {}}
                  />
                  <span className={styles.slider}></span>
                </label>
              </div>
            </div>
          </div>

          {/* Безопасность */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Безопасность</h2>
            <div className={styles.settingGroup}>
              <label className={styles.settingLabel}>Двухфакторная аутентификация</label>
              <div className={styles.settingControl}>
                <Button variant="secondary" size="sm">
                  Настроить
                </Button>
              </div>
            </div>

            <div className={styles.settingGroup}>
              <label className={styles.settingLabel}>Смена пароля</label>
              <div className={styles.settingControl}>
                <Button variant="secondary" size="sm">
                  Изменить
                </Button>
              </div>
            </div>
          </div>

          {/* Действия */}
          <div className={styles.actions}>
            <Button variant="primary" onClick={handleSave}>
              Сохранить настройки
            </Button>
            <Button variant="secondary">
              Сбросить к умолчаниям
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
