import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginForm, RegisterForm } from './components';
import styles from './Auth.module.scss';

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const switchToLogin = () => setIsLogin(true);
  const switchToRegister = () => setIsLogin(false);
  const goToHome = () => navigate('/');

  return (
    <div className={styles.authPage}>
      <button className={styles.backButton} onClick={goToHome}>
        ← Вернуться на главную
      </button>
      
      <div className={styles.authForm}>
        {isLogin ? (
          <LoginForm onSwitchToRegister={switchToRegister} />
        ) : (
          <RegisterForm onSwitchToLogin={switchToLogin} />
        )}
      </div>
    </div>
  );
};

export default Auth;