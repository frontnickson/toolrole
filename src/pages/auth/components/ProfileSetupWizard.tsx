import React, { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { useAuthNavigation } from '../../../hooks/useAuthNavigation';
import { uploadUserAvatar, updateUserProfile } from '../../../services/api/users';
import ProfessionSelection from './ProfessionSelection';
import SubscriptionStep from './SubscriptionStep';
import OfferAgreement from './OfferAgreement';
import styles from './AuthForms.module.scss';

interface ProfileSetupWizardProps {
  onComplete: () => void;
}

interface ProfileData {
  profession: string;
  bio: string;
  phoneNumber: string;
  avatarFile?: File;
  avatarUrl?: string;
}

type SetupStep = 'profession' | 'additional' | 'subscription' | 'offer' | 'loading';

const ProfileSetupWizard: React.FC<ProfileSetupWizardProps> = ({ onComplete }) => {
  const { currentUser, updateUserProfile: updateReduxProfile } = useAuth();
  const { navigateToTodo } = useAuthNavigation();
  
  const [currentStep, setCurrentStep] = useState<SetupStep>('profession');
  const [profileData, setProfileData] = useState<ProfileData>({
    profession: '',
    bio: '',
    phoneNumber: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleProfessionNext = (profession: string) => {
    setProfileData(prev => ({ ...prev, profession }));
    setCurrentStep('additional');
  };

  const handleProfessionBack = () => {
    setCurrentStep('profession');
  };

  const handleAdditionalNext = async (data: {
    bio: string;
    phoneNumber: string;
    avatarFile?: File;
    avatarUrl?: string;
  }) => {
    setProfileData(prev => ({ ...prev, ...data }));
    setCurrentStep('subscription');
  };

  const handleSubscriptionNext = (plan: string) => {
    setCurrentStep('offer');
  };

  const handleOfferAccept = async () => {
    setCurrentStep('loading');
    setIsLoading(true);
    setError('');

    try {
      console.log('🚀 ProfileSetupWizard: Начинаем настройку профиля...');

      // Если есть файл аватара, загружаем его
      if (profileData.avatarFile) {
        try {
          const avatarResult = await uploadUserAvatar(profileData.avatarFile);
          console.log('✅ ProfileSetupWizard: Аватар загружен:', avatarResult);
          
          // Обновляем профиль с URL аватара
          await updateUserProfile({
            avatarUrl: avatarResult.avatarUrl,
          });
        } catch (avatarError) {
          console.warn('⚠️ ProfileSetupWizard: Ошибка загрузки аватара:', avatarError);
          // Не прерываем процесс из-за ошибки аватара
        }
      }

      // Обновляем профиль с остальными данными
      try {
        const updateData = {
          profession: profileData.profession,
          bio: profileData.bio,
          phoneNumber: profileData.phoneNumber,
          subscriptionPlan: 'free', // Пока используем бесплатный план
        };

        await updateUserProfile(updateData);
        
        // Обновляем Redux store
        updateReduxProfile(updateData);
        
        console.log('✅ ProfileSetupWizard: Профиль настроен успешно');
        
        // Перенаправляем на главную страницу
        navigateToTodo();
      } catch (profileError) {
        console.error('❌ ProfileSetupWizard: Ошибка обновления профиля:', profileError);
        setError('Ошибка при настройке профиля');
        setCurrentStep('offer');
      }
    } catch (error) {
      console.error('❌ ProfileSetupWizard: Исключение при настройке профиля:', error);
      setError('Произошла ошибка при настройке профиля');
      setCurrentStep('offer');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOfferDecline = () => {
    // Очищаем данные и возвращаемся к началу
    setCurrentStep('profession');
    setProfileData({
      profession: '',
      bio: '',
      phoneNumber: '',
    });
    setError('Настройка профиля отменена. Вы не согласились с условиями использования.');
  };

  const handleSubscriptionSkip = () => {
    setCurrentStep('offer');
  };

  const handleAdditionalBack = () => {
    setCurrentStep('profession');
  };

  const handleSubscriptionBack = () => {
    setCurrentStep('additional');
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'profession':
        return (
          <ProfessionSelection
            onNext={handleProfessionNext}
            onBack={handleProfessionBack}
          />
        );
      
      case 'additional':
        return (
          <AdditionalInfoForm
            onNext={handleAdditionalNext}
            onBack={handleAdditionalBack}
          />
        );
      
      case 'subscription':
        return (
          <SubscriptionStep
            onSubscribe={handleSubscriptionNext}
            onSkip={handleSubscriptionSkip}
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
            <h3>Настраиваем ваш профиль...</h3>
            <p>Пожалуйста, подождите</p>
          </div>
        );
      
      default:
        return (
          <ProfessionSelection
            onNext={handleProfessionNext}
            onBack={handleProfessionBack}
          />
        );
    }
  };

  return (
    <div className={styles.profileSetupWizard}>
      {/* Индикатор прогресса */}
      <div className={styles.progressIndicator}>
        <div className={styles.progressSteps}>
          <div className={`${styles.progressStep} ${currentStep === 'profession' ? styles.active : ''} ${['additional', 'subscription', 'offer', 'loading'].includes(currentStep) ? styles.completed : ''}`}>
            <div className={styles.stepNumber}>1</div>
            <span>Профессия</span>
          </div>
          <div className={styles.progressLine}></div>
          <div className={`${styles.progressStep} ${currentStep === 'additional' ? styles.active : ''} ${['subscription', 'offer', 'loading'].includes(currentStep) ? styles.completed : ''}`}>
            <div className={styles.stepNumber}>2</div>
            <span>Дополнительно</span>
          </div>
          <div className={styles.progressLine}></div>
          <div className={`${styles.progressStep} ${currentStep === 'subscription' ? styles.active : ''} ${['offer', 'loading'].includes(currentStep) ? styles.completed : ''}`}>
            <div className={styles.stepNumber}>3</div>
            <span>Подписка</span>
          </div>
          <div className={styles.progressLine}></div>
          <div className={`${styles.progressStep} ${currentStep === 'offer' ? styles.active : ''} ${currentStep === 'loading' ? styles.completed : ''}`}>
            <div className={styles.stepNumber}>4</div>
            <span>Соглашение</span>
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
    </div>
  );
};

// Компонент для дополнительной информации
interface AdditionalInfoFormProps {
  onNext: (data: {
    bio: string;
    phoneNumber: string;
    avatarFile?: File;
    avatarUrl?: string;
  }) => void;
  onBack: () => void;
}

const AdditionalInfoForm: React.FC<AdditionalInfoFormProps> = ({ onNext, onBack }) => {
  const [formData, setFormData] = useState({
    bio: '',
    phoneNumber: '',
  });
  
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Очищаем ошибку при вводе
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Проверяем размер файла (максимум 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, avatar: 'Размер файла не должен превышать 5MB' }));
        return;
      }
      
      // Проверяем тип файла
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, avatar: 'Выберите изображение' }));
        return;
      }
      
      setAvatarFile(file);
      
      // Создаем превью
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      
      // Очищаем ошибку
      if (errors.avatar) {
        setErrors(prev => ({ ...prev, avatar: '' }));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const data = {
      bio: formData.bio.trim(),
      phoneNumber: formData.phoneNumber.trim(),
      avatarFile: avatarFile || undefined,
      avatarUrl: avatarPreview || undefined,
    };
    
    onNext(data);
  };

  return (
    <div className={styles.professionFormContainer}>
      <div className={styles.stepHeader}>
        <h2>Дополнительная информация</h2>
        <p className={styles.subtitle}>Расскажите больше о себе (необязательно)</p>
      </div>

      <form onSubmit={handleSubmit} className={`${styles.form} ${styles.additionalInfoForm}`}>
        {/* Аватар */}
        <div className={styles.avatarSection}>
          <div className={styles.avatarContainer}>
            {avatarPreview ? (
              <div className={styles.avatarPreview}>
                <img src={avatarPreview} alt="Аватар" />
              </div>
            ) : (
              <div className={styles.avatarPlaceholder}>
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 20C23.3137 20 26 17.3137 26 14C26 10.6863 23.3137 8 20 8C16.6863 8 14 10.6863 14 14C14 17.3137 16.6863 20 20 20Z" fill="#9CA3AF"/>
                  <path d="M20 22C14.4772 22 10 26.4772 10 32H30C30 26.4772 25.5228 22 20 22Z" fill="#9CA3AF"/>
                </svg>
              </div>
            )}
          </div>
          
          <div className={styles.avatarActions}>
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className={styles.fileInput}
              id="avatar"
            />
            <label htmlFor="avatar" className={styles.avatarButton}>
              {avatarPreview ? 'Изменить фото' : 'Загрузить фото'}
            </label>
            <small className={styles.helpText}>
              JPG, PNG до 5MB
            </small>
          </div>
          
          {errors.avatar && <span className={styles.errorText}>{errors.avatar}</span>}
        </div>

        {/* Телефон */}
        <div className={styles.inputGroup}>
          <label htmlFor="phoneNumber">Телефон</label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            className={errors.phoneNumber ? styles.inputError : ''}
            placeholder="+7 (999) 123-45-67"
          />
          {errors.phoneNumber && <span className={styles.errorText}>{errors.phoneNumber}</span>}
        </div>

        {/* О себе */}
        <div className={styles.inputGroup}>
          <label htmlFor="bio">О себе</label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            className={styles.textarea}
            placeholder="Расскажите немного о себе..."
            rows={3}
          />
        </div>

        {/* Кнопки */}
        <div className={styles.formActions}>
          <button
            type="button"
            onClick={onBack}
            className={styles.backButton}
          >
            Назад
          </button>
          
          <button
            type="submit"
            className={styles.nextButton}
          >
            Завершить настройку
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileSetupWizard;
