import React, { useState } from 'react';
import { ShoppingBag, ChefHat, LayoutDashboard, Phone, Menu, X, Sparkles, Flame } from 'lucide-react';
import { Logo } from './Logo';
import { CartItem } from '../types';
import { formatCurrency } from '../utils/orderCalculations';

interface NavbarProps {
  cartItems: CartItem[];
  onOpenCart: () => void;
  onOpenKDS: () => void;
  onOpenAdmin: () => void;
  onOpenMarketing: () => void;
  activeSection: string;
  onNavigateSection: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartItems,
  onOpenCart,
  onOpenKDS,
  onOpenAdmin,
  onOpenMarketing,
  activeSection,
  onNavigateSection,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const totalItemsCount = cartItems.reduce((sum, it) => sum + it.quantity, 0);
  const cartSubtotal = cartItems.reduce((sum, it) => sum + (it.totalPrice || 0), 0);

  const navLinks = [
    { id: 'hero', label: 'Home' },
    { id: 'menu', label: 'Our Menu' },
    { id: 'deals', label: 'Special Deals' },
    { id: 'about', label: 'About Us' },
    { id: 'contact', label: 'Contact Us' },
  ];

  const handleNavClick = (id: string) => {
    onNavigateSection(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-stone-950/90 backdrop-blur-md border-b border-stone-800/80 transition-all">
      {/* Top Banner Ticker */}
      <div className="bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 text-white text-[11px] font-extrabold py-1.5 px-4 text-center tracking-wider uppercase flex items-center justify-center gap-2 overflow-hidden shadow-inner">
        <Flame className="w-3.5 h-3.5 fill-white" />
        <span>HOT WEEKEND DEAL: 20% OFF WITH CODE "GOPIZZA20" • FREE 30-MIN DELIVERY ON ORDERS $35+</span>
        <Flame className="w-3.5 h-3.5 fill-white hidden sm:inline" />
      </div>

      {/* Main Nav Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <button
          type="button"
          onClick={() => handleNavClick('hero')}
          className="text-left group flex items-center"
        >
          <Logo size="md" showTagline />
        </button>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-xs font-extrabold uppercase tracking-wider text-stone-300">
          {navLinks.map(link => (
            <button
              key={link.id}
              type="button"
              onClick={() => handleNavClick(link.id)}
              className={`px-3 py-2 rounded-xl transition-all ${
                activeSection === link.id
                  ? 'text-amber-400 bg-stone-900 border border-stone-800'
                  : 'hover:text-white hover:bg-stone-900/60'
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Right Tools: Restaurant Staff Views & Cart */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Staff Switches Dropdown / Pills */}
          <div className="hidden md:flex items-center gap-1.5 bg-stone-900/90 border border-stone-800 p-1 rounded-2xl text-xs">
            <button
              type="button"
              onClick={onOpenKDS}
              className="px-2.5 py-1.5 rounded-xl font-bold text-stone-300 hover:text-white hover:bg-stone-800 flex items-center gap-1.5 transition-colors"
              title="Open Real-time Kitchen Display System"
            >
              <ChefHat className="w-3.5 h-3.5 text-amber-400" />
              <span>Kitchen (KDS)</span>
            </button>

            <button
              type="button"
              onClick={onOpenAdmin}
              className="px-2.5 py-1.5 rounded-xl font-bold text-stone-300 hover:text-white hover:bg-stone-800 flex items-center gap-1.5 transition-colors"
              title="Open Management & Sales Analytics"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-rose-400" />
              <span>Admin Hub</span>
            </button>

            <button
              type="button"
              onClick={onOpenMarketing}
              className="px-2 py-1.5 rounded-xl font-bold text-stone-400 hover:text-amber-400 hover:bg-stone-800 transition-colors"
              title="Social Marketing Studio"
            >
              <Sparkles className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Hotline */}
          <a
            href="tel:18004674992"
            className="hidden xl:flex items-center gap-2 bg-stone-900 border border-stone-800 hover:border-amber-500/50 px-3 py-2 rounded-xl text-xs font-bold text-stone-200 transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-amber-400" />
            <span>(800) GO-PIZZA</span>
          </a>

          {/* Cart Trigger Button */}
          <button
            type="button"
            onClick={onOpenCart}
            aria-label={`Shopping cart with ${totalItemsCount} items`}
            className="relative bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-black text-xs py-2.5 px-4 rounded-2xl flex items-center gap-2.5 shadow-lg shadow-red-950/40 transition-all active:scale-[0.98]"
          >
            <div className="relative">
              <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
              {totalItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-stone-950 text-amber-400 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-amber-400">
                  {totalItemsCount}
                </span>
              )}
            </div>
            <span className="hidden sm:inline">Order Cart</span>
            {totalItemsCount > 0 && (
              <span className="bg-stone-950/30 px-2 py-0.5 rounded-lg text-white font-mono">
                {formatCurrency(cartSubtotal)}
              </span>
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(prev => !prev)}
            aria-label="Toggle navigation menu"
            className="lg:hidden p-2 rounded-xl bg-stone-900 border border-stone-800 text-stone-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-stone-900 border-b border-stone-800 p-4 space-y-3 animate-in slide-in-from-top-2">
          <nav className="grid grid-cols-2 gap-2 text-xs font-bold text-stone-300">
            {navLinks.map(link => (
              <button
                key={link.id}
                type="button"
                onClick={() => handleNavClick(link.id)}
                className={`p-2.5 rounded-xl text-left ${
                  activeSection === link.id ? 'bg-amber-500 text-stone-950' : 'bg-stone-950 text-stone-300'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          <div className="pt-2 border-t border-stone-800 grid grid-cols-3 gap-2 text-xs">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenKDS();
              }}
              className="p-2 rounded-xl bg-stone-950 text-stone-300 font-bold flex flex-col items-center gap-1"
            >
              <ChefHat className="w-4 h-4 text-amber-400" />
              <span>Kitchen</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="p-2 rounded-xl bg-stone-950 text-stone-300 font-bold flex flex-col items-center gap-1"
            >
              <LayoutDashboard className="w-4 h-4 text-rose-400" />
              <span>Admin Hub</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenMarketing();
              }}
              className="p-2 rounded-xl bg-stone-950 text-stone-300 font-bold flex flex-col items-center gap-1"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Promos</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
