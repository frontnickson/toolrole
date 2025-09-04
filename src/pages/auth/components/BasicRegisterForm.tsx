import React, { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import styles from './AuthForms.module.scss';

interface BasicRegisterFormProps {
  onSwitchToLogin: () => void;
  onRegistrationSuccess: () => void;
}

const BasicRegisterForm: React.FC<BasicRegisterFormProps> = ({ 
  onSwitchToLogin, 
  onRegistrationSuccess 
}) => {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Очищаем ошибку при вводе
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Имя обязательно';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Фамилия обязательна';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email обязателен';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Введите корректный email';
    }

    if (!formData.password) {
      newErrors.password = 'Пароль обязателен';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Пароль должен содержать минимум 8 символов';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Подтвердите пароль';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Пароли не совпадают';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // Генерируем username из email
      const username = formData.email.split('@')[0];
      
      // Подготавливаем данные для регистрации
      const registrationData = {
        email: formData.email.trim(),
        username: username,
        password: formData.password,
        first_name: formData.firstName.trim(),
        last_name: formData.lastName.trim(),
        offer_accepted: true, // Согласие с офертой
        offer_accepted_at: new Date().toISOString(), // Время согласия
      };

      console.log('🚀 BasicRegisterForm: Начинаем базовую регистрацию с данными:', registrationData);

      // Регистрируем пользователя
      const result = await register(registrationData);

      if (result.success) {
        console.log('✅ BasicRegisterForm: Базовая регистрация успешна');
        onRegistrationSuccess();
      } else {
        console.error('❌ BasicRegisterForm: Ошибка регистрации:', result.error);
        
        // Обрабатываем ошибки (result.error - это строка)
        const errorMessage = result.error || 'Ошибка регистрации';
        
        if (errorMessage.includes('уже существует')) {
          setErrors({ 
            general: 'Пользователь с таким email уже существует. Попробуйте войти в систему или используйте другой email.' 
          });
        } else if (errorMessage.includes('валидации')) {
          setErrors({ general: errorMessage });
        } else {
          setErrors({ general: errorMessage });
        }
      }
    } catch (error) {
      console.error('❌ BasicRegisterForm: Исключение при регистрации:', error);
      setErrors({ general: 'Произошла ошибка при регистрации. Проверьте подключение к интернету.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.stepHeader}>
        <h2>Регистрация</h2>
        <p className={styles.subtitle}>Создайте аккаунт для начала работы</p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Общая ошибка */}
        {errors.general && (
          <div className={styles.errorMessage}>
            {errors.general}
            {errors.general.includes('уже существует') && (
              <div className={styles.errorActions}>
                <button
                  type="button"
                  onClick={onSwitchToLogin}
                  className={styles.errorButton}
                >
                  Войти в систему
                </button>
              </div>
            )}
          </div>
        )}

        {/* Имя и фамилия */}
        <div className={styles.nameRow}>
          <div className={styles.inputGroup}>
            <label htmlFor="firstName">Имя *</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className={errors.firstName ? styles.inputError : ''}
              placeholder="Введите имя"
              disabled={isLoading}
            />
            {errors.firstName && <span className={styles.errorText}>{errors.firstName}</span>}
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="lastName">Фамилия *</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className={errors.lastName ? styles.inputError : ''}
              placeholder="Введите фамилию"
              disabled={isLoading}
            />
            {errors.lastName && <span className={styles.errorText}>{errors.lastName}</span>}
          </div>
        </div>

        {/* Email */}
        <div className={styles.inputGroup}>
          <label htmlFor="email">Email *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? styles.inputError : ''}
            placeholder="Введите email"
            disabled={isLoading}
          />
          {errors.email && <span className={styles.errorText}>{errors.email}</span>}
        </div>

        {/* Пароль */}
        <div className={styles.inputGroup}>
          <label htmlFor="password">Пароль *</label>
          <div className={styles.passwordInputContainer}>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`${errors.password ? styles.inputError : ''} ${styles.passwordInput}`}
              placeholder="Введите пароль"
              disabled={isLoading}
            />
            <button
              type="button"
              className={styles.passwordToggle}
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
              tabIndex={-1}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
          {errors.password && <span className={styles.errorText}>{errors.password}</span>}
        </div>

        {/* Подтверждение пароля */}
        <div className={styles.inputGroup}>
          <label htmlFor="confirmPassword">Подтвердите пароль *</label>
          <div className={styles.passwordInputContainer}>
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`${errors.confirmPassword ? styles.inputError : ''} ${styles.passwordInput}`}
              placeholder="Подтвердите пароль"
              disabled={isLoading}
            />
            <button
              type="button"
              className={styles.passwordToggle}
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              disabled={isLoading}
              tabIndex={-1}
            >
              {showConfirmPassword ? '🙈' : '👁️'}
            </button>
          </div>
          {errors.confirmPassword && <span className={styles.errorText}>{errors.confirmPassword}</span>}
        </div>

        {/* Кнопка регистрации */}
        <button
          type="submit"
          className={styles.submitButton}
          disabled={isLoading}
        >
          {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
        </button>
      </form>

      {/* Переключение на вход */}
      <div className={styles.switchForm}>
        <p>
          Уже есть аккаунт?{' '}
          <button type="button" onClick={onSwitchToLogin} className={styles.switchButton}>
            Войти
          </button>
        </p>
      </div>
    </div>
  );
};

export default BasicRegisterForm;
