import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../api/axios';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
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

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    setCreateLoading(true);
    try {
      const response = await api.post('/tasks', newTask);
      setTasks([response.data, ...tasks]);
      setNewTask({ title: '', description: '' });
      setError('');
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
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Create New Task</h2>
              <form onSubmit={handleCreateTask}>
                <div className="mb-4">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    id="title"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Task title"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    id="description"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Task description (optional)"
                    rows="3"
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  />
                </div>
                <button
                  type="submit"
                  disabled={createLoading}
                  className={`w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200 ${createLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {createLoading ? 'Adding...' : 'Add Task'}
                </button>
              </form>
            </div>
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
                    <li key={task._id} className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center hover:bg-gray-50 transition duration-150">
                      <div className="flex-1 pr-4">
                        <div className="flex items-center mb-1">
                          <h3 className={`text-lg font-medium ${task.status === 'completed' ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                            {task.title}
                          </h3>
                          <span className={`ml-3 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            task.status === 'completed' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {task.status}
                          </span>
                        </div>
                        {task.description && (
                          <p className={`text-sm ${task.status === 'completed' ? 'text-gray-400' : 'text-gray-600'}`}>
                            {task.description}
                          </p>
                        )}
                      </div>
                      
                      <div className="mt-4 sm:mt-0 flex space-x-3">
                        <button
                          onClick={() => handleUpdateTask(task._id, task.status)}
                          className={`text-sm px-3 py-1 rounded border ${
                            task.status === 'completed'
                              ? 'border-gray-300 text-gray-600 hover:bg-gray-100'
                              : 'border-green-300 text-green-600 hover:bg-green-50'
                          }`}
                        >
                          {task.status === 'completed' ? 'Mark Pending' : 'Mark Done'}
                        </button>
                        <button
                          onClick={() => handleDeleteTask(task._id)}
                          className="text-sm px-3 py-1 rounded border border-red-300 text-red-600 hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    </li>
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
