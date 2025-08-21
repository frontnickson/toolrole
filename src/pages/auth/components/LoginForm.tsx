import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useAuth } from '../../../hooks/useAuth';
import { useAuthNavigation } from '../../../hooks/useAuthNavigation';
import { setCurrentUser } from '../../../store/slices/userSlice';
import Button from '../../../components/ui/Button/Button';
import styles from './AuthForms.module.scss';

interface LoginFormProps {
  onSwitchToRegister: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToRegister }) => {
  const dispatch = useDispatch();
  const { login } = useAuth();
  const { navigateToTodo } = useAuthNavigation();
  const [formData, setFormData] = useState({ email: '', password: ''});
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

    if (!formData.password) {
      newErrors.password = 'Пароль обязателен';
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
        const result = await login(formData);
        
        if (result.success) {
          // Успешный вход - перенаправляем на todo
          console.log('Успешный вход');
          
          // Получаем данные пользователя из localStorage (они должны быть сохранены в useAuth)
          const userData = localStorage.getItem('userData');
          if (userData) {
            try {
              const user = JSON.parse(userData);
              console.log('🔐 LoginForm: Устанавливаем пользователя в Redux store:', user);
              dispatch(setCurrentUser(user));
            } catch (parseError) {
              console.error('🔐 LoginForm: Ошибка парсинга userData:', parseError);
            }
          }
          
          navigateToTodo();
        } else {
          setSubmitError(result.error || 'Ошибка входа');
        }
      } catch (error) {
        setSubmitError('Произошла ошибка при входе');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className={styles.formContainer}>
      <h2>Вход в аккаунт</h2>
      <p className={styles.subtitle}>Войдите в свой аккаунт для продолжения</p>
      
      <form onSubmit={handleSubmit} className={styles.form}>
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

        <div className={styles.forgotPassword}>
          <button type="button" className={styles.forgotButton}>
            Забыли пароль?
          </button>
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
          {isLoading ? 'Вход...' : 'Войти'}
        </Button>
      </form>

      <div className={styles.switchForm}>
        <p>
          Нет аккаунта?{' '}
          <button type="button" onClick={onSwitchToRegister} className={styles.switchButton}>
            Зарегистрироваться
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
