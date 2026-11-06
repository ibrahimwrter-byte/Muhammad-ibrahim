import React, { useState } from 'react';
import { 
  BarChart3, 
  ShoppingBag, 
  Layers, 
  Package, 
  Users, 
  Tag, 
  FileDown, 
  Plus, 
  Search, 
  Check, 
  AlertCircle, 
  TrendingUp, 
  DollarSign, 
  Bike, 
  Store, 
  ChefHat, 
  Edit3, 
  Trash2, 
  ExternalLink,
  ArrowUpRight
} from 'lucide-react';
import { Coupon, CustomerProfile, InventoryItem, MenuItem, Order, OrderStatus } from '../types';
import { formatCurrency } from '../utils/orderCalculations';

interface AdminDashboardProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
  menuItems: MenuItem[];
  onToggleItemAvailability: (id: string) => void;
  onAddNewMenuItem: (item: MenuItem) => void;
  inventory: InventoryItem[];
  onRestockInventory: (id: string, amount: number) => void;
  coupons: Coupon[];
  onToggleCouponActive: (code: string) => void;
  onAddNewCoupon: (coupon: Coupon) => void;
  customers: CustomerProfile[];
  onOpenStorefront: () => void;
  onOpenKDS: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  orders,
  onUpdateOrderStatus,
  menuItems,
  onToggleItemAvailability,
  onAddNewMenuItem,
  inventory,
  onRestockInventory,
  coupons,
  onToggleCouponActive,
  onAddNewCoupon,
  customers,
  onOpenStorefront,
  onOpenKDS,
}) => {
  type AdminTab = 'overview' | 'orders' | 'menu' | 'inventory' | 'customers' | 'promotions';
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  // Search & Filters
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [menuSearch, setMenuSearch] = useState('');
  const [selectedOrderReceipt, setSelectedOrderReceipt] = useState<Order | null>(null);

  // New Item Modal
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<MenuItem['category']>('Special House Pizza');
  const [newItemPrice, setNewItemPrice] = useState('16.99');
  const [newItemDescription, setNewItemDescription] = useState('');

  // New Coupon Form
  const [showAddCouponModal, setShowAddCouponModal] = useState(false);
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponType, setNewCouponType] = useState<'percent' | 'fixed'>('percent');
  const [newCouponVal, setNewCouponVal] = useState('15');
  const [newCouponMin, setNewCouponMin] = useState('20');
  const [newCouponDesc, setNewCouponDesc] = useState('');

  // Financial Stats
  const totalRevenue = orders.reduce((sum, o) => sum + (o.status !== 'cancelled' ? o.total : 0), 0);
  const totalDelivered = orders.filter(o => o.status === 'delivered').length;
  const activeOrders = orders.filter(o => o.status === 'new' || o.status === 'preparing' || o.status === 'ready').length;
  const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;

  // Export Daily Sales Report
  const handleExportReport = () => {
    const reportData = {
      restaurant: 'GO PIZZA SHOP',
      exportedAt: new Date().toISOString(),
      summary: {
        totalRevenue: Number(totalRevenue.toFixed(2)),
        totalOrders: orders.length,
        averageOrderValue: Number(avgOrderValue.toFixed(2)),
        activeInKitchen: activeOrders,
      },
      orders: orders.map(o => ({
        id: o.id,
        orderNumber: o.orderNumber,
        customer: o.customerName,
        phone: o.customerPhone,
        type: o.orderType,
        total: o.total,
        status: o.status,
        payment: o.paymentMethod,
        itemsCount: o.items.length,
        createdAt: o.createdAt,
      })),
      inventoryLevels: inventory.map(i => ({
        name: i.name,
        currentStock: i.currentStock,
        unit: i.unit,
        status: i.currentStock <= i.minThreshold ? 'LOW_STOCK' : 'OK',
      })),
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `GO_PIZZA_Sales_Report_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCreateMenuItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    const price = parseFloat(newItemPrice) || 14.99;
    const isPizza = newItemCategory.includes('Pizza');

    const created: MenuItem = {
      id: `custom-item-${Date.now()}`,
      name: newItemName.trim(),
      category: newItemCategory,
      description: newItemDescription.trim() || 'Freshly prepared specialty dish handcrafted in our kitchen.',
      image: isPizza
        ? 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80'
        : 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
      basePrice: price,
      tags: ['new', 'chef'],
      isAvailable: true,
      preparationTimeMin: 18,
      isCustomizable: isPizza,
    };

    onAddNewMenuItem(created);
    setShowAddItemModal(false);
    setNewItemName('');
    setNewItemDescription('');
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode.trim()) return;

    const created: Coupon = {
      code: newCouponCode.trim().toUpperCase(),
      discountType: newCouponType,
      value: parseFloat(newCouponVal) || 10,
      minOrder: parseFloat(newCouponMin) || 0,
      description: newCouponDesc.trim() || `${newCouponVal}% promotional savings`,
      isActive: true,
      usageCount: 0,
    };

    onAddNewCoupon(created);
    setShowAddCouponModal(false);
    setNewCouponCode('');
    setNewCouponDesc('');
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col">
      {/* Top Header */}
      <header className="bg-stone-900 border-b border-stone-800 px-6 py-4 sticky top-0 z-30 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500 flex items-center justify-center text-stone-950 font-black shadow-lg shadow-amber-950/50">
            <TrendingUp className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
              GO PIZZA MANAGEMENT HUB
            </h1>
            <p className="text-xs text-stone-400">Back-Office, Sales Analytics, Menu & Inventory Control</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleExportReport}
            className="bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold py-2 px-3.5 rounded-xl flex items-center gap-1.5 transition-colors border border-stone-700"
          >
            <FileDown className="w-4 h-4 text-emerald-400" />
            <span>Export Report (JSON)</span>
          </button>

          <button
            type="button"
            onClick={onOpenKDS}
            className="bg-red-600 hover:bg-red-500 text-white text-xs font-extrabold py-2 px-3.5 rounded-xl flex items-center gap-1.5 transition-colors shadow-md shadow-red-950/40"
          >
            <ChefHat className="w-4 h-4" />
            <span>Open Kitchen KDS</span>
          </button>

          <button
            type="button"
            onClick={onOpenStorefront}
            className="bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold py-2 px-3.5 rounded-xl transition-colors border border-stone-700/60"
          >
            Storefront
          </button>
        </div>
      </header>

      {/* Admin Navigation Tabs */}
      <nav className="bg-stone-950 border-b border-stone-800 px-6 py-2 flex items-center gap-2 overflow-x-auto text-xs shrink-0">
        {[
          { id: 'overview', label: 'Sales & Analytics', icon: BarChart3 },
          { id: 'orders', label: `Orders (${orders.length})`, icon: ShoppingBag },
          { id: 'menu', label: `Menu Items (${menuItems.length})`, icon: Layers },
          { id: 'inventory', label: 'Inventory & Stock', icon: Package },
          { id: 'customers', label: `Customers CRM (${customers.length})`, icon: Users },
          { id: 'promotions', label: `Discounts & Coupons (${coupons.length})`, icon: Tag },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as AdminTab)}
              className={`px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-950/40'
                  : 'text-stone-400 hover:text-white hover:bg-stone-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Main Tab Content */}
      <main className="p-6 flex-1 max-w-7xl w-full mx-auto space-y-6">
        {/* TAB 1: OVERVIEW & SALES DASHBOARD */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-5 shadow-lg">
                <div className="flex items-center justify-between text-stone-400 text-xs">
                  <span>Gross Sales Revenue</span>
                  <DollarSign className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white mt-2">
                  {formatCurrency(totalRevenue)}
                </div>
                <p className="text-[11px] text-emerald-400 font-semibold mt-1 flex items-center gap-1">
                  <ArrowUpRight className="w-3.5 h-3.5" /> +18.4% vs last week
                </p>
              </div>

              <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-5 shadow-lg">
                <div className="flex items-center justify-between text-stone-400 text-xs">
                  <span>Total Order Volume</span>
                  <ShoppingBag className="w-4 h-4 text-rose-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white mt-2">
                  {orders.length}
                </div>
                <p className="text-[11px] text-stone-400 mt-1">
                  {totalDelivered} completed • {activeOrders} in progress
                </p>
              </div>

              <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-5 shadow-lg">
                <div className="flex items-center justify-between text-stone-400 text-xs">
                  <span>Average Ticket (AOV)</span>
                  <TrendingUp className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white mt-2">
                  {formatCurrency(avgOrderValue)}
                </div>
                <p className="text-[11px] text-stone-400 mt-1">
                  Optimized combo bundles & toppings
                </p>
              </div>

              <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-5 shadow-lg">
                <div className="flex items-center justify-between text-stone-400 text-xs">
                  <span>Kitchen Inventory Alert</span>
                  <Package className="w-4 h-4 text-amber-500" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-amber-400 mt-2">
                  {inventory.filter(i => i.currentStock <= i.minThreshold).length} items
                </div>
                <p className="text-[11px] text-stone-400 mt-1">
                  {inventory.filter(i => i.currentStock <= i.minThreshold).length > 0 ? 'Requires immediate restock' : 'All stocks healthy'}
                </p>
              </div>
            </div>

            {/* Daily Breakdown & Popular Category Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-stone-900/60 border border-stone-800 rounded-3xl p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-extrabold text-white">
                    Today's Hourly Order Trend
                  </h3>
                  <span className="text-xs text-stone-400">Peak times: 12 PM - 2 PM, 7 PM - 10 PM</span>
                </div>

                {/* Visual Bar representation */}
                <div className="h-44 flex items-end justify-between gap-2 pt-6 px-2 border-b border-stone-800">
                  {[
                    { time: '11 AM', val: 30 },
                    { time: '12 PM', val: 85 },
                    { time: '1 PM', val: 95 },
                    { time: '2 PM', val: 60 },
                    { time: '3 PM', val: 40 },
                    { time: '4 PM', val: 35 },
                    { time: '5 PM', val: 55 },
                    { time: '6 PM', val: 80 },
                    { time: '7 PM', val: 100 },
                    { time: '8 PM', val: 90 },
                    { time: '9 PM', val: 75 },
                    { time: '10 PM', val: 50 },
                  ].map(b => (
                    <div key={b.time} className="flex-1 flex flex-col items-center gap-2 group">
                      <div
                        className="w-full bg-gradient-to-t from-red-600 to-amber-500 rounded-t-lg group-hover:from-red-500 group-hover:to-amber-400 transition-all cursor-pointer relative"
                        style={{ height: `${b.val}%` }}
                      >
                        <span className="opacity-0 group-hover:opacity-100 absolute -top-7 left-1/2 -translate-x-1/2 bg-stone-950 text-amber-400 font-bold text-[10px] px-1.5 py-0.5 rounded border border-stone-700 whitespace-nowrap transition-opacity">
                          {b.val}% load
                        </span>
                      </div>
                      <span className="text-[10px] text-stone-400">{b.time}</span>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-4 pt-2 text-center text-xs">
                  <div className="bg-stone-950 p-3 rounded-2xl border border-stone-800">
                    <span className="text-stone-400 block text-[11px]">Delivery Orders</span>
                    <strong className="text-base font-black text-white">
                      {orders.filter(o => o.orderType === 'delivery').length}
                    </strong>
                  </div>
                  <div className="bg-stone-950 p-3 rounded-2xl border border-stone-800">
                    <span className="text-stone-400 block text-[11px]">Counter Pickup</span>
                    <strong className="text-base font-black text-white">
                      {orders.filter(o => o.orderType === 'pickup').length}
                    </strong>
                  </div>
                  <div className="bg-stone-950 p-3 rounded-2xl border border-stone-800">
                    <span className="text-stone-400 block text-[11px]">Avg Prep Speed</span>
                    <strong className="text-base font-black text-amber-400">18.5 mins</strong>
                  </div>
                </div>
              </div>

              {/* Best-Selling Items */}
              <div className="bg-stone-900/60 border border-stone-800 rounded-3xl p-6 shadow-xl space-y-4">
                <h3 className="text-base font-extrabold text-white">
                  Top Performing Menu Items
                </h3>
                <div className="space-y-3">
                  {[
                    { name: 'NYC Double Crispy Pepperoni', sold: 48, rev: '$743.52' },
                    { name: 'Desi Chargrilled Chicken Tikka', sold: 42, rev: '$692.58' },
                    { name: 'Family Mega Feast Combo', sold: 29, rev: '$1,304.71' },
                    { name: 'Four Cheese Lava Burst', sold: 24, rev: '$359.76' },
                    { name: 'Monster Double Cheese Zinger', sold: 22, rev: '$263.78' },
                  ].map((top, idx) => (
                    <div key={top.name} className="flex items-center justify-between text-xs bg-stone-950/70 p-3 rounded-2xl border border-stone-800">
                      <div className="flex items-center gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-stone-800 text-stone-300 font-bold flex items-center justify-center text-[10px]">
                          {idx + 1}
                        </span>
                        <div>
                          <div className="font-bold text-stone-200">{top.name}</div>
                          <span className="text-[10px] text-stone-400">{top.sold} orders today</span>
                        </div>
                      </div>
                      <span className="font-mono font-bold text-amber-400">{top.rev}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ORDERS MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="bg-stone-900/70 border border-stone-800 rounded-3xl p-6 space-y-5 shadow-xl">
            {/* Search & Status Filters */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="relative flex-1 min-w-[240px]">
                <Search className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search orders by customer or ID..."
                  value={orderSearch}
                  onChange={e => setOrderSearch(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-9 pr-3 py-2 text-xs text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-stone-400">Status:</span>
                <select
                  value={orderStatusFilter}
                  onChange={e => setOrderStatusFilter(e.target.value)}
                  className="bg-stone-950 border border-stone-800 text-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500"
                >
                  <option value="all">All Statuses</option>
                  <option value="new">New</option>
                  <option value="preparing">Preparing</option>
                  <option value="ready">Ready</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Orders Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-300">
                <thead className="bg-stone-950 text-stone-400 text-[11px] uppercase tracking-wider border-b border-stone-800">
                  <tr>
                    <th className="p-3.5 rounded-l-xl">Ticket #</th>
                    <th className="p-3.5">Customer</th>
                    <th className="p-3.5">Fulfillment</th>
                    <th className="p-3.5">Items</th>
                    <th className="p-3.5">Total</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 rounded-r-xl text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800/60">
                  {orders
                    .filter(o => {
                      if (orderStatusFilter !== 'all' && o.status !== orderStatusFilter) return false;
                      if (orderSearch.trim()) {
                        const q = orderSearch.toLowerCase();
                        return (
                          o.customerName.toLowerCase().includes(q) ||
                          o.id.toLowerCase().includes(q) ||
                          String(o.orderNumber).includes(q)
                        );
                      }
                      return true;
                    })
                    .map(order => (
                      <tr key={order.id} className="hover:bg-stone-950/40 transition-colors">
                        <td className="p-3.5 font-mono font-bold text-white">
                          #{order.orderNumber}
                          <span className="text-[10px] text-stone-500 block">{order.id}</span>
                        </td>
                        <td className="p-3.5">
                          <div className="font-bold text-white">{order.customerName}</div>
                          <span className="text-[11px] text-stone-400">{order.customerPhone}</span>
                        </td>
                        <td className="p-3.5">
                          <span className={`inline-flex items-center gap-1 font-bold text-[11px] px-2 py-0.5 rounded-full ${
                            order.orderType === 'delivery'
                              ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}>
                            {order.orderType === 'delivery' ? <Bike className="w-3 h-3" /> : <Store className="w-3 h-3" />}
                            {order.orderType}
                          </span>
                        </td>
                        <td className="p-3.5 max-w-[200px] truncate">
                          {order.items.map(it => `${it.quantity}x ${it.name}`).join(', ')}
                        </td>
                        <td className="p-3.5 font-mono font-extrabold text-amber-400">
                          {formatCurrency(order.total)}
                        </td>
                        <td className="p-3.5">
                          <select
                            value={order.status}
                            onChange={e => onUpdateOrderStatus(order.id, e.target.value as OrderStatus)}
                            className="bg-stone-950 border border-stone-700 text-stone-200 rounded-lg px-2.5 py-1 text-xs font-semibold focus:outline-none focus:border-amber-500"
                          >
                            <option value="new">New</option>
                            <option value="preparing">Preparing</option>
                            <option value="ready">Ready</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="p-3.5 text-right">
                          <button
                            type="button"
                            onClick={() => setSelectedOrderReceipt(order)}
                            className="bg-stone-800 hover:bg-stone-700 text-stone-200 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
                          >
                            View Receipt
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: MENU & PRODUCT MANAGEMENT */}
        {activeTab === 'menu' && (
          <div className="bg-stone-900/70 border border-stone-800 rounded-3xl p-6 space-y-5 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="relative flex-1 min-w-[240px]">
                <Search className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search menu catalog..."
                  value={menuSearch}
                  onChange={e => setMenuSearch(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-9 pr-3 py-2 text-xs text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                type="button"
                onClick={() => setShowAddItemModal(true)}
                className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs py-2 px-4 rounded-xl flex items-center gap-1.5 transition-colors shadow-md shadow-amber-950/40"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>+ Add Menu Item</span>
              </button>
            </div>

            {/* Menu Items Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {menuItems
                .filter(item => {
                  if (menuSearch.trim()) {
                    const q = menuSearch.toLowerCase();
                    return item.name.toLowerCase().includes(q) || item.category.toLowerCase().includes(q);
                  }
                  return true;
                })
                .map(item => (
                  <div
                    key={item.id}
                    className={`bg-stone-950 border rounded-2xl p-4 flex gap-3.5 transition-colors ${
                      item.isAvailable ? 'border-stone-800' : 'border-stone-800 opacity-60'
                    }`}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 rounded-xl object-cover shrink-0 bg-stone-900"
                    />
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="text-xs font-bold text-white truncate">
                            {item.name}
                          </h4>
                          <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded">
                            {formatCurrency(item.basePrice)}
                          </span>
                        </div>
                        <span className="text-[10px] text-stone-400 block truncate mt-0.5">
                          {item.category}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-stone-900 mt-2">
                        <span className="text-[11px] text-stone-400">
                          {item.isAvailable ? 'In Stock' : 'Out of Stock'}
                        </span>
                        <button
                          type="button"
                          onClick={() => onToggleItemAvailability(item.id)}
                          className={`text-xs font-bold px-2.5 py-1 rounded-lg transition-colors ${
                            item.isAvailable
                              ? 'bg-emerald-950 text-emerald-400 hover:bg-red-950 hover:text-red-400 border border-emerald-800/40'
                              : 'bg-stone-800 text-stone-300 hover:bg-emerald-950 hover:text-emerald-400'
                          }`}
                        >
                          {item.isAvailable ? 'Available' : 'Mark In Stock'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* TAB 4: INVENTORY MANAGEMENT */}
        {activeTab === 'inventory' && (
          <div className="bg-stone-900/70 border border-stone-800 rounded-3xl p-6 space-y-5 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-white">
                  Kitchen Raw Material Stock Levels
                </h3>
                <p className="text-xs text-stone-400">
                  Automated depletion tracking based on active kitchen orders
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {inventory.map(inv => {
                const isLow = inv.currentStock <= inv.minThreshold;
                return (
                  <div
                    key={inv.id}
                    className={`bg-stone-950 border rounded-2xl p-4.5 flex flex-col justify-between ${
                      isLow ? 'border-amber-500/80 bg-amber-950/10' : 'border-stone-800'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between">
                        <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">
                          {inv.category}
                        </span>
                        {isLow && (
                          <span className="text-[10px] font-bold text-amber-400 bg-amber-400/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" /> Low Stock
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-bold text-white mt-1">
                        {inv.name}
                      </h4>
                      <div className="text-2xl font-black text-amber-400 mt-2 font-mono">
                        {inv.currentStock} <span className="text-xs font-normal text-stone-400">{inv.unit}</span>
                      </div>
                      <div className="text-[11px] text-stone-400 mt-0.5">
                        Minimum Threshold: {inv.minThreshold} {inv.unit}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-stone-800/80 mt-4 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onRestockInventory(inv.id, 25)}
                        className="flex-1 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold py-2 rounded-xl transition-colors"
                      >
                        + Restock 25 {inv.unit}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 5: CUSTOMER CRM */}
        {activeTab === 'customers' && (
          <div className="bg-stone-900/70 border border-stone-800 rounded-3xl p-6 space-y-5 shadow-xl">
            <h3 className="text-base font-extrabold text-white">
              Customer Relationship Management (CRM)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-300">
                <thead className="bg-stone-950 text-stone-400 text-[11px] uppercase tracking-wider border-b border-stone-800">
                  <tr>
                    <th className="p-3.5 rounded-l-xl">Customer Name</th>
                    <th className="p-3.5">Phone Number</th>
                    <th className="p-3.5">Loyalty Tier</th>
                    <th className="p-3.5">Total Orders</th>
                    <th className="p-3.5">Total Spent</th>
                    <th className="p-3.5">Favorite Pizza</th>
                    <th className="p-3.5 rounded-r-xl">Last Order</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800/60">
                  {customers.map(cust => (
                    <tr key={cust.id} className="hover:bg-stone-950/40 transition-colors">
                      <td className="p-3.5 font-bold text-white">{cust.name}</td>
                      <td className="p-3.5 text-stone-400">{cust.phone}</td>
                      <td className="p-3.5">
                        <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full ${
                          cust.loyaltyTier === 'VIP Platinum'
                            ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                            : cust.loyaltyTier === 'Gold'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-stone-800 text-stone-300'
                        }`}>
                          {cust.loyaltyTier}
                        </span>
                      </td>
                      <td className="p-3.5 font-mono font-bold text-white">{cust.totalOrders}</td>
                      <td className="p-3.5 font-mono font-extrabold text-amber-400">
                        {formatCurrency(cust.totalSpent)}
                      </td>
                      <td className="p-3.5 text-stone-200">{cust.favoriteItem}</td>
                      <td className="p-3.5 text-stone-400">{cust.lastOrderDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 6: PROMOTIONS & COUPONS */}
        {activeTab === 'promotions' && (
          <div className="bg-stone-900/70 border border-stone-800 rounded-3xl p-6 space-y-5 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-white">
                  Discount Codes & Promotional Vouchers
                </h3>
                <p className="text-xs text-stone-400">
                  Manage active coupons for customer checkout & WhatsApp campaigns
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddCouponModal(true)}
                className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs py-2 px-4 rounded-xl flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>+ Create Coupon</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {coupons.map(cp => (
                <div
                  key={cp.code}
                  className={`bg-stone-950 border rounded-2xl p-4 flex flex-col justify-between ${
                    cp.isActive ? 'border-stone-800' : 'border-stone-800 opacity-60'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <span className="text-base font-black font-mono tracking-wider text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-lg border border-amber-400/20">
                        {cp.code}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        cp.isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-stone-800 text-stone-500'
                      }`}>
                        {cp.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-white mt-3">
                      {cp.discountType === 'percent' ? `${cp.value}% Off` : `$${cp.value} Flat Off`}
                    </h4>
                    <p className="text-[11px] text-stone-400 mt-1">
                      {cp.description}
                    </p>
                    <div className="text-[11px] text-stone-500 mt-2">
                      Min order: {formatCurrency(cp.minOrder)} • Used {cp.usageCount} times
                    </div>
                  </div>

                  <div className="pt-3 border-t border-stone-900 mt-4">
                    <button
                      type="button"
                      onClick={() => onToggleCouponActive(cp.code)}
                      className={`w-full py-2 rounded-xl text-xs font-bold transition-colors ${
                        cp.isActive
                          ? 'bg-stone-800 hover:bg-red-950 hover:text-red-400 text-stone-300'
                          : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                      }`}
                    >
                      {cp.isActive ? 'Deactivate' : 'Activate Coupon'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* MODAL: View Order Receipt */}
      {selectedOrderReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-start border-b border-stone-800 pb-3">
              <div>
                <h4 className="text-lg font-bold text-white">Ticket #{selectedOrderReceipt.orderNumber}</h4>
                <span className="text-xs font-mono text-stone-400">{selectedOrderReceipt.id}</span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrderReceipt(null)}
                className="text-stone-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="text-xs space-y-2 text-stone-300">
              <div><strong>Customer:</strong> {selectedOrderReceipt.customerName} ({selectedOrderReceipt.customerPhone})</div>
              <div><strong>Fulfillment:</strong> {selectedOrderReceipt.orderType.toUpperCase()}</div>
              <div><strong>Address:</strong> {selectedOrderReceipt.deliveryAddress}</div>
              <div className="pt-2 border-t border-stone-800 space-y-1">
                {selectedOrderReceipt.items.map(it => (
                  <div key={it.cartItemId} className="flex justify-between">
                    <span>{it.quantity}x {it.name} ({it.size || ''})</span>
                    <span className="font-mono text-amber-400">{formatCurrency(it.totalPrice)}</span>
                  </div>
                ))}
              </div>
              <div className="pt-2 border-t border-stone-800 flex justify-between font-bold text-white text-sm">
                <span>Grand Total:</span>
                <span className="text-amber-400">{formatCurrency(selectedOrderReceipt.total)}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedOrderReceipt(null)}
              className="w-full bg-stone-800 hover:bg-stone-700 text-white py-2.5 rounded-xl font-bold text-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* MODAL: Add Menu Item */}
      {showAddItemModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h4 className="text-lg font-bold text-white">Add New Product to Menu</h4>
            <form onSubmit={handleCreateMenuItem} className="space-y-3 text-xs">
              <div>
                <label className="text-stone-300 block mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Smoky Truffle Beef Pizza"
                  value={newItemName}
                  onChange={e => setNewItemName(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="text-stone-300 block mb-1">Category</label>
                <select
                  value={newItemCategory}
                  onChange={e => setNewItemCategory(e.target.value as MenuItem['category'])}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-white"
                >
                  <option value="Classic Pizza">Classic Pizza</option>
                  <option value="Chicken Pizza">Chicken Pizza</option>
                  <option value="Fajita Pizza">Fajita Pizza</option>
                  <option value="Tikka Pizza">Tikka Pizza</option>
                  <option value="Supreme Pizza">Supreme Pizza</option>
                  <option value="Cheese Lovers Pizza">Cheese Lovers Pizza</option>
                  <option value="Pepperoni Pizza">Pepperoni Pizza</option>
                  <option value="Special House Pizza">Special House Pizza</option>
                  <option value="Zinger Burgers">Zinger Burgers</option>
                  <option value="Chicken Wings">Chicken Wings</option>
                  <option value="French Fries">French Fries</option>
                  <option value="Garlic Bread">Garlic Bread</option>
                  <option value="Cold Drinks & Shakes">Cold Drinks & Shakes</option>
                  <option value="Special Deals & Combos">Special Deals & Combos</option>
                </select>
              </div>

              <div>
                <label className="text-stone-300 block mb-1">Base Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={newItemPrice}
                  onChange={e => setNewItemPrice(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="text-stone-300 block mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Delicious ingredients..."
                  value={newItemDescription}
                  onChange={e => setNewItemDescription(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddItemModal(false)}
                  className="flex-1 bg-stone-800 text-stone-300 py-2.5 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-amber-500 text-stone-950 py-2.5 rounded-xl font-black"
                >
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Add Coupon */}
      {showAddCouponModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h4 className="text-lg font-bold text-white">Create New Coupon Code</h4>
            <form onSubmit={handleCreateCoupon} className="space-y-3 text-xs">
              <div>
                <label className="text-stone-300 block mb-1">Coupon Code (Uppercase)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. TASTY30"
                  value={newCouponCode}
                  onChange={e => setNewCouponCode(e.target.value.toUpperCase())}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-white font-mono uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-stone-300 block mb-1">Type</label>
                  <select
                    value={newCouponType}
                    onChange={e => setNewCouponType(e.target.value as 'percent' | 'fixed')}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-white"
                  >
                    <option value="percent">Percent (%)</option>
                    <option value="fixed">Fixed ($)</option>
                  </select>
                </div>
                <div>
                  <label className="text-stone-300 block mb-1">Value ({newCouponType === 'percent' ? '%' : '$'})</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newCouponVal}
                    onChange={e => setNewCouponVal(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-stone-300 block mb-1">Minimum Order ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={newCouponMin}
                  onChange={e => setNewCouponMin(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="text-stone-300 block mb-1">Description</label>
                <input
                  type="text"
                  placeholder="e.g. 15% off lunch special"
                  value={newCouponDesc}
                  onChange={e => setNewCouponDesc(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddCouponModal(false)}
                  className="flex-1 bg-stone-800 text-stone-300 py-2.5 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-amber-500 text-stone-950 py-2.5 rounded-xl font-black"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
