import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { MenuSection } from './components/MenuSection';
import { DealsSection } from './components/DealsSection';
import { AboutSection } from './components/AboutSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { PizzaCustomizerModal } from './components/PizzaCustomizerModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderConfirmationModal } from './components/OrderConfirmationModal';
import { KitchenDisplaySystem } from './components/KitchenDisplaySystem';
import { AdminDashboard } from './components/AdminDashboard';
import { MarketingStudio } from './components/MarketingStudio';
import { 
  INITIAL_MENU_ITEMS, 
  INITIAL_ORDERS, 
  INITIAL_INVENTORY, 
  INITIAL_COUPONS, 
  INITIAL_CUSTOMERS 
} from './data/menuData';
import { CartItem, Coupon, CustomerProfile, InventoryItem, MenuItem, Order, OrderStatus } from './types';
import { generateWhatsAppOrderUrl } from './utils/orderCalculations';

export default function App() {
  // Check URL query parameters for direct view routing
  const [currentView, setCurrentView] = useState<'storefront' | 'kds' | 'admin' | 'marketing'>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const view = params.get('view');
      if (view === 'kds' || view === 'admin' || view === 'marketing') {
        return view;
      }
    }
    return 'storefront';
  });

  const [activeSection, setActiveSection] = useState('hero');

  // Persistent State with LocalStorage
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    try {
      const saved = localStorage.getItem('gopizza_menu_v1');
      return saved ? JSON.parse(saved) : INITIAL_MENU_ITEMS;
    } catch {
      return INITIAL_MENU_ITEMS;
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('gopizza_orders_v1');
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('gopizza_inventory_v1');
      return saved ? JSON.parse(saved) : INITIAL_INVENTORY;
    } catch {
      return INITIAL_INVENTORY;
    }
  });

  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    try {
      const saved = localStorage.getItem('gopizza_coupons_v1');
      return saved ? JSON.parse(saved) : INITIAL_COUPONS;
    } catch {
      return INITIAL_COUPONS;
    }
  });

  const [customers, setCustomers] = useState<CustomerProfile[]>(() => {
    try {
      const saved = localStorage.getItem('gopizza_customers_v1');
      return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
    } catch {
      return INITIAL_CUSTOMERS;
    }
  });

  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('gopizza_cart_v1');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [orderType, setOrderType] = useState<'delivery' | 'pickup'>('delivery');

  // Modals
  const [customizingItem, setCustomizingItem] = useState<MenuItem | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('gopizza_menu_v1', JSON.stringify(menuItems));
  }, [menuItems]);

  useEffect(() => {
    localStorage.setItem('gopizza_orders_v1', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('gopizza_inventory_v1', JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem('gopizza_coupons_v1', JSON.stringify(coupons));
  }, [coupons]);

  useEffect(() => {
    localStorage.setItem('gopizza_cart_v1', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('gopizza_customers_v1', JSON.stringify(customers));
  }, [customers]);

  // Smooth Navigation
  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    if (currentView !== 'storefront') {
      setCurrentView('storefront');
    }
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 50);
  };

  // Cart Operations
  const handleAddToCart = (customizedItem: Omit<CartItem, 'cartItemId'>) => {
    const cartItemId = `cart-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    const fullItem: CartItem = {
      ...customizedItem,
      cartItemId,
    };

    setCartItems(prev => [...prev, fullItem]);
    setIsCartOpen(true);
  };

  const handleQuickAddNonCustomizable = (item: MenuItem) => {
    handleAddToCart({
      menuItemId: item.id,
      name: item.name,
      category: item.category,
      image: item.image,
      selectedToppings: [],
      unitPrice: item.basePrice,
      quantity: 1,
      totalPrice: item.basePrice,
    });
  };

  const handleUpdateQuantity = (cartItemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItem(cartItemId);
      return;
    }
    setCartItems(prev =>
      prev.map(it => {
        if (it.cartItemId === cartItemId) {
          return {
            ...it,
            quantity: newQuantity,
            totalPrice: Number((it.unitPrice * newQuantity).toFixed(2)),
          };
        }
        return it;
      })
    );
  };

  const handleRemoveItem = (cartItemId: string) => {
    setCartItems(prev => prev.filter(it => it.cartItemId !== cartItemId));
  };

  // Order Placement
  const handleOrderSuccess = (newOrder: Order, openWhatsAppDirectly: boolean = false) => {
    // 1. Add order to KDS and Order History
    setOrders(prev => [newOrder, ...prev]);

    // 2. Clear Cart & Applied Coupon
    setCartItems([]);
    setAppliedCoupon(null);
    setIsCheckoutOpen(false);
    setIsCartOpen(false);

    // 3. Update customer CRM or create new
    setCustomers(prev => {
      const existing = prev.find(c => c.phone === newOrder.customerPhone);
      if (existing) {
        return prev.map(c => {
          if (c.phone === newOrder.customerPhone) {
            return {
              ...c,
              totalOrders: c.totalOrders + 1,
              totalSpent: Number((c.totalSpent + newOrder.total).toFixed(2)),
              lastOrderDate: new Date().toISOString().split('T')[0],
              loyaltyTier: (c.totalOrders + 1 >= 10 ? 'VIP Platinum' : c.totalOrders + 1 >= 5 ? 'Gold' : 'Silver') as CustomerProfile['loyaltyTier'],
            };
          }
          return c;
        });
      } else {
        const newCust: CustomerProfile = {
          id: `cust-${Date.now()}`,
          name: newOrder.customerName,
          phone: newOrder.customerPhone,
          totalOrders: 1,
          totalSpent: newOrder.total,
          lastOrderDate: new Date().toISOString().split('T')[0],
          favoriteItem: newOrder.items[0]?.name || 'Specialty Pizza',
          loyaltyTier: 'Bronze',
        };
        return [newCust, ...prev];
      }
    });

    // 4. Show confirmation modal
    setConfirmedOrder(newOrder);

    // 5. If WhatsApp requested, open the WhatsApp link in a new tab
    if (openWhatsAppDirectly) {
      const waUrl = generateWhatsAppOrderUrl(newOrder);
      window.open(waUrl, '_blank', 'noopener,noreferrer');
    }
  };

  // KDS & Order Status Updater
  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders(prev =>
      prev.map(o => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    if (confirmedOrder && confirmedOrder.id === orderId) {
      setConfirmedOrder(prev => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  // Manual Walk-in Order from KDS
  const handleAddManualWalkIn = () => {
    const orderNumber = Math.floor(100 + Math.random() * 900);
    const orderId = `GP-${Math.floor(1000 + Math.random() * 9000)}`;

    const manualOrder: Order = {
      id: orderId,
      orderNumber,
      customerName: `Walk-in Counter Guest #${orderNumber}`,
      customerPhone: '+1 (555) 000-0000',
      orderType: 'pickup',
      deliveryAddress: 'GO PIZZA Counter Station',
      items: [
        {
          cartItemId: `manual-${Date.now()}`,
          menuItemId: 'pizza-margherita',
          name: 'Margherita Royale',
          category: 'Classic Pizza',
          image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=800&q=80',
          size: 'Regular (10")',
          crust: 'Hand Tossed Pan',
          selectedToppings: [],
          unitPrice: 12.99,
          quantity: 1,
          totalPrice: 12.99,
          specialInstructions: 'Dine-in hot box',
        },
      ],
      subtotal: 12.99,
      discount: 0,
      deliveryFee: 0,
      tax: 1.04,
      total: 14.03,
      status: 'new',
      paymentMethod: 'cash',
      createdAt: new Date().toISOString(),
      estimatedTimeMinutes: 15,
      preparationNotes: 'Counter urgent walk-in ticket',
    };

    setOrders(prev => [manualOrder, ...prev]);
  };

  // Menu, Inventory, Coupon Handlers
  const handleToggleItemAvailability = (id: string) => {
    setMenuItems(prev =>
      prev.map(it => (it.id === id ? { ...it, isAvailable: !it.isAvailable } : it))
    );
  };

  const handleAddNewMenuItem = (item: MenuItem) => {
    setMenuItems(prev => [item, ...prev]);
  };

  const handleRestockInventory = (id: string, amount: number) => {
    setInventory(prev =>
      prev.map(inv =>
        inv.id === id
          ? {
              ...inv,
              currentStock: inv.currentStock + amount,
              lastRestocked: new Date().toISOString().split('T')[0],
            }
          : inv
      )
    );
  };

  const handleToggleCouponActive = (code: string) => {
    setCoupons(prev =>
      prev.map(c => (c.code === code ? { ...c, isActive: !c.isActive } : c))
    );
  };

  const handleAddNewCoupon = (coupon: Coupon) => {
    setCoupons(prev => [coupon, ...prev]);
  };

  // RENDER BASED ON VIEW
  if (currentView === 'kds') {
    return (
      <KitchenDisplaySystem
        orders={orders}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        onAddManualOrder={handleAddManualWalkIn}
        onOpenStorefront={() => setCurrentView('storefront')}
      />
    );
  }

  if (currentView === 'admin') {
    return (
      <AdminDashboard
        orders={orders}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        menuItems={menuItems}
        onToggleItemAvailability={handleToggleItemAvailability}
        onAddNewMenuItem={handleAddNewMenuItem}
        inventory={inventory}
        onRestockInventory={handleRestockInventory}
        coupons={coupons}
        onToggleCouponActive={handleToggleCouponActive}
        onAddNewCoupon={handleAddNewCoupon}
        customers={customers}
        onOpenStorefront={() => setCurrentView('storefront')}
        onOpenKDS={() => setCurrentView('kds')}
      />
    );
  }

  if (currentView === 'marketing') {
    return <MarketingStudio onBackToStore={() => setCurrentView('storefront')} />;
  }

  // DEFAULT VIEW: STOREFRONT
  const specialDeals = menuItems.filter(item => item.category === 'Special Deals & Combos');

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans selection:bg-amber-500 selection:text-stone-950">
      {/* Top Navbar */}
      <Navbar
        cartItems={cartItems}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenKDS={() => setCurrentView('kds')}
        onOpenAdmin={() => setCurrentView('admin')}
        onOpenMarketing={() => setCurrentView('marketing')}
        activeSection={activeSection}
        onNavigateSection={scrollToSection}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* 1. Hero Section */}
        <Hero
          onOrderNow={() => scrollToSection('menu')}
          onExploreDeals={() => scrollToSection('deals')}
          onOpenMenu={() => scrollToSection('menu')}
        />

        {/* 2. Menu Section */}
        <MenuSection
          menuItems={menuItems}
          onSelectItemForCustomization={item => setCustomizingItem(item)}
          onQuickAddToCart={handleQuickAddNonCustomizable}
        />

        {/* 3. Special Deals Section */}
        <DealsSection
          deals={specialDeals}
          onAddDealToCart={deal => handleQuickAddNonCustomizable(deal)}
        />

        {/* 4. About Us Section */}
        <AboutSection />

        {/* 5. Contact Us Section */}
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer
        onNavigateSection={scrollToSection}
        onOpenKDS={() => setCurrentView('kds')}
        onOpenAdmin={() => setCurrentView('admin')}
        onOpenMarketing={() => setCurrentView('marketing')}
      />

      {/* Interactive Modals */}
      <PizzaCustomizerModal
        item={customizingItem}
        isOpen={Boolean(customizingItem)}
        onClose={() => setCustomizingItem(null)}
        onAddToCart={handleAddToCart}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        orderType={orderType}
        onToggleOrderType={setOrderType}
        appliedCoupon={appliedCoupon}
        onApplyCoupon={setAppliedCoupon}
        availableCoupons={coupons}
        onOpenCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        onBrowseMenu={() => scrollToSection('menu')}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        orderType={orderType}
        appliedCoupon={appliedCoupon}
        onOrderSuccess={handleOrderSuccess}
      />

      <OrderConfirmationModal
        order={confirmedOrder}
        isOpen={Boolean(confirmedOrder)}
        onClose={() => setConfirmedOrder(null)}
        onGoToKDS={() => {
          setConfirmedOrder(null);
          setCurrentView('kds');
        }}
      />
    </div>
  );
}
