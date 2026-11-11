import React, { useState } from 'react';
import { Property } from '../types';
import { formatPKR } from '../lib/utils';
import { 
  X, 
  MapPin, 
  Bed, 
  Bath, 
  Maximize2, 
  Check, 
  Calendar, 
  ShieldCheck, 
  User, 
  Phone, 
  Share2,
  Calculator,
  MessageCircle,
  Download,
  DollarSign
} from 'lucide-react';

interface PropertyDetailModalProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
  onInquire: (property: Property) => void;
}

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({
  property,
  isOpen,
  onClose,
  onInquire,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  // Mortgage Calculator State
  const [showCalculator, setShowCalculator] = useState(false);
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [loanTenureYears, setLoanTenureYears] = useState(20);
  const [interestRate, setInterestRate] = useState(13.5); // Average Pakistan KIBOR + spread

  if (!isOpen || !property) return null;

  const images = property.media && property.media.length > 0 
    ? property.media.map((m) => m.url) 
    : ['/src/assets/images/property_islamabad_villa_1794204424374.jpg'];

  const isRent = property.purpose === 'rent';

  // Calculator calculations
  const price = property.price;
  const downPaymentAmount = (price * downPaymentPercent) / 100;
  const loanAmount = price - downPaymentAmount;
  const monthlyInterestRate = interestRate / 100 / 12;
  const totalMonths = loanTenureYears * 12;
  const monthlyInstallment = !isRent && loanAmount > 0
    ? (loanAmount * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, totalMonths))) / 
      (Math.pow(1 + monthlyInterestRate, totalMonths) - 1)
    : 0;

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsAppInquiry = () => {
    const agentPhone = property.assigned_agent?.phone?.replace(/[^0-9]/g, '') || '923008521470';
    const message = encodeURIComponent(
      `Hello Skyline Premier Properties! I am interested in inquiring about listing ${property.reference_code} - "${property.title}" in ${property.locality}, ${property.city}. Price: PKR ${property.price.toLocaleString()}. Please share details!`
    );
    window.open(`https://wa.me/${agentPhone}?text=${message}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Sticky Header with Title and Close */}
        <div className="sticky top-0 z-20 px-6 py-4 bg-white/95 backdrop-blur-xs border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              {property.reference_code}
            </span>
            <span className="text-xs text-slate-500 hidden sm:inline">
              Published by Skyline Premier Properties
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="p-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 cursor-pointer text-xs flex items-center gap-1"
              title="Share Property"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">{copied ? 'Copied' : 'Share'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Gallery Section */}
        <div className="bg-slate-900 relative">
          <div className="aspect-16/9 sm:aspect-21/9 max-h-[380px] w-full overflow-hidden flex items-center justify-center">
            <img
              src={images[activeImageIndex] || images[0]}
              alt={property.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>

          {images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-slate-950/60 backdrop-blur-md p-1 rounded-xl">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-12 h-8 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                    activeImageIndex === idx ? 'border-emerald-400 scale-105' : 'border-transparent opacity-60'
                  }`}
                >
                  <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[60vh] overflow-y-auto">
          {/* Headline & Price */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className={`px-2.5 py-0.5 text-xs font-bold rounded-md ${isRent ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}>
                  {isRent ? 'For Rent' : 'For Sale'}
                </span>
                <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                  {property.property_type.replace('_', ' ')} · {property.category}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
                {property.title}
              </h1>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>{property.address || property.locality}, {property.city}, Pakistan</span>
              </div>
            </div>

            <div className="sm:text-right shrink-0">
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-sans">
                {isRent ? `${formatPKR(property.price)} / mo` : formatPKR(property.price)}
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                Possession: <strong className="text-slate-700 capitalize">{property.possession_status}</strong>
              </div>
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-emerald-600 shadow-2xs">
                <Bed className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] text-slate-500">Bedrooms</div>
                <div className="text-sm font-bold text-slate-800">{property.bedrooms} Beds</div>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-emerald-600 shadow-2xs">
                <Bath className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] text-slate-500">Bathrooms</div>
                <div className="text-sm font-bold text-slate-800">{property.bathrooms} Baths</div>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-emerald-600 shadow-2xs">
                <Maximize2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] text-slate-500">Area</div>
                <div className="text-sm font-bold text-slate-800">{property.area_value.toLocaleString()} {property.area_unit}</div>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-emerald-600 shadow-2xs">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] text-slate-500">Furnishing</div>
                <div className="text-sm font-bold text-slate-800 capitalize">{property.furnishing_status.replace('_', ' ')}</div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-2">Property Description</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {property.description}
            </p>
          </div>

          {/* Amenities & Features */}
          {property.amenities && property.amenities.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-3">Amenities &amp; Features</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {property.amenities.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                    <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5" />
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Interactive Mortgage & Installment Schedule (For Sale listings) */}
          {!isRent && (
            <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-bold text-slate-800">Mortgage &amp; Monthly Installment Estimator</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCalculator(!showCalculator)}
                  className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 cursor-pointer"
                >
                  {showCalculator ? 'Hide Details' : 'Calculate Installments'}
                </button>
              </div>

              {showCalculator && (
                <div className="space-y-3 pt-2 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Down Payment ({downPaymentPercent}%):
                      </label>
                      <input
                        type="range"
                        min={10}
                        max={60}
                        step={5}
                        value={downPaymentPercent}
                        onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                        className="w-full accent-emerald-600 cursor-pointer"
                      />
                      <div className="text-[11px] font-bold text-slate-800 mt-0.5">
                        {formatPKR(downPaymentAmount)}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Tenure: {loanTenureYears} Years
                      </label>
                      <input
                        type="range"
                        min={5}
                        max={25}
                        step={5}
                        value={loanTenureYears}
                        onChange={(e) => setLoanTenureYears(Number(e.target.value))}
                        className="w-full accent-emerald-600 cursor-pointer"
                      />
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {totalMonths} monthly payments
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Financing Rate: {interestRate}%
                      </label>
                      <input
                        type="range"
                        min={8}
                        max={20}
                        step={0.5}
                        value={interestRate}
                        onChange={(e) => setInterestRate(Number(e.target.value))}
                        className="w-full accent-emerald-600 cursor-pointer"
                      />
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Standard KIBOR spread
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-emerald-200 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                        Estimated Monthly Installment
                      </div>
                      <div className="text-base font-extrabold text-emerald-700 font-mono">
                        {formatPKR(Math.round(monthlyInstallment))} / month
                      </div>
                    </div>
                    <div className="text-[11px] text-slate-500 text-right">
                      Principal: <strong>{formatPKR(loanAmount)}</strong>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Assigned Agent Contact Card & Actions */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
                <User className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">
                  {property.assigned_agent?.full_name || 'Sarah Ahmed'}
                </div>
                <div className="text-[11px] text-slate-500">Verified AqarFlow Senior Consultant</div>
                <div className="text-[11px] text-emerald-600 font-medium flex items-center gap-1 mt-0.5">
                  <Phone className="w-3 h-3" />
                  <span>{property.assigned_agent?.phone || '+92 300 8521470'}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleWhatsAppInquiry}
                className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
                title="Send inquiry directly via WhatsApp"
              >
                <MessageCircle className="w-4 h-4 text-emerald-300" />
                <span>WhatsApp</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onInquire(property);
                }}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4 text-emerald-400" />
                <span>Book Guided Visit</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
