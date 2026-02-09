
import React, { useState, useEffect, useCallback } from 'react';
import { 
  LayoutDashboard, 
  Briefcase, 
  CheckSquare, 
  Sparkles, 
  Plus, 
  Menu, 
  X,
  ChevronRight,
  TrendingUp,
  Clock,
  AlertCircle
} from 'lucide-react';
import { View, Project, Task } from './types';
import Dashboard from './components/Dashboard';
import ProjectList from './components/ProjectList';
import TaskBoard from './components/TaskBoard';
import AIAssistant from './components/AIAssistant';

const INITIAL_PROJECTS: Project[] = [
  { 
    id: '1', 
    name: 'Vertex 2026 Mobile App', 
    description: 'Internal internship portal for tracking tasks and certificates.', 
    color: '#6366f1',
    createdAt: new Date().toISOString()
  },
  { 
    id: '2', 
    name: 'Marketing Campaign', 
    description: 'Q1 Outreach for student developers.', 
    color: '#ec4899',
    createdAt: new Date().toISOString()
  }
];

const INITIAL_TASKS: Task[] = [
  { 
    id: 't1', 
    projectId: '1', 
    title: 'Design UI Layouts', 
    description: 'Create Figma designs for the dashboard.', 
    priority: 'High', 
    status: 'In Progress', 
    dueDate: '2024-06-15',
    createdAt: new Date().toISOString()
  },
  { 
    id: 't2', 
    projectId: '1', 
    title: 'API Integration', 
    description: 'Connect frontend to Vertex core services.', 
    priority: 'Medium', 
    status: 'Todo', 
    dueDate: '2024-06-20',
    createdAt: new Date().toISOString()
  }
];

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  // New Project Form State
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newColor, setNewColor] = useState('#6366f1');

  const addProject = (project: Project) => setProjects(prev => [...prev, project]);
  const addTask = (task: Task) => setTasks(prev => [...prev, task]);
  const updateTask = (updatedTask: Task) => {
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
  };
  const deleteTask = (id: string) => setTasks(prev => prev.filter(t => t.id !== id));

  const handleProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newProject: Project = {
      id: Math.random().toString(36).substr(2, 9),
      name: newName,
      description: newDesc,
      color: newColor,
      createdAt: new Date().toISOString()
    };
    addProject(newProject);
    setNewName('');
    setNewDesc('');
    setIsProjectModalOpen(false);
    setActiveView('projects');
  };

  const NavItem = ({ view, icon: Icon, label }: { view: View, icon: any, label: string }) => (
    <button
      onClick={() => { setActiveView(view); setIsSidebarOpen(false); }}
      className={`flex items-center space-x-3 w-full p-3 rounded-xl transition-all ${
        activeView === view 
          ? 'bg-indigo-600 text-white shadow-lg' 
          : 'text-black hover:bg-slate-100'
      }`}
    >
      <Icon size={20} className={activeView === view ? 'text-white' : 'text-black'} />
      <span className={`font-medium ${activeView === view ? 'text-white' : 'text-black'}`}>{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-30 w-72 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-10">
            <div className="w-10 h-10 vertex-gradient rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
              V
            </div>
            <div>
              <h1 className="text-xl font-bold text-black tracking-tight">VERTEX</h1>
              <p className="text-xs font-bold text-black uppercase tracking-widest">Development</p>
            </div>
          </div>

          <nav className="space-y-2">
            <NavItem view="dashboard" icon={LayoutDashboard} label="Dashboard" />
            <NavItem view="projects" icon={Briefcase} label="Projects" />
            <NavItem view="tasks" icon={CheckSquare} label="All Tasks" />
            <NavItem view="ai-assistant" icon={Sparkles} label="AI Planner" />
          </nav>
        </div>

        <div className="absolute bottom-0 w-full p-6 border-t border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
              <img src="https://picsum.photos/40/40" alt="Avatar" />
            </div>
            <div>
              <p className="text-sm font-bold text-black">Intern Admin</p>
              <p className="text-xs text-black font-medium">2026 Batch</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-6 bg-white border-bottom border-slate-200 shrink-0">
          <div className="flex items-center lg:hidden">
            <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-black">
              <Menu size={24} />
            </button>
            <span className="ml-3 font-bold text-black">Vertex Tracker</span>
          </div>

          <div className="hidden lg:flex items-center space-x-2 text-black text-sm">
            <span>Vertex Development</span>
            <ChevronRight size={14} />
            <span className="text-black font-bold capitalize">{activeView.replace('-', ' ')}</span>
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-2 text-black hover:bg-slate-100 rounded-full transition-colors relative">
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              <AlertCircle size={20} />
            </button>
            <button 
              onClick={() => setIsProjectModalOpen(true)}
              className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-md"
            >
              <Plus size={18} />
              <span className="hidden sm:inline">New Project</span>
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
          {activeView === 'dashboard' && (
            <Dashboard projects={projects} tasks={tasks} />
          )}
          {activeView === 'projects' && (
            <ProjectList 
              projects={projects} 
              onAddProject={() => setIsProjectModalOpen(true)} 
            />
          )}
          {activeView === 'tasks' && (
            <TaskBoard 
              tasks={tasks} 
              projects={projects} 
              onUpdateTask={updateTask}
              onDeleteTask={deleteTask}
              onAddTask={addTask}
            />
          )}
          {activeView === 'ai-assistant' && (
            <AIAssistant 
              onTasksGenerated={(newTasks) => {
                newTasks.forEach(t => addTask({
                  ...t,
                  id: Math.random().toString(36).substr(2, 9),
                  projectId: projects[0]?.id || '1',
                  status: 'Todo',
                  createdAt: new Date().toISOString()
                }));
                setActiveView('tasks');
              }}
            />
          )}
        </div>
      </main>

      {/* Global Project Creation Modal */}
      {isProjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-black">Create New Project</h3>
              <button onClick={() => setIsProjectModalOpen(false)} className="text-black hover:text-slate-600">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleProjectSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-black mb-1">Project Name</label>
                <input 
                  autoFocus
                  required
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  type="text" 
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 text-black" 
                  placeholder="e.g. Website Redesign"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-black mb-1">Description</label>
                <textarea 
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 h-24 resize-none text-black" 
                  placeholder="What is this project about?"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-black mb-1">Theme Color</label>
                <div className="flex space-x-3">
                  {['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#ef4444'].map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setNewColor(color)}
                      className={`w-8 h-8 rounded-full border-4 transition-all ${newColor === color ? 'border-slate-300 scale-110' : 'border-transparent'}`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
              <button 
                type="submit"
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all mt-4"
              >
                Create Project
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
