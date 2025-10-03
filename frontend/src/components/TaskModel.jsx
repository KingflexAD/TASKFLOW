// src/components/TaskModel.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { X, Save, PlusCircle, AlignLeft, Flag, Calendar, CheckCircle } from 'lucide-react';
import { DEFAULT_TASK, baseControlClasses } from '../assets/dummyData';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export default function TaskModel({ isOpen, onClose, taskToEdit, onSave, onLogout }) {
  const [taskData, setTaskData] = useState(DEFAULT_TASK);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const today = new Date().toISOString().split('T')[0];

  // Get authorization header
  const getHeaders = useCallback(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
  }, []);

  // Initialize form data when modal opens
  useEffect(() => {
    if (!isOpen) return;

    if (taskToEdit) {
      const normalized = {
        ...taskToEdit,
        completed: taskToEdit.completed === true || taskToEdit.completed === 'Yes' ? 'Yes' : 'No',
        dueDate: taskToEdit.dueDate ? new Date(taskToEdit.dueDate).toISOString().split('T')[0] : '',
      };
      setTaskData(normalized);
    } else {
      setTaskData(DEFAULT_TASK);
    }
    setError(null);
  }, [isOpen, taskToEdit]);

  // Handle input changes
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setTaskData((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Handle form submission
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      // Validate due date
      if (taskData.dueDate && taskData.dueDate < today) {
        setError('Due date cannot be in the past');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const isEdit = Boolean(taskData._id);
        
        // ✅ FIXED: Both URLs now include /api/tasks
        const url = isEdit 
          ? `${API_BASE}/api/tasks/${taskData._id}`  // PUT /api/tasks/:id
          : `${API_BASE}/api/tasks`;                  // POST /api/tasks

        console.log('🔍 API Request:', isEdit ? 'PUT' : 'POST', url);

        const response = await fetch(url, {
          method: isEdit ? 'PUT' : 'POST',
          headers: getHeaders(),
          body: JSON.stringify(taskData),
        });

        console.log('🔍 Response Status:', response.status);

        if (!response.ok) {
          if (response.status === 401) {
            onLogout?.();
            return;
          }
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to save task');
        }

        const savedTask = await response.json();
        console.log('✅ Task saved successfully:', savedTask);
        
        onSave?.(savedTask);
        onClose?.();
      } catch (err) {
        console.error('❌ Error saving task:', err);
        setError(err.message || 'An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    },
    [taskData, today, getHeaders, onSave, onClose, onLogout]
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-purple-100 rounded-xl max-w-md w-full shadow-lg relative p-6 animate-fadeIn">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            {taskData._id ? (
              <>
                <Save className="text-purple-500 w-5 h-5" />
                Edit Task
              </>
            ) : (
              <>
                <PlusCircle className="text-purple-500 w-5 h-5" />
                Create New Task
              </>
            )}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-purple-100 rounded-lg transition-colors text-gray-500 hover:text-purple-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100 mb-4">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Task Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
            <div className="flex items-center border border-purple-100 rounded-lg px-3 py-2.5 focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-purple-500 transition-all duration-200">
              <input
                type="text"
                name="title"
                required
                value={taskData.title}
                onChange={handleChange}
                className="w-full focus:outline-none text-sm"
                placeholder="Enter task title"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
              <AlignLeft className="w-4 h-4 text-purple-500" />
              Description
            </label>
            <textarea
              name="description"
              rows="3"
              value={taskData.description}
              onChange={handleChange}
              className={baseControlClasses}
              placeholder="Add details about your task"
            />
          </div>

          {/* Priority and Due Date Row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                <Flag className="w-4 h-4 text-purple-500" />
                Priority
              </label>
              <select
                name="priority"
                value={taskData.priority}
                onChange={handleChange}
                className={`${baseControlClasses} appearance-none bg-white`}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                <Calendar className="w-4 h-4 text-purple-500" />
                Due Date
              </label>
              <input
                type="date"
                name="dueDate"
                required
                min={today}
                value={taskData.dueDate}
                onChange={handleChange}
                className={baseControlClasses}
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
              <CheckCircle className="w-4 h-4 text-purple-500" />
              Status
            </label>
            <div className="flex items-center gap-4">
              {[
                { value: 'No', label: 'In Progress' },
                { value: 'Yes', label: 'Completed' },
              ].map(({ value, label }) => (
                <label key={value} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="completed"
                    value={value}
                    checked={taskData.completed === value}
                    onChange={handleChange}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white font-medium py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 hover:shadow-md transition-all duration-200"
          >
            {loading ? (
              'Saving...'
            ) : taskData._id ? (
              <>
                <Save className="w-4 h-4" />
                Update Task
              </>
            ) : (
              <>
                <PlusCircle className="w-4 h-4" />
                Create Task
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
