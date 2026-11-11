import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { PublicPages } from './components/PublicPages';
import { Footer } from './components/Footer';
import { PropertyDetailModal } from './components/PropertyDetailModal';
import { InquiryModal } from './components/InquiryModal';
import { AuthModal } from './components/AuthModal';

import { WorkspaceLayout } from './components/workspace/WorkspaceLayout';
import { DashboardView } from './components/workspace/DashboardView';
import { PropertiesView } from './components/workspace/PropertiesView';
import { LeadsView } from './components/workspace/LeadsView';
import { VisitsView } from './components/workspace/VisitsView';
import { DealsView } from './components/workspace/DealsView';
import { AgentsView } from './components/workspace/AgentsView';
import { SettingsView } from './components/workspace/SettingsView';

import { Property } from './types';

function AppContent() {
  const { isAuthenticated, loading } = useAuth();

  // Mode: 'marketplace' or 'workspace'
  const [appMode, setAppMode] = useState<'marketplace' | 'workspace'>('marketplace');

  // Marketplace states
  const [marketplaceTab, setMarketplaceTab] = useState<string>('home');
  const [heroSearchParams, setHeroSearchParams] = useState<any>(undefined);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [inquiryProperty, setInquiryProperty] = useState<Property | null>(null);
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Workspace states
  const [workspaceView, setWorkspaceView] = useState<string>('dashboard');

  // If user is NOT authenticated, force the Login Page as the gatekeeper
  if (!isAuthenticated && !loading) {
    const isAdminRoute = typeof window !== 'undefined' && 
      (window.location.pathname.toLowerCase().includes('/admin') || window.location.hash.toLowerCase().includes('admin'));

    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <AuthModal
          isOpen={true}
          initialServerType={isAdminRoute ? 'admin' : undefined}
          onClose={() => {}}
          onSuccess={() => setAppMode('workspace')}
        />
      </div>
    );
  }

  const handleHeroSearch = (filters: any) => {
    setHeroSearchParams(filters);
    setMarketplaceTab('properties');
  };

  const handleSelectProperty = (property: Property) => {
    setSelectedProperty(property);
    setIsDetailModalOpen(true);
  };

  const handleInquireProperty = (property: Property) => {
    setInquiryProperty(property);
    setIsInquiryModalOpen(true);
  };

  const handleOpenWorkspace = () => {
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
    } else {
      setAppMode('workspace');
    }
  };

  // If in Agency Workspace
  if (appMode === 'workspace' && isAuthenticated) {
    return (
      <WorkspaceLayout
        currentView={workspaceView}
        onSelectView={setWorkspaceView}
        onExitToMarketplace={() => setAppMode('marketplace')}
      >
        {workspaceView === 'dashboard' && (
          <DashboardView onNavigateToView={setWorkspaceView} />
        )}
        {workspaceView === 'properties' && <PropertiesView />}
        {workspaceView === 'leads' && <LeadsView />}
        {workspaceView === 'visits' && <VisitsView />}
        {workspaceView === 'deals' && <DealsView />}
        {workspaceView === 'agents' && <AgentsView />}
        {workspaceView === 'reports' && (
          <DashboardView onNavigateToView={setWorkspaceView} />
        )}
        {workspaceView === 'settings' && <SettingsView />}
      </WorkspaceLayout>
    );
  }

  // Public Marketplace Experience
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        currentTab={marketplaceTab}
        onSelectTab={setMarketplaceTab}
        onOpenLogin={() => setIsAuthModalOpen(true)}
        onOpenWorkspace={handleOpenWorkspace}
      />

      {/* Hero Section on Home tab */}
      {marketplaceTab === 'home' && (
        <HeroSection onSearch={handleHeroSearch} />
      )}

      {/* Main Public Content */}
      <main className="flex-1">
        <PublicPages
          currentTab={marketplaceTab}
          onSelectProperty={handleSelectProperty}
          onInquireProperty={handleInquireProperty}
          onNavigateToWorkspace={handleOpenWorkspace}
          searchParams={heroSearchParams}
        />
      </main>

      {/* Footer */}
      <Footer onNavigateToWorkspace={handleOpenWorkspace} />

      {/* Property Details Modal */}
      <PropertyDetailModal
        property={selectedProperty}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onInquire={handleInquireProperty}
      />

      {/* Inquiry Modal -> Directly creates CRM lead */}
      <InquiryModal
        property={inquiryProperty}
        isOpen={isInquiryModalOpen}
        onClose={() => setIsInquiryModalOpen(false)}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => setAppMode('workspace')}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
