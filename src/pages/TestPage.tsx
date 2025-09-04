import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useAuthNavigation } from '../hooks/useAuthNavigation';
import UserProfile from '../components/ui/UserProfile';

const TestPage: React.FC = () => {
  const { user, isLoading, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const { navigateToHome } = useAuthNavigation();

  const handleProfileNavigation = () => {
    navigate('/profile');
  };

  const handleSettingsNavigation = () => {
    navigate('/profile/settings');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h1>🧪 Тестовая страница навигации</h1>
      
      <div style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h3>Состояние аутентификации:</h3>
        <ul>
          <li><strong>Загрузка:</strong> {isLoading ? 'Да' : 'Нет'}</li>
          <li><strong>Аутентифицирован:</strong> {isAuthenticated ? 'Да' : 'Нет'}</li>
          <li><strong>Пользователь:</strong> {user ? JSON.stringify(user, null, 2) : 'Не найден'}</li>
        </ul>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h3>Тест навигации:</h3>
        <div style={{ display: 'grid', gap: '0.5rem', marginBottom: '1rem' }}>
          <button
            onClick={handleProfileNavigation}
            style={{
              padding: '0.75rem',
              border: '1px solid #28a745',
              backgroundColor: '#28a745',
              color: 'white',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            🧪 Тест: Перейти на /profile
          </button>
          
          <button
            onClick={handleSettingsNavigation}
            style={{
              padding: '0.75rem',
              border: '1px solid #17a2b8',
              backgroundColor: '#17a2b8',
              color: 'white',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            🧪 Тест: Перейти на /profile/settings
          </button>
          
          <button
            onClick={handleLogout}
            style={{
              padding: '0.75rem',
              border: '1px solid #dc3545',
              backgroundColor: '#dc3545',
              color: 'white',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            🧪 Тест: Выйти из системы
          </button>
        </div>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h3>Тест UserProfile компонента:</h3>
        <div style={{ 
          border: '1px solid #ddd', 
          borderRadius: '8px', 
          padding: '1rem',
          backgroundColor: '#f8f9fa',
          maxWidth: '300px'
        }}>
          <UserProfile />
        </div>
      </div>

      <div>
        <button
          onClick={() => navigate('/')}
          style={{
            padding: '0.75rem',
            border: '1px solid #6c757d',
            backgroundColor: '#6c757d',
            color: 'white',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          ← Вернуться на главную
        </button>
      </div>
    </div>
  );
};

export default TestPage;
