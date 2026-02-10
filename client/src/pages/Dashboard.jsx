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
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="flex justify-center items-center h-[calc(100vh-64px)]">
          <div className="text-xl text-gray-600">Loading tasks...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-10">
      <Navbar />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        
        {/* Header */}
        <header className="px-4 mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        </header>

        {/* Error Message */}
        {error && (
          <div className="mx-4 mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
          
          {/* Create Task Form */}
          <div className="md:col-span-1">
            <CreateTaskForm onCreate={handleCreateTask} loading={createLoading} />
          </div>

          {/* Task List */}
          <div className="md:col-span-2">
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">Your Tasks</h2>
              </div>
              
              {tasks.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  No tasks found. Create one to get started!
                </div>
              ) : (
                <ul className="divide-y divide-gray-200">
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
      </div>
    </div>
  );
};

export default Dashboard;
