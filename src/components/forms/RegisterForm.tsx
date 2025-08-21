import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useAuth } from '../../hooks/useAuth';
import { clearTempUserData, setTempUserData } from '../../store/slices/userSlice';
import type { ExtendedUser } from '../../types/user';
import './AuthForms.module.scss';

/**
 * Форма регистрации нового пользователя
 *
 * Демонстрирует новую логику работы с userSlice:
 * 1. Использует useState для всех полей ExtendedUser
 * 2. При отправке формы использует dispatch для сохранения в Redux
 * 3. Данные сохраняются в tempUserData для последующей обработки
 */
const RegisterForm: React.FC = () => {
  const dispatch = useDispatch();
  const { register, error, isLoading } = useAuth();

  // Состояние для всех возможных полей пользователя
  const [formData, setFormData] = useState<Partial<ExtendedUser>>({
    // Основные данные
    email: '',
    username: '',

    // Личные данные
    firstName: '',
    lastName: '',
    middleName: '',
    gender: 'prefer_not_to_say',
    birthDate: '',

    // Профиль
    bio: '',
    phoneNumber: '',
    country: '',
    city: '',

    // Настройки
    theme: 'light',
    language: 'ru',

    // Настройки уведомлений
    emailNotifications: true,
    pushNotifications: true,
    desktopNotifications: true,

    // Приватность
    profileVisibility: 'public',
    showOnlineStatus: true,
    allowFriendRequests: true,

    // Дополнительные поля
    interests: [],
    skills: [],
    education: '',
    occupation: '',
    company: '',
    website: '',

    // Социальные сети
    socialLinks: {
      twitter: '',
      linkedin: '',
      github: '',
      instagram: '',
    },
  });

  // Пароль (не сохраняется в ExtendedUser, но нужен для регистрации)
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  /**
   * Обработчик изменения полей формы
   * Обновляет локальное состояние и временные данные в Redux
   */
  const handleInputChange = (field: keyof ExtendedUser, value: unknown) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);

    // Сохраняем изменения в Redux tempUserData
    dispatch(setTempUserData(newData));
  };

  /**
   * Обработчик изменения вложенных полей (например, socialLinks)
   */
  const handleNestedChange = (parentField: keyof ExtendedUser, childField: string, value: unknown) => {
    const currentValue = formData[parentField] as Record<string, unknown>;
    const newData = {
      ...formData,
      [parentField]: { ...currentValue, [childField]: value }
    };

    setFormData(newData);
    dispatch(setTempUserData(newData));
  };

  /**
   * Обработчик отправки формы
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('Пароли не совпадают');
      return;
    }

    try {
      // Сначала сохраняем все данные в Redux tempUserData
      dispatch(setTempUserData(formData));

      // Выполняем регистрацию
      const result = await register({
        email: formData.email || '',
        username: formData.username || '',
        password,
        full_name: `${formData.firstName || ''} ${formData.lastName || ''}`.trim(),
        bio: formData.bio,
      });

      if (result.success) {
        // Очищаем временные данные после успешной регистрации
        dispatch(clearTempUserData());
        alert('Регистрация успешна!');
      } else {
        alert(`Ошибка регистрации: ${result.error}`);
      }
    } catch (error) {
      console.error('Ошибка при регистрации:', error);
      alert('Произошла ошибка при регистрации');
    }
  };

  /**
   * Обработчик очистки формы
   */
  const handleClear = () => {
    setFormData({
      email: '',
      username: '',
      firstName: '',
      lastName: '',
      middleName: '',
      gender: 'prefer_not_to_say',
      birthDate: '',
      bio: '',
      phoneNumber: '',
      country: '',
      city: '',
      theme: 'light',
      language: 'ru',
      emailNotifications: true,
      pushNotifications: true,
      desktopNotifications: true,
      profileVisibility: 'public',
      showOnlineStatus: true,
      allowFriendRequests: true,
      interests: [],
      skills: [],
      education: '',
      occupation: '',
      company: '',
      website: '',
      socialLinks: {
        twitter: '',
        linkedin: '',
        github: '',
        instagram: '',
      },
    });

    setPassword('');
    setConfirmPassword('');

    // Очищаем временные данные в Redux
    dispatch(clearTempUserData());
  };

  return (
    <div className="register-form">
      <h2>Регистрация нового пользователя</h2>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        {/* Основные данные */}
        <div className="form-section">
          <h3>Основные данные</h3>

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              value={formData.email || ''}
              onChange={(e) => handleInputChange('email', e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="username">Имя пользователя *</label>
            <input
              type="text"
              id="username"
              value={formData.username || ''}
              onChange={(e) => handleInputChange('username', e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Пароль *</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Подтвердите пароль *</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Личные данные */}
        <div className="form-section">
          <h3>Личные данные</h3>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">Имя</label>
              <input
                type="text"
                id="firstName"
                value={formData.firstName || ''}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Фамилия</label>
              <input
                type="text"
                id="lastName"
                value={formData.lastName || ''}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="middleName">Отчество</label>
            <input
              type="text"
              id="middleName"
              value={formData.middleName || ''}
              onChange={(e) => handleInputChange('middleName', e.target.value)}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="gender">Пол</label>
              <select
                id="gender"
                value={formData.gender || 'prefer_not_to_say'}
                onChange={(e) => handleInputChange('gender', e.target.value)}
              >
                <option value="prefer_not_to_say">Предпочитаю не указывать</option>
                <option value="male">Мужской</option>
                <option value="female">Женский</option>
                <option value="other">Другой</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="birthDate">Дата рождения</label>
              <input
                type="date"
                id="birthDate"
                value={formData.birthDate || ''}
                onChange={(e) => handleInputChange('birthDate', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Профиль */}
        <div className="form-section">
          <h3>Профиль</h3>

          <div className="form-group">
            <label htmlFor="bio">О себе</label>
            <textarea
              id="bio"
              value={formData.bio || ''}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              rows={3}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="phoneNumber">Телефон</label>
              <input
                type="tel"
                id="phoneNumber"
                value={formData.phoneNumber || ''}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="country">Страна</label>
              <input
                type="text"
                id="country"
                value={formData.country || ''}
                onChange={(e) => handleInputChange('country', e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="city">Город</label>
            <input
              type="text"
              id="city"
              value={formData.city || ''}
              onChange={(e) => handleInputChange('city', e.target.value)}
            />
          </div>
        </div>

        {/* Настройки */}
        <div className="form-section">
          <h3>Настройки</h3>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="theme">Тема</label>
              <select
                id="theme"
                value={formData.theme || 'light'}
                onChange={(e) => handleInputChange('theme', e.target.value)}
              >
                <option value="light">Светлая</option>
                <option value="dark">Темная</option>
                <option value="auto">Авто</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="language">Язык</label>
              <select
                id="language"
                value={formData.language || 'ru'}
                onChange={(e) => handleInputChange('language', e.target.value)}
              >
                <option value="ru">Русский</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>
        </div>

        {/* Уведомления */}
        <div className="form-section">
          <h3>Настройки уведомлений</h3>

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={formData.emailNotifications || false}
                onChange={(e) => handleInputChange('emailNotifications', e.target.checked)}
              />
              Email уведомления
            </label>
          </div>

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={formData.pushNotifications || false}
                onChange={(e) => handleInputChange('pushNotifications', e.target.checked)}
              />
              Push уведомления
            </label>
          </div>

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={formData.desktopNotifications || false}
                onChange={(e) => handleInputChange('desktopNotifications', e.target.checked)}
              />
              Desktop уведомления
            </label>
          </div>
        </div>

        {/* Приватность */}
        <div className="form-section">
          <h3>Приватность</h3>

          <div className="form-group">
            <label htmlFor="profileVisibility">Видимость профиля</label>
            <select
              id="profileVisibility"
              value={formData.profileVisibility || 'public'}
              onChange={(e) => handleInputChange('profileVisibility', e.target.value)}
            >
              <option value="public">Публичный</option>
              <option value="friends">Только друзья</option>
              <option value="private">Приватный</option>
            </select>
          </div>

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={formData.showOnlineStatus || false}
                onChange={(e) => handleInputChange('showOnlineStatus', e.target.checked)}
              />
              Показывать статус онлайн
            </label>
          </div>

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={formData.allowFriendRequests || false}
                onChange={(e) => handleInputChange('allowFriendRequests', e.target.checked)}
              />
              Разрешить заявки в друзья
            </label>
          </div>
        </div>

        {/* Дополнительные поля */}
        <div className="form-section">
          <h3>Дополнительная информация</h3>

          <div className="form-group">
            <label htmlFor="education">Образование</label>
            <input
              type="text"
              id="education"
              value={formData.education || ''}
              onChange={(e) => handleInputChange('education', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="occupation">Профессия</label>
            <input
              type="text"
              id="occupation"
              value={formData.occupation || ''}
              onChange={(e) => handleInputChange('occupation', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="company">Компания</label>
            <input
              type="text"
              id="company"
              value={formData.company || ''}
              onChange={(e) => handleInputChange('company', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="website">Веб-сайт</label>
            <input
              type="url"
              id="website"
              value={formData.website || ''}
              onChange={(e) => handleInputChange('website', e.target.value)}
            />
          </div>
        </div>

        {/* Социальные сети */}
        <div className="form-section">
          <h3>Социальные сети</h3>

          <div className="form-group">
            <label htmlFor="twitter">Twitter</label>
            <input
              type="text"
              id="twitter"
              value={formData.socialLinks?.twitter || ''}
              onChange={(e) => handleNestedChange('socialLinks', 'twitter', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="linkedin">LinkedIn</label>
            <input
              type="text"
              id="linkedin"
              value={formData.socialLinks?.linkedin || ''}
              onChange={(e) => handleNestedChange('socialLinks', 'linkedin', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="github">GitHub</label>
            <input
              type="text"
              id="github"
              value={formData.socialLinks?.github || ''}
              onChange={(e) => handleNestedChange('socialLinks', 'github', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="instagram">Instagram</label>
            <input
              type="text"
              id="instagram"
              value={formData.socialLinks?.instagram || ''}
              onChange={(e) => handleNestedChange('socialLinks', 'instagram', e.target.value)}
            />
          </div>
        </div>

        {/* Кнопки */}
        <div className="form-actions">
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
          </button>

          <button type="button" onClick={handleClear}>
            Очистить форму
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
