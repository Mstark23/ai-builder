// 1. Import the component
import { NewLeadsSection, useDashboardStats } from '@/components/NewLeadsSection';

// 2. Inside your dashboard component, add at the TOP before stats cards:
export default function DashboardPage() {
  const stats = useDashboardStats(); // Optional: replace your existing stats

  return (
    <div className="space-y-6">
      {/* ✨ NEW: Live lead feed with claim button */}
      <NewLeadsSection />

      {/* Your existing dashboard content below */}
      <div className="grid grid-cols-4 gap-4">
        {/* ...existing stats cards... */}
        {/* Optional: add these new stat cards */}
        <div className="bg-white rounded-2xl p-6 border border-neutral-200">
          <div className="text-sm text-neutral-500">Pending Leads</div>
          <div className="text-3xl font-semibold mt-1">{stats.pendingLeads}</div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-neutral-200">
          <div className="text-sm text-neutral-500">Today's Leads</div>
          <div className="text-3xl font-semibold mt-1">{stats.todayLeads}</div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-neutral-200">
          <div className="text-sm text-neutral-500">Conversion Rate</div>
          <div className="text-3xl font-semibold mt-1">{stats.conversionRate}%</div>
        </div>
      </div>
      {/* ...rest of existing dashboard... */}
    </div>
  );
}
