import React, { useState } from 'react';
import { 
  Pizza, 
  Flame, 
  Sparkles, 
  Search, 
  Plus, 
  SlidersHorizontal, 
  ChevronRight, 
  Coffee, 
  Drumstick, 
  Sandwich, 
  UtensilsCrossed,
  Tag
} from 'lucide-react';
import { MenuCategory, MenuItem } from '../types';
import { formatCurrency } from '../utils/orderCalculations';

interface MenuSectionProps {
  menuItems: MenuItem[];
  onSelectItemForCustomization: (item: MenuItem) => void;
  onQuickAddToCart: (item: MenuItem) => void;
}

export const MenuSection: React.FC<MenuSectionProps> = ({
  menuItems,
  onSelectItemForCustomization,
  onQuickAddToCart,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeTag, setActiveTag] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories: { label: string; value: string }[] = [
    { label: 'All Items', value: 'All' },
    { label: '🍕 Classic Pizza', value: 'Classic Pizza' },
    { label: '🍗 Chicken Pizza', value: 'Chicken Pizza' },
    { label: '🌶️ Fajita Pizza', value: 'Fajita Pizza' },
    { label: '🔥 Tikka Pizza', value: 'Tikka Pizza' },
    { label: '👑 Supreme Pizza', value: 'Supreme Pizza' },
    { label: '🧀 Cheese Lovers', value: 'Cheese Lovers Pizza' },
    { label: '🥓 Pepperoni Pizza', value: 'Pepperoni Pizza' },
    { label: '✨ Special House Pizza', value: 'Special House Pizza' },
    { label: '🍔 Zinger Burgers', value: 'Zinger Burgers' },
    { label: '🍗 Chicken Wings', value: 'Chicken Wings' },
    { label: '🍟 French Fries', value: 'French Fries' },
    { label: '🥖 Garlic Bread', value: 'Garlic Bread' },
    { label: '🥪 Sandwiches', value: 'Sandwiches' },
    { label: '🥤 Cold Drinks & Shakes', value: 'Cold Drinks & Shakes' },
    { label: '🎁 Special Deals & Combos', value: 'Special Deals & Combos' },
  ];

  const filteredItems = menuItems.filter(item => {
    // Availability
    if (!item.isAvailable) return false;

    // Category
    if (selectedCategory !== 'All' && item.category !== selectedCategory) {
      return false;
    }

    // Tag filter
    if (activeTag === 'bestseller' && !item.tags.includes('bestseller')) return false;
    if (activeTag === 'spicy' && !item.tags.includes('spicy')) return false;
    if (activeTag === 'chef' && !item.tags.includes('chef')) return false;
    if (activeTag === 'veg' && !item.tags.includes('veg')) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = item.name.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      const matchCat = item.category.toLowerCase().includes(q);
      if (!matchName && !matchDesc && !matchCat) return false;
    }

    return true;
  });

  return (
    <section id="menu" className="py-16 sm:py-24 bg-stone-950 relative scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 bg-stone-900 border border-stone-800 rounded-full px-3.5 py-1 text-xs font-black uppercase tracking-wider text-amber-400">
            <Pizza className="w-3.5 h-3.5 text-amber-400" />
            <span>Handcrafted Kitchen Menu</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            EXPLORE OUR ARTISAN MENU
          </h2>
          <p className="text-sm sm:text-base text-stone-400">
            Every pizza is hand-stretched to order, topped with slow-simmered tomato sauce, whole-milk mozzarella, and baked in 500° ovens for crisp golden edges.
          </p>
        </div>

        {/* Search & Dietary Filters Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-stone-900/80 border border-stone-800 p-3 sm:p-4 rounded-3xl backdrop-blur-sm">
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search pizzas, zingers, wings, fries..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-stone-950 border border-stone-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          {/* Quick Dietary / Attribute Tags */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 text-xs font-bold">
            {[
              { id: 'all', label: 'All Items' },
              { id: 'bestseller', label: '🔥 Bestsellers' },
              { id: 'spicy', label: '🌶️ Spicy & Hot' },
              { id: 'chef', label: "👨‍🍳 Chef's Special" },
              { id: 'veg', label: '🌱 Pure Veg' },
            ].map(tag => (
              <button
                key={tag.id}
                type="button"
                onClick={() => setActiveTag(tag.id)}
                className={`px-3 py-2 rounded-xl whitespace-nowrap transition-all ${
                  activeTag === tag.id
                    ? 'bg-amber-400 text-stone-950 shadow-md shadow-amber-950/40'
                    : 'bg-stone-950/60 text-stone-400 hover:text-white hover:bg-stone-800'
                }`}
              >
                {tag.label}
              </button>
            ))}
          </div>
        </div>

        {/* Category Scroll Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat.value}
              type="button"
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold whitespace-nowrap border transition-all ${
                selectedCategory === cat.value
                  ? 'border-red-600 bg-red-600 text-white shadow-lg shadow-red-950/50 scale-[1.02]'
                  : 'border-stone-800 bg-stone-900/60 text-stone-300 hover:border-stone-700 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map(item => {
            const isPizza = item.category.toLowerCase().includes('pizza');
            const hasMultipleSizes = item.sizes && Object.keys(item.sizes).length > 1;

            return (
              <div
                key={item.id}
                className="group bg-stone-900/60 border border-stone-800/90 rounded-3xl overflow-hidden hover:border-stone-700 flex flex-col justify-between shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Image & Badges */}
                <div className="relative h-48 w-full overflow-hidden bg-stone-950">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-transparent to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    {item.tags.includes('bestseller') && (
                      <span className="text-[10px] font-black uppercase tracking-wider text-rose-300 bg-red-600/90 px-2.5 py-0.5 rounded-full shadow-md flex items-center gap-1">
                        <Flame className="w-3 h-3 fill-rose-300" /> Bestseller
                      </span>
                    )}
                    {item.tags.includes('chef') && (
                      <span className="text-[10px] font-black uppercase tracking-wider text-stone-950 bg-amber-400 px-2.5 py-0.5 rounded-full shadow-md flex items-center gap-1">
                        <Sparkles className="w-3 h-3 fill-stone-950" /> Chef Special
                      </span>
                    )}
                    {item.tags.includes('spicy') && (
                      <span className="text-[10px] font-black uppercase tracking-wider text-orange-300 bg-orange-600/90 px-2 py-0.5 rounded-full shadow-md">
                        🌶️ Spicy
                      </span>
                    )}
                    {item.tags.includes('veg') && (
                      <span className="text-[10px] font-black uppercase tracking-wider text-emerald-300 bg-emerald-700/90 px-2 py-0.5 rounded-full shadow-md">
                        🌱 Veg
                      </span>
                    )}
                  </div>

                  {/* Category Pill on bottom of image */}
                  <div className="absolute bottom-3 left-3 text-[10px] font-bold text-amber-400 bg-stone-950/80 px-2.5 py-0.5 rounded-full border border-stone-800 backdrop-blur-sm">
                    {item.category}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <h3 className="text-base font-extrabold text-white group-hover:text-amber-400 transition-colors line-clamp-1">
                      {item.name}
                    </h3>
                    <p className="text-xs text-stone-400 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Price Preview & Action */}
                  <div className="pt-3 border-t border-stone-800/80 flex items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] text-stone-400 uppercase font-semibold block">
                        {hasMultipleSizes ? 'Starting from' : 'Price'}
                      </span>
                      <span className="text-lg font-black text-amber-400 font-mono">
                        {formatCurrency(item.basePrice)}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        if (item.isCustomizable) {
                          onSelectItemForCustomization(item);
                        } else {
                          onQuickAddToCart(item);
                        }
                      }}
                      className="bg-red-600 hover:bg-red-500 active:scale-95 text-white font-extrabold text-xs py-2.5 px-4 rounded-xl flex items-center gap-1.5 shadow-md shadow-red-950/40 transition-all"
                    >
                      <Plus className="w-4 h-4 stroke-[3]" />
                      <span>{item.isCustomizable ? 'Customize' : 'Add to Cart'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* If no items match */}
        {filteredItems.length === 0 && (
          <div className="text-center py-16 bg-stone-900/40 border border-stone-800 rounded-3xl space-y-3">
            <Pizza className="w-12 h-12 text-stone-600 mx-auto" />
            <h3 className="text-base font-bold text-white">No items found</h3>
            <p className="text-xs text-stone-400">Try adjusting your search query or selected category filter.</p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('All');
                setActiveTag('all');
                setSearchQuery('');
              }}
              className="bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold py-2 px-4 rounded-xl"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
