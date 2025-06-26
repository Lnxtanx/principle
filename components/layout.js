import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styles from '../styles/Teachers.module.css';

const Layout = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const router = useRouter();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Professional SVG Icons
  const icons = {
    reports: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M3 3v18h18v-2H5V3H3zm2 2v12h14V5H5zm2 2h10v2H7V7zm0 4h10v2H7v-2zm0 4h7v2H7v-2z"/>
      </svg>
    ),
    applications: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm4 18H6V4h7v5h5v11z"/>
      </svg>
    ),
    teachers: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
      </svg>
    ),
    lessons: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
      </svg>
    ),
    school: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6L23 9l-11-6zm6.5 12.5L12 18.15 5.5 15.5v-3.79L12 15l6.5-3.29v3.79z"/>
      </svg>
    ),
    graduation: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6L23 9l-11-6zm0 5.82L7 6l5-2.18L17 6l-5 2.82z"/>
      </svg>
    ),
    sun: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z"/>
      </svg>
    ),
    moon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8z"/>
      </svg>
    ),
    back: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
      </svg>
    ),
    logout: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.59L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
      </svg>
    )
  };

  const menuItems = [
    {
      id: 'reports',
      label: 'Report Generation',
      icon: icons.reports,
      href: '/record-generation/records'
    },
    {
      id: 'applications',
      label: 'View Applications',
      icon: icons.applications,
      href: '/application/1'
    },
    {
      id: 'teachers',
      label: 'Teachers Directory',
      icon: icons.teachers,
      href: '/teachers/teacher'
    },
    {
      id: 'lessons',
      label: 'Completed Lessons',
      icon: icons.lessons,
      href: '/class-report/1c'
    }
  ];

  const handleLogout = () => {
    router.push('/login');
  };

  return (
    <div className={`${styles.wrapper} ${isDarkMode ? 'dark-theme' : ''}`}>
      {router.pathname !== '/' && router.pathname !== '/login' && (
        <button 
          onClick={() => router.back()} 
          className="btn-back"
        >
          {icons.back}
          <span>Back</span>
        </button>
      )}
      
      {/* Top Navbar */}
      <nav className="navbar">
        <Link href="/" className="brand">
          <div className="brand-icon">{icons.graduation}</div>
          <h1>School Portal</h1>
        </Link>
        <div className="profile">
          <button 
            onClick={toggleDarkMode} 
            className="btn btn-theme"
          >
            {isDarkMode ? icons.sun : icons.moon}
            <span>{isDarkMode ? 'Light' : 'Dark'}</span>
          </button>
          <button onClick={handleLogout} className="btn btn-logout">
            {icons.logout}
            <span>Logout</span>
          </button>
        </div>
      </nav>

      {/* Sidebar */}
      <aside className="sidebar">
        <div className="menu">
          {menuItems.map((item) => (
            <a
              key={item.id}
              href={item.href}
              className={`menu-item ${router.pathname === item.href ? 'active' : ''}`}
              onClick={() => setActiveMenu(item.href)}
            >
              <span className="menu-icon">{item.icon}</span>
              <span className="menu-label">{item.label}</span>
            </a>
          ))}
        </div>
        <div className="sidebar-footer">
          <a 
            href="/profile/school-profile"
            className={`menu-item ${router.pathname === '/profile/school-profile' ? 'active' : ''}`}
          >
            <span className="menu-icon">{icons.school}</span>
            <span className="menu-label">School Details</span>
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {children}
      </main>

      <style jsx>{`
        :global(body) {
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          transition: all 0.3s ease;
        }

        :global(.dark-theme) {
          background: #0a0a0a;
          color: #ffffff;
        }

        .layout {
          min-height: 100vh;
          background: ${isDarkMode ? '#0a0a0a' : '#f8fafc'};
          transition: background 0.3s ease;
        }

        .btn-back {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 1001;
          display: flex;
          align-items: center;
          gap: 8px;
          background: ${isDarkMode ? '#1a1a1a' : '#ffffff'};
          color: ${isDarkMode ? '#60a5fa' : '#3b82f6'};
          border: 2px solid ${isDarkMode ? '#374151' : '#e5e7eb'};
          padding: 8px 16px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s ease;
          box-shadow: 0 4px 12px rgba(0, 0, 0, ${isDarkMode ? '0.3' : '0.1'});
        }

        .btn-back:hover {
          background: ${isDarkMode ? '#2a2a2a' : '#f8fafc'};
          border-color: #60a5fa;
          transform: translateY(-1px);
        }

        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 70px;
          background: ${isDarkMode ? 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)' : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)'};
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 24px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, ${isDarkMode ? '0.3' : '0.1'});
          border-bottom: 1px solid ${isDarkMode ? '#374151' : '#e5e7eb'};
          z-index: 1000;
          backdrop-filter: blur(10px);
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
          color: ${isDarkMode ? '#ffffff' : '#1f2937'};
          transition: all 0.2s ease;
        }

        .brand:hover {
          transform: translateY(-1px);
          color: #60a5fa;
        }

        .brand h1 {
          margin: 0;
          font-size: 1.375rem;
          font-weight: 700;
          background: ${isDarkMode ? 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)' : 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'};
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .brand-icon {
          font-size: 1.75rem;
          color: #60a5fa;
          filter: drop-shadow(0 2px 4px rgba(96, 165, 250, 0.3));
        }

        .profile {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s ease;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .btn-theme {
          background: ${isDarkMode ? '#374151' : '#f3f4f6'};
          color: ${isDarkMode ? '#d1d5db' : '#374151'};
          border: 1px solid ${isDarkMode ? '#4b5563' : '#d1d5db'};
        }

        .btn-theme:hover {
          background: ${isDarkMode ? '#4b5563' : '#e5e7eb'};
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .btn-logout {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          color: white;
          border: 1px solid #dc2626;
        }

        .btn-logout:hover {
          background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
        }

        .sidebar {
          position: fixed;
          top: 70px;
          left: 0;
          bottom: 0;
          width: 280px;
          background: ${isDarkMode ? 'linear-gradient(180deg, #1a1a1a 0%, #0f0f0f 100%)' : 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)'};
          border-right: 1px solid ${isDarkMode ? '#374151' : '#e5e7eb'};
          display: flex;
          flex-direction: column;
          z-index: 30;
          box-shadow: 4px 0 20px rgba(0, 0, 0, ${isDarkMode ? '0.3' : '0.1'});
        }

        .menu {
          padding: 24px 0;
          flex: 1;
        }

        .menu-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px 24px;
          color: ${isDarkMode ? '#d1d5db' : '#64748b'};
          text-decoration: none;
          transition: all 0.2s ease;
          border-left: 3px solid transparent;
          margin: 4px 0;
        }

        .menu-item:hover {
          background: ${isDarkMode ? 'rgba(96, 165, 250, 0.1)' : 'rgba(59, 130, 246, 0.05)'};
          color: ${isDarkMode ? '#60a5fa' : '#3b82f6'};
          border-left-color: #60a5fa;
          transform: translateX(4px);
        }

        .menu-item.active {
          background: ${isDarkMode ? 'rgba(96, 165, 250, 0.15)' : 'rgba(59, 130, 246, 0.1)'};
          color: ${isDarkMode ? '#60a5fa' : '#3b82f6'};
          font-weight: 600;
          border-left-color: #3b82f6;
          box-shadow: inset 0 0 20px rgba(59, 130, 246, 0.1);
        }

        .menu-icon {
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: inherit;
        }

        .menu-label {
          font-size: 15px;
          font-weight: 500;
        }

        .sidebar-footer {
          border-top: 1px solid ${isDarkMode ? '#374151' : '#e5e7eb'};
          padding: 16px 0;
          background: ${isDarkMode ? 'rgba(0, 0, 0, 0.2)' : 'rgba(248, 250, 252, 0.8)'};
        }

        .main-content {
          margin-left: 280px;
          margin-top: 70px;
          padding: 32px;
          min-height: calc(100vh - 70px);
          background: ${isDarkMode ? '#0a0a0a' : '#ffffff'};
          transition: all 0.3s ease;
        }

        @media (max-width: 768px) {
          .sidebar {
            transform: translateX(-100%);
            transition: transform 0.3s ease;
          }

          .main-content {
            margin-left: 0;
          }

          .navbar {
            padding: 0 16px;
          }

          .btn {
            padding: 8px 12px;
            font-size: 12px;
          }

          .btn span {
            display: none;
          }
        }

        @media (max-width: 480px) {
          .brand h1 {
            font-size: 1.125rem;
          }

          .main-content {
            padding: 20px 16px;
          }
        }
      `}</style>
    </div>
  );
};

export default Layout;
