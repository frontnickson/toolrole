import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';

export const useTheme = () => {
  const { currentUser } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    // Применяем тему при загрузке приложения
    const applyTheme = (theme: 'light' | 'dark' | 'auto') => {
      const html = document.documentElement;
      
      console.log('applyTheme called with:', theme);
      
      // Убираем все классы тем
      html.classList.remove('light-theme', 'dark-theme');
      
      if (theme === 'auto') {
        // Автоматическая тема на основе системных настроек
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        console.log('Auto theme - prefers dark:', prefersDark);
        if (prefersDark) {
          html.classList.add('dark-theme');
        } else {
          html.classList.add('light-theme');
        }
      } else {
        // Ручная тема
        console.log('Adding theme class:', `${theme}-theme`);
        html.classList.add(`${theme}-theme`);
      }
      
      console.log('Current HTML classes:', html.className);
    };

    // Применяем тему из пользовательских настроек
    if (currentUser?.theme) {
      console.log('Applying theme from Redux:', currentUser.theme);
      applyTheme(currentUser.theme);
    } else {
      // Если тема не установлена, проверяем localStorage
      const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'auto';
      if (savedTheme) {
        console.log('Applying theme from localStorage:', savedTheme);
        applyTheme(savedTheme);
      } else {
        // По умолчанию светлая тема
        console.log('Applying default theme: light');
        applyTheme('light');
      }
    }

    // Слушаем изменения системной темы для автоматического режима
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = () => {
      if (currentUser?.theme === 'auto') {
        applyTheme('auto');
      }
    };

    // Слушаем кастомное событие изменения темы
    const handleThemeChange = (event: CustomEvent) => {
      const { theme } = event.detail;
      applyTheme(theme);
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);
    window.addEventListener('themeChanged', handleThemeChange as EventListener);

    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
      window.removeEventListener('themeChanged', handleThemeChange as EventListener);
    };
  }, [currentUser?.theme]);

  return {
    currentTheme: currentUser?.theme || 'light',
    isDarkMode: currentUser?.theme === 'dark' || 
                (currentUser?.theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches)
  };
};
