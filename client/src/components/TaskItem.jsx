const TaskItem = ({ task, onUpdate, onDelete }) => {
  return (
    <li className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center hover:bg-gray-50 transition duration-200 group">
      <div className="flex-1 pr-4">
        <div className="flex items-center mb-1.5">
          <h3 className={`text-base font-semibold ${task.status === 'completed' ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
            {task.title}
          </h3>
          <span className={`ml-3 px-2.5 py-0.5 inline-flex text-xs font-medium rounded-full border ${
            task.status === 'completed' 
              ? 'bg-green-50 text-green-700 border-green-200' 
              : 'bg-yellow-50 text-yellow-700 border-yellow-200'
          }`}>
            {task.status}
          </span>
        </div>
        {task.description && (
          <p className={`text-sm ${task.status === 'completed' ? 'text-gray-400' : 'text-gray-500'} line-clamp-2`}>
            {task.description}
          </p>
        )}
      </div>
      
      <div className="mt-4 sm:mt-0 flex items-center space-x-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
        <button
          onClick={() => onUpdate(task._id, task.status)}
          className={`text-xs font-medium px-3 py-1.5 rounded-md border transition-colors duration-150 ${
            task.status === 'completed'
              ? 'border-gray-200 text-gray-600 hover:bg-gray-100'
              : 'border-green-200 text-green-700 bg-green-50 hover:bg-green-100'
          }`}
        >
          {task.status === 'completed' ? 'Undo' : 'Complete'}
        </button>
        <button
          onClick={() => onDelete(task._id)}
          className="text-xs font-medium px-3 py-1.5 rounded-md border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 transition-colors duration-150"
        >
          Delete
        </button>
      </div>
    </li>
  );
};

export default TaskItem;
