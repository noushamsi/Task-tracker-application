
import React, { useState } from 'react';
import { Sparkles, Loader2, Send, CheckCircle2 } from 'lucide-react';
import { getProjectPlan } from '../services/geminiService';
import { Task } from '../types';

interface Props {
  onTasksGenerated: (tasks: Omit<Task, 'id' | 'projectId' | 'status' | 'createdAt'>[]) => void;
}

const AIAssistant: React.FC<Props> = ({ onTasksGenerated }) => {
  const [loading, setLoading] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [generatedTasks, setGeneratedTasks] = useState<any[]>([]);

  const handleGenerate = async () => {
    if (!projectName || !description) return;
    setLoading(true);
    try {
      const tasks = await getProjectPlan(projectName, description);
      setGeneratedTasks(tasks);
    } catch (error) {
      alert("Failed to generate plan. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center p-4 bg-indigo-100 rounded-3xl text-indigo-600 shadow-inner">
          <Sparkles size={40} className="animate-pulse" />
        </div>
        <h2 className="text-3xl font-black text-black">AI Project Planner</h2>
        <p className="text-black font-bold max-w-xl mx-auto">
          Input your project idea, and let Vertex AI break it down into actionable tasks automatically.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        <div className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-black text-black uppercase tracking-wider">Project Name</label>
              <input 
                value={projectName}
                onChange={e => setProjectName(e.target.value)}
                className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold text-black"
                placeholder="e.g. Vertex Mobile App"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-black text-black uppercase tracking-wider">Estimated Goal</label>
              <input 
                className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold text-black"
                placeholder="Finish by end of Q2"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-black text-black uppercase tracking-wider">Full Description & Vision</label>
            <textarea 
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all h-32 resize-none font-bold text-black"
              placeholder="Describe what you want to achieve in detail..."
            />
          </div>

          <button 
            disabled={loading || !projectName || !description}
            onClick={handleGenerate}
            className="w-full flex items-center justify-center space-x-3 bg-black hover:bg-slate-900 text-white py-4 rounded-2xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                <span>Decomposing Project...</span>
              </>
            ) : (
              <>
                <Send size={20} />
                <span>Generate Smart Roadmap</span>
              </>
            )}
          </button>
        </div>

        {generatedTasks.length > 0 && (
          <div className="bg-slate-50 border-t border-slate-100 p-8 animate-in fade-in slide-in-from-bottom-4">
            <h3 className="text-xl font-black text-black mb-6 flex items-center">
              <CheckCircle2 className="text-emerald-500 mr-2" size={24} />
              AI Proposed Roadmap
            </h3>
            <div className="space-y-4">
              {generatedTasks.map((task, idx) => (
                <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start space-x-4">
                  <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm shrink-0">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-black text-black">{task.title}</h4>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        task.priority === 'High' ? 'bg-rose-100 text-rose-600' : 
                        task.priority === 'Medium' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'
                      }`}>
                        {task.priority}
                      </span>
                    </div>
                    <p className="text-sm text-black font-bold mt-1">{task.description}</p>
                    <div className="mt-2 text-xs font-black text-black">Due: {task.dueDate}</div>
                  </div>
                </div>
              ))}
            </div>
            <button 
              onClick={() => onTasksGenerated(generatedTasks)}
              className="w-full mt-8 py-4 vertex-gradient text-white font-bold rounded-2xl shadow-xl shadow-indigo-100 transition-transform hover:scale-[1.01]"
            >
              Add these tasks to my project
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAssistant;
