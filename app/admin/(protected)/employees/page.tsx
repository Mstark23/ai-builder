'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

type Employee = {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar_url: string | null;
  status: 'online' | 'offline' | 'busy';
  created_at: string;
};

type Project = {
  id: string;
  business_name: string;
  status: string;
  assigned_to: string | null;
};

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const mockEmployees: Employee[] = [
    { id: '1', name: 'Sarah Chen', email: 'sarah@verktorlabs.com', role: 'Senior Designer', avatar_url: null, status: 'online', created_at: '2024-01-01' },
    { id: '2', name: 'Mike Johnson', email: 'mike@verktorlabs.com', role: 'Designer', avatar_url: null, status: 'online', created_at: '2024-02-15' },
    { id: '3', name: 'Emma Wilson', email: 'emma@verktorlabs.com', role: 'Designer', avatar_url: null, status: 'offline', created_at: '2024-03-10' },
    { id: '4', name: 'David Park', email: 'david@verktorlabs.com', role: 'Junior Designer', avatar_url: null, status: 'busy', created_at: '2024-06-01' },
  ];

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const { data: projectsData } = await supabase.from('projects').select('id, business_name, status, assigned_to').not('status', 'in', '("DELIVERED","CANCELLED")');
      if (projectsData) setProjects(projectsData);
      setEmployees(mockEmployees);
    } catch (err) { console.error('Error loading data:', err); }
    finally { setLoading(false); }
  };

  const getEmployeeProjects = (employeeId: string) => {
    const index = employees.findIndex(e => e.id === employeeId);
    const perEmployee = Math.ceil(projects.length / employees.length);
    return projects.slice(index * perEmployee, (index + 1) * perEmployee);
  };

  const getWorkloadPercentage = (employeeId: string) => Math.min((getEmployeeProjects(employeeId).length / 5) * 100, 100);

  const getWorkloadColor = (p: number) => p >= 80 ? { bar: 'bg-orange-500', text: 'text-orange-600' } : p >= 50 ? { bar: 'bg-emerald-500', text: 'text-emerald-600' } : { bar: 'bg-blue-500', text: 'text-blue-600' };

  const getStatusConfig = (s: string) => ({ online: { color: 'bg-emerald-500', label: 'Online' }, offline: { color: 'bg-neutral-400', label: 'Offline' }, busy: { color: 'bg-orange-500', label: 'Busy' } }[s] || { color: 'bg-neutral-400', label: 'Offline' });

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="p-6 lg:p-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        <div><h1 className="font-display text-3xl lg:text-4xl font-medium text-black">Team</h1><p className="font-body text-neutral-500 mt-1">Manage your team members and workload</p></div>
        <button onClick={() => setShowAddModal(true)} className="px-5 py-2.5 bg-black text-white font-body text-sm font-medium rounded-full hover:bg-black/80 transition-colors flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>Invite Member
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl border border-neutral-200 p-5"><div className="font-display text-3xl font-semibold text-black">{employees.length}</div><div className="font-body text-sm text-neutral-500 mt-1">Team Members</div></div>
        <div className="bg-blue-50 rounded-2xl border border-blue-200 p-5"><div className="font-display text-3xl font-semibold text-blue-700">{projects.length}</div><div className="font-body text-sm text-blue-600 mt-1">Active Projects</div></div>
        <div className="bg-emerald-50 rounded-2xl border border-emerald-200 p-5"><div className="font-display text-3xl font-semibold text-emerald-700">64</div><div className="font-body text-sm text-emerald-600 mt-1">Completed Total</div></div>
        <div className="bg-purple-50 rounded-2xl border border-purple-200 p-5"><div className="font-display text-3xl font-semibold text-purple-700">2.1 days</div><div className="font-body text-sm text-purple-600 mt-1">Avg. Delivery</div></div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {employees.map((employee) => {
          const employeeProjects = getEmployeeProjects(employee.id);
          const workload = getWorkloadPercentage(employee.id);
          const workloadColors = getWorkloadColor(workload);
          const statusConfig = getStatusConfig(employee.status);
          const completedForEmployee = Math.floor(Math.random() * 20) + 5;
          const avgDeliveryTime = (Math.random() * 1 + 1.5).toFixed(1);

          return (
            <div key={employee.id} className="bg-white rounded-2xl border border-neutral-200 p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setSelectedEmployee(employee)}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-xl font-body font-bold">{employee.name.split(' ').map(n => n[0]).join('')}</div>
                    <span className={`absolute -bottom-1 -right-1 w-4 h-4 ${statusConfig.color} rounded-full border-2 border-white`} />
                  </div>
                  <div><h3 className="font-body font-semibold text-black">{employee.name}</h3><p className="font-body text-sm text-neutral-500">{employee.role}</p></div>
                </div>
              </div>
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between"><span className="font-body text-sm text-neutral-500">Active Projects</span><span className="font-body text-sm font-medium text-black">{employeeProjects.length}</span></div>
                <div className="flex items-center justify-between"><span className="font-body text-sm text-neutral-500">Completed</span><span className="font-body text-sm font-medium text-black">{completedForEmployee}</span></div>
                <div className="flex items-center justify-between"><span className="font-body text-sm text-neutral-500">Avg. Delivery</span><span className="font-body text-sm font-medium text-emerald-600">{avgDeliveryTime} days</span></div>
              </div>
              <div className="pt-4 border-t border-neutral-100">
                <div className="flex items-center justify-between mb-2"><span className="font-body text-xs text-neutral-500">Workload</span><span className={`font-body text-xs font-medium ${workloadColors.text}`}>{Math.round(workload)}%</span></div>
                <div className="h-2 bg-neutral-100 rounded-full overflow-hidden"><div className={`h-full ${workloadColors.bar} rounded-full transition-all duration-500`} style={{ width: `${workload}%` }} /></div>
              </div>
            </div>
          );
        })}
        <div onClick={() => setShowAddModal(true)} className="bg-neutral-50 rounded-2xl border-2 border-dashed border-neutral-300 p-6 flex flex-col items-center justify-center text-center hover:border-black hover:bg-white transition-all cursor-pointer min-h-[280px]">
          <div className="w-14 h-14 bg-neutral-200 rounded-2xl flex items-center justify-center mb-4"><svg className="w-6 h-6 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg></div>
          <h3 className="font-body font-semibold text-black mb-1">Add Team Member</h3><p className="font-body text-sm text-neutral-500">Invite a new designer</p>
        </div>
      </div>

      <div className="mt-8 bg-white rounded-2xl border border-neutral-200 p-6">
        <h2 className="font-body font-semibold text-black mb-6">Workload Overview</h2>
        <div className="space-y-4">
          {employees.map((employee) => {
            const workload = getWorkloadPercentage(employee.id);
            const workloadColors = getWorkloadColor(workload);
            const employeeProjects = getEmployeeProjects(employee.id);
            return (
              <div key={employee.id} className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white text-sm font-body font-bold flex-shrink-0">{employee.name.split(' ').map(n => n[0]).join('')}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1"><span className="font-body text-sm font-medium text-black">{employee.name}</span><span className="font-body text-xs text-neutral-500">{employeeProjects.length} projects</span></div>
                  <div className="h-2 bg-neutral-100 rounded-full overflow-hidden"><div className={`h-full ${workloadColors.bar} rounded-full transition-all duration-500`} style={{ width: `${workload}%` }} /></div>
                </div>
                <span className={`font-body text-sm font-medium ${workloadColors.text} w-12 text-right`}>{Math.round(workload)}%</span>
              </div>
            );
          })}
        </div>
      </div>

      {showAddModal && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setShowAddModal(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl p-6 z-50">
            <div className="flex items-center justify-between mb-6"><h2 className="font-display text-xl font-medium text-black">Invite Team Member</h2><button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-neutral-100 rounded-lg"><svg className="w-5 h-5 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button></div>
            <div className="space-y-4">
              <div><label className="block font-body text-sm font-medium text-black mb-2">Full Name</label><input type="text" placeholder="Enter name" className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl font-body text-sm focus:outline-none focus:border-black" /></div>
              <div><label className="block font-body text-sm font-medium text-black mb-2">Email Address</label><input type="email" placeholder="Enter email" className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl font-body text-sm focus:outline-none focus:border-black" /></div>
              <div><label className="block font-body text-sm font-medium text-black mb-2">Role</label><select className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl font-body text-sm focus:outline-none focus:border-black"><option>Junior Designer</option><option>Designer</option><option>Senior Designer</option><option>Lead Designer</option></select></div>
            </div>
            <div className="flex gap-3 mt-6"><button onClick={() => setShowAddModal(false)} className="flex-1 px-4 py-3 border border-neutral-200 text-neutral-600 font-body text-sm font-medium rounded-xl hover:bg-neutral-50">Cancel</button><button className="flex-1 px-4 py-3 bg-black text-white font-body text-sm font-medium rounded-xl hover:bg-black/80">Send Invite</button></div>
          </div>
        </>
      )}

      {selectedEmployee && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setSelectedEmployee(null)} />
          <div className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white z-50 overflow-y-auto">
            <div className="p-6 border-b border-neutral-200 flex items-center justify-between sticky top-0 bg-white"><h2 className="font-body font-semibold text-lg text-black">Team Member</h2><button onClick={() => setSelectedEmployee(null)} className="p-2 hover:bg-neutral-100 rounded-lg"><svg className="w-5 h-5 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button></div>
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-2xl font-body font-bold">{selectedEmployee.name.split(' ').map(n => n[0]).join('')}</div>
                <div><h3 className="font-body font-semibold text-xl text-black">{selectedEmployee.name}</h3><p className="font-body text-sm text-neutral-500">{selectedEmployee.role}</p><div className="flex items-center gap-2 mt-1"><span className={`w-2 h-2 rounded-full ${getStatusConfig(selectedEmployee.status).color}`} /><span className="font-body text-xs text-neutral-500">{getStatusConfig(selectedEmployee.status).label}</span></div></div>
              </div>
              <div className="mb-6 p-4 bg-neutral-50 rounded-xl"><h4 className="font-body font-medium text-sm text-black mb-3">Contact Information</h4><div className="space-y-2"><div className="flex items-center justify-between"><span className="font-body text-sm text-neutral-500">Email</span><span className="font-body text-sm text-black">{selectedEmployee.email}</span></div><div className="flex items-center justify-between"><span className="font-body text-sm text-neutral-500">Joined</span><span className="font-body text-sm text-black">{new Date(selectedEmployee.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span></div></div></div>
              <div className="mb-6"><h4 className="font-body font-medium text-sm text-black mb-3">Active Projects</h4><div className="space-y-2">{getEmployeeProjects(selectedEmployee.id).map((project) => (<a key={project.id} href={`/admin/projects/${project.id}`} className="flex items-center justify-between p-3 bg-white border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors"><div className="flex items-center gap-3"><div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white text-xs font-body font-semibold">{project.business_name?.charAt(0) || '?'}</div><span className="font-body text-sm font-medium text-black">{project.business_name}</span></div><svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg></a>))}{getEmployeeProjects(selectedEmployee.id).length === 0 && <p className="font-body text-sm text-neutral-500 text-center py-4">No active projects</p>}</div></div>
              <div className="flex gap-3"><button className="flex-1 px-4 py-2.5 bg-black text-white font-body text-sm font-medium rounded-xl hover:bg-black/80">Assign Project</button><button className="px-4 py-2.5 border border-neutral-200 text-neutral-600 font-body text-sm font-medium rounded-xl hover:bg-neutral-50">Edit</button></div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
