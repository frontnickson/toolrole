import React, { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { useAuthNavigation } from '../../../hooks/useAuthNavigation';
import Button from '../../../components/ui/Button/Button';
import styles from './AuthForms.module.scss';

interface LoginFormProps {
  onSwitchToRegister: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToRegister }) => {

  const { login } = useAuth();
  const { navigateToTodo } = useAuthNavigation();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData(prev => ({ ...prev, [name]: value }));

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
          <div className={styles.passwordInputContainer}>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`${errors.password ? styles.inputError : ''} ${styles.passwordInput}`}
              placeholder="Введите пароль"
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
