import React, { useState } from 'react';
import BasicRegisterForm from './BasicRegisterForm';
import ProfileSetupWizard from './ProfileSetupWizard';
import styles from './AuthForms.module.scss';

interface RegisterFormProps {
  onSwitchToLogin: () => void;
  onProfileSetupStart?: () => void;
}

type RegistrationStep = 'basic' | 'profile-setup';

const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin, onProfileSetupStart }) => {
  const [currentStep, setCurrentStep] = useState<RegistrationStep>('basic');

  const handleRegistrationSuccess = () => {
    setCurrentStep('profile-setup');
    onProfileSetupStart?.(); // Уведомляем родительский компонент
  };

  const handleProfileSetupComplete = () => {
    // Профиль настроен, пользователь будет перенаправлен в ProfileSetupWizard
  };

  if (currentStep === 'basic') {
    return (
      <BasicRegisterForm 
        onSwitchToLogin={onSwitchToLogin}
        onRegistrationSuccess={handleRegistrationSuccess}
      />
    );
  }

  return (
    <ProfileSetupWizard 
      onComplete={handleProfileSetupComplete}
    />
  );
};

export default RegisterForm;
