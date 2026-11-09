import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import { DashboardStats } from '../../types';
import { 
  Home, 
  Users, 
  Calendar, 
  Handshake, 
  ArrowUpRight, 
  TrendingUp, 
  Clock, 
  MapPin, 
  ArrowRight,
  RefreshCw
} from 'lucide-react';

interface DashboardViewProps {
  onNavigateToView: (view: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigateToView }) => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const data = await api.getDashboardStats();
      setStats(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [user]);

  if (loading && !stats) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 w-64 bg-slate-200 rounded-lg" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-slate-200 rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-72 bg-slate-200 rounded-2xl" />
          <div className="h-72 bg-slate-200 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Welcome back, <strong className="text-slate-800">{user?.full_name}</strong>! Here is your agency operational overview.
          </p>
        </div>

        <button
          onClick={fetchStats}
          className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-2xs transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Metrics</span>
        </button>
      </div>

      {error && (
        <div className="p-4 text-xs text-red-700 bg-red-50 border border-red-200 rounded-xl">
          {error}
        </div>
      )}

      {/* KPI Cards Row matching image_c021d3a8.png */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Properties */}
        <div 
          onClick={() => onNavigateToView('properties')}
          className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Home className="w-5 h-5" />
            </div>
            <span className="flex items-center text-xs font-bold text-emerald-600">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+{stats?.trends.propertiesGrowth || 12}%</span>
            </span>
          </div>
          <div className="text-xs font-medium text-slate-500">Total Properties</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1 font-mono tabular-nums">
            {stats?.totalProperties ?? 128}
          </div>
        </div>

        {/* New Leads */}
        <div 
          onClick={() => onNavigateToView('leads')}
          className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Users className="w-5 h-5" />
            </div>
            <span className="flex items-center text-xs font-bold text-emerald-600">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+{stats?.trends.leadsGrowth || 8}%</span>
            </span>
          </div>
          <div className="text-xs font-medium text-slate-500">New Leads</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1 font-mono tabular-nums">
            {stats?.newLeads ?? 24}
          </div>
        </div>

        {/* Scheduled Visits */}
        <div 
          onClick={() => onNavigateToView('visits')}
          className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Calendar className="w-5 h-5" />
            </div>
            <span className="flex items-center text-xs font-bold text-emerald-600">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+{stats?.trends.visitsGrowth || 15}%</span>
            </span>
          </div>
          <div className="text-xs font-medium text-slate-500">Scheduled Visits</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1 font-mono tabular-nums">
            {stats?.scheduledVisits ?? 18}
          </div>
        </div>

        {/* Open Deals */}
        <div 
          onClick={() => onNavigateToView('deals')}
          className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Handshake className="w-5 h-5" />
            </div>
            <span className="flex items-center text-xs font-bold text-emerald-600">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+{stats?.trends.dealsGrowth || 10}%</span>
            </span>
          </div>
          <div className="text-xs font-medium text-slate-500">Open Deals</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1 font-mono tabular-nums">
            {stats?.openDeals ?? 12}
          </div>
        </div>
      </div>

      {/* Visualizations Row matching image_c021d3a8.png */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Inquiries Line Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Monthly Inquiries</h3>
              <p className="text-[11px] text-slate-400">Total customer inquiries received over time</p>
            </div>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
              +32% YTD
            </span>
          </div>

          {/* SVG Line Chart */}
          <div className="relative h-56 w-full flex items-end pt-8 pb-4">
            {/* Tooltip simulation for May matching screenshot */}
            <div className="absolute top-2 right-1/4 bg-slate-900 text-white text-[11px] font-medium py-1 px-2.5 rounded-lg shadow-md z-10 pointer-events-none">
              May · <strong>124 inquiries</strong>
            </div>

            <svg viewBox="0 0 500 160" className="w-full h-full overflow-visible">
              {/* Grid Lines */}
              <line x1="0" y1="140" x2="500" y2="140" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1="100" x2="500" y2="100" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1="60" x2="500" y2="60" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1="20" x2="500" y2="20" stroke="#f1f5f9" strokeWidth="1" />

              {/* Gradient Area Fill */}
              <defs>
                <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d="M 20 120 L 100 100 L 180 65 L 260 75 L 340 30 L 420 50 L 480 20 L 480 140 L 20 140 Z"
                fill="url(#blueGrad)"
              />

              {/* Main Line */}
              <path
                d="M 20 120 Q 60 110 100 100 T 180 65 T 260 75 T 340 30 T 420 50 T 480 20"
                fill="none"
                stroke="#2563EB"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Points */}
              {[
                { x: 20, y: 120 },
                { x: 100, y: 100 },
                { x: 180, y: 65 },
                { x: 260, y: 75 },
                { x: 340, y: 30, active: true },
                { x: 420, y: 50 },
                { x: 480, y: 20 },
              ].map((pt, i) => (
                <circle
                  key={i}
                  cx={pt.x}
                  cy={pt.y}
                  r={pt.active ? 6 : 4}
                  fill={pt.active ? '#10B981' : '#2563EB'}
                  stroke="#FFFFFF"
                  strokeWidth="2.5"
                />
              ))}
            </svg>
          </div>

          {/* Month labels */}
          <div className="flex justify-between text-[11px] text-slate-400 font-medium px-2 border-t border-slate-100 pt-2">
            <span>Jan</span>
            <span>Feb</span>
            <span>Mar</span>
            <span>Apr</span>
            <span className="font-bold text-slate-900">May</span>
            <span>Jun</span>
            <span>Jul</span>
          </div>
        </div>

        {/* Lead Pipeline Donut Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Lead Pipeline</h3>
              <p className="text-[11px] text-slate-400">Current active leads by conversion stage</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-around gap-6 my-auto py-2">
            {/* Donut Chart representation */}
            <div className="relative w-36 h-36 shrink-0">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                {/* Background Ring */}
                <circle cx="50" cy="50" r="38" fill="none" stroke="#f1f5f9" strokeWidth="14" />
                {/* Segment 1: New (35%) -> Blue */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="none"
                  stroke="#2563EB"
                  strokeWidth="14"
                  strokeDasharray="83.5 155"
                  strokeDashoffset="0"
                />
                {/* Segment 2: Contacted (30%) -> Amber */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="none"
                  stroke="#F59E0B"
                  strokeWidth="14"
                  strokeDasharray="71.6 167"
                  strokeDashoffset="-83.5"
                />
                {/* Segment 3: Qualified (20%) -> Slate */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="none"
                  stroke="#64748B"
                  strokeWidth="14"
                  strokeDasharray="47.7 191"
                  strokeDashoffset="-155.1"
                />
                {/* Segment 4: Converted (15%) -> Emerald */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="14"
                  strokeDasharray="35.8 203"
                  strokeDashoffset="-202.8"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xs text-slate-400 font-medium">Pipeline</span>
                <span className="text-base font-extrabold text-slate-900 font-mono">100%</span>
              </div>
            </div>

            {/* Legend matching screenshot */}
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-600 shrink-0" />
                <span className="text-slate-600">New Inquiries</span>
                <span className="ml-auto font-mono font-bold text-slate-900">35%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-500 shrink-0" />
                <span className="text-slate-600">Contacted</span>
                <span className="ml-auto font-mono font-bold text-slate-900">30%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-slate-500 shrink-0" />
                <span className="text-slate-600">Qualified</span>
                <span className="ml-auto font-mono font-bold text-slate-900">20%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 shrink-0" />
                <span className="text-slate-600">Converted</span>
                <span className="ml-auto font-mono font-bold text-slate-900">15%</span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Average conversion cycle: 14 days</span>
            <button
              onClick={() => onNavigateToView('leads')}
              className="text-emerald-600 hover:text-emerald-700 font-semibold cursor-pointer"
            >
              Open Pipeline &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Panels Row matching image_c021d3a8.png */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity Panel */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900">Recent Activity</h3>
            <span className="text-[11px] text-slate-400">Live system events</span>
          </div>

          <div className="space-y-3.5">
            {stats?.recentActivities && stats.recentActivities.length > 0 ? (
              stats.recentActivities.map((act) => (
                <div key={act.id} className="flex items-start gap-3 text-xs">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                    <TrendingUp className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-slate-800 font-medium">{act.description}</p>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <Clock className="w-2.5 h-2.5" />
                      <span>{new Date(act.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 py-4 text-center">No recent activities logged.</p>
            )}
          </div>
        </div>

        {/* Upcoming Visits Panel matching image_c021d3a8.png */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900">Upcoming Visits</h3>
            <button
              onClick={() => onNavigateToView('visits')}
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {stats?.upcomingVisits && stats.upcomingVisits.length > 0 ? (
              stats.upcomingVisits.map((visit) => (
                <div
                  key={visit.id}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">
                        {visit.visit_date} · {visit.start_time}
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{visit.property?.locality || 'Property Location'}</span>
                        {visit.lead && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span>{visit.lead.customer_name}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                    visit.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {visit.status}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 py-4 text-center">No upcoming visits scheduled.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
