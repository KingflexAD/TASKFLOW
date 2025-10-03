// src/components/TaskItem.jsx
import React, { useState, useEffect } from 'react';
import { CheckCircle2, Calendar, Clock, MoreVertical } from 'lucide-react';
import { format, isToday } from 'date-fns';
import api from '../api';  // ✅ Using your api.js instead of raw axios
import {
  TI_CLASSES,
  getPriorityColor,
  getPriorityBadgeColor,
  MENU_OPTIONS,
} from '../assets/dummyData';
import TaskModel from './TaskModel';

export default function TaskItem({ task, onRefresh, showCompletedCheckbox = true, onEdit }) {
  const [showMenu, setShowMenu] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showEditModel, setShowEditModel] = useState(false);

  // Initialize completed state
  useEffect(() => {
    const completed = [true, 1, 'yes', 'Yes'].includes(task.completed) ||
      (typeof task.completed === 'string' && task.completed.toLowerCase() === 'yes');
    setIsCompleted(completed);
  }, [task.completed]);

  // Determine border color based on status
  const borderColor = isCompleted
    ? 'border-green-500'
    : getPriorityColor(task.priority);

  // Handle completion toggle
  const handleComplete = async () => {
    const newStatus = isCompleted ? 'No' : 'Yes';
    
    try {
      await api.put(`/api/tasks/${task._id}`, { completed: newStatus });  // ✅ Fixed URL
      setIsCompleted(!isCompleted);
      onRefresh?.();
    } catch (error) {
      console.error('Error updating task:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
  };

  // Handle task deletion
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      await api.delete(`/api/tasks/${task._id}`);  // ✅ Fixed URL
      onRefresh?.();
    } catch (error) {
      console.error('Error deleting task:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
  };

  // Handle task save from edit modal
  const handleSave = async (updatedTask) => {
    const payload = {
      title: updatedTask.title,
      description: updatedTask.description,
      priority: updatedTask.priority,
      dueDate: updatedTask.dueDate,
      completed: updatedTask.completed,
    };

    try {
      await api.put(`/api/tasks/${task._id}`, payload);  // ✅ Fixed URL
      setShowEditModel(false);
      onRefresh?.();
    } catch (error) {
      console.error('Error updating task:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
  };

  // Handle menu actions
  const handleAction = (action) => {
    setShowMenu(false);
    if (action === 'edit') {
      setShowEditModel(true);
    } else if (action === 'delete') {
      handleDelete();
    }
  };

  return (
    <>
      <div className={`${TI_CLASSES.wrapper} ${borderColor}`}>
        {/* Left Section - Checkbox & Content */}
        <div className={TI_CLASSES.leftContainer}>
          {/* Completion Checkbox */}
          {showCompletedCheckbox && (
            <button
              onClick={handleComplete}
              className={`${TI_CLASSES.completeBtn} ${
                isCompleted ? 'text-green-500' : 'text-gray-300'
              }`}
            >
              <CheckCircle2
                className={`${TI_CLASSES.checkboxIconBase} ${
                  isCompleted ? 'fill-green-500' : ''
                }`}
              />
            </button>
          )}

          {/* Task Content */}
          <div className="flex-1 min-w-0">
            {/* Title & Priority Badge */}
            <div className="flex items-baseline gap-2 mb-1 flex-wrap">
              <h3
                className={`${TI_CLASSES.titleBase} ${
                  isCompleted ? 'text-gray-400 line-through' : 'text-gray-800'
                }`}
              >
                {task.title}
              </h3>
              <span
                className={`${TI_CLASSES.priorityBadge} ${getPriorityBadgeColor(
                  task.priority
                )}`}
              >
                {task.priority}
              </span>
            </div>

            {/* Description */}
            {task.description && (
              <p className={TI_CLASSES.description}>{task.description}</p>
            )}
          </div>
        </div>

        {/* Right Section - Dates & Menu */}
        <div className={TI_CLASSES.rightContainer}>
          {/* Due Date */}
          {task.dueDate && (
            <div
              className={`${TI_CLASSES.dateRow} ${
                isToday(new Date(task.dueDate)) ? 'text-fuchsia-600' : 'text-gray-500'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              {isToday(new Date(task.dueDate))
                ? 'Today'
                : format(new Date(task.dueDate), 'MMM dd')}
            </div>
          )}

          {/* Created Date */}
          {task.createdAt && (
            <div className={TI_CLASSES.createdRow}>
              <Clock className="w-3 h-3" />
              {format(new Date(task.createdAt), 'MMM dd')}
            </div>
          )}

          {/* Menu Button */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className={TI_CLASSES.menuButton}
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {/* Dropdown Menu */}
            {showMenu && (
              <div className={TI_CLASSES.menuDropdown}>
                {MENU_OPTIONS.map((option) => (
                  <button
                    key={option.action}
                    onClick={() => handleAction(option.action)}
                    className="w-full px-3 sm:px-4 py-2 text-left text-xs sm:text-sm hover:bg-purple-50 flex items-center gap-2 transition-colors duration-200"
                  >
                    {option.icon}
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <TaskModel
        isOpen={showEditModel}
        onClose={() => setShowEditModel(false)}
        taskToEdit={task}
        onSave={handleSave}
      />
    </>
  );
}
