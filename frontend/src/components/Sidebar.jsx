// src/components/Sidebar.jsx
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, FileText, CheckCircle, User, Menu, X, Zap, Sparkles, Lightbulb } from 'lucide-react';
import { linkClasses, sidebarClasses } from '../styles/classes';

const MENU = [
  { text: 'Dashboard', path: '/', icon: Home },
  { text: 'Pending', path: '/pending', icon: FileText },
  { text: 'Completed', path: '/complete', icon: CheckCircle },
  { text: 'Profile', path: '/profile', icon: User },
];

export default function Sidebar({ tasks = [] }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const renderLink = ({ text, path, icon: Icon }) => (
    <NavLink
      key={path}
      to={path}
      className={({ isActive }) => `${linkClasses.base} ${isActive ? linkClasses.active : linkClasses.inactive}`}
      onClick={() => setMobileOpen(false)}
    >
      <Icon className="w-4 h-4" />
      <span className="hidden md:block">{text}</span>
    </NavLink>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className={sidebarClasses.desktop + " p-5"}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-fuchsia-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-md">
            TF
          </div>
          <h3 className="text-lg font-bold text-gray-800">TaskFlow</h3>
        </div>

        <nav className="flex flex-col gap-2">
          {MENU.map(renderLink)}
        </nav>

        <div className="mt-auto pt-6">
          <div className="p-3 rounded-lg bg-purple-50">
            <div className="flex items-center gap-3">
              <Lightbulb className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-gray-800">Pro tip</p>
                <a href="https://example.com" target="_blank" rel="noreferrer" className="text-sm text-purple-500 hover:underline">Visit docs</a>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile floating button */}
      <button
        className="md:hidden fixed bottom-6 left-4 z-40 p-3 rounded-full bg-white shadow-lg"
        onClick={() => setMobileOpen(true)}
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-white p-4">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-fuchsia-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-md">TF</div>
                <h3 className="text-lg font-bold text-gray-800">TaskFlow</h3>
              </div>
              <button onClick={() => setMobileOpen(false)} className="p-2">
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex flex-col gap-2">
              {MENU.map(renderLink)}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
