
import React, { useState } from 'react';
import { Task, Project, Status, Priority } from '../types';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Clock, 
  Trash2, 
  X,
  CheckSquare
} from 'lucide-react';

interface Props {
  tasks: Task[];
  projects: Project[];
  onUpdateTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onAddTask: (task: Task) => void;
}

const TaskBoard: React.FC<Props> = ({ tasks, projects, onUpdateTask, onDeleteTask, onAddTask }) => {
  const [activeTab, setActiveTab] = useState<Status | 'All'>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // New Task Form State
  const [newTitle, setNewTitle] = useState('');
  const [newProjectId, setNewProjectId] = useState(projects[0]?.id || '');
  const [newPriority, setNewPriority] = useState<Priority>('Medium');

  const filteredTasks = tasks.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'All' || t.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const getPriorityColor = (p: Priority) => {
    switch (p) {
      case 'High': return 'text-rose-600 bg-rose-50';
      case 'Medium': return 'text-amber-600 bg-amber-50';
      case 'Low': return 'text-emerald-600 bg-emerald-50';
    }
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    onAddTask({
      id: Math.random().toString(36).substr(2, 9),
      projectId: newProjectId,
      title: newTitle,
      description: '',
      priority: newPriority,
      status: 'Todo',
      dueDate: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString()
    });
    setNewTitle('');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-black">Task Board</h2>
          <p className="text-black font-medium">Track and manage individual action items.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-md"
        >
          <Plus size={18} />
          <span>Add Task</span>
        </button>
      </div>

      {/* Filters & Tabs */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
        <div className="flex p-1 bg-slate-100 rounded-lg">
          {(['All', 'Todo', 'In Progress', 'Completed'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${
                activeTab === tab ? 'bg-white text-indigo-600 shadow-sm' : 'text-black hover:text-slate-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-3">
          <div className="relative flex-1 lg:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-black" size={16} />
            <input 
              type="text" 
              placeholder="Search tasks..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none w-full lg:w-64 text-black"
            />
          </div>
          <button className="p-2 border border-slate-200 rounded-lg text-black hover:bg-slate-50 transition-colors">
            <Filter size={18} />
          </button>
        </div>
      </div>

      {/* Task List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTasks.map(task => {
          const project = projects.find(p => p.id === task.projectId);
          return (
            <div key={task.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group relative">
              <div className="flex items-center justify-between mb-3">
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </span>
                <div className="flex items-center space-x-1">
                  <button 
                    onClick={() => onDeleteTask(task.id)}
                    className="p-1 text-black hover:text-rose-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                  <button className="p-1 text-black hover:text-slate-600 transition-colors">
                    <MoreHorizontal size={16} />
                  </button>
                </div>
              </div>

              <h4 className="text-base font-bold text-black mb-1 group-hover:text-indigo-600 transition-colors">
                {task.title}
              </h4>
              <p className="text-black text-sm font-medium mb-4 line-clamp-2">
                {task.description || "No description provided."}
              </p>

              <div className="flex items-center justify-between mt-auto">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: project?.color || '#000000' }} />
                  <span className="text-xs font-bold text-black">{project?.name || 'Unknown'}</span>
                </div>
                <div className="flex items-center text-black space-x-1 text-xs font-bold">
                  <Clock size={12} />
                  <span>{task.dueDate}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
                <div className="flex -space-x-2">
                   <div className="w-6 h-6 rounded-full border-2 border-white bg-indigo-100 flex items-center justify-center text-[8px] font-bold text-indigo-600">
                    IA
                   </div>
                </div>
                <select 
                  value={task.status}
                  onChange={(e) => onUpdateTask({ ...task, status: e.target.value as Status })}
                  className="bg-slate-50 border-none text-[11px] font-bold text-black rounded-md py-1 px-2 focus:ring-0 cursor-pointer"
                >
                  <option value="Todo">Todo</option>
                  <option value="In Progress">Working</option>
                  <option value="Completed">Done</option>
                </select>
              </div>
            </div>
          );
        })}
        {filteredTasks.length === 0 && (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-black bg-white border border-dashed border-slate-200 rounded-2xl">
            <CheckSquare size={48} className="mb-4 opacity-20" />
            <p className="text-lg font-bold">No tasks found</p>
            <p className="text-sm font-medium">Try adjusting your filters or search.</p>
          </div>
        )}
      </div>

      {/* New Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-black">Add New Task</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-black hover:text-slate-600">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleAddTask} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-black mb-1">Task Title</label>
                <input 
                  autoFocus
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  type="text" 
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 text-black" 
                  placeholder="e.g. Implement Auth Flow"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-black mb-1">Project</label>
                <select 
                  value={newProjectId}
                  onChange={e => setNewProjectId(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 text-black font-bold"
                >
                  {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-black mb-1">Priority</label>
                <div className="flex space-x-2">
                  {(['Low', 'Medium', 'High'] as Priority[]).map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setNewPriority(p)}
                      className={`flex-1 py-2 rounded-lg text-sm font-bold border transition-all ${
                        newPriority === p 
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg' 
                          : 'bg-white text-black border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              <button 
                type="submit"
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all mt-4"
              >
                Create Task
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskBoard;
