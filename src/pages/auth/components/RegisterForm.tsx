import React, { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { useAuthNavigation } from '../../../hooks/useAuthNavigation';
import Button from '../../../components/ui/Button/Button';
import styles from './AuthForms.module.scss';

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin }) => {
  const { register, checkEmailExists, checkUsernameExists } = useAuth();
  const { navigateToTodo } = useAuthNavigation();
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    full_name: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string>('');

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

    if (!formData.email) {
      newErrors.email = 'Email обязателен';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Введите корректный email';
    }

    if (!formData.username) {
      newErrors.username = 'Имя пользователя обязательно';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Имя пользователя должно содержать минимум 3 символа';
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

    if (!formData.full_name) {
      newErrors.full_name = 'Полное имя обязательно';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    
    if (validateForm()) {
      setIsLoading(true);
      
      try {
        // Проверяем существование email и username
        const [emailExists, usernameExists] = await Promise.all([
          checkEmailExists(formData.email),
          checkUsernameExists(formData.username)
        ]);
        
        if (emailExists) {
          setErrors(prev => ({ ...prev, email: 'Пользователь с таким email уже существует' }));
          setIsLoading(false);
          return;
        }
        
        if (usernameExists) {
          setErrors(prev => ({ ...prev, username: 'Пользователь с таким именем уже существует' }));
          setIsLoading(false);
          return;
        }
        
        // Регистрируем пользователя
        const result = await register({
          email: formData.email,
          username: formData.username,
          password: formData.password,
          full_name: formData.full_name
        });
        
        if (result.success) {
          // Успешная регистрация - автоматически входим и перенаправляем
          console.log('✅ Успешная регистрация');
          
          // Данные пользователя уже должны быть в Redux store через useAuth
          // Просто перенаправляем на todo
          navigateToTodo();
        } else {
          setSubmitError(result.error || 'Ошибка регистрации');
        }
      } catch {
        setSubmitError('Произошла ошибка при регистрации');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className={styles.formContainer}>
      <h2>Регистрация</h2>
      <p className={styles.subtitle}>Создайте аккаунт для начала работы</p>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label htmlFor="username">Имя пользователя</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className={errors.username ? styles.inputError : ''}
            placeholder="Введите имя пользователя"
          />
          {errors.username && <span className={styles.errorText}>{errors.username}</span>}
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="full_name">Полное имя</label>
          <input
            type="text"
            id="full_name"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            className={errors.full_name ? styles.inputError : ''}
            placeholder="Введите полное имя"
          />
          {errors.full_name && <span className={styles.errorText}>{errors.full_name}</span>}
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? styles.inputError : ''}
            placeholder="Введите email"
          />
          {errors.email && <span className={styles.errorText}>{errors.email}</span>}
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="password">Пароль</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={errors.password ? styles.inputError : ''}
            placeholder="Введите пароль"
          />
          {errors.password && <span className={styles.errorText}>{errors.password}</span>}
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="confirmPassword">Подтвердите пароль</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={errors.confirmPassword ? styles.inputError : ''}
            placeholder="Подтвердите пароль"
          />
          {errors.confirmPassword && <span className={styles.errorText}>{errors.confirmPassword}</span>}
        </div>

        {submitError && (
          <div className={styles.errorMessage}>
            {submitError}
          </div>
        )}
        
        <Button 
          type="submit" 
          variant="primary" 
          size="lg" 
          className={styles.submitButton}
          disabled={isLoading}
        >
          {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
        </Button>
      </form>

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

export default RegisterForm;
