import React, { useState } from 'react';
import { AqarFlowLogo } from './AqarFlowLogo';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, LogIn, UserCheck, Shield, ChevronDown, Menu, X } from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onOpenLogin: () => void;
  onOpenWorkspace: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onOpenLogin,
  onOpenWorkspace,
}) => {
  const { user, isAuthenticated, isAdmin, switchDemoRole } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'properties', label: 'Properties' },
    { id: 'about', label: 'About Us' },
    { id: 'services', label: 'Services' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => {
            onSelectTab('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="text-left focus-visible:outline-hidden cursor-pointer"
        >
          <AqarFlowLogo size="md" />
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => onSelectTab(link.id)}
              className={`transition-colors whitespace-nowrap cursor-pointer hover:text-emerald-600 ${
                currentTab === link.id
                  ? 'text-emerald-600 font-semibold border-b-2 border-emerald-500 pb-0.5'
                  : ''
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Zone 3: Actions & Workspace Entry */}
        <div className="hidden lg:flex items-center gap-3 shrink-0">
          {isAuthenticated && isAdmin ? (
            <button
              onClick={onOpenWorkspace}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-sm cursor-pointer whitespace-nowrap"
            >
              <LayoutDashboard className="w-4 h-4 text-emerald-400" />
              <span>Admin Dashboard</span>
            </button>
          ) : isAuthenticated ? (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg text-xs font-semibold text-slate-700">
              <span>{user?.full_name || 'Signed In'}</span>
            </div>
          ) : (
            <button
              onClick={onOpenLogin}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-sm cursor-pointer whitespace-nowrap"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In</span>
            </button>
          )}
        </div>

        {/* Mobile menu hamburger */}
        <div className="md:hidden flex items-center gap-2">
          {isAuthenticated && (
            <button
              onClick={onOpenWorkspace}
              className="px-2.5 py-1 text-xs font-medium text-white bg-slate-900 rounded-md"
            >
              Workspace
            </button>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-600 hover:text-slate-900 cursor-pointer"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-4 space-y-2">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                onSelectTab(link.id);
                setMobileMenuOpen(false);
              }}
              className={`block w-full text-left px-3 py-2 text-sm rounded-md font-medium ${
                currentTab === link.id
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              {link.label}
            </button>
          ))}
          <div className="pt-2 border-t border-slate-200 flex flex-col gap-2">
            {isAuthenticated ? (
              <button
                onClick={() => {
                  onOpenWorkspace();
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-center px-4 py-2.5 text-xs font-semibold text-white rounded-lg ${
                  isAdmin ? 'bg-slate-900' : 'bg-blue-600'
                }`}
              >
                {isAdmin ? 'Open Admin Dashboard' : 'Open User Dashboard'}
              </button>
            ) : (
              <button
                onClick={() => {
                  onOpenLogin();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-center px-4 py-2.5 text-xs font-semibold text-white bg-emerald-600 rounded-lg"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
