import React, { useEffect } from 'react';
import AppRoutes from './components/layout/AppRoutes';
import './App.scss';

function App() {
  useEffect(() => {
    console.log('🚀 Приложение запущено');
    
    // Обработка глобальных ошибок
    const handleError = (error: ErrorEvent) => {
      console.error('🚨 Глобальная ошибка:', error);
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('🚨 Необработанное отклонение промиса:', event.reason);
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return (
    <div className="App">
      <AppRoutes/>
    </div>
  );
}

export default App;
