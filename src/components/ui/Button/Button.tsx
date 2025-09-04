import React from 'react';
import './Button.module.scss';


export interface ButtonProps {
  children: React.ReactNode; // Содержимое кнопки
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'; // Стиль кнопки
  size?: 'sm' | 'md' | 'lg'; // Размер кнопки
  disabled?: boolean; // Отключена ли кнопка
  loading?: boolean; // Показывать ли спиннер загрузки
  type?: 'button' | 'submit' | 'reset'; // Тип кнопки
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void; // Обработчик клика
  className?: string; // Дополнительные CSS классы
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  type = 'button',
  onClick,
  className = '',
}) => {
  const baseClass = 'btn'; // Базовый CSS класс
  const variantClass = `btn--${variant}`; // Класс для стиля
  const sizeClass = `btn--${size}`; // Класс для размера
  const loadingClass = loading ? 'btn--loading' : ''; // Класс для состояния загрузки
  
  const buttonClasses = [
    baseClass,
    variantClass,
    sizeClass,
    loadingClass,
    className,
  ].filter(Boolean).join(' '); // Объединяем все CSS классы

  return (
    <button
      type={type} // Тип HTML кнопки
      className={buttonClasses} // CSS классы для стилизации
      disabled={disabled || loading} // Отключаем кнопку при загрузке или отключении
      onClick={onClick} // Обработчик события клика
    >
      {loading && <span className="btn__spinner" />} {/* Спиннер загрузки */}
      {children} {/* Содержимое кнопки */}
    </button>
  );
};

export default Button;
