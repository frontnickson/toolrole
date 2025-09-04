import React, { useState, useRef, useEffect } from 'react';
import styles from './TaskPage.module.scss';

interface CustomSelectOption {
  value: string;
  label: string;
  color?: string;
}

interface CustomSelectProps {
  options: CustomSelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Выберите...',
  className = '',
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<CustomSelectOption | null>(null);
  const selectRef = useRef<HTMLDivElement>(null);

  // Находим выбранную опцию
  useEffect(() => {
    const option = options.find(opt => opt.value === value);
    setSelectedOption(option || null);
  }, [value, options]);

  // Закрываем дропдаун при клике вне компонента
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Закрываем дропдаун при нажатии Escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => {
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [isOpen]);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleOptionSelect = (option: CustomSelectOption) => {
    onChange(option.value);
    setIsOpen(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleToggle();
    }
  };

  return (
    <div 
      ref={selectRef}
      className={`${styles.customSelect} ${className}`}
      tabIndex={disabled ? -1 : 0}
      onKeyDown={handleKeyDown}
    >
      <div
        className={`${styles.customSelectTrigger} ${isOpen ? styles.open : ''}`}
        onClick={handleToggle}
        role="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={placeholder}
        tabIndex={0}
      >
        <div className={styles.selectedValue}>
          {selectedOption ? (
            <>
              {selectedOption.color && (
                <span 
                  className={styles.optionColor}
                  style={{ backgroundColor: selectedOption.color }}
                />
              )}
              {selectedOption.label}
            </>
          ) : (
            <span style={{ color: '#9ca3af' }}>{placeholder}</span>
          )}
        </div>
        <span className={`${styles.arrow} ${isOpen ? styles.open : ''}`}>
          ▼
        </span>
      </div>

      {isOpen && (
        <div 
          className={styles.customSelectDropdown}
          role="listbox"
          aria-label="Опции выбора"
        >
          {options.map((option) => (
            <div
              key={option.value}
              className={`${styles.customSelectOption} ${
                option.value === value ? styles.selected : ''
              }`}
              onClick={() => handleOptionSelect(option)}
              role="option"
              aria-selected={option.value === value}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleOptionSelect(option);
                }
              }}
            >
              {option.color && (
                <span 
                  className={styles.optionColor}
                  style={{ backgroundColor: option.color }}
                />
              )}
              <span className={styles.optionLabel}>{option.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
