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
  
  // Состояние для ошибок валидации
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  /**
   * Валидация пароля согласно требованиям бэкенда
   */
  const validatePassword = (password: string): string[] => {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('Пароль должен содержать минимум 8 символов');
    }
    
    if (!/(?=.*[a-z])/.test(password)) {
      errors.push('Пароль должен содержать минимум одну строчную букву');
    }
    
    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push('Пароль должен содержать минимум одну заглавную букву');
    }
    
    if (!/(?=.*\d)/.test(password)) {
      errors.push('Пароль должен содержать минимум одну цифру');
    }
    
    if (!/(?=.*[@$!%*?&])/.test(password)) {
      errors.push('Пароль должен содержать минимум один специальный символ (@$!%*?&)');
    }
    
    return errors;
  };

  /**
   * Определяет силу пароля
   */
  const getPasswordStrength = (password: string): number => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/(?=.*[a-z])/.test(password)) strength++;
    if (/(?=.*[A-Z])/.test(password)) strength++;
    if (/(?=.*\d)/.test(password)) strength++;
    if (/(?=.*[@$!%*?&])/.test(password)) strength++;
    return strength;
  };

  /**
   * Определяет цвет индикатора силы пароля
   */
  const getPasswordStrengthColor = (strength: number): string => {
    if (strength === 5) return '#4CAF50'; // Green for very strong
    if (strength === 4) return '#8BC34A'; // Light green for strong
    if (strength === 3) return '#FFC107'; // Amber for medium
    if (strength === 2) return '#FF9800'; // Orange for weak
    return '#F44336'; // Red for very weak
  };

  /**
   * Определяет текст индикатора силы пароля
   */
  const getPasswordStrengthText = (strength: number): string => {
    if (strength === 5) return 'Очень сильный';
    if (strength === 4) return 'Сильный';
    if (strength === 3) return 'Средний';
    if (strength === 2) return 'Слабый';
    return 'Очень слабый';
  };

  /**
   * Валидация формы перед отправкой
   */
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    // Проверяем обязательные поля
    if (!formData.email?.trim()) {
      errors.email = 'Email обязателен';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Некорректный формат email';
    }
    
    if (!formData.username?.trim()) {
      errors.username = 'Имя пользователя обязательно';
    } else if (formData.username.length < 3) {
      errors.username = 'Имя пользователя должно содержать минимум 3 символа';
    } else if (!/^[a-zA-Z0-9_-]+$/.test(formData.username)) {
      errors.username = 'Имя пользователя может содержать только буквы, цифры, дефисы и подчеркивания';
    }
    
    // Проверяем обязательные поля согласно модели User
    if (!formData.firstName?.trim()) {
      errors.firstName = 'Имя обязательно';
    }
    
    if (!formData.lastName?.trim()) {
      errors.lastName = 'Фамилия обязательна';
    }
    
    // Валидация пароля
    if (!password) {
      errors.password = 'Пароль обязателен';
    } else {
      const passwordErrors = validatePassword(password);
      if (passwordErrors.length > 0) {
        errors.password = passwordErrors.join(', ');
      }
    }
    
    if (password !== confirmPassword) {
      errors.confirmPassword = 'Пароли не совпадают';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /**
   * Обработчик изменения полей формы
   * Обновляет локальное состояние и временные данные в Redux
   */
  const handleInputChange = (field: keyof ExtendedUser, value: unknown) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);

    // Сохраняем изменения в Redux tempUserData
    dispatch(setTempUserData(newData));
    
    // Очищаем ошибку валидации для этого поля
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
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
   * Обработчик изменения пароля
   */
  const handlePasswordChange = (value: string) => {
    setPassword(value);
    
    // Очищаем ошибку валидации пароля
    if (validationErrors.password) {
      setValidationErrors(prev => ({ ...prev, password: '' }));
    }
  };

  /**
   * Обработчик изменения подтверждения пароля
   */
  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    
    // Очищаем ошибку валидации подтверждения пароля
    if (validationErrors.confirmPassword) {
      setValidationErrors(prev => ({ ...prev, confirmPassword: '' }));
    }
  };

  /**
   * Обработчик отправки формы
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      alert('Пожалуйста, исправьте ошибки в форме.');
      return;
    }

    try {
      // Сначала сохраняем все данные в Redux tempUserData
      dispatch(setTempUserData(formData));

      // Подготавливаем данные для отправки на бэкенд
      const registrationData = {
        email: formData.email || '',
        username: formData.username || '',
        password,
        
        // Личные данные
        first_name: formData.firstName,
        last_name: formData.lastName,
        middle_name: formData.middleName,
        gender: formData.gender,
        birth_date: formData.birthDate ? new Date(formData.birthDate).toISOString() : undefined,
        
        // Профиль
        full_name: `${formData.firstName || ''} ${formData.lastName || ''}`.trim(),
        bio: formData.bio,
        phone_number: formData.phoneNumber,
        country: formData.country,
        city: formData.city,
        
        // Настройки
        theme: formData.theme,
        language: formData.language,
        
        // Настройки уведомлений
        email_notifications: formData.emailNotifications,
        push_notifications: formData.pushNotifications,
        desktop_notifications: formData.desktopNotifications,
        
        // Приватность
        profile_visibility: formData.profileVisibility,
        show_online_status: formData.showOnlineStatus,
        allow_friend_requests: formData.allowFriendRequests,
        
        // Дополнительные поля
        interests: formData.interests,
        skills: formData.skills,
        education: formData.education,
        occupation: formData.occupation,
        company: formData.company,
        website: formData.website,
        
        // Социальные сети
        social_links: formData.socialLinks,
      };

      // Выполняем регистрацию со всеми данными
      const result = await register(registrationData);

      if (result.success) {
        // Очищаем временные данные после успешной регистрации
        dispatch(clearTempUserData());
        alert('Регистрация успешна! Все ваши данные сохранены.');
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
        <div className="formSection">
          <h3>Основные данные</h3>
          
          <div className="password-requirements">
            <p><strong>Требования к паролю:</strong></p>
            <ul>
              <li>Минимум 8 символов</li>
              <li>Минимум одна заглавная буква</li>
              <li>Минимум одна строчная буква</li>
              <li>Минимум одна цифра</li>
              <li>Минимум один специальный символ (@$!%*?&)</li>
            </ul>
          </div>

            <div className={`inputGroup ${validationErrors.email ? 'hasError' : ''}`}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={formData.email || ''}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Введите email"
                required
              />
              {validationErrors.email && <p className="error-text">{validationErrors.email}</p>}
            </div>

            <div className={`inputGroup ${validationErrors.username ? 'hasError' : ''}`}>
              <label htmlFor="username">Имя пользователя</label>
              <input
                type="text"
                id="username"
                value={formData.username || ''}
                onChange={(e) => handleInputChange('username', e.target.value)}
                placeholder="Введите имя пользователя"
                required
              />
              {validationErrors.username && <p className="error-text">{validationErrors.username}</p>}
            </div>

            <div className={`inputGroup ${validationErrors.password ? 'hasError' : ''}`}>
              <label htmlFor="password">Пароль</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => handlePasswordChange(e.target.value)}
                placeholder="Введите пароль"
                required
              />
              {validationErrors.password && <p className="error-text">{validationErrors.password}</p>}
              
              {/* Индикатор силы пароля */}
              {password && (
                <div className="password-strength">
                  <div className="strength-bar">
                    <div 
                      className="strength-fill"
                      style={{
                        width: `${(getPasswordStrength(password) / 5) * 100}%`,
                        backgroundColor: getPasswordStrengthColor(getPasswordStrength(password))
                      }}
                    />
                  </div>
                  <span className="strength-text" style={{ color: getPasswordStrengthColor(getPasswordStrength(password)) }}>
                    {getPasswordStrengthText(getPasswordStrength(password))}
                  </span>
                </div>
              )}
              
              <small className="password-hint">
                Пароль должен содержать минимум 8 символов, включая заглавную и строчную буквы, цифру и специальный символ (@$!%*?&)
              </small>
            </div>

            <div className={`inputGroup ${validationErrors.confirmPassword ? 'hasError' : ''}`}>
              <label htmlFor="confirmPassword">Подтвердите пароль</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                placeholder="Подтвердите пароль"
                required
              />
              {validationErrors.confirmPassword && <p className="error-text">{validationErrors.confirmPassword}</p>}
            </div>
        </div>

        {/* Личные данные */}
        <div className="formSection">
          <h3>Личные данные</h3>

          <div className="formRow">
            <div className={`inputGroup ${validationErrors.firstName ? 'hasError' : ''}`}>
              <label htmlFor="firstName">Имя *</label>
              <input
                type="text"
                id="firstName"
                value={formData.firstName || ''}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                placeholder="Введите имя"
                required
              />
              {validationErrors.firstName && <p className="error-text">{validationErrors.firstName}</p>}
            </div>

            <div className={`inputGroup ${validationErrors.lastName ? 'hasError' : ''}`}>
              <label htmlFor="lastName">Фамилия *</label>
              <input
                type="text"
                id="lastName"
                value={formData.lastName || ''}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                placeholder="Введите фамилию"
                required
              />
              {validationErrors.lastName && <p className="error-text">{validationErrors.lastName}</p>}
            </div>
          </div>

          <div className="inputGroup">
            <label htmlFor="middleName">Отчество</label>
            <input
              type="text"
              id="middleName"
              value={formData.middleName || ''}
              onChange={(e) => handleInputChange('middleName', e.target.value)}
              placeholder="Введите отчество"
            />
          </div>

          <div className="formRow">
            <div className="inputGroup">
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

            <div className="inputGroup">
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
        <div className="formSection">
          <h3>Профиль</h3>

          <div className="inputGroup">
            <label htmlFor="bio">О себе</label>
            <textarea
              id="bio"
              value={formData.bio || ''}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              rows={3}
              placeholder="Расскажите о себе"
            />
          </div>

          <div className="formRow">
            <div className="inputGroup">
              <label htmlFor="phoneNumber">Телефон</label>
              <input
                type="tel"
                id="phoneNumber"
                value={formData.phoneNumber || ''}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
              />
            </div>

            <div className="inputGroup">
              <label htmlFor="country">Страна</label>
              <input
                type="text"
                id="country"
                value={formData.country || ''}
                onChange={(e) => handleInputChange('country', e.target.value)}
              />
            </div>
          </div>

          <div className="inputGroup">
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
        <div className="formSection">
          <h3>Настройки</h3>

          <div className="formRow">
            <div className="inputGroup">
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

            <div className="inputGroup">
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
        <div className="formSection">
          <h3>Настройки уведомлений</h3>

          <div className="inputGroup">
            <label>
              <input
                type="checkbox"
                checked={formData.emailNotifications || false}
                onChange={(e) => handleInputChange('emailNotifications', e.target.checked)}
              />
              Email уведомления
            </label>
          </div>

          <div className="inputGroup">
            <label>
              <input
                type="checkbox"
                checked={formData.pushNotifications || false}
                onChange={(e) => handleInputChange('pushNotifications', e.target.checked)}
              />
              Push уведомления
            </label>
          </div>

          <div className="inputGroup">
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
        <div className="formSection">
          <h3>Приватность</h3>

          <div className="inputGroup">
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

          <div className="inputGroup">
            <label>
              <input
                type="checkbox"
                checked={formData.showOnlineStatus || false}
                onChange={(e) => handleInputChange('showOnlineStatus', e.target.checked)}
              />
              Показывать статус онлайн
            </label>
          </div>

          <div className="inputGroup">
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
        <div className="formSection">
          <h3>Дополнительная информация</h3>

          <div className="inputGroup">
            <label htmlFor="education">Образование</label>
            <input
              type="text"
              id="education"
              value={formData.education || ''}
              onChange={(e) => handleInputChange('education', e.target.value)}
            />
          </div>

          <div className="inputGroup">
            <label htmlFor="occupation">Профессия</label>
            <input
              type="text"
              id="occupation"
              value={formData.occupation || ''}
              onChange={(e) => handleInputChange('occupation', e.target.value)}
            />
          </div>

          <div className="inputGroup">
            <label htmlFor="company">Компания</label>
            <input
              type="text"
              id="company"
              value={formData.company || ''}
              onChange={(e) => handleInputChange('company', e.target.value)}
            />
          </div>

          <div className="inputGroup">
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
        <div className="formSection">
          <h3>Социальные сети</h3>

          <div className="inputGroup">
            <label htmlFor="twitter">Twitter</label>
            <input
              type="text"
              id="twitter"
              value={formData.socialLinks?.twitter || ''}
              onChange={(e) => handleNestedChange('socialLinks', 'twitter', e.target.value)}
            />
          </div>

          <div className="inputGroup">
            <label htmlFor="linkedin">LinkedIn</label>
            <input
              type="text"
              id="linkedin"
              value={formData.socialLinks?.linkedin || ''}
              onChange={(e) => handleNestedChange('socialLinks', 'linkedin', e.target.value)}
            />
          </div>

          <div className="inputGroup">
            <label htmlFor="github">GitHub</label>
            <input
              type="text"
              id="github"
              value={formData.socialLinks?.github || ''}
              onChange={(e) => handleNestedChange('socialLinks', 'github', e.target.value)}
            />
          </div>

          <div className="inputGroup">
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
