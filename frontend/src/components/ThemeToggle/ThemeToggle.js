import React from 'react';
import './ThemeToggle.css';

function ThemeToggle({ isDark, onToggle }) {
  return (
    <button 
      className="theme-toggle" 
      onClick={onToggle}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
    >
      <div className="toggle-track">
        <div className="toggle-thumb">
          {isDark ? '🌙' : '☀️'}
        </div>
      </div>
    </button>
  );
}

export default ThemeToggle;
