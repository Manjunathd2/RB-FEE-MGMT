import React, { useState, useEffect } from 'react';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ForgotPassword from './components/auth/ForgotPassword';
import Dashboard from './components/Dashboard';
import { User, AuthState } from './types';
import { usersDb } from './data/users';

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authState, setAuthState] = useState<AuthState>('login');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setCurrentUser(user);
      } catch (error) {
        localStorage.removeItem('currentUser');
      }
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (email: string, password: string): boolean => {
    const user = usersDb.find(u => u.email === email && u.password === password);
    if (user) {
      const userSession = { ...user };
      delete userSession.password; // Don't store password in session
      setCurrentUser(userSession);
      localStorage.setItem('currentUser', JSON.stringify(userSession));
      return true;
    }
    return false;
  };

  const handleRegister = (name: string, email: string, password: string): boolean => {
    const existingUser = usersDb.find(u => u.email === email);
    if (existingUser) {
      return false; // User already exists
    }

    const newUser: User = {
      id: (usersDb.length + 1).toString(),
      name,
      email,
      password,
      role: 'clerk',
      subscriptions: {
        billing: false,
        reports: false,
        kanban: false
      }
    };

    usersDb.push(newUser);
    return true;
  };

  const handleForgotPassword = (email: string): boolean => {
    const user = usersDb.find(u => u.email === email);
    return !!user; // Simulate sending reset email
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    setAuthState('login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {authState === 'login' && (
          <Login
            onLogin={handleLogin}
            onSwitchToRegister={() => setAuthState('register')}
            onSwitchToForgotPassword={() => setAuthState('forgot-password')}
          />
        )}
        {authState === 'register' && (
          <Register
            onRegister={handleRegister}
            onSwitchToLogin={() => setAuthState('login')}
          />
        )}
        {authState === 'forgot-password' && (
          <ForgotPassword
            onSubmit={handleForgotPassword}
            onSwitchToLogin={() => setAuthState('login')}
          />
        )}
      </div>
    );
  }

  return <Dashboard user={currentUser} onLogout={handleLogout} />;
}

export default App;