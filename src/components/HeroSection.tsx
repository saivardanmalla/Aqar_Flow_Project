import React, { useState } from 'react';
import { Search, MapPin, Building, Tag, CheckCircle2 } from 'lucide-react';

interface HeroProps {
  onSearch: (filters: {
    purpose?: string;
    property_type?: string;
    city?: string;
    search?: string;
  }) => void;
}

export const HeroSection: React.FC<HeroProps> = ({ onSearch }) => {
  const [purpose, setPurpose] = useState<string>('sale');
  const [propertyType, setPropertyType] = useState<string>('all');
  const [city, setCity] = useState<string>('all');
  const [keyword, setKeyword] = useState<string>('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      purpose,
      property_type: propertyType,
      city,
      search: keyword.trim(),
    });
  };

  return (
    <section className="relative overflow-hidden bg-slate-950 text-white min-h-[560px] flex items-center">
      {/* Background architectural image overlay matching image_c021d3a8.png */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/property_islamabad_villa_1794204424374.jpg"
          alt="Contemporary luxury architectural villa in Pakistan"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center scale-105 opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/60" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        <div className="max-w-2xl">
          {/* Eyebrow kicker */}
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-widest mb-3">
            <span>AqarFlow Platform</span>
            <span aria-hidden="true">·</span>
            <span>Premier Real Estate Pakistan</span>
          </div>

          {/* Main Headline matching image */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Find Your <br />
            <span className="text-emerald-400 drop-shadow-sm">Dream Property</span>
          </h1>

          <p className="mt-4 text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
            Buy, Rent or Invest in the Best Properties across Pakistan. Verified luxury homes, apartments, and commercial plazas in Islamabad, Lahore, Karachi, and Rawalpindi.
          </p>

          {/* Search Box Card matching image_c021d3a8.png */}
          <div className="mt-8 p-3 sm:p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl">
            {/* Sale / Rent Toggle Buttons */}
            <div className="flex items-center gap-2 mb-3">
              <button
                type="button"
                onClick={() => setPurpose('sale')}
                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                  purpose === 'sale'
                    ? 'bg-emerald-500 text-white shadow-xs'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                For Sale
              </button>
              <button
                type="button"
                onClick={() => setPurpose('rent')}
                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                  purpose === 'rent'
                    ? 'bg-emerald-500 text-white shadow-xs'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                For Rent
              </button>
              <button
                type="button"
                onClick={() => setPurpose('all')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                  purpose === 'all'
                    ? 'bg-emerald-500 text-white shadow-xs'
                    : 'text-slate-300 hover:bg-white/10'
                }`}
              >
                All Purposes
              </button>
            </div>

            {/* Filter inputs form */}
            <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {/* Property Type */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Building className="w-4 h-4 text-emerald-400" />
                </div>
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-900/90 text-white text-xs rounded-xl border border-white/15 focus:outline-hidden focus:border-emerald-400"
                >
                  <option value="all">All Property Types</option>
                  <option value="house">House / Bungalow</option>
                  <option value="apartment">Apartment / Flat</option>
                  <option value="villa">Luxury Villa</option>
                  <option value="penthouse">Penthouse</option>
                  <option value="office">Commercial Office</option>
                  <option value="shop">Retail Shop</option>
                </select>
              </div>

              {/* City Selection */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                </div>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-900/90 text-white text-xs rounded-xl border border-white/15 focus:outline-hidden focus:border-emerald-400"
                >
                  <option value="all">All Cities (Pakistan)</option>
                  <option value="Islamabad">Islamabad</option>
                  <option value="Lahore">Lahore</option>
                  <option value="Karachi">Karachi</option>
                  <option value="Rawalpindi">Rawalpindi</option>
                </select>
              </div>

              {/* Location or Keyword Search */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Tag className="w-4 h-4 text-emerald-400" />
                </div>
                <input
                  type="text"
                  placeholder="Sector, DHA, Bahria..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-900/90 text-white placeholder-slate-400 text-xs rounded-xl border border-white/15 focus:outline-hidden focus:border-emerald-400"
                />
              </div>

              {/* Search Action Button matching screenshot */}
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer"
              >
                <Search className="w-4 h-4" />
                <span>Search Properties</span>
              </button>
            </form>
          </div>

          {/* Proof metrics row */}
          <div className="mt-8 flex flex-wrap items-center gap-6 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>100% Verified Inventory</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Direct Agency Inquiries</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Free Property Visits</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
