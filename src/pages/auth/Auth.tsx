import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginForm, RegisterForm } from './components';
import styles from './Auth.module.scss';

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isProfileSetup, setIsProfileSetup] = useState(false);
  const navigate = useNavigate();

  const switchToLogin = () => {
    setIsLogin(true);
    setIsProfileSetup(false);
  };
  
  const switchToRegister = () => {
    setIsLogin(false);
    setIsProfileSetup(false);
  };
  
  const goToHome = () => navigate('/');

  // Определяем, нужен ли широкий контейнер
  const needsWideContainer = !isLogin && isProfileSetup;

  return (
    <div className={styles.authPage}>
      <button className={styles.backButton} onClick={goToHome}>
        ← Вернуться на главную
      </button>
      
      <div className={needsWideContainer ? styles.wideAuthForm : styles.authForm}>
        {isLogin ? (
          <LoginForm onSwitchToRegister={switchToRegister} />
        ) : (
          <RegisterForm 
            onSwitchToLogin={switchToLogin}
            onProfileSetupStart={() => setIsProfileSetup(true)}
          />
        )}
      </div>
    </div>
  );
};

export default Auth;