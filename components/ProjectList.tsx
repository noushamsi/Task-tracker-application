
import React from 'react';
import { Project } from '../types';
import { Plus, Search, MoreVertical, Calendar } from 'lucide-react';

interface Props {
  projects: Project[];
  onAddProject: () => void;
}

const ProjectList: React.FC<Props> = ({ projects, onAddProject }) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-black">Projects</h2>
          <p className="text-black font-medium">Manage and organize your team's workflows.</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-black" size={18} />
            <input 
              type="text" 
              placeholder="Search projects..." 
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none w-full sm:w-64 text-black"
            />
          </div>
          <button 
            onClick={onAddProject}
            className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-md"
          >
            <Plus size={18} />
            <span>New Project</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {projects.map(project => (
          <div key={project.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-inner"
                style={{ backgroundColor: project.color }}
              >
                {project.name.charAt(0)}
              </div>
              <button className="text-black hover:text-slate-600 p-1">
                <MoreVertical size={20} />
              </button>
            </div>
            
            <h3 className="text-lg font-bold text-black mb-2 group-hover:text-indigo-600 transition-colors">
              {project.name}
            </h3>
            <p className="text-black text-sm font-medium line-clamp-2 mb-6">
              {project.description}
            </p>

            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-bold text-black uppercase tracking-wider">
                <span>Progress</span>
                <span>65%</span>
              </div>
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-600 rounded-full" style={{ width: '65%' }} />
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
              <div className="flex -space-x-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white overflow-hidden bg-slate-200">
                    <img src={`https://picsum.photos/32/32?random=${i}`} alt="Avatar" />
                  </div>
                ))}
                <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-black">
                  +2
                </div>
              </div>
              <div className="flex items-center text-black space-x-3 text-xs font-bold">
                <div className="flex items-center space-x-1">
                  <Calendar size={14} />
                  <span>Jun 20</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectList;
