import React from 'react';
import { Tag, Sparkles, Check, ArrowRight, Flame, Clock } from 'lucide-react';
import { MenuItem } from '../types';
import { formatCurrency } from '../utils/orderCalculations';

interface DealsSectionProps {
  deals: MenuItem[];
  onAddDealToCart: (deal: MenuItem) => void;
}

export const DealsSection: React.FC<DealsSectionProps> = ({ deals, onAddDealToCart }) => {
  return (
    <section id="deals" className="py-16 sm:py-24 bg-stone-900/40 relative border-y border-stone-800/80 scroll-mt-24">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-red-600/10 border border-red-500/30 text-red-400 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Limited Time Promotions</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              HOT COMBO FEAST DEALS
            </h2>
            <p className="text-sm text-stone-400 max-w-xl">
              Engineered for maximum flavor and supreme value. Feasts that save you up to 35% compared to individual items!
            </p>
          </div>

          <div className="flex items-center gap-2 bg-stone-900 border border-stone-800 rounded-2xl px-4 py-2.5 text-xs font-bold text-amber-400 shrink-0">
            <Clock className="w-4 h-4 animate-pulse" />
            <span>Weekend Deals Active: Code <strong>GOPIZZA20</strong></span>
          </div>
        </div>

        {/* Deals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {deals.map(deal => {
            const savingsText = deal.name.includes('Party') 
              ? 'SAVE $25' 
              : deal.name.includes('Family') 
              ? 'SAVE $18' 
              : deal.name.includes('Duo') 
              ? 'SAVE $9' 
              : 'POPULAR';

            return (
              <div
                key={deal.id}
                className="bg-stone-900 border border-stone-800 rounded-3xl overflow-hidden flex flex-col justify-between hover:border-amber-500/50 transition-all duration-300 shadow-xl group"
              >
                {/* Thumbnail */}
                <div className="relative h-48 w-full overflow-hidden bg-stone-950">
                  <img
                    src={deal.image}
                    alt={deal.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-transparent to-transparent" />
                  
                  {/* Saving Badge */}
                  <div className="absolute top-3 right-3 bg-red-600 text-white font-black text-[11px] px-3 py-1 rounded-full shadow-lg uppercase tracking-wider">
                    {savingsText}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-base font-extrabold text-white group-hover:text-amber-400 transition-colors">
                      {deal.name}
                    </h3>
                    <p className="text-xs text-stone-400 leading-relaxed">
                      {deal.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-stone-800/80 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-stone-400 uppercase font-semibold block">Combo Price</span>
                      <span className="text-xl font-black text-amber-400 font-mono">
                        {formatCurrency(deal.basePrice)}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => onAddDealToCart(deal)}
                      className="bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-black text-xs py-2.5 px-4 rounded-xl flex items-center gap-1.5 shadow-md shadow-red-950/40 transition-transform active:scale-95"
                    >
                      <span>Add Deal</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
