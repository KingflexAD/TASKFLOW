// src/components/Layout.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import api from '../api';
import { toast } from 'react-toastify';

export default function Layout({ currentUser, onLogout }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/api/tasks');
      setTasks(res.data.tasks || res.data || []);
    } catch (err) {
      if (err?.response?.status === 401) {
        onLogout?.();
      } else {
        setError(err?.response?.data?.message || 'Could not load tasks');
      }
    } finally {
      setLoading(false);
    }
  }, [onLogout]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Calculate stats for right sidebar
  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => 
      t.completed === true || 
      t.completed === 1 || 
      (typeof t.completed === 'string' && t.completed.toLowerCase() === 'yes')
    ).length,
    pending: tasks.length - tasks.filter(t => 
      t.completed === true || 
      t.completed === 1 || 
      (typeof t.completed === 'string' && t.completed.toLowerCase() === 'yes')
    ).length,
    completionRate: tasks.length > 0 
      ? Math.round((tasks.filter(t => 
          t.completed === true || 
          t.completed === 1 || 
          (typeof t.completed === 'string' && t.completed.toLowerCase() === 'yes')
        ).length / tasks.length) * 100) 
      : 0
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={currentUser} onLogout={onLogout} />
      
      <div className="flex">
        {/* Left Sidebar */}
        <Sidebar user={currentUser} tasks={tasks} />

        {/* Main Content Area */}
        <main className="flex-1 ml-0 md:ml-20 lg:ml-64 mr-0 lg:mr-80 p-4 md:p-6">
          <Outlet context={{ tasks, refreshTasks: fetchTasks, loading, error }} />
        </main>

        {/* Right Stats Sidebar - Hidden on mobile/tablet */}
        <aside className="hidden lg:block fixed right-0 top-16 w-80 h-[calc(100vh-4rem)] bg-white border-l border-purple-100 p-6 overflow-y-auto">
          <div className="space-y-6">
            {/* Task Statistics */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-lg">📊</span>
                <h3 className="font-semibold text-gray-800">Task Statistics</h3>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-purple-50 rounded-lg p-3 border border-purple-100">
                  <p className="text-xs text-gray-500 mb-1">Total Tasks</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.total}</p>
                </div>
                
                <div className="bg-green-50 rounded-lg p-3 border border-green-100">
                  <p className="text-xs text-gray-500 mb-1">Completed</p>
                  <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
                </div>
                
                <div className="bg-fuchsia-50 rounded-lg p-3 border border-fuchsia-100">
                  <p className="text-xs text-gray-500 mb-1">Pending</p>
                  <p className="text-2xl font-bold text-fuchsia-600">{stats.pending}</p>
                </div>
                
                <div className="bg-purple-50 rounded-lg p-3 border border-purple-100">
                  <p className="text-xs text-gray-500 mb-1">Completion Rate</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.completionRate}%</p>
                </div>
              </div>
            </div>

            {/* Task Progress */}
            <div className="bg-gradient-to-br from-purple-50 to-fuchsia-50 rounded-xl p-4 border border-purple-100">
              <h4 className="text-sm font-semibold text-gray-800 mb-2">Task Progress</h4>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-600">{stats.completed} of {stats.total}</span>
                <span className="text-xs font-semibold text-purple-600">{stats.completionRate}%</span>
              </div>
              <div className="h-2 bg-purple-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-fuchsia-500 to-purple-600 transition-all duration-500"
                  style={{ width: `${stats.completionRate}%` }}
                />
              </div>
            </div>

            {/* Recent Activity */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <span>🕐</span>
                Recent Activity
              </h3>
              <div className="space-y-2">
                {tasks.slice(0, 3).map((task) => (
                  <div 
                    key={task._id || task.id} 
                    className="bg-white rounded-lg p-3 border border-purple-100 hover:border-purple-300 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">{task.title}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {task.createdAt ? new Date(task.createdAt).toLocaleDateString() : 'No date'}
                        </p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full shrink-0 ml-2 ${
                        task.completed === true || task.completed === 'Yes' || task.completed === 'yes'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-fuchsia-100 text-fuchsia-700'
                      }`}>
                        {task.completed === true || task.completed === 'Yes' || task.completed === 'yes' ? 'Done' : 'Pending'}
                      </span>
                    </div>
                  </div>
                ))}

                {tasks.length === 0 && (
                  <div className="text-center py-6 text-gray-500">
                    <p className="text-sm">No recent activity</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
