import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Landing from '../../pages/landing/Landing';
import Auth from '../../pages/auth/Auth';
import { TodoLayout } from '../../pages/todo/components/layout';
import { Profile, Settings, Subscription, Notifications, Help } from '../../pages/profile';
import TestPage from '../../pages/TestPage';

const AppRoutes: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    // Здесь можно добавить логику для отслеживания изменений маршрута
  }, [location.pathname]);

  return (
    <Routes>
        <Route path="/" element={<Landing/>}/>
        <Route path="/auth" element={<Auth/>}/>
        <Route path="/todo/*" element={<TodoLayout/>}/>
        <Route path="/test" element={<TestPage/>}/>
        <Route path="/profile" element={<Profile/>}/>
        <Route path="/profile/settings" element={<Settings/>}/>
        <Route path="/profile/subscription" element={<Subscription/>}/>
        <Route path="/profile/notifications" element={<Notifications/>}/>
        <Route path="/profile/help" element={<Help/>}/>
    </Routes>
  );
};

export default AppRoutes;