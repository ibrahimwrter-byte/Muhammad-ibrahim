import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, Check, Flame, Sparkles } from 'lucide-react';
import { CrustOption, MenuItem, PizzaTopping, SizeOption } from '../types';
import { calculateItemUnitPrice, formatCurrency } from '../utils/orderCalculations';

interface PizzaCustomizerModalProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (customizedItem: {
    menuItemId: string;
    name: string;
    category: MenuItem['category'];
    image: string;
    size?: SizeOption;
    crust?: CrustOption;
    selectedToppings: { name: string; price: number }[];
    specialInstructions?: string;
    unitPrice: number;
    quantity: number;
    totalPrice: number;
  }) => void;
}

export const PizzaCustomizerModal: React.FC<PizzaCustomizerModalProps> = ({
  item,
  isOpen,
  onClose,
  onAddToCart,
}) => {
  if (!isOpen || !item) return null;

  const isPizza = item.category.toLowerCase().includes('pizza');
  const availableSizes = item.sizes
    ? (Object.keys(item.sizes) as SizeOption[])
    : [];

  const [selectedSize, setSelectedSize] = useState<SizeOption | undefined>(
    item.defaultSize || (availableSizes.length > 0 ? availableSizes[0] : undefined)
  );

  const [selectedCrust, setSelectedCrust] = useState<CrustOption | undefined>(
    item.defaultCrust || (item.crusts && item.crusts.length > 0 ? item.crusts[0].name : undefined)
  );

  const [selectedToppings, setSelectedToppings] = useState<{ name: string; price: number }[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Reset states when item opens
  useEffect(() => {
    if (item) {
      setSelectedSize(item.defaultSize || (availableSizes.length > 0 ? availableSizes[0] : undefined));
      setSelectedCrust(item.defaultCrust || (item.crusts && item.crusts.length > 0 ? item.crusts[0].name : undefined));
      setSelectedToppings([]);
      setSpecialInstructions('');
      setQuantity(1);
    }
  }, [item]);

  const unitPrice = calculateItemUnitPrice(
    item.basePrice,
    item.sizes,
    selectedSize,
    item.crusts,
    selectedCrust,
    selectedToppings
  );

  const totalPrice = Number((unitPrice * quantity).toFixed(2));

  const toggleTopping = (topping: PizzaTopping) => {
    setSelectedToppings(prev => {
      const exists = prev.some(t => t.name === topping.name);
      if (exists) {
        return prev.filter(t => t.name !== topping.name);
      } else {
        return [...prev, { name: topping.name, price: topping.price }];
      }
    });
  };

  const handleAdd = () => {
    onAddToCart({
      menuItemId: item.id,
      name: item.name,
      category: item.category,
      image: item.image,
      size: selectedSize,
      crust: selectedCrust,
      selectedToppings,
      specialInstructions: specialInstructions.trim() || undefined,
      unitPrice,
      quantity,
      totalPrice,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-stone-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-stone-900 border border-stone-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-pizza-title"
      >
        {/* Header Image & Badges */}
        <div className="relative h-48 sm:h-56 w-full shrink-0 overflow-hidden bg-stone-950">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/40 to-transparent" />
          
          <button
            type="button"
            onClick={onClose}
            aria-label="Close customizer"
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-stone-950/70 hover:bg-stone-800 text-stone-300 hover:text-white flex items-center justify-center backdrop-blur-sm transition-colors border border-stone-700/50"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-6 right-6">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
                {item.category}
              </span>
              {item.tags.includes('bestseller') && (
                <span className="text-xs font-bold uppercase tracking-wider text-rose-400 bg-rose-500/10 px-2.5 py-0.5 rounded-full border border-rose-500/20 flex items-center gap-1">
                  <Flame className="w-3 h-3 text-rose-500 fill-rose-500" /> Bestseller
                </span>
              )}
              {item.tags.includes('chef') && (
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-emerald-400" /> Chef Special
                </span>
              )}
            </div>
            <h2 id="modal-pizza-title" className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {item.name}
            </h2>
          </div>
        </div>

        {/* Scrollable Configuration Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-stone-200">
          <p className="text-sm text-stone-400 leading-relaxed">
            {item.description}
          </p>

          {/* Size Selection */}
          {availableSizes.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-stone-200 uppercase tracking-wider">
                  1. Choose Size
                </label>
                <span className="text-xs text-amber-400 font-medium">Required</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {availableSizes.map(size => {
                  const sizePrice = item.sizes ? item.sizes[size] : item.basePrice;
                  const isSelected = selectedSize === size;
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        isSelected
                          ? 'border-amber-500 bg-amber-500/10 text-white shadow-md shadow-amber-500/10'
                          : 'border-stone-800 bg-stone-950/40 text-stone-400 hover:border-stone-700 hover:text-stone-200'
                      }`}
                    >
                      <div className="text-xs font-bold">{size}</div>
                      <div className="text-sm font-extrabold text-amber-400 mt-0.5">
                        {formatCurrency(sizePrice || item.basePrice)}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Crust Selection */}
          {item.crusts && item.crusts.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-stone-200 uppercase tracking-wider">
                  2. Choose Crust Style
                </label>
                <span className="text-xs text-amber-400 font-medium">Required</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {item.crusts.map(crust => {
                  const isSelected = selectedCrust === crust.name;
                  return (
                    <button
                      key={crust.name}
                      type="button"
                      onClick={() => setSelectedCrust(crust.name)}
                      className={`p-3.5 rounded-2xl border flex items-center justify-between transition-all ${
                        isSelected
                          ? 'border-rose-500 bg-rose-500/10 text-white shadow-md shadow-rose-500/10'
                          : 'border-stone-800 bg-stone-950/40 text-stone-300 hover:border-stone-700'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-bold text-stone-100">{crust.name}</div>
                        <div className="text-[11px] text-stone-400">
                          {crust.price > 0 ? `+${formatCurrency(crust.price)}` : 'Standard Included'}
                        </div>
                      </div>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        isSelected ? 'border-rose-500 bg-rose-500 text-white' : 'border-stone-700'
                      }`}>
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Extra Toppings */}
          {item.availableToppings && item.availableToppings.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-stone-200 uppercase tracking-wider">
                  3. Extra Gourmet Toppings
                </label>
                <span className="text-xs text-stone-400">Optional</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {item.availableToppings.map(topping => {
                  const isChecked = selectedToppings.some(t => t.name === topping.name);
                  return (
                    <button
                      key={topping.id}
                      type="button"
                      onClick={() => toggleTopping(topping)}
                      className={`p-2.5 px-3 rounded-xl border flex items-center justify-between text-left transition-colors ${
                        isChecked
                          ? 'border-amber-400/80 bg-amber-400/10 text-white'
                          : 'border-stone-800 bg-stone-950/30 text-stone-400 hover:border-stone-700 hover:text-stone-300'
                      }`}
                    >
                      <div className="text-xs">
                        <span className="font-semibold text-stone-200">{topping.name}</span>
                        <span className="text-[11px] text-amber-400/90 block">
                          +{formatCurrency(topping.price)}
                        </span>
                      </div>
                      <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                        isChecked ? 'border-amber-400 bg-amber-400 text-stone-950' : 'border-stone-700'
                      }`}>
                        {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Special Instructions */}
          <div className="space-y-2">
            <label htmlFor="custom-notes" className="text-xs font-bold text-stone-300 uppercase tracking-wider block">
              Kitchen Notes / Special Requests
            </label>
            <input
              id="custom-notes"
              type="text"
              placeholder="e.g. Extra crispy bottom, sauce on side, cut into 8 squares..."
              value={specialInstructions}
              onChange={e => setSpecialInstructions(e.target.value)}
              className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-2.5 text-sm text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Footer with Quantity & Add Button */}
        <div className="p-4 sm:p-6 bg-stone-950 border-t border-stone-800/80 shrink-0 flex items-center justify-between gap-4">
          {/* Quantity Controls */}
          <div className="flex items-center gap-3 bg-stone-900 border border-stone-800 rounded-2xl p-1.5 px-2">
            <button
              type="button"
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              aria-label="Decrease quantity"
              className="w-8 h-8 rounded-xl bg-stone-800 hover:bg-stone-700 disabled:opacity-40 text-stone-300 flex items-center justify-center transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-6 text-center font-bold text-white text-base">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity(q => q + 1)}
              aria-label="Increase quantity"
              className="w-8 h-8 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 flex items-center justify-center transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add to Cart CTA */}
          <button
            type="button"
            onClick={handleAdd}
            className="flex-1 bg-gradient-to-r from-red-600 via-red-500 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-extrabold py-3.5 px-6 rounded-2xl shadow-lg shadow-red-950/40 flex items-center justify-between transition-all active:scale-[0.99]"
          >
            <span>Add to Order</span>
            <span className="text-lg font-black tracking-tight bg-stone-950/30 px-3 py-1 rounded-xl">
              {formatCurrency(totalPrice)}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
