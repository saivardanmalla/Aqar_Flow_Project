import React from 'react';
import { Home, Users, Calendar, Handshake, BarChart3, ShieldCheck } from 'lucide-react';
import { AqarFlowLogo } from './AqarFlowLogo';

export const Footer: React.FC<{ onNavigateToWorkspace?: () => void }> = ({ onNavigateToWorkspace }) => {
  const highlights = [
    { icon: Home, label: 'Property Listings' },
    { icon: Users, label: 'Lead Management CRM' },
    { icon: Calendar, label: 'Visit Scheduling' },
    { icon: Handshake, label: 'Deal Tracking' },
    { icon: BarChart3, label: 'Analytics & Reports' },
    { icon: ShieldCheck, label: 'Secure & Scalable' },
  ];

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-900 mt-20">
      {/* Feature Strip matching image_c021d3a8.png */}
      <div className="border-b border-slate-800/80 bg-slate-900/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {highlights.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="flex items-center gap-2.5 text-xs text-slate-300 font-medium">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="whitespace-nowrap">{item.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Footer Links & Brand info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4 md:col-span-1">
            <AqarFlowLogo variant="dark" size="md" />
            <p className="text-xs text-slate-400 leading-relaxed">
              One connected real estate ERP, CRM, and property discovery marketplace designed for modern agencies, developers, and brokers in Pakistan.
            </p>
            <div className="pt-2">
              <span className="text-[11px] text-emerald-400 font-semibold uppercase tracking-wider block">
                Islamabad · Lahore · Karachi
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Markets & Hubs</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>Islamabad (F-7, F-8, E-7, Gulberg Greens)</li>
              <li>Lahore (DHA Phase 5 & 6, Gulberg, Bahria)</li>
              <li>Karachi (Clifton, DHA, Bahria Town)</li>
              <li>Rawalpindi (Bahria Town Civic Center, DHA)</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Operations Platform</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>Verified Property Inventory</li>
              <li>Inquiry-to-Lead CRM Automation</li>
              <li>Real-time Agent Visit Scheduling</li>
              <li>Deal Pipeline & Offer Tracking</li>
              {onNavigateToWorkspace && (
                <li>
                  <button
                    onClick={onNavigateToWorkspace}
                    className="text-emerald-400 hover:text-emerald-300 cursor-pointer text-left"
                  >
                    Agency Management Workspace &rarr;
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* VIRELEO Signature matching bottom right of image */}
          <div className="flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Developed By</h4>
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-lg font-black tracking-tight text-white">
                  VIRE<span className="text-emerald-400">LEO</span>
                </div>
                <div className="text-[11px] font-medium text-emerald-400 tracking-widest uppercase mt-0.5">
                  Build • Innovate • Grow
                </div>
                <p className="text-[11px] text-slate-400 mt-2">
                  Enterprise software solutions for real estate and business automation.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 mt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>&copy; {new Date().getFullYear()} AqarFlow by VIRELEO. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Enterprise Real Estate ERP</span>
            <span aria-hidden="true">·</span>
            <span>REST API v1</span>
            <span aria-hidden="true">·</span>
            <span>Multi-Tenant Agency Isolation</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
