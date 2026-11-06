import React, { useState, useEffect } from 'react';
import { ChefHat, Clock, AlertTriangle, CheckCircle2, Flame, Bike, Store, Filter, Search, Plus, Volume2, VolumeX, ArrowRight, RefreshCw } from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { formatCurrency } from '../utils/orderCalculations';

interface KitchenDisplaySystemProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  onAddManualOrder: () => void;
  onOpenStorefront: () => void;
}

export const KitchenDisplaySystem: React.FC<KitchenDisplaySystemProps> = ({
  orders,
  onUpdateOrderStatus,
  onAddManualOrder,
  onOpenStorefront,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'delivery' | 'pickup'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [currentTime, setCurrentTime] = useState(Date.now());

  // Update timer tick every 10 seconds for elapsed timer badges
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(Date.now()), 10000);
    return () => clearInterval(timer);
  }, []);

  const getElapsedMinutes = (createdAt: string) => {
    const diffMs = currentTime - new Date(createdAt).getTime();
    return Math.max(0, Math.floor(diffMs / (1000 * 60)));
  };

  const filteredOrders = orders.filter(order => {
    if (filterType !== 'all' && order.orderType !== filterType) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = order.customerName.toLowerCase().includes(q);
      const matchId = order.id.toLowerCase().includes(q) || String(order.orderNumber).includes(q);
      if (!matchName && !matchId) return false;
    }
    return true;
  });

  const newOrders = filteredOrders.filter(o => o.status === 'new');
  const preparingOrders = filteredOrders.filter(o => o.status === 'preparing');
  const readyOrders = filteredOrders.filter(o => o.status === 'ready');
  const completedOrders = filteredOrders.filter(o => o.status === 'delivered');

  const renderOrderCard = (order: Order) => {
    const elapsed = getElapsedMinutes(order.createdAt);
    const isUrgent = elapsed >= 20;
    const isWarning = elapsed >= 12 && elapsed < 20;

    return (
      <div
        key={order.id}
        className={`bg-stone-900 border rounded-2xl p-4 shadow-xl flex flex-col transition-all ${
          order.status === 'new'
            ? 'border-amber-500/60 ring-2 ring-amber-500/20'
            : order.status === 'preparing'
            ? 'border-rose-500/50'
            : order.status === 'ready'
            ? 'border-emerald-500/50'
            : 'border-stone-800 opacity-75'
        }`}
      >
        {/* Ticket Header */}
        <div className="flex items-start justify-between gap-2 pb-3 border-b border-stone-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-black text-white font-mono">
                #{order.orderNumber}
              </span>
              <span className="text-[11px] font-mono text-stone-400">
                {order.id}
              </span>
              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full flex items-center gap-1 ${
                order.orderType === 'delivery'
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              }`}>
                {order.orderType === 'delivery' ? <Bike className="w-3 h-3" /> : <Store className="w-3 h-3" />}
                {order.orderType}
              </span>
            </div>
            <div className="text-xs font-bold text-stone-200 mt-1">
              {order.customerName}
            </div>
          </div>

          {/* Elapsed Timer Badge */}
          <div className={`px-2.5 py-1 rounded-xl flex items-center gap-1.5 text-xs font-black ${
            isUrgent
              ? 'bg-red-500 text-white animate-pulse'
              : isWarning
              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
              : 'bg-stone-800 text-stone-300'
          }`}>
            <Clock className="w-3.5 h-3.5" />
            <span>{elapsed}m</span>
          </div>
        </div>

        {/* Food Items List */}
        <div className="py-3 flex-1 space-y-3">
          {order.items.map(item => (
            <div key={item.cartItemId} className="text-xs space-y-0.5">
              <div className="flex justify-between font-bold text-stone-100">
                <span className="flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-md bg-stone-800 text-amber-400 flex items-center justify-center text-xs font-black shrink-0">
                    {item.quantity}x
                  </span>
                  <span>{item.name}</span>
                </span>
                <span className="text-stone-400 font-mono text-[11px]">
                  {formatCurrency(item.totalPrice)}
                </span>
              </div>

              {(item.size || item.crust) && (
                <div className="pl-6 text-[11px] text-amber-400 font-semibold">
                  {item.size} • {item.crust}
                </div>
              )}

              {item.selectedToppings.length > 0 && (
                <div className="pl-6 text-[10px] text-emerald-400 font-medium">
                  + {item.selectedToppings.map(t => t.name).join(', ')}
                </div>
              )}

              {item.specialInstructions && (
                <div className="ml-6 mt-1 p-1.5 rounded-lg bg-red-950/40 border border-red-500/30 text-[11px] text-red-200 font-bold flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                  <span>NOTE: "{item.specialInstructions}"</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Customer Address / Instructions preview */}
        {order.orderType === 'delivery' && order.deliveryAddress && (
          <div className="text-[11px] text-stone-400 bg-stone-950/70 p-2 rounded-xl border border-stone-800/80 mb-3 truncate">
            📍 {order.deliveryAddress}
          </div>
        )}

        {/* Action Controls based on status */}
        <div className="pt-2 border-t border-stone-800 mt-auto flex items-center gap-2">
          {order.status === 'new' && (
            <button
              type="button"
              onClick={() => onUpdateOrderStatus(order.id, 'preparing')}
              className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-stone-950 font-black text-xs flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
            >
              <Flame className="w-4 h-4 fill-stone-950" />
              <span>Start Baking in Oven</span>
            </button>
          )}

          {order.status === 'preparing' && (
            <button
              type="button"
              onClick={() => onUpdateOrderStatus(order.id, 'ready')}
              className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-extrabold text-xs flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Mark Baked & Ready</span>
            </button>
          )}

          {order.status === 'ready' && (
            <button
              type="button"
              onClick={() => onUpdateOrderStatus(order.id, 'delivered')}
              className="w-full py-2.5 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-extrabold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <ArrowRight className="w-4 h-4 text-emerald-400" />
              <span>{order.orderType === 'delivery' ? 'Dispatch to Driver' : 'Handed to Customer'}</span>
            </button>
          )}

          {order.status === 'delivered' && (
            <div className="w-full py-1.5 text-center text-xs text-stone-500 font-bold flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Completed
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col">
      {/* Top KDS Control Bar */}
      <header className="bg-stone-900 border-b border-stone-800 px-6 py-4 sticky top-0 z-30 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-red-600 flex items-center justify-center text-white shadow-lg shadow-red-950/60">
              <ChefHat className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black text-white tracking-tight">
                  GO PIZZA KITCHEN DISPLAY
                </h1>
                <span className="text-[10px] font-black uppercase tracking-wider bg-rose-500/20 text-rose-400 px-2 py-0.5 rounded border border-rose-500/30 animate-pulse">
                  LIVE STATION
                </span>
              </div>
              <p className="text-xs text-stone-400">Real-time Stone Oven & Kitchen Order Dispatch</p>
            </div>
          </div>
        </div>

        {/* Center Search & Filters */}
        <div className="flex items-center gap-2.5 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by ticket # or customer..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Filter Type */}
          <div className="flex bg-stone-950 border border-stone-800 rounded-xl p-1 text-xs">
            <button
              type="button"
              onClick={() => setFilterType('all')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
                filterType === 'all' ? 'bg-stone-800 text-white' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              All ({orders.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterType('delivery')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
                filterType === 'delivery' ? 'bg-blue-600 text-white' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Delivery
            </button>
            <button
              type="button"
              onClick={() => setFilterType('pickup')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
                filterType === 'pickup' ? 'bg-amber-500 text-stone-950' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Pickup
            </button>
          </div>
        </div>

        {/* Right Tools */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setSoundEnabled(s => !s)}
            className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors"
            title={soundEnabled ? 'Kitchen chime sound active' : 'Sound muted'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-stone-500" />}
          </button>

          <button
            type="button"
            onClick={onAddManualOrder}
            className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-extrabold text-xs py-2 px-3.5 rounded-xl flex items-center gap-1.5 shadow-md shadow-amber-950/40 transition-colors"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>+ Counter Order</span>
          </button>

          <button
            type="button"
            onClick={onOpenStorefront}
            className="bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold py-2 px-3.5 rounded-xl transition-colors border border-stone-700/60"
          >
            Return to Store
          </button>
        </div>
      </header>

      {/* 4 Kanban Columns */}
      <main className="flex-1 p-6 overflow-x-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 min-w-[1000px]">
          {/* Column 1: New Orders */}
          <div className="flex flex-col rounded-3xl bg-stone-900/40 border border-stone-800/80 p-4">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-stone-800">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-400 ring-4 ring-amber-400/20 animate-pulse" />
                <h2 className="text-sm font-black text-white tracking-wide uppercase">
                  1. New Orders
                </h2>
              </div>
              <span className="text-xs font-mono font-bold bg-amber-400/20 text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-400/30">
                {newOrders.length}
              </span>
            </div>
            <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-200px)] pr-1">
              {newOrders.length === 0 ? (
                <div className="p-8 text-center text-xs text-stone-500 italic border border-dashed border-stone-800 rounded-2xl">
                  No new orders in queue.
                </div>
              ) : (
                newOrders.map(renderOrderCard)
              )}
            </div>
          </div>

          {/* Column 2: In Preparation / Oven */}
          <div className="flex flex-col rounded-3xl bg-stone-900/40 border border-stone-800/80 p-4">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-stone-800">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500 ring-4 ring-rose-500/20" />
                <h2 className="text-sm font-black text-white tracking-wide uppercase">
                  2. In Oven / Baking
                </h2>
              </div>
              <span className="text-xs font-mono font-bold bg-rose-500/20 text-rose-300 px-2.5 py-0.5 rounded-full border border-rose-500/30">
                {preparingOrders.length}
              </span>
            </div>
            <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-200px)] pr-1">
              {preparingOrders.length === 0 ? (
                <div className="p-8 text-center text-xs text-stone-500 italic border border-dashed border-stone-800 rounded-2xl">
                  Oven stations ready for incoming dough.
                </div>
              ) : (
                preparingOrders.map(renderOrderCard)
              )}
            </div>
          </div>

          {/* Column 3: Ready for Dispatch */}
          <div className="flex flex-col rounded-3xl bg-stone-900/40 border border-stone-800/80 p-4">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-stone-800">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-400 ring-4 ring-emerald-400/20" />
                <h2 className="text-sm font-black text-white tracking-wide uppercase">
                  3. Ready for Handover
                </h2>
              </div>
              <span className="text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                {readyOrders.length}
              </span>
            </div>
            <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-200px)] pr-1">
              {readyOrders.length === 0 ? (
                <div className="p-8 text-center text-xs text-stone-500 italic border border-dashed border-stone-800 rounded-2xl">
                  No orders currently waiting for dispatch.
                </div>
              ) : (
                readyOrders.map(renderOrderCard)
              )}
            </div>
          </div>

          {/* Column 4: Completed / Dispatched */}
          <div className="flex flex-col rounded-3xl bg-stone-900/40 border border-stone-800/80 p-4">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-stone-800">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-stone-500" />
                <h2 className="text-sm font-black text-stone-400 tracking-wide uppercase">
                  4. Dispatched / Done
                </h2>
              </div>
              <span className="text-xs font-mono font-bold bg-stone-800 text-stone-400 px-2.5 py-0.5 rounded-full">
                {completedOrders.length}
              </span>
            </div>
            <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-200px)] pr-1">
              {completedOrders.length === 0 ? (
                <div className="p-8 text-center text-xs text-stone-500 italic border border-dashed border-stone-800 rounded-2xl">
                  Completed orders will appear here.
                </div>
              ) : (
                completedOrders.slice(0, 10).map(renderOrderCard)
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
