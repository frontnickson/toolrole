import React, { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { useAuthNavigation } from '../../../hooks/useAuthNavigation';
import { uploadUserAvatar, updateUserProfile } from '../../../services/api/users';
import WelcomeStep from './WelcomeStep';
import LoginPasswordStep from './LoginPasswordStep';
import UserDataForm from './UserDataForm';
import ProfessionSelection from './ProfessionSelection';
import OfferAgreement from './OfferAgreement';
import styles from './AuthForms.module.scss';

interface RegistrationWizardProps {
  onSwitchToLogin: () => void;
}

interface LoginData {
  email: string;
  password: string;
  username: string;
}

interface UserDataFormData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  bio: string;
  avatarFile?: File;
  avatarUrl?: string;
}

type RegistrationStep = 'welcome' | 'loginPassword' | 'userData' | 'profession' | 'offer' | 'loading';

const RegistrationWizard: React.FC<RegistrationWizardProps> = ({ onSwitchToLogin }) => {
  const { register, setTempData, clearTempData } = useAuth();
  const { navigateToTodo } = useAuthNavigation();
  
  const [currentStep, setCurrentStep] = useState<RegistrationStep>('welcome');
  const [loginData, setLoginData] = useState<LoginData | null>(null);
  const [userData, setUserData] = useState<UserDataFormData | null>(null);
  const [profession, setProfession] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleWelcomeNext = () => {
    setCurrentStep('loginPassword');
  };

  const handleLoginPasswordNext = (data: LoginData) => {
    setLoginData(data);
    setCurrentStep('userData');
  };

  const handleLoginPasswordBack = () => {
    setCurrentStep('welcome');
  };

  const handleUserDataNext = (data: UserDataFormData) => {
    setUserData(data);
    setCurrentStep('profession');
  };

  const handleUserDataBack = () => {
    setCurrentStep('loginPassword');
  };

  const handleProfessionNext = async (selectedProfession: string) => {
    setProfession(selectedProfession);
    setCurrentStep('offer');
  };

  const handleOfferBack = () => {
    setCurrentStep('profession');
  };

  const handleOfferDecline = () => {
    // Очищаем временные данные и возвращаемся к началу
    clearTempData();
    setCurrentStep('welcome');
    setLoginData(null);
    setUserData(null);
    setProfession('');
    setError('Регистрация отменена. Вы не согласились с условиями использования.');
  };

  const handleOfferAccept = async () => {
    setCurrentStep('loading');
    setIsLoading(true);
    setError('');

    try {
      // Создаем временные данные для Redux store
      const tempUserData = {
        firstName: userData?.firstName || '',
        lastName: userData?.lastName || '',
        email: loginData?.email || '',
        phoneNumber: userData?.phoneNumber || '',
        bio: userData?.bio || '',
        occupation: profession,
        avatarUrl: userData?.avatarUrl || '',
      };

      // Сохраняем временные данные в Redux store
      setTempData(tempUserData);
      
      // Подготавливаем данные для регистрации
      const registrationData = {
        email: loginData?.email || '',
        username: loginData?.username || '',
        password: loginData?.password || '',
        full_name: `${userData?.firstName || ''} ${userData?.lastName || ''}`.trim(),
        first_name: userData?.firstName || '',
        last_name: userData?.lastName || '',
        bio: userData?.bio || '',
        phone_number: userData?.phoneNumber || '',
        occupation: profession,
        avatar_url: userData?.avatarUrl || '',
        offer_accepted: true, // Согласие с офертой
        offer_accepted_at: new Date().toISOString(), // Время согласия
      };

      console.log('🚀 RegistrationWizard: Начинаем регистрацию с данными:', registrationData);

      // Регистрируем пользователя
      const result = await register(registrationData);

      if (result.success) {
        console.log('✅ RegistrationWizard: Регистрация успешна, загружаем аватар...');

        // Если есть файл аватара, загружаем его
        if (userData?.avatarFile) {
          try {
            const avatarResult = await uploadUserAvatar(userData.avatarFile);
            console.log('✅ RegistrationWizard: Аватар загружен:', avatarResult);
            
            // Обновляем профиль с URL аватара
            await updateUserProfile({
              avatarUrl: avatarResult.avatarUrl,
            });
          } catch (avatarError) {
            console.warn('⚠️ RegistrationWizard: Ошибка загрузки аватара:', avatarError);
            // Не прерываем процесс регистрации из-за ошибки аватара
          }
        }

        // Обновляем профиль с остальными данными
        try {
          await updateUserProfile({
            firstName: userData?.firstName || '',
            lastName: userData?.lastName || '',
            bio: userData?.bio || '',
            phoneNumber: userData?.phoneNumber || '',
            occupation: profession,
          });
          console.log('✅ RegistrationWizard: Профиль обновлен');
        } catch (profileError) {
          console.warn('⚠️ RegistrationWizard: Ошибка обновления профиля:', profileError);
        }

        // Очищаем временные данные
        clearTempData();

        // Перенаправляем на главную страницу
        navigateToTodo();
      } else {
        console.error('❌ RegistrationWizard: Ошибка регистрации:', result.error);
        setError(result.error || 'Ошибка регистрации');
        setCurrentStep('profession');
      }
    } catch (error) {
      console.error('❌ RegistrationWizard: Исключение при регистрации:', error);
      setError('Произошла ошибка при регистрации');
      setCurrentStep('profession');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfessionBack = () => {
    setCurrentStep('userData');
  };

  const handleBackToLogin = () => {
    clearTempData();
    onSwitchToLogin();
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'welcome':
        return <WelcomeStep onNext={handleWelcomeNext} />;
      
      case 'loginPassword':
        return (
          <LoginPasswordStep 
            onNext={handleLoginPasswordNext}
            onBack={handleLoginPasswordBack}
          />
        );
      
      case 'userData':
        return (
          <UserDataForm
            initialData={userData ? {
              firstName: userData.firstName,
              lastName: userData.lastName,
              email: userData.email,
              phoneNumber: userData.phoneNumber,
              bio: userData.bio,
              avatarUrl: userData.avatarUrl,
            } : undefined}
            onNext={handleUserDataNext}
            onBack={handleUserDataBack}
          />
        );
      
      case 'profession':
        return (
          <ProfessionSelection
            onNext={handleProfessionNext}
            onBack={handleProfessionBack}
          />
        );
      
      case 'offer':
        return (
          <OfferAgreement
            onAccept={handleOfferAccept}
            onDecline={handleOfferDecline}
          />
        );
      
      case 'loading':
        return (
          <div className={styles.loadingContainer}>
            <div className={styles.loadingSpinner}>
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="18" stroke="#E5E7EB" strokeWidth="4"/>
                <path d="M20 2C29.3888 2 37 9.61116 37 19" stroke="#4F46E5" strokeWidth="4" strokeLinecap="round"/>
              </svg>
            </div>
            <h3>Создаем ваш профиль...</h3>
            <p>Пожалуйста, подождите</p>
          </div>
        );
      
      default:
        return <WelcomeStep onNext={handleWelcomeNext} />;
    }
  };

  return (
    <div className={styles.registrationWizard}>
      {/* Индикатор прогресса */}
      <div className={styles.progressIndicator}>
        <div className={styles.progressSteps}>
          <div className={`${styles.progressStep} ${currentStep === 'welcome' ? styles.active : ''} ${['userData', 'profession', 'loading'].includes(currentStep) ? styles.completed : ''}`}>
            <div className={styles.stepNumber}>1</div>
            <span>Приветствие</span>
          </div>
          <div className={styles.progressLine}></div>
          <div className={`${styles.progressStep} ${currentStep === 'userData' ? styles.active : ''} ${['profession', 'loading'].includes(currentStep) ? styles.completed : ''}`}>
            <div className={styles.stepNumber}>2</div>
            <span>Данные</span>
          </div>
          <div className={styles.progressLine}></div>
          <div className={`${styles.progressStep} ${currentStep === 'profession' ? styles.active : ''} ${currentStep === 'loading' ? styles.completed : ''}`}>
            <div className={styles.stepNumber}>3</div>
            <span>Профессия</span>
          </div>
        </div>
      </div>

      {/* Контент шага */}
      <div className={styles.stepContent}>
        {renderCurrentStep()}
      </div>

      {/* Ошибка */}
      {error && (
        <div className={styles.errorMessage}>
          {error}
        </div>
      )}

      {/* Кнопка возврата к входу */}
      {currentStep !== 'loading' && (
        <div className={styles.switchForm}>
          <p>
            Уже есть аккаунт?{' '}
            <button type="button" onClick={handleBackToLogin} className={styles.switchButton}>
              Войти
            </button>
          </p>
        </div>
      )}
    </div>
  );
};

export default RegistrationWizard;
