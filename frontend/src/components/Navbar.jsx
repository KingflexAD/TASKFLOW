// src/components/Navbar.jsx
import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Settings, ChevronDown, LogOut, User } from 'lucide-react';

export default function Navbar({ user, onLogout }) {
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onDoc = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, []);

  const initials = (user?.name?.[0] || 'U').toUpperCase();

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-200 font-sans">
      <div className="flex items-center justify-between px-4 py-3 md:px-6 max-w-7xl mx-auto">
        {/* logo */}
        <div
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => navigate('/')}
        >
          <div className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-500 via-purple-500 to-indigo-500 shadow-lg group-hover:shadow-purple-300/50 group-hover:scale-105 transition-all duration-300">
            <Zap className="w-6 h-6 text-white" />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-white rounded-full shadow-md animate-pulse" />
          </div>
          {/* brand name */}
          <span className="text-2xl font-extrabold bg-gradient-to-r from-fuchsia-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent tracking-wide">TaskFlow</span>
        </div>

        {/* right */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/profile')}
            className="p-2 text-gray-600 hover:text-purple-500 transition-colors duration-300 hover:bg-purple-50 rounded-full"
          >
            <Settings className="w-5 h-5" />
          </button>

          {/* user dropdown */}
          <div ref={menuRef} className="relative">
            <button
              onClick={() => setMenuOpen(prev => !prev)}
              className="flex items-center gap-2 px-3 py-2 rounded-full cursor-pointer hover:bg-purple-50 transition-colors duration-300 border border-transparent hover:border-purple-200"
            >
              {user?.avatar ? (
                <img src={user.avatar} alt="avatar" className="w-9 h-9 rounded-full shadow-sm" />
              ) : (
                <div className="w-9 h-9 flex items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-500 to-purple-600 text-white font-semibold shadow-md">
                  {initials}
                </div>
              )}

              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-800">{user?.name || 'Guest'}</p>
                <p className="text-xs text-gray-500">{user?.email || ''}</p>
              </div>

              <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
            </button>

            {menuOpen && (
              <ul className="absolute top-14 right-0 w-56 bg-white rounded-2xl shadow-xl border border-purple-100 z-50 overflow-hidden animate-fade-in">
                <li>
                  <button
                    onClick={() => { setMenuOpen(false); navigate('/profile'); }}
                    className="w-full text-left px-4 py-2 hover:bg-purple-50 text-sm text-gray-700 flex items-center gap-2"
                  >
                    <Settings className="w-4 h-4 text-gray-700" /> Profile settings
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => { setMenuOpen(false); onLogout?.(); }}
                    className="w-full text-left px-4 py-2 hover:bg-red-50 text-sm text-red-600 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" /> Log out
                  </button>
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
