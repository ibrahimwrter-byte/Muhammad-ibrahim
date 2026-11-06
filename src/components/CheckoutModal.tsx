import React, { useState } from 'react';
import { X, Check, Bike, Store, CreditCard, Banknote, ShieldCheck, ArrowRight, MessageCircle } from 'lucide-react';
import { CartItem, Coupon, Order } from '../types';
import { calculateCartTotals, estimatePreparationTime, formatCurrency, generateWhatsAppOrderUrl } from '../utils/orderCalculations';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  orderType: 'delivery' | 'pickup';
  appliedCoupon: Coupon | null;
  onOrderSuccess: (order: Order, openWhatsAppDirectly?: boolean) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  orderType,
  appliedCoupon,
  onOrderSuccess,
}) => {
  if (!isOpen || items.length === 0) return null;

  const totals = calculateCartTotals(items, appliedCoupon, orderType);

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryInstructions, setDeliveryInstructions] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'online'>('cash');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!customerName.trim()) {
      errs.customerName = 'Please enter your full name.';
    }
    if (!customerPhone.trim() || customerPhone.trim().length < 7) {
      errs.customerPhone = 'Please provide a valid contact phone number.';
    }
    if (orderType === 'delivery' && (!deliveryAddress.trim() || deliveryAddress.trim().length < 6)) {
      errs.deliveryAddress = 'Please enter complete delivery street address and apartment/house number.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleCreateOrder = (sendWhatsApp: boolean = false) => {
    if (!validate()) return;
    setIsSubmitting(true);

    const orderNumber = Math.floor(100 + Math.random() * 900);
    const orderId = `GP-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder: Order = {
      id: orderId,
      orderNumber,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerEmail: customerEmail.trim() || undefined,
      orderType,
      deliveryAddress: orderType === 'delivery' ? deliveryAddress.trim() : 'Store Pickup at GO PIZZA Counter',
      deliveryInstructions: deliveryInstructions.trim() || undefined,
      items: [...items],
      subtotal: totals.subtotal,
      discount: totals.discount,
      deliveryFee: totals.deliveryFee,
      tax: totals.tax,
      total: totals.total,
      couponCode: appliedCoupon?.code,
      status: 'new',
      paymentMethod,
      createdAt: new Date().toISOString(),
      estimatedTimeMinutes: estimatePreparationTime(items),
      preparationNotes: 'Freshly placed online order. Ready for dough stretching.',
    };

    setTimeout(() => {
      setIsSubmitting(false);
      onOrderSuccess(newOrder, sendWhatsApp);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-stone-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-stone-900 border border-stone-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-modal-title"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-stone-800 bg-stone-950/70 flex items-center justify-between shrink-0">
          <div>
            <h2 id="checkout-modal-title" className="text-xl sm:text-2xl font-black text-white">
              Complete Your Order
            </h2>
            <p className="text-xs text-stone-400 mt-0.5">
              {orderType === 'delivery' ? 'Home Delivery (~30 mins)' : 'Store Pickup at GO PIZZA Downtown'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close checkout"
            className="w-8 h-8 rounded-full bg-stone-800 text-stone-300 hover:text-white hover:bg-stone-700 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-stone-200">
          {/* Customer Contact Details */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              1. Customer Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="checkout-name" className="text-xs font-semibold text-stone-300 block mb-1">
                  Full Name *
                </label>
                <input
                  id="checkout-name"
                  type="text"
                  placeholder="e.g. Marcus Sterling"
                  value={customerName}
                  onChange={e => {
                    setCustomerName(e.target.value);
                    if (errors.customerName) setErrors(prev => ({ ...prev, customerName: '' }));
                  }}
                  className={`w-full bg-stone-950 border rounded-xl px-3.5 py-2.5 text-sm text-stone-200 placeholder-stone-600 focus:outline-none ${
                    errors.customerName ? 'border-red-500' : 'border-stone-800 focus:border-amber-500'
                  }`}
                />
                {errors.customerName && (
                  <p className="text-[11px] text-red-400 mt-1">{errors.customerName}</p>
                )}
              </div>

              <div>
                <label htmlFor="checkout-phone" className="text-xs font-semibold text-stone-300 block mb-1">
                  Phone Number (For Order Updates) *
                </label>
                <input
                  id="checkout-phone"
                  type="tel"
                  placeholder="e.g. +1 (555) 019-2831"
                  value={customerPhone}
                  onChange={e => {
                    setCustomerPhone(e.target.value);
                    if (errors.customerPhone) setErrors(prev => ({ ...prev, customerPhone: '' }));
                  }}
                  className={`w-full bg-stone-950 border rounded-xl px-3.5 py-2.5 text-sm text-stone-200 placeholder-stone-600 focus:outline-none ${
                    errors.customerPhone ? 'border-red-500' : 'border-stone-800 focus:border-amber-500'
                  }`}
                />
                {errors.customerPhone && (
                  <p className="text-[11px] text-red-400 mt-1">{errors.customerPhone}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="checkout-email" className="text-xs font-semibold text-stone-300 block mb-1">
                Email Address (Optional for e-receipt)
              </label>
              <input
                id="checkout-email"
                type="email"
                placeholder="name@example.com"
                value={customerEmail}
                onChange={e => setCustomerEmail(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-sm text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Delivery Address (if Delivery) */}
          {orderType === 'delivery' ? (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                2. Delivery Destination
              </h3>
              <div>
                <label htmlFor="checkout-address" className="text-xs font-semibold text-stone-300 block mb-1">
                  Street Address & Apartment / Unit *
                </label>
                <input
                  id="checkout-address"
                  type="text"
                  placeholder="e.g. 742 Evergreen Terrace, Apt 3B"
                  value={deliveryAddress}
                  onChange={e => {
                    setDeliveryAddress(e.target.value);
                    if (errors.deliveryAddress) setErrors(prev => ({ ...prev, deliveryAddress: '' }));
                  }}
                  className={`w-full bg-stone-950 border rounded-xl px-3.5 py-2.5 text-sm text-stone-200 placeholder-stone-600 focus:outline-none ${
                    errors.deliveryAddress ? 'border-red-500' : 'border-stone-800 focus:border-amber-500'
                  }`}
                />
                {errors.deliveryAddress && (
                  <p className="text-[11px] text-red-400 mt-1">{errors.deliveryAddress}</p>
                )}
              </div>

              <div>
                <label htmlFor="checkout-instructions" className="text-xs font-semibold text-stone-300 block mb-1">
                  Driver Drop-off Notes
                </label>
                <input
                  id="checkout-instructions"
                  type="text"
                  placeholder="e.g. Gate code #1234, leave by front porch, ring doorbell"
                  value={deliveryInstructions}
                  onChange={e => setDeliveryInstructions(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-sm text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          ) : (
            <div className="bg-stone-950/60 border border-stone-800 rounded-2xl p-4 flex items-center gap-3">
              <Store className="w-6 h-6 text-amber-400 shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-white">Store Counter Pickup</h4>
                <p className="text-xs text-stone-400">
                  GO PIZZA Flagship Kitchen: 742 Gourmet Ave, Food Hub District. Ready in ~15-20 mins.
                </p>
              </div>
            </div>
          )}

          {/* Payment Method */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              {orderType === 'delivery' ? '3. Payment Method' : '2. Payment Method'}
            </h3>
            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setPaymentMethod('cash')}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  paymentMethod === 'cash'
                    ? 'border-emerald-500 bg-emerald-500/10 text-white shadow-md shadow-emerald-950/20'
                    : 'border-stone-800 bg-stone-950/40 text-stone-400 hover:border-stone-700'
                }`}
              >
                <Banknote className="w-5 h-5 mx-auto mb-1 text-emerald-400" />
                <span className="text-xs font-bold block">{orderType === 'delivery' ? 'Cash on Delivery' : 'Pay at Counter'}</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  paymentMethod === 'card'
                    ? 'border-rose-500 bg-rose-500/10 text-white shadow-md shadow-rose-950/20'
                    : 'border-stone-800 bg-stone-950/40 text-stone-400 hover:border-stone-700'
                }`}
              >
                <CreditCard className="w-5 h-5 mx-auto mb-1 text-rose-400" />
                <span className="text-xs font-bold block">Credit / Debit Card</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('online')}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  paymentMethod === 'online'
                    ? 'border-amber-500 bg-amber-500/10 text-white shadow-md shadow-amber-950/20'
                    : 'border-stone-800 bg-stone-950/40 text-stone-400 hover:border-stone-700'
                }`}
              >
                <ShieldCheck className="w-5 h-5 mx-auto mb-1 text-amber-400" />
                <span className="text-xs font-bold block">Apple / Google Pay</span>
              </button>
            </div>
          </div>

          {/* Quick Summary Box */}
          <div className="bg-stone-950 border border-stone-800 rounded-2xl p-4 text-xs space-y-1.5">
            <div className="flex justify-between text-stone-400">
              <span>Items ({items.reduce((a, b) => a + b.quantity, 0)})</span>
              <span className="text-white font-semibold">{formatCurrency(totals.subtotal)}</span>
            </div>
            {totals.discount > 0 && (
              <div className="flex justify-between text-emerald-400 font-semibold">
                <span>Discount ({appliedCoupon?.code})</span>
                <span>-{formatCurrency(totals.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-stone-400">
              <span>Fulfillment ({orderType})</span>
              <span>{totals.deliveryFee === 0 ? 'FREE' : formatCurrency(totals.deliveryFee)}</span>
            </div>
            <div className="flex justify-between text-stone-400">
              <span>Tax (8%)</span>
              <span>{formatCurrency(totals.tax)}</span>
            </div>
            <div className="flex justify-between text-sm font-extrabold text-white pt-2 border-t border-stone-800">
              <span>Total Payable</span>
              <span className="text-amber-400 text-base">{formatCurrency(totals.total)}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 sm:p-6 bg-stone-950 border-t border-stone-800 shrink-0 flex flex-col sm:flex-row items-center gap-3">
          {/* Direct WhatsApp Ordering */}
          <button
            type="button"
            onClick={() => handleCreateOrder(true)}
            disabled={isSubmitting}
            className="w-full sm:w-1/2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-950/30"
          >
            <MessageCircle className="w-5 h-5" />
            <span>Order via WhatsApp</span>
          </button>

          {/* Direct Place Order */}
          <button
            type="button"
            onClick={() => handleCreateOrder(false)}
            disabled={isSubmitting}
            className="w-full sm:w-1/2 bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-extrabold py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-950/40"
          >
            <span>{isSubmitting ? 'Confirming...' : `Confirm Order • ${formatCurrency(totals.total)}`}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
