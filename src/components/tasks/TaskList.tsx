import React from 'react';

interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: Date;
  dueDate?: Date;
}

interface TaskListProps {
  tasks: Task[];
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  onDeleteTask: (taskId: string) => void;
}

export default function TaskList({ tasks, onUpdateTask, onDeleteTask }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No tasks</h3>
        <p className="mt-1 text-sm text-gray-500">
          Get started by creating your first task.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Your Tasks ({tasks.length})
      </h2>
      
      {tasks.map((task) => (
        <div
          key={task.id}
          className={`p-4 rounded-lg border transition-colors ${
            task.completed
              ? 'bg-green-50 border-green-200'
              : 'bg-white border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3 flex-1">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={(e) => onUpdateTask(task.id, { completed: e.target.checked })}
                className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <div className="flex-1">
                <h3 className={`text-sm font-medium ${
                  task.completed ? 'text-green-800 line-through' : 'text-gray-900'
                }`}>
                  {task.title}
                </h3>
                {task.description && (
                  <p className={`mt-1 text-sm ${
                    task.completed ? 'text-green-600' : 'text-gray-600'
                  }`}>
                    {task.description}
                  </p>
                )}
                <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                  <span>
                    Created: {new Date(task.createdAt).toLocaleDateString()}
                  </span>
                  {task.dueDate && (
                    <span className={`${
                      new Date(task.dueDate) < new Date() && !task.completed
                        ? 'text-red-600 font-medium'
                        : ''
                    }`}>
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={() => onDeleteTask(task.id)}
              className="ml-4 text-gray-400 hover:text-red-600 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
