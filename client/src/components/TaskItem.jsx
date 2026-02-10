const TaskItem = ({ task, onUpdate, onDelete }) => {
  return (
    <li className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center hover:bg-gray-50 transition duration-150">
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
          onClick={() => onUpdate(task._id, task.status)}
          className={`text-sm px-3 py-1 rounded border ${
            task.status === 'completed'
              ? 'border-gray-300 text-gray-600 hover:bg-gray-100'
              : 'border-green-300 text-green-600 hover:bg-green-50'
          }`}
        >
          {task.status === 'completed' ? 'Mark Pending' : 'Mark Done'}
        </button>
        <button
          onClick={() => onDelete(task._id)}
          className="text-sm px-3 py-1 rounded border border-red-300 text-red-600 hover:bg-red-50"
        >
          Delete
        </button>
      </div>
    </li>
  );
};

export default TaskItem;
