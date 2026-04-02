import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import { fetchCurrentUser, removeToken } from './utils/api';
import './App.css';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  // Restore session from stored token on page load
  useEffect(() => {
    fetchCurrentUser()
      .then(user => setCurrentUser(user))
      .catch(() => {})
      .finally(() => setAuthChecked(true));
  }, []);

  const handleLogin = (user) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    removeToken();
    setCurrentUser(null);
  };

  if (!authChecked) {
    return <div className="app-loading">Loading…</div>;
  }

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="App">
      <Dashboard currentUser={currentUser} onLogout={handleLogout} />
    </div>
  );
}

export default App;
