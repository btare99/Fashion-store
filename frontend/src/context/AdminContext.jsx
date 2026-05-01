import { createContext, useContext, useState, useEffect } from 'react';

const AdminContext = createContext();

export function AdminProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('luxe_admin_token'));
  const [adminUser, setAdminUser] = useState(() => localStorage.getItem('luxe_admin_user'));
  const isAuthenticated = !!token;

  const login = (tok, username) => {
    setToken(tok);
    setAdminUser(username);
    localStorage.setItem('luxe_admin_token', tok);
    localStorage.setItem('luxe_admin_user', username);
  };

  const logout = () => {
    setToken(null);
    setAdminUser(null);
    localStorage.removeItem('luxe_admin_token');
    localStorage.removeItem('luxe_admin_user');
  };

  return (
    <AdminContext.Provider value={{ token, adminUser, isAuthenticated, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
}

export const useAdmin = () => useContext(AdminContext);
