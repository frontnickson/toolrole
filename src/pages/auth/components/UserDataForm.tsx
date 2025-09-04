import React, { useState, useRef } from 'react';
import styles from './AuthForms.module.scss';

interface UserDataFormData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  bio: string;
  avatarFile?: File;
  avatarUrl?: string;
}

interface UserDataFormProps {
  initialData?: {
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    bio?: string;
    avatarUrl?: string;
  };
  onNext: (data: UserDataFormData) => void;
  onBack: () => void;
}

const UserDataForm: React.FC<UserDataFormProps> = ({ initialData, onNext, onBack }) => {
  const [formData, setFormData] = useState({
    firstName: initialData?.firstName || '',
    lastName: initialData?.lastName || '',
    phoneNumber: initialData?.phoneNumber || '',
    bio: initialData?.bio || '',
  });
  
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>(initialData?.avatarUrl || '');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleRemoveAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
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



    if (formData.phoneNumber && !/^[\+]?[1-9][\d]{0,15}$/.test(formData.phoneNumber.replace(/\s/g, ''))) {
      newErrors.phoneNumber = 'Введите корректный номер телефона';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const data: UserDataFormData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        phoneNumber: formData.phoneNumber.trim(),
        bio: formData.bio.trim(),
        avatarFile: avatarFile || undefined,
        avatarUrl: avatarPreview || undefined,
      };
      
      onNext(data);
    }
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.stepHeader}>
        <h2>Личные данные</h2>
        <p className={styles.subtitle}>Расскажите немного о себе</p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Аватар */}
        <div className={styles.avatarSection}>
          <div className={styles.avatarContainer}>
            {avatarPreview ? (
              <div className={styles.avatarPreview}>
                <img src={avatarPreview} alt="Аватар" />
                <button
                  type="button"
                  onClick={handleRemoveAvatar}
                  className={styles.removeAvatar}
                  title="Удалить фото"
                >
                  ×
                </button>
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
              ref={fileInputRef}
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
          />
          {errors.email && <span className={styles.errorText}>{errors.email}</span>}
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
            Далее
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserDataForm;
