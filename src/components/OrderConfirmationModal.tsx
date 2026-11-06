import React from 'react';
import { CheckCircle2, Clock, MapPin, Phone, MessageCircle, ExternalLink, ChefHat, ArrowRight } from 'lucide-react';
import { Order } from '../types';
import { formatCurrency, generateWhatsAppOrderUrl } from '../utils/orderCalculations';

interface OrderConfirmationModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onGoToKDS: () => void;
}

export const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({
  order,
  isOpen,
  onClose,
  onGoToKDS,
}) => {
  if (!isOpen || !order) return null;

  const whatsappUrl = generateWhatsAppOrderUrl(order);

  const getStatusIndex = (status: Order['status']) => {
    switch (status) {
      case 'new': return 0;
      case 'preparing': return 1;
      case 'ready': return 2;
      case 'delivered': return 3;
      default: return 0;
    }
  };

  const steps = [
    { title: 'Order Received', desc: 'Sent to Chef' },
    { title: 'Baking in Oven', desc: '500° Stone Oven' },
    { title: order.orderType === 'delivery' ? 'Out for Delivery' : 'Ready at Counter', desc: order.orderType === 'delivery' ? 'Hot delivery bag' : 'Packaged warm' },
    { title: 'Completed', desc: 'Delivered / Picked' },
  ];

  const currentStep = getStatusIndex(order.status);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-stone-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl bg-stone-900 border border-stone-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirmation-heading"
      >
        {/* Celebration Header */}
        <div className="p-6 bg-gradient-to-b from-stone-900 to-stone-950 text-center border-b border-stone-800 shrink-0">
          <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-emerald-950/40">
            <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
            Order Confirmed & In Kitchen
          </span>
          <h2 id="confirmation-heading" className="text-2xl sm:text-3xl font-black text-white mt-2">
            Thank You, {order.customerName.split(' ')[0]}!
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            Order Reference: <strong className="text-white font-mono">{order.id}</strong> (Ticket #{order.orderNumber})
          </p>
        </div>

        {/* Live Stepper Tracker */}
        <div className="p-6 bg-stone-950/50 border-b border-stone-800/80 shrink-0">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-xs font-bold text-stone-300">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Estimated Time: ~{order.estimatedTimeMinutes} minutes</span>
            </div>
            <span className="text-xs font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-red-600/20 text-red-400 border border-red-500/30">
              Live Kitchen Status: {order.status.toUpperCase()}
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2 relative">
            {steps.map((st, i) => {
              const isPast = i < currentStep;
              const isCurrent = i === currentStep;
              return (
                <div key={st.title} className="text-center relative">
                  <div
                    className={`w-7 h-7 mx-auto rounded-full flex items-center justify-center text-xs font-bold mb-1.5 transition-colors ${
                      isPast
                        ? 'bg-emerald-500 text-stone-950'
                        : isCurrent
                        ? 'bg-amber-400 text-stone-950 ring-4 ring-amber-400/20'
                        : 'bg-stone-800 text-stone-500'
                    }`}
                  >
                    {isPast ? '✓' : i + 1}
                  </div>
                  <div className="text-[10px] font-bold text-stone-200 leading-tight">
                    {st.title}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Scrollable Order Breakdown */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs text-stone-300">
          {/* Destination & Contact */}
          <div className="bg-stone-950 rounded-2xl p-4 border border-stone-800 space-y-2">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-stone-400 block text-[11px]">
                  {order.orderType === 'delivery' ? 'Delivery Address' : 'Pickup Location'}
                </span>
                <span className="text-white font-semibold">{order.deliveryAddress}</span>
              </div>
            </div>
            <div className="flex items-center gap-2.5 pt-1.5 border-t border-stone-900">
              <Phone className="w-4 h-4 text-stone-500 shrink-0" />
              <span className="text-stone-300">{order.customerPhone}</span>
            </div>
          </div>

          {/* Items List */}
          <div className="bg-stone-950 rounded-2xl p-4 border border-stone-800 space-y-2.5">
            <h4 className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
              Order Receipt ({order.items.length} items)
            </h4>
            <div className="space-y-2 divide-y divide-stone-900">
              {order.items.map(item => (
                <div key={item.cartItemId} className="pt-2 first:pt-0 flex justify-between items-start">
                  <div>
                    <span className="font-bold text-white">
                      {item.quantity}x {item.name}
                    </span>
                    {(item.size || item.crust) && (
                      <span className="block text-[11px] text-stone-400">
                        {item.size} • {item.crust}
                      </span>
                    )}
                    {item.selectedToppings.length > 0 && (
                      <span className="block text-[10px] text-amber-400/90">
                        + {item.selectedToppings.map(t => t.name).join(', ')}
                      </span>
                    )}
                  </div>
                  <span className="font-semibold text-stone-200">
                    {formatCurrency(item.totalPrice)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-stone-800/80 space-y-1">
              <div className="flex justify-between text-stone-400">
                <span>Subtotal</span>
                <span>{formatCurrency(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Discount</span>
                  <span>-{formatCurrency(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-stone-400">
                <span>Delivery</span>
                <span>{order.deliveryFee === 0 ? 'FREE' : formatCurrency(order.deliveryFee)}</span>
              </div>
              <div className="flex justify-between text-stone-400">
                <span>Tax (8%)</span>
                <span>{formatCurrency(order.tax)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-white pt-1.5 border-t border-stone-800">
                <span>Paid via {order.paymentMethod.toUpperCase()}</span>
                <span className="text-amber-400">{formatCurrency(order.total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 bg-stone-950 border-t border-stone-800 shrink-0 flex flex-col sm:flex-row gap-2.5">
          {/* WhatsApp Direct Receipt */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-xs transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Open WhatsApp Receipt</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-70" />
          </a>

          {/* Jump to KDS */}
          <button
            type="button"
            onClick={() => {
              onClose();
              onGoToKDS();
            }}
            className="flex-1 bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-xs transition-colors"
          >
            <ChefHat className="w-4 h-4 text-amber-400" />
            <span>View in Kitchen Board</span>
          </button>

          {/* Close */}
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 text-xs font-bold transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
