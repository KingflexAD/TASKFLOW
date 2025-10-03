// src/pages/PendingPage.jsx
import React from 'react';
import { useOutletContext } from 'react-router-dom';

export default function PendingPage() {
  const { tasks = [] } = useOutletContext();
  const pending = tasks.filter(t => !(t.completed === true || String(t.completed).toLowerCase() === 'yes'));

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Pending tasks ({pending.length})</h2>
      <div className="space-y-3">
        {pending.map(task => (
          <div key={task._id || task.id || task.title} className="bg-white p-3 rounded-lg shadow-sm border border-purple-50 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">{task.title}</p>
              <p className="text-xs text-gray-500">{task.description}</p>
            </div>
            <div className="text-xs text-gray-500">{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : ''}</div>
          </div>
        ))}
        {pending.length === 0 && <div className="text-gray-500">No pending tasks.</div>}
      </div>
    </div>
  );
}
