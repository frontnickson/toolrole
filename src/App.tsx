// import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store';
import AppRoutes from './components/layout/AppRoutes';
import { useTheme } from './hooks/useTheme';
import './App.scss';

// Внутренний компонент для использования хука темы
const AppContent: React.FC = () => {
  useTheme(); // Применяем тему при загрузке приложения
  
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
};

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppContent />
      </PersistGate>
    </Provider>
  );
}

export default App;
