import React, { useState } from 'react';
import { Logo } from './Logo';
import { Phone, Mail, MapPin, Check, Heart, ShieldCheck } from 'lucide-react';

interface FooterProps {
  onNavigateSection: (id: string) => void;
  onOpenKDS: () => void;
  onOpenAdmin: () => void;
  onOpenMarketing: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigateSection,
  onOpenKDS,
  onOpenAdmin,
  onOpenMarketing,
}) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setSubscribed(true);
    setNewsletterEmail('');
  };

  return (
    <footer className="bg-stone-950 border-t border-stone-800 text-stone-300 text-xs">
      {/* Newsletter Strip */}
      <div className="bg-gradient-to-r from-red-950/60 via-stone-900 to-amber-950/40 border-b border-stone-800/80 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-lg font-black text-white flex items-center justify-center md:justify-start gap-2">
              <span>GET A FREE CHEESY GARLIC BREAD</span>
              <span className="text-xs bg-amber-400 text-stone-950 px-2 py-0.5 rounded-full font-extrabold uppercase">
                FIRST ORDER
              </span>
            </h3>
            <p className="text-stone-400 text-xs">
              Subscribe to GO PIZZA VIP alerts for exclusive secret menu drops, 50% discount vouchers & birthday gifts.
            </p>
          </div>

          {subscribed ? (
            <div className="bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-bold px-4 py-2.5 rounded-2xl flex items-center gap-2">
              <Check className="w-4 h-4 stroke-[3]" />
              <span>You're subscribed! Use code "FREESHIP" at checkout.</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex gap-2 w-full md:w-auto max-w-md">
              <input
                type="email"
                required
                placeholder="Enter your email address..."
                value={newsletterEmail}
                onChange={e => setNewsletterEmail(e.target.value)}
                className="flex-1 md:w-64 bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-stone-600 focus:outline-none focus:border-amber-500"
              />
              <button
                type="submit"
                className="bg-amber-400 hover:bg-amber-300 text-stone-950 font-black px-4 py-2.5 rounded-xl text-xs whitespace-nowrap transition-colors"
              >
                Claim Bread
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Main Footer Columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
        {/* Brand & Mission (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <Logo size="lg" showTagline />
          <p className="text-stone-400 text-xs leading-relaxed max-w-sm">
            GO PIZZA SHOP is an international-standard pizza restaurant and cloud kitchen network dedicated to 48-hour fermented dough, real mozzarella, and lightning-fast 30-minute delivery.
          </p>
          <div className="flex items-center gap-3 text-stone-400 pt-2 text-xs">
            <span className="flex items-center gap-1.5 bg-stone-900 border border-stone-800 px-3 py-1.5 rounded-xl">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Quality Food Safety Certified</span>
            </span>
          </div>
        </div>

        {/* Menu Navigation */}
        <div className="space-y-3">
          <h4 className="text-xs font-black uppercase tracking-wider text-white">Popular Pizzas</h4>
          <ul className="space-y-2 text-stone-400">
            <li><button type="button" onClick={() => onNavigateSection('menu')} className="hover:text-amber-400">NYC Crispy Pepperoni</button></li>
            <li><button type="button" onClick={() => onNavigateSection('menu')} className="hover:text-amber-400">Desi Chicken Tikka</button></li>
            <li><button type="button" onClick={() => onNavigateSection('menu')} className="hover:text-amber-400">Sizzling Chicken Fajita</button></li>
            <li><button type="button" onClick={() => onNavigateSection('menu')} className="hover:text-amber-400">Grand Super Supreme</button></li>
            <li><button type="button" onClick={() => onNavigateSection('menu')} className="hover:text-amber-400">Signature Royal Crown</button></li>
          </ul>
        </div>

        {/* Quick Links & Staff Access */}
        <div className="space-y-3">
          <h4 className="text-xs font-black uppercase tracking-wider text-white">Platform Links</h4>
          <ul className="space-y-2 text-stone-400">
            <li><button type="button" onClick={() => onNavigateSection('hero')} className="hover:text-amber-400">Home Storefront</button></li>
            <li><button type="button" onClick={() => onNavigateSection('deals')} className="hover:text-amber-400">Special Deals & Combos</button></li>
            <li><button type="button" onClick={() => onNavigateSection('about')} className="hover:text-amber-400">Our Story & Craft</button></li>
            <li><button type="button" onClick={() => onNavigateSection('contact')} className="hover:text-amber-400">Store Locations & FAQ</button></li>
            <li className="pt-2 border-t border-stone-900">
              <button type="button" onClick={onOpenKDS} className="text-amber-400 hover:underline font-bold">
                🍳 Kitchen Display (KDS)
              </button>
            </li>
            <li>
              <button type="button" onClick={onOpenAdmin} className="text-rose-400 hover:underline font-bold">
                📊 Restaurant Admin Hub
              </button>
            </li>
            <li>
              <button type="button" onClick={onOpenMarketing} className="text-emerald-400 hover:underline font-bold">
                🎨 Marketing Studio
              </button>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="space-y-3">
          <h4 className="text-xs font-black uppercase tracking-wider text-white">Call & WhatsApp</h4>
          <div className="space-y-2 text-stone-400">
            <p className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-amber-400" />
              <strong className="text-white">+1 (800) GO-PIZZA</strong>
            </p>
            <p className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-red-500" />
              <span>742 Gourmet Ave, Food Hub</span>
            </p>
            <p className="text-[11px] text-stone-500 pt-1">
              Open Daily: 11:00 AM – 02:00 AM
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-stone-800/80 py-6 px-4 sm:px-6 lg:px-8 text-stone-500 text-[11px]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} GO PIZZA SHOP. All Rights Reserved. Fresh, Hot & Fast Premium Pizza.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-stone-300 cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-stone-300 cursor-pointer">Terms of Service</span>
            <span>•</span>
            <span className="hover:text-stone-300 cursor-pointer">Franchise Inquiries</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
