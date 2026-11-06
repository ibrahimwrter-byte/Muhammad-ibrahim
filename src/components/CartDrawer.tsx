import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, Tag, ArrowRight, ShoppingBag, Bike, Store, Check, AlertCircle } from 'lucide-react';
import { CartItem, Coupon } from '../types';
import { calculateCartTotals, formatCurrency, validateCoupon } from '../utils/orderCalculations';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (cartItemId: string, newQuantity: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  orderType: 'delivery' | 'pickup';
  onToggleOrderType: (type: 'delivery' | 'pickup') => void;
  appliedCoupon: Coupon | null;
  onApplyCoupon: (coupon: Coupon | null) => void;
  availableCoupons: Coupon[];
  onOpenCheckout: () => void;
  onBrowseMenu: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  orderType,
  onToggleOrderType,
  appliedCoupon,
  onApplyCoupon,
  availableCoupons,
  onOpenCheckout,
  onBrowseMenu,
}) => {
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  if (!isOpen) return null;

  const totals = calculateCartTotals(items, appliedCoupon, orderType);
  const totalItemCount = items.reduce((acc, it) => acc + it.quantity, 0);

  const handleApplyCode = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');

    const res = validateCoupon(couponInput, totals.subtotal, availableCoupons);
    if (!res.valid || !res.coupon) {
      setCouponError(res.error || 'Invalid code');
      return;
    }

    onApplyCoupon(res.coupon);
    setCouponSuccess(`Coupon ${res.coupon.code} applied!`);
    setCouponInput('');
  };

  const handleRemoveCoupon = () => {
    onApplyCoupon(null);
    setCouponSuccess('');
    setCouponError('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div 
          className="w-screen max-w-md bg-stone-900 border-l border-stone-800 flex flex-col shadow-2xl"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cart-drawer-heading"
        >
          {/* Header */}
          <div className="p-5 border-b border-stone-800 bg-stone-950/60 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-500">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 id="cart-drawer-heading" className="text-lg font-bold text-white flex items-center gap-2">
                  Your Order
                  <span className="text-xs font-semibold bg-stone-800 text-stone-300 px-2 py-0.5 rounded-full">
                    {totalItemCount} {totalItemCount === 1 ? 'item' : 'items'}
                  </span>
                </h2>
                <p className="text-xs text-stone-400">Fresh from GO PIZZA kitchen</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close cart"
              className="w-8 h-8 rounded-full bg-stone-800 text-stone-300 hover:text-white hover:bg-stone-700 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Fulfillment Toggle: Delivery vs Pickup */}
          <div className="p-3 bg-stone-950/40 border-b border-stone-800/80 shrink-0">
            <div className="grid grid-cols-2 gap-1.5 bg-stone-950 p-1 rounded-xl border border-stone-800">
              <button
                type="button"
                onClick={() => onToggleOrderType('delivery')}
                className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  orderType === 'delivery'
                    ? 'bg-red-600 text-white shadow-md shadow-red-950'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <Bike className="w-4 h-4" />
                Delivery (~30m)
              </button>
              <button
                type="button"
                onClick={() => onToggleOrderType('pickup')}
                className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  orderType === 'pickup'
                    ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-950'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <Store className="w-4 h-4" />
                Store Pickup (~15m)
              </button>
            </div>

            {/* Free Delivery Bar */}
            {orderType === 'delivery' && (
              <div className="mt-2.5 px-2">
                <div className="flex justify-between text-[11px] mb-1">
                  {totals.amountNeededForFreeDelivery > 0 ? (
                    <span className="text-stone-400">
                      Add <strong className="text-amber-400">{formatCurrency(totals.amountNeededForFreeDelivery)}</strong> more for <strong className="text-white">FREE Delivery</strong>
                    </span>
                  ) : (
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <Check className="w-3 h-3 stroke-[3]" /> You've unlocked FREE Delivery!
                    </span>
                  )}
                  <span className="text-stone-500 font-semibold">{formatCurrency(totals.subtotal)} / $35</span>
                </div>
                <div className="w-full h-1.5 bg-stone-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-300"
                    style={{ width: `${Math.min(100, (totals.subtotal / 35) * 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-stone-800/80 border border-stone-700/50 flex items-center justify-center text-stone-500">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Your Cart is Empty</h3>
                  <p className="text-xs text-stone-400 mt-1 max-w-xs">
                    Satisfy your hunger with our woodfired artisanal pizzas, crispy zingers, and loaded fries!
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onBrowseMenu();
                  }}
                  className="bg-red-600 hover:bg-red-500 text-white text-xs font-bold py-2.5 px-5 rounded-xl transition-colors"
                >
                  Explore Delicious Menu
                </button>
              </div>
            ) : (
              items.map(item => (
                <div
                  key={item.cartItemId}
                  className="bg-stone-950/60 border border-stone-800/80 rounded-2xl p-3 flex gap-3 group transition-colors hover:border-stone-700"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-xl object-cover shrink-0 bg-stone-900"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="text-xs font-bold text-white truncate">
                        {item.name}
                      </h4>
                      <button
                        type="button"
                        onClick={() => onRemoveItem(item.cartItemId)}
                        aria-label={`Remove ${item.name}`}
                        className="text-stone-500 hover:text-red-400 p-1 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {(item.size || item.crust) && (
                      <div className="text-[11px] text-stone-400 truncate mt-0.5">
                        {item.size && <span>{item.size}</span>}
                        {item.size && item.crust && <span> • </span>}
                        {item.crust && <span>{item.crust}</span>}
                      </div>
                    )}

                    {item.selectedToppings.length > 0 && (
                      <div className="text-[10px] text-amber-400/90 truncate mt-0.5">
                        + {item.selectedToppings.map(t => t.name).join(', ')}
                      </div>
                    )}

                    {item.specialInstructions && (
                      <div className="text-[10px] text-stone-500 italic truncate mt-0.5">
                        "{item.specialInstructions}"
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-stone-800/60">
                      <div className="flex items-center gap-2 bg-stone-900 border border-stone-800 rounded-lg p-1">
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.cartItemId, item.quantity - 1)}
                          aria-label="Decrease quantity"
                          className="w-5 h-5 rounded flex items-center justify-center text-stone-400 hover:text-white hover:bg-stone-800"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold text-white w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.cartItemId, item.quantity + 1)}
                          aria-label="Increase quantity"
                          className="w-5 h-5 rounded flex items-center justify-center text-stone-400 hover:text-white hover:bg-stone-800"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-xs font-extrabold text-amber-400">
                        {formatCurrency(item.totalPrice)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Area */}
          {items.length > 0 && (
            <div className="p-4 bg-stone-950 border-t border-stone-800 space-y-3.5 shrink-0">
              {/* Coupon Input */}
              <div>
                {appliedCoupon ? (
                  <div className="bg-emerald-950/40 border border-emerald-700/50 rounded-xl p-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Tag className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="font-bold text-emerald-300">
                        {appliedCoupon.code} applied (-{formatCurrency(totals.discount)})
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="text-stone-400 hover:text-red-400 text-[11px] underline font-semibold"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCode} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Promo code (e.g. GOPIZZA20)"
                      value={couponInput}
                      onChange={e => {
                        setCouponInput(e.target.value);
                        setCouponError('');
                      }}
                      className="flex-1 bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-200 uppercase placeholder-stone-500 focus:outline-none focus:border-amber-500"
                    />
                    <button
                      type="submit"
                      className="bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold px-3.5 py-2 rounded-xl text-xs transition-colors"
                    >
                      Apply
                    </button>
                  </form>
                )}
                {couponError && (
                  <div className="text-[11px] text-red-400 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3" /> {couponError}
                  </div>
                )}
              </div>

              {/* Price Calculations */}
              <div className="space-y-1.5 text-xs text-stone-300 pt-1 border-t border-stone-900">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-white">{formatCurrency(totals.subtotal)}</span>
                </div>
                {totals.discount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-semibold">
                    <span>Discount</span>
                    <span>-{formatCurrency(totals.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>{totals.deliveryFee === 0 ? <strong className="text-emerald-400">FREE</strong> : formatCurrency(totals.deliveryFee)}</span>
                </div>
                <div className="flex justify-between text-stone-400">
                  <span>Estimated Tax (8%)</span>
                  <span>{formatCurrency(totals.tax)}</span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-white pt-2 border-t border-stone-800">
                  <span>Total</span>
                  <span className="text-amber-400 text-lg">{formatCurrency(totals.total)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                type="button"
                onClick={onOpenCheckout}
                className="w-full bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-extrabold py-3.5 px-4 rounded-2xl shadow-xl shadow-red-950/60 flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
