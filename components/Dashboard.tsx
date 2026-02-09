
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { Project, Task } from '../types';
import { TrendingUp, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

interface Props {
  projects: Project[];
  tasks: Task[];
}

const Dashboard: React.FC<Props> = ({ projects, tasks }) => {
  const completedTasks = tasks.filter(t => t.status === 'Completed').length;
  const inProgressTasks = tasks.filter(t => t.status === 'In Progress').length;
  const todoTasks = tasks.filter(t => t.status === 'Todo').length;

  const pieData = [
    { name: 'Todo', value: todoTasks, color: '#94a3b8' },
    { name: 'In Progress', value: inProgressTasks, color: '#6366f1' },
    { name: 'Completed', value: completedTasks, color: '#10b981' },
  ];

  const priorityData = [
    { name: 'Low', count: tasks.filter(t => t.priority === 'Low').length },
    { name: 'Medium', count: tasks.filter(t => t.priority === 'Medium').length },
    { name: 'High', count: tasks.filter(t => t.priority === 'High').length },
  ];

  const StatCard = ({ title, value, icon: Icon, color, trend }: any) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${color} bg-opacity-10`}>
          <Icon className={color.replace('bg-', 'text-')} size={24} />
        </div>
        {trend && (
          <div className="flex items-center space-x-1 text-emerald-600 text-sm font-bold">
            <TrendingUp size={14} />
            <span>{trend}%</span>
          </div>
        )}
      </div>
      <h3 className="text-black text-sm font-bold">{title}</h3>
      <p className="text-2xl font-black text-black mt-1">{value}</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-black">Program Overview</h2>
          <p className="text-black font-medium">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="flex items-center bg-white border border-slate-200 rounded-lg p-1">
          <button className="px-4 py-1.5 text-sm font-bold bg-slate-100 rounded-md text-black">Last 7 Days</button>
          <button className="px-4 py-1.5 text-sm font-bold text-black hover:text-indigo-600">Last 30 Days</button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Active Projects" value={projects.length} icon={TrendingUp} color="bg-indigo-600" trend="12" />
        <StatCard title="Total Tasks" value={tasks.length} icon={Clock} color="bg-blue-600" />
        <StatCard title="Completed" value={completedTasks} icon={CheckCircle} color="bg-emerald-600" trend="8" />
        <StatCard title="High Priority" value={tasks.filter(t => t.priority === 'High').length} icon={AlertTriangle} color="bg-rose-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Task Progress Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-black mb-6">Tasks by Priority</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={priorityData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#000000', fontWeight: 'bold'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#000000', fontWeight: 'bold'}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', color: '#000' }}
                />
                <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-black mb-6">Status Distribution</h3>
          <div className="h-[250px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{color: '#000'}} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3 mt-4">
            {pieData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm font-bold text-black">{item.name}</span>
                </div>
                <span className="text-sm font-black text-black">{Math.round((item.value / tasks.length) * 100) || 0}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <h3 className="text-lg font-bold text-black mb-4">Recent Projects</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="pb-3 font-bold text-black text-sm">Project Name</th>
                <th className="pb-3 font-bold text-black text-sm">Created</th>
                <th className="pb-3 font-bold text-black text-sm">Progress</th>
                <th className="pb-3 font-bold text-black text-sm">Tasks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {projects.map(p => {
                const projectTasks = tasks.filter(t => t.projectId === p.id);
                const projectCompleted = projectTasks.filter(t => t.status === 'Completed').length;
                const progress = projectTasks.length ? Math.round((projectCompleted / projectTasks.length) * 100) : 0;
                
                return (
                  <tr key={p.id} className="group hover:bg-slate-50 transition-colors">
                    <td className="py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-10 rounded-full" style={{ backgroundColor: p.color }} />
                        <span className="font-black text-black">{p.name}</span>
                      </div>
                    </td>
                    <td className="py-4 text-sm text-black font-medium">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4">
                      <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-600" style={{ width: `${progress}%` }} />
                      </div>
                    </td>
                    <td className="py-4">
                      <span className="px-2 py-1 bg-slate-100 text-black text-xs font-black rounded-md">
                        {projectTasks.length} tasks
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
