import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../api/axios';
import CreateTaskForm from '../components/CreateTaskForm';
import TaskItem from '../components/TaskItem';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [createLoading, setCreateLoading] = useState(false);

  // Fetch tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await api.get('/tasks');
      setTasks(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError('Failed to load tasks. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (taskData, onSuccess) => {
    setCreateLoading(true);
    try {
      const response = await api.post('/tasks', taskData);
      setTasks([response.data, ...tasks]);
      setError('');
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error('Error creating task:', err);
      setError('Failed to create task. Please try again.');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleUpdateTask = async (id, currentStatus) => {
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    
    // Optimistic update
    const originalTasks = [...tasks];
    setTasks(tasks.map(task => 
      task._id === id ? { ...task, status: newStatus } : task
    ));

    try {
      await api.put(`/tasks/${id}`, { status: newStatus });
    } catch (err) {
      console.error('Error updating task:', err);
      setError('Failed to update task status.');
      // Revert on error
      setTasks(originalTasks);
    }
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    // Optimistic update
    const originalTasks = [...tasks];
    setTasks(tasks.filter(task => task._id !== id));

    try {
      await api.delete(`/tasks/${id}`);
    } catch (err) {
      console.error('Error deleting task:', err);
      setError('Failed to delete task.');
      // Revert on error
      setTasks(originalTasks);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12 flex flex-col">
      <Navbar />
      
      <main className="flex-1 max-w-7xl w-full mx-auto py-10 sm:px-6 lg:px-8">
        
        {/* Header */}
        <header className="px-4 mb-8 sm:flex sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your tasks and track your progress.
            </p>
          </div>
        </header>

        {/* Error Message */}
        {error && (
          <div className="mx-4 mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center" role="alert">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-4">
          
          {/* Create Task Form */}
          <div className="lg:col-span-1">
            <CreateTaskForm onCreate={handleCreateTask} loading={createLoading} />
          </div>

          {/* Task List */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-100">
              <div className="px-6 py-5 border-b border-gray-200 bg-gray-50/50 flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-900">Your Tasks</h2>
                <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold">
                  {tasks.length} {tasks.length === 1 ? 'Task' : 'Tasks'}
                </span>
              </div>
              
              {tasks.length === 0 ? (
                <div className="p-10 text-center flex flex-col items-center justify-center">
                  <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">No tasks yet</h3>
                  <p className="mt-1 text-gray-500 max-w-sm">
                    Get started by creating a new task using the form on the left.
                  </p>
                </div>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {tasks.map((task) => (
                    <TaskItem 
                      key={task._id} 
                      task={task} 
                      onUpdate={handleUpdateTask} 
                      onDelete={handleDeleteTask} 
                    />
                  ))}
                </ul>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default Dashboard;
