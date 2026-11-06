import React from 'react';
import { Flame, Clock, Award, ShieldCheck, ArrowRight, Sparkles, ChefHat, Tag } from 'lucide-react';

interface HeroProps {
  onOrderNow: () => void;
  onExploreDeals: () => void;
  onOpenMenu: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOrderNow, onExploreDeals, onOpenMenu }) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-16 lg:pb-24 bg-stone-950">
      {/* Background Ambience & Lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-red-600/15 via-amber-500/10 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -left-32 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Brand Copy & CTAs (7 cols) */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Top Awards Badge */}
            <div className="inline-flex items-center gap-2.5 bg-stone-900/90 border border-amber-500/30 rounded-full px-4 py-1.5 shadow-lg shadow-amber-950/20">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <Flame className="w-4 h-4 text-red-500 fill-red-500" />
              <span className="text-xs font-black uppercase tracking-wider text-amber-300">
                VOTED CITY'S #1 CRAFT PIZZA & FAST CASUAL BRAND
              </span>
            </div>

            {/* Bold Hero Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.05]">
              CRAVING REAL, <br />
              <span className="bg-gradient-to-r from-red-500 via-amber-400 to-yellow-300 bg-clip-text text-transparent">
                EXTRA CHEESY
              </span> <br />
              PIZZA PERFECTION?
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-stone-300 max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed">
              Hand-tossed 48-hour fermented dough, 100% whole-milk Wisconsin mozzarella, and secret Italian San Marzano herb sauce. Stone-baked at 500°F and delivered piping hot to your door in 30 minutes!
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <button
                type="button"
                onClick={onOrderNow}
                className="w-full sm:w-auto bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-black text-sm sm:text-base py-4 px-8 rounded-2xl shadow-xl shadow-red-950/60 flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
              >
                <span>Order Online Now</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={onExploreDeals}
                className="w-full sm:w-auto bg-stone-900/90 hover:bg-stone-800 border border-stone-700/80 hover:border-amber-500/50 text-white font-extrabold text-sm sm:text-base py-4 px-7 rounded-2xl flex items-center justify-center gap-2.5 transition-all"
              >
                <Tag className="w-4 h-4 text-amber-400" />
                <span>Special Combo Deals</span>
              </button>
            </div>

            {/* Four Quality Guarantee Pillars */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-stone-800/80">
              <div className="flex items-center gap-2.5 text-left">
                <div className="w-8 h-8 rounded-xl bg-red-600/10 border border-red-500/20 flex items-center justify-center text-red-500 shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div className="text-[11px] leading-tight">
                  <strong className="text-white block font-bold">30-Min Fast</strong>
                  <span className="text-stone-400">Doorstep delivery</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 text-left">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                  <Award className="w-4 h-4" />
                </div>
                <div className="text-[11px] leading-tight">
                  <strong className="text-white block font-bold">100% Real Cheese</strong>
                  <span className="text-stone-400">Wisconsin Mozzarella</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 text-left">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                  <ChefHat className="w-4 h-4" />
                </div>
                <div className="text-[11px] leading-tight">
                  <strong className="text-white block font-bold">500° Stone Baked</strong>
                  <span className="text-stone-400">Artisan fire oven</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 text-left">
                <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="text-[11px] leading-tight">
                  <strong className="text-white block font-bold">Hot Seal Box</strong>
                  <span className="text-stone-400">Freshness guaranteed</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Hero Presentation (5 cols) */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="relative w-full max-w-lg aspect-square">
              {/* Rotating Outer Ring */}
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-stone-800 animate-[spin_60s_linear_infinite]" />
              <div className="absolute -inset-4 rounded-full bg-gradient-to-tr from-red-600/30 via-amber-500/20 to-transparent blur-2xl" />

              {/* Main Appetizing Pizza Visual */}
              <div className="relative w-full h-full rounded-full overflow-hidden border-8 border-stone-900 shadow-2xl shadow-red-950/80 group">
                <img
                  src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1000&q=85"
                  alt="GO PIZZA Signature Royal Crown Crust Pizza"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent" />
              </div>

              {/* Floating Badge 1: 30-Min Fast Delivery Guarantee */}
              <div className="absolute -bottom-4 -left-4 sm:left-4 bg-stone-900/95 border border-stone-700/80 rounded-2xl p-3.5 shadow-2xl backdrop-blur-md flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white font-black shadow-lg shadow-red-950">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-black text-white">30 MINS OR FREE</div>
                  <div className="text-[11px] text-amber-400 font-bold">Guaranteed Delivery Speed</div>
                </div>
              </div>

              {/* Floating Badge 2: Customer Rating */}
              <div className="absolute -top-3 -right-3 sm:right-4 bg-stone-900/95 border border-stone-700/80 rounded-2xl p-3.5 shadow-2xl backdrop-blur-md flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-stone-950 font-black shadow-lg shadow-amber-950">
                  <Sparkles className="w-5 h-5 fill-stone-950" />
                </div>
                <div>
                  <div className="text-xs font-black text-white">4.9 / 5.0 RATING</div>
                  <div className="text-[11px] text-stone-300">15,000+ Happy Foodies</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
