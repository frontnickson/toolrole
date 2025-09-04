import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../../../store';
import { updateUserProfile, toggleTheme, toggleLanguage } from '../../../../store/slices/userSlice';
import { updateUserSettings, sendTestEmail } from '../../../../services/api/users';
import { useTranslation } from '../../../../utils/translations';
import styles from './SettingsPanel.module.scss';

interface SettingsPanelProps {
  onClose: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ onClose }) => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: RootState) => state.user);
  
  // Переводы
  const { t } = useTranslation(currentUser?.language || 'ru');
  
  // Состояние для настроек
  const [notifications, setNotifications] = useState({
    email: currentUser?.emailNotifications ?? true,
    push: currentUser?.pushNotifications ?? true,
    desktop: currentUser?.desktopNotifications ?? true,
    taskUpdates: true,
    comments: true,
    mentions: true,
    dueDateReminders: true,
  });
  
  const [darkMode, setDarkMode] = useState(currentUser?.theme === 'dark');
  const [language, setLanguage] = useState(currentUser?.language ?? 'ru');
  const [isLoading, setIsLoading] = useState(false);
  const [emailTestSent, setEmailTestSent] = useState(false);

  // Обновляем состояние при изменении currentUser
  useEffect(() => {
    if (currentUser) {
      setNotifications({
        email: currentUser.emailNotifications ?? true,
        push: currentUser.pushNotifications ?? true,
        desktop: currentUser.desktopNotifications ?? true,
        taskUpdates: true,
        comments: true,
        mentions: true,
        dueDateReminders: true,
      });
      setDarkMode(currentUser.theme === 'dark');
      setLanguage(currentUser.language ?? 'ru');
    }
  }, [currentUser]);

  // Обработчик изменения настроек уведомлений
  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Обработчик переключения темы
  const handleThemeToggle = () => {
    const newTheme = !darkMode;
    setDarkMode(newTheme);
    
    // Обновляем тему в store
    dispatch(updateUserProfile({ theme: newTheme ? 'dark' : 'light' }));
    
    // Применяем тему к документу с плавным переходом
    const html = document.documentElement;
    
    // Добавляем класс для плавного перехода
    html.classList.add('theme-transitioning');
    
    // Устанавливаем новую тему
    if (newTheme) {
      html.classList.add('dark-theme');
      html.classList.remove('light-theme');
    } else {
      html.classList.add('light-theme');
      html.classList.remove('dark-theme');
    }
    
    // Убираем класс перехода после завершения анимации
    setTimeout(() => {
      html.classList.remove('theme-transitioning');
    }, 300);
    
    // Сохраняем в localStorage
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    
    // Принудительно обновляем тему для всех компонентов
    // Это гарантирует, что тема применится ко всем страницам
    window.dispatchEvent(new CustomEvent('themeChanged', { 
      detail: { theme: newTheme ? 'dark' : 'light' } 
    }));
  };

  // Обработчик изменения языка
  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    dispatch(updateUserProfile({ language: newLanguage as 'en' | 'ru' }));
    
    // Сохраняем в localStorage
    localStorage.setItem('language', newLanguage);
    
    // Перезагружаем страницу для применения языка
    // В реальном приложении лучше использовать i18n без перезагрузки
    if (confirm(t('settings.language_change_confirm'))) {
      window.location.reload();
    }
  };

  // Обработчик сохранения настроек
  const handleSaveSettings = async () => {
    setIsLoading(true);
    try {
      // Отправляем настройки на сервер
      const updatedUser = await updateUserSettings({
        theme: darkMode ? 'dark' : 'light',
        language: language as 'en' | 'ru',
        emailNotifications: notifications.email,
        pushNotifications: notifications.push,
        desktopNotifications: notifications.desktop,
      });
      
      // Обновляем настройки в store
      dispatch(updateUserProfile(updatedUser));
      
      alert(t('settings.settings_saved'));
    } catch (error) {
      console.error('Ошибка при сохранении настроек:', error);
      alert(t('settings.settings_save_error'));
    } finally {
      setIsLoading(false);
    }
  };

  // Обработчик сброса настроек
  const handleResetSettings = () => {
    if (confirm(t('settings.reset_settings_confirm'))) {
      setNotifications({
        email: true,
        push: true,
        desktop: true,
        taskUpdates: true,
        comments: true,
        mentions: true,
        dueDateReminders: true,
      });
      setDarkMode(false);
      setLanguage('ru');
      
      // Сбрасываем тему
      document.documentElement.classList.remove('dark-theme');
      document.documentElement.classList.add('light-theme');
      
      // Очищаем localStorage
      localStorage.removeItem('theme');
      localStorage.removeItem('language');
    }
  };

  // Обработчик отправки тестового email
  const handleSendTestEmail = async () => {
    if (!currentUser?.email) {
      alert(t('settings.email_not_found'));
      return;
    }

    setIsLoading(true);
    try {
      // Отправляем тестовый email через API
      await sendTestEmail(currentUser.email);
      
      setEmailTestSent(true);
      alert(t('settings.test_email_sent_alert'));
      
      // Сбрасываем статус через 5 секунд
      setTimeout(() => setEmailTestSent(false), 5000);
    } catch (error) {
      console.error('Ошибка при отправке тестового email:', error);
      alert(t('settings.test_email_error'));
    } finally {
      setIsLoading(false);
    }
  };



  if (!currentUser) {
    return (
      <div className={styles.settingsPanel}>
        <div className={styles.header}>
          <h2>{t('settings.title')}</h2>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>
        <div className={styles.content}>
          <p>Пользователь не найден</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.settingsPanel}>
      <div className={styles.header}>
        <h2>{t('settings.title')}</h2>
        <button className={styles.closeBtn} onClick={onClose}>✕</button>
      </div>
      
      <div className={styles.content}>
        {/* Секция уведомлений */}
        <div className={styles.section}>
          <h3>{t('settings.notifications')}</h3>
          
          <div className={styles.settingItem}>
            <div className={styles.settingInfo}>
              <label>{t('settings.email_notifications')}</label>
              <p>{t('settings.email_notifications_desc')}</p>
            </div>
            <label className={styles.switch}>
              <input 
                type="checkbox" 
                checked={notifications.email}
                onChange={(e) => handleNotificationChange('email', e.target.checked)}
              />
              <span className={styles.slider}></span>
            </label>
          </div>

          {notifications.email && (
            <div className={styles.settingItem}>
              <div className={styles.settingInfo}>
                <label>{t('settings.send_test_email')}</label>
                <p>{t('settings.send_test_email')} на {currentUser.email}</p>
              </div>
              <button 
                className={`${styles.actionBtn} ${emailTestSent ? styles.success : ''}`}
                onClick={handleSendTestEmail}
                disabled={isLoading}
              >
                {emailTestSent ? '✅ ' + t('settings.test_email_sent') : t('settings.send_test')}
              </button>
            </div>
          )}

          <div className={styles.settingItem}>
            <div className={styles.settingInfo}>
              <label>{t('settings.push_notifications')}</label>
              <p>{t('settings.push_notifications_desc')}</p>
            </div>
            <label className={styles.switch}>
              <input 
                type="checkbox" 
                checked={notifications.push}
                onChange={(e) => handleNotificationChange('push', e.target.checked)}
              />
              <span className={styles.slider}></span>
            </label>
          </div>

          <div className={styles.settingItem}>
            <div className={styles.settingInfo}>
              <label>{t('settings.desktop_notifications')}</label>
              <p>{t('settings.desktop_notifications_desc')}</p>
            </div>
            <label className={styles.switch}>
              <input 
                type="checkbox" 
                checked={notifications.desktop}
                onChange={(e) => handleNotificationChange('desktop', e.target.checked)}
              />
              <span className={styles.slider}></span>
            </label>
          </div>

          <div className={styles.settingItem}>
            <div className={styles.settingInfo}>
              <label>{t('settings.task_updates')}</label>
              <p>{t('settings.task_updates_desc')}</p>
            </div>
            <label className={styles.switch}>
              <input 
                type="checkbox" 
                checked={notifications.taskUpdates}
                onChange={(e) => handleNotificationChange('taskUpdates', e.target.checked)}
              />
              <span className={styles.slider}></span>
            </label>
          </div>

          <div className={styles.settingItem}>
            <div className={styles.settingInfo}>
              <label>{t('settings.comments')}</label>
              <p>{t('settings.comments_desc')}</p>
            </div>
            <label className={styles.switch}>
              <input 
                type="checkbox" 
                checked={notifications.comments}
                onChange={(e) => handleNotificationChange('comments', e.target.checked)}
              />
              <span className={styles.slider}></span>
            </label>
          </div>

          <div className={styles.settingItem}>
            <div className={styles.settingInfo}>
              <label>{t('settings.mentions')}</label>
              <p>{t('settings.mentions_desc')}</p>
            </div>
            <label className={styles.switch}>
              <input 
                type="checkbox" 
                checked={notifications.mentions}
                onChange={(e) => handleNotificationChange('mentions', e.target.checked)}
              />
              <span className={styles.slider}></span>
            </label>
          </div>

          <div className={styles.settingItem}>
            <div className={styles.settingInfo}>
              <label>{t('settings.due_date_reminders')}</label>
              <p>{t('settings.due_date_reminders_desc')}</p>
            </div>
            <label className={styles.switch}>
              <input 
                type="checkbox" 
                checked={notifications.dueDateReminders}
                onChange={(e) => handleNotificationChange('dueDateReminders', e.target.checked)}
              />
              <span className={styles.slider}></span>
            </label>
          </div>
        </div>

        {/* Секция внешнего вида */}
        <div className={styles.section}>
          <h3>{t('settings.appearance')}</h3>
          <div className={styles.settingItem}>
            <div className={styles.settingInfo}>
              <label>{t('settings.dark_theme')}</label>
              <p>{t('settings.dark_theme_desc')}</p>
            </div>
            <label className={styles.switch}>
              <input 
                type="checkbox" 
                checked={darkMode}
                onChange={handleThemeToggle}
              />
              <span className={styles.slider}></span>
            </label>
          </div>
        </div>

        {/* Секция языка */}
        <div className={styles.section}>
          <h3>{t('settings.language')}</h3>
          <div className={styles.settingItem}>
            <div className={styles.settingInfo}>
              <label>{t('settings.language')}</label>
              <p>{t('settings.language_desc')}</p>
            </div>
            <select 
              value={language} 
              onChange={(e) => handleLanguageChange(e.target.value)}
              className={styles.select}
            >
              <option value="ru">{t('settings.language_russian')}</option>
              <option value="en">{t('settings.language_english')}</option>
            </select>
          </div>
        </div>

        {/* Секция безопасности */}
        <div className={styles.section}>
          <h3>{t('settings.security')}</h3>
          <div className={styles.settingItem}>
            <div className={styles.settingInfo}>
              <label>{t('settings.two_factor_auth')}</label>
              <p>{t('settings.two_factor_auth_desc')}</p>
            </div>
            <button className={styles.actionBtn}>
              {t('settings.configure')}
            </button>
          </div>
        </div>

        {/* Секция действий */}
        <div className={styles.actionsSection}>
          <button 
            className={styles.saveBtn}
            onClick={handleSaveSettings}
            disabled={isLoading}
          >
            {isLoading ? t('settings.saving') : '💾 ' + t('settings.save_settings')}
          </button>
          <button 
            className={styles.resetBtn}
            onClick={handleResetSettings}
            disabled={isLoading}
          >
            🔄 {t('settings.reset_settings')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
