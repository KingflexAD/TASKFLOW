// src/pages/Dashboard.jsx
import React, { useMemo, useState, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Home as HomeIcon, Plus, Filter } from 'lucide-react';
import TaskItem from '../components/TaskItem';
import TaskModel from '../components/TaskModel';
import {
  WRAPPER,
  HEADER,
  ADD_BUTTON,
  STATS_GRID,
  STAT_CARD,
  ICON_WRAPPER,
  VALUE_CLASS,
  LABEL_CLASS,
  STATS,
  FILTER_OPTIONS,
  FILTER_LABELS,
  EMPTY_STATE,
  FILTER_WRAPPER,
  SELECT_CLASSES,
  TABS_WRAPPER,
  TAB_BASE,
  TAB_ACTIVE,
  TAB_INACTIVE,
} from '../assets/dummyData';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/tasks';

export default function Dashboard() {
  const { tasks = [], refreshTasks, loading, error } = useOutletContext();
  const [showModel, setShowModel] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [filter, setFilter] = useState('all');

  // Calculate stats
  const stats = useMemo(() => {
    const total = tasks.length;
    
    const lowPriority = tasks.filter(
      (t) => t.priority?.toLowerCase() === 'low'
    ).length;
    
    const mediumPriority = tasks.filter(
      (t) => t.priority?.toLowerCase() === 'medium'
    ).length;
    
    const highPriority = tasks.filter(
      (t) => t.priority?.toLowerCase() === 'high'
    ).length;

    const completed = tasks.filter(
      (t) =>
        t.completed === true ||
        t.completed === 1 ||
        (typeof t.completed === 'string' && t.completed.toLowerCase() === 'yes')
    ).length;

    return { total, lowPriority, mediumPriority, highPriority, completed };
  }, [tasks]);

  // Filter tasks based on selected filter
  const filteredTasks = useMemo(() => {
    let filtered = [...tasks];

    if (filter === 'today') {
      const today = new Date().toDateString();
      filtered = filtered.filter(
        (t) => new Date(t.dueDate).toDateString() === today
      );
    } else if (filter === 'week') {
      const today = new Date();
      const nextWeek = new Date(today);
      nextWeek.setDate(today.getDate() + 7);
      filtered = filtered.filter((t) => {
        const dueDate = new Date(t.dueDate);
        return dueDate >= today && dueDate <= nextWeek;
      });
    } else if (['high', 'medium', 'low'].includes(filter)) {
      filtered = filtered.filter(
        (t) => t.priority?.toLowerCase() === filter
      );
    }

    return filtered;
  }, [tasks, filter]);

  // Handle task save
  const handleTaskSave = useCallback(() => {
    setShowModel(false);
    setSelectedTask(null);
    refreshTasks?.();
  }, [refreshTasks]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-purple-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        Error: {error}
      </div>
    );
  }

  return (
    <div className={WRAPPER}>
      {/* Header with Add Button */}
      <div className={HEADER}>
        <div className="min-w-0 flex-1">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 flex items-center gap-2 truncate">
            <span className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <HomeIcon className="w-5 h-5 text-purple-600" />
            </span>
            Task Overview
          </h2>
          <p className="text-xs md:text-sm text-gray-500 mt-1 ml-10 truncate">
            Manage your tasks efficiently
          </p>
        </div>
        <button
          onClick={() => setShowModel(true)}
          className={ADD_BUTTON}
        >
          <Plus className="w-4 h-5" />
          <span>Add New Task</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className={STATS_GRID}>
        {STATS.map(({ key, label, icon: Icon, iconColor, valueKey, gradient, textColor }) => (
          <div key={key} className={STAT_CARD}>
            <div className="flex items-center gap-2 md:gap-3">
              <div className={`${ICON_WRAPPER} ${iconColor}`}>
                <Icon className="w-4 h-4 md:w-5 md:h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className={LABEL_CLASS}>{label}</p>
                <p
                  className={`${VALUE_CLASS} ${
                    gradient
                      ? 'bg-gradient-to-r from-fuchsia-500 to-purple-600 bg-clip-text text-transparent'
                      : textColor || 'text-gray-800'
                  }`}
                >
                  {stats[valueKey]}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter Section */}
      <div className="space-y-6">
        <div className={FILTER_WRAPPER}>
          <div className="flex items-center gap-2 min-w-0">
            <Filter className="w-5 h-5 text-purple-500 shrink-0" />
            <h2 className="text-base md:text-lg font-semibold text-gray-800 truncate">
              {FILTER_LABELS[filter]}
            </h2>
          </div>

          {/* Mobile Dropdown */}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className={SELECT_CLASSES}
          >
            {FILTER_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </option>
            ))}
          </select>

          {/* Desktop Tabs */}
          <div className={TABS_WRAPPER}>
            {FILTER_OPTIONS.map((option) => (
              <button
                key={option}
                onClick={() => setFilter(option)}
                className={`${TAB_BASE} ${
                  filter === option ? TAB_ACTIVE : TAB_INACTIVE
                }`}
              >
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Task List */}
        <div className="space-y-4">
          {filteredTasks.length === 0 ? (
            <div className={EMPTY_STATE.wrapper}>
              <div className={EMPTY_STATE.iconWrapper}>
                <HomeIcon className="w-8 h-8 text-purple-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {filter === 'all' ? 'No tasks yet' : 'No tasks match this filter'}
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                {filter === 'all'
                  ? 'Create your first task to get started'
                  : 'Try selecting a different filter'}
              </p>
              <button
                onClick={() => setShowModel(true)}
                className={EMPTY_STATE.btn}
              >
                Add New Task
              </button>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <TaskItem
                key={task._id || task.id}
                task={task}
                onRefresh={refreshTasks}
                showCompletedCheckbox={true}
                onEdit={() => {
                  setSelectedTask(task);
                  setShowModel(true);
                }}
              />
            ))
          )}
        </div>

        {/* Desktop Add Task Button */}
        <div
          onClick={() => setShowModel(true)}
          className="hidden md:flex items-center justify-center p-5 border-2 border-dashed border-purple-200 rounded-xl hover:border-purple-400 bg-purple-50/50 cursor-pointer transition-colors group"
        >
          <Plus className="w-5 h-5 text-purple-500 mr-2" />
          <span className="text-gray-600 font-medium group-hover:text-purple-700 transition-colors">
            Add New Task
          </span>
        </div>
      </div>

      {/* Task Modal */}
      <TaskModel
        isOpen={showModel || !!selectedTask}
        onClose={() => {
          setShowModel(false);
          setSelectedTask(null);
        }}
        taskToEdit={selectedTask}
        onSave={handleTaskSave}
      />
    </div>
  );
}
