import React, { useState, useEffect } from 'react';
import { Property } from '../types';
import { api } from '../lib/api';
import { PropertyCard } from './PropertyCard';
import { 
  Building2, 
  ShieldCheck, 
  Users2, 
  CheckCircle2, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Filter, 
  SlidersHorizontal,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Award
} from 'lucide-react';

interface PublicPagesProps {
  currentTab: string;
  onSelectProperty: (property: Property) => void;
  onInquireProperty: (property: Property) => void;
  onNavigateToWorkspace: () => void;
  searchParams?: {
    purpose?: string;
    property_type?: string;
    city?: string;
    search?: string;
  };
}

export const PublicPages: React.FC<PublicPagesProps> = ({
  currentTab,
  onSelectProperty,
  onInquireProperty,
  onNavigateToWorkspace,
  searchParams,
}) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states for Properties directory
  const [purpose, setPurpose] = useState<string>(searchParams?.purpose || 'all');
  const [propertyType, setPropertyType] = useState<string>(searchParams?.property_type || 'all');
  const [city, setCity] = useState<string>(searchParams?.city || 'all');
  const [search, setSearch] = useState<string>(searchParams?.search || '');
  const [bedrooms, setBedrooms] = useState<string>('all');
  const [sort, setSort] = useState<string>('newest');

  // Sync when hero search triggers
  useEffect(() => {
    if (searchParams) {
      if (searchParams.purpose) setPurpose(searchParams.purpose);
      if (searchParams.property_type) setPropertyType(searchParams.property_type);
      if (searchParams.city) setCity(searchParams.city);
      if (searchParams.search !== undefined) setSearch(searchParams.search);
    }
  }, [searchParams]);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const res = await api.getPublicProperties({
        purpose: purpose !== 'all' ? purpose : undefined,
        property_type: propertyType !== 'all' ? propertyType : undefined,
        city: city !== 'all' ? city : undefined,
        bedrooms: bedrooms !== 'all' ? Number(bedrooms) : undefined,
        search: search.trim() || undefined,
        sort,
      });
      setProperties(res.properties);
    } catch (err: any) {
      setError(err.message || 'Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [purpose, propertyType, city, bedrooms, sort]);

  // Handle live search button click
  const handleApplySearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProperties();
  };

  // -------------------------------------------------------------
  // TAB: HOME (Featured Properties + Agency Introduction + Highlights)
  // -------------------------------------------------------------
  if (currentTab === 'home') {
    const featuredList = properties.slice(0, 3);

    return (
      <div className="space-y-20 py-12">
        {/* Featured Properties section matching image_c021d3a8.png */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
                Curated Listings
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                Featured Properties
              </h2>
            </div>
            <button
              onClick={() => {
                const propsBtn = document.querySelector('[data-tab="properties"]');
                if (propsBtn) (propsBtn as HTMLElement).click();
              }}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1.5 cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-96 rounded-2xl bg-slate-200 animate-pulse" />
              ))}
            </div>
          ) : error ? (
            <div className="p-6 text-center text-sm text-red-600 bg-red-50 rounded-2xl">
              {error}
            </div>
          ) : featuredList.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
              <p className="text-sm text-slate-500">No properties matching your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredList.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  onSelect={onSelectProperty}
                  onInquire={onInquireProperty}
                />
              ))}
            </div>
          )}
        </section>

        {/* Categories Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
              Explore by Category
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Find Property Across All Asset Classes
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              {
                title: 'Luxury Villas & Houses',
                count: '42 Available',
                city: 'Islamabad, Lahore, Karachi',
                icon: Building2,
              },
              {
                title: 'Modern Apartments',
                count: '38 Available',
                city: 'DHA, Gulberg, Clifton',
                icon: TrendingUp,
              },
              {
                title: 'Commercial Hubs',
                count: '19 Available',
                city: 'Civic Centers & Plazas',
                icon: Sparkles,
              },
              {
                title: 'Residential Plots',
                count: '29 Available',
                city: 'Phase 6, 7 & 8 Schemes',
                icon: Award,
              },
            ].map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <div
                  key={idx}
                  onClick={() => {
                    const propsBtn = document.querySelector('[data-tab="properties"]');
                    if (propsBtn) (propsBtn as HTMLElement).click();
                  }}
                  className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                    {cat.title}
                  </h3>
                  <div className="text-xs text-slate-500 mt-1">{cat.count}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5 truncate">{cat.city}</div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Agency Introduction / ERP Banner */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl">
            <div className="relative z-10 max-w-2xl space-y-4">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
                A VIRELEO Innovation
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                Are you an Agency, Builder or Real Estate Broker?
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                AqarFlow connects your property inventory, lead management CRM, agent visits, and sales contracts into a single unified workspace. Eliminate lost leads, coordinate your agent team, and prevent scheduling conflicts.
              </p>
              <div className="pt-2 flex flex-wrap gap-3">
                <button
                  onClick={onNavigateToWorkspace}
                  className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-md transition-colors cursor-pointer flex items-center gap-2"
                >
                  <span>Explore Agency Operations Workspace</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            {/* Background geometric shapes */}
            <div className="absolute right-0 bottom-0 translate-x-10 translate-y-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          </div>
        </section>
      </div>
    );
  }

  // -------------------------------------------------------------
  // TAB: PROPERTIES (Full Directory with live filters)
  // -------------------------------------------------------------
  if (currentTab === 'properties') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div>
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
            Pakistan Property Marketplace
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Browse All Verified Properties
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Showing {properties.length} active listings across Islamabad, Lahore, Karachi, and Rawalpindi.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3">
          <form onSubmit={handleApplySearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2.5">
            {/* Search Input */}
            <div className="lg:col-span-2">
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Search Keywords</label>
              <input
                type="text"
                placeholder="Title, Reference, Locality..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:border-emerald-500"
              />
            </div>

            {/* Purpose */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Purpose</label>
              <select
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:border-emerald-500 bg-white"
              >
                <option value="all">All Purposes</option>
                <option value="sale">For Sale</option>
                <option value="rent">For Rent</option>
              </select>
            </div>

            {/* City */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">City</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:border-emerald-500 bg-white"
              >
                <option value="all">All Cities</option>
                <option value="Islamabad">Islamabad</option>
                <option value="Lahore">Lahore</option>
                <option value="Karachi">Karachi</option>
                <option value="Rawalpindi">Rawalpindi</option>
              </select>
            </div>

            {/* Property Type */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Type</label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:border-emerald-500 bg-white"
              >
                <option value="all">All Types</option>
                <option value="house">House</option>
                <option value="apartment">Apartment</option>
                <option value="villa">Villa</option>
                <option value="penthouse">Penthouse</option>
                <option value="office">Commercial Office</option>
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Sort By</label>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:border-emerald-500 bg-white"
              >
                <option value="newest">Newest First</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </form>

          {/* Quick Clear */}
          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-slate-500">
              Active filters: <strong className="text-slate-700 capitalize">{purpose} · {city} · {propertyType}</strong>
            </span>
            <button
              onClick={() => {
                setPurpose('all');
                setPropertyType('all');
                setCity('all');
                setSearch('');
                setBedrooms('all');
                setSort('newest');
              }}
              className="text-emerald-600 hover:text-emerald-700 font-semibold cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Listings Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-96 rounded-2xl bg-slate-200 animate-pulse" />
            ))}
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 space-y-3">
            <Building2 className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No properties match your filter</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try adjusting your city, budget, or property type filters to explore more listings.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onSelect={onSelectProperty}
                onInquire={onInquireProperty}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  // -------------------------------------------------------------
  // TAB: ABOUT US
  // -------------------------------------------------------------
  if (currentTab === 'about') {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
            About AqarFlow by VIRELEO
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Transforming Real Estate Operations Across Pakistan
          </h1>
          <p className="text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
            AqarFlow is an integrated Real Estate ERP + CRM + Property Marketplace developed by VIRELEO to modernize how real estate agencies, dealers, and buyers interact in Pakistan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Verified Inventory Only</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Every property listing undergoes verification for documentation, ownership reference codes, and accurate pricing.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users2 className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Dedicated Agent Network</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Inquiries are systematically routed to qualified area specialists in Islamabad, Lahore, and Karachi.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Conflict-Free Visits</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Our backend scheduling engine prevents double bookings and coordinates client viewings smoothly.
            </p>
          </div>
        </div>

        <div className="p-8 bg-slate-900 text-white rounded-3xl space-y-4">
          <div className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
            The VIRELEO Standard
          </div>
          <h2 className="text-xl sm:text-2xl font-bold">
            Built for Scale. Engineered for Trust.
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Traditional real estate in Pakistan suffers from fake listings, lost paper inquiries, and unorganized agent communications. AqarFlow introduces an enterprise-grade ERP architecture with role-based access control, PostgreSQL data integrity, and automated CRM workflows.
          </p>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // TAB: SERVICES
  // -------------------------------------------------------------
  if (currentTab === 'services') {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
            Platform Capabilities
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Comprehensive Real Estate Management Services
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              title: '1. Property Inventory & Multi-Media Management',
              desc: 'High-resolution photo galleries, plot/covered area tracking in Marla, Kanal, and Sqft, and instant publication control.',
            },
            {
              title: '2. CRM & Automated Inquiry Capture',
              desc: 'Every public website inquiry automatically creates a CRM lead with stage progression from New to Converted.',
            },
            {
              title: '3. Agent Visit Scheduling & Conflict Engine',
              desc: 'Intelligent scheduling with backend time-overlap validation prevents double-booking agents for buyer tours.',
            },
            {
              title: '4. Deal Pipeline & Sales Closing',
              desc: 'End-to-end deal lifecycle management from initial offer through negotiation, token deposit, and final documentation.',
            },
            {
              title: '5. Executive Business Analytics',
              desc: 'Real-time dashboard metrics tracking inventory velocity, lead conversion ratios, and monthly inquiry trends.',
            },
            {
              title: '6. Role-Based Permissions & Isolation',
              desc: 'Strict tenant data protection ensuring agents only access assigned leads while administrators maintain full oversight.',
            },
          ].map((srv, idx) => (
            <div key={idx} className="p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-2">
              <h3 className="text-sm font-bold text-slate-900">{srv.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{srv.desc}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // TAB: CONTACT
  // -------------------------------------------------------------
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
      <div className="text-center space-y-2">
        <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
          Get In Touch
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Contact AqarFlow by VIRELEO
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Our regional offices in Islamabad, Lahore, and Karachi are ready to assist you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-2xl border border-slate-200 text-center space-y-2">
          <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <MapPin className="w-5 h-5" />
          </div>
          <div className="text-xs font-bold text-slate-900">Headquarters</div>
          <p className="text-xs text-slate-500">Suite 401, Blue Area, Jinnah Avenue, Islamabad</p>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-slate-200 text-center space-y-2">
          <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <Phone className="w-5 h-5" />
          </div>
          <div className="text-xs font-bold text-slate-900">Direct Telephone</div>
          <p className="text-xs text-slate-500">+92 51 2899000 / +92 300 8521470</p>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-slate-200 text-center space-y-2">
          <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <Mail className="w-5 h-5" />
          </div>
          <div className="text-xs font-bold text-slate-900">Email Inquiry</div>
          <p className="text-xs text-slate-500">operations@aqarflow.vireleo.com</p>
        </div>
      </div>
    </div>
  );
};
