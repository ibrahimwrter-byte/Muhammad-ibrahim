export type SizeOption = 'Small (8")' | 'Regular (10")' | 'Large (12")' | 'Jumbo (14")';

export type CrustOption = 
  | 'Hand Tossed Pan' 
  | 'Thin Italian Crust' 
  | 'Cheese Stuffed Crust' 
  | 'Garlic Butter Crown Crust';

export interface PizzaTopping {
  id: string;
  name: string;
  price: number;
  category: 'cheese' | 'meat' | 'veggie' | 'sauce';
}

export type MenuCategory = 
  | 'Classic Pizza'
  | 'Chicken Pizza'
  | 'Fajita Pizza'
  | 'Tikka Pizza'
  | 'Supreme Pizza'
  | 'Cheese Lovers Pizza'
  | 'Pepperoni Pizza'
  | 'Special House Pizza'
  | 'Zinger Burgers'
  | 'Chicken Wings'
  | 'French Fries'
  | 'Garlic Bread'
  | 'Sandwiches'
  | 'Cold Drinks & Shakes'
  | 'Special Deals & Combos';

export interface MenuItem {
  id: string;
  name: string;
  category: MenuCategory;
  description: string;
  image: string;
  basePrice: number;
  sizes?: Partial<Record<SizeOption, number>>;
  defaultSize?: SizeOption;
  crusts?: Array<{ name: CrustOption; price: number }>;
  defaultCrust?: CrustOption;
  availableToppings?: PizzaTopping[];
  tags: ('bestseller' | 'spicy' | 'chef' | 'veg' | 'new')[];
  isAvailable: boolean;
  preparationTimeMin: number;
  calories?: string;
  isCustomizable?: boolean;
}

export interface CartItem {
  cartItemId: string;
  menuItemId: string;
  name: string;
  category: MenuCategory;
  image: string;
  size?: SizeOption;
  crust?: CrustOption;
  selectedToppings: { name: string; price: number }[];
  specialInstructions?: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
}

export type OrderStatus = 'new' | 'preparing' | 'ready' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  orderNumber: number;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  orderType: 'delivery' | 'pickup';
  deliveryAddress: string;
  deliveryInstructions?: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  tax: number;
  total: number;
  couponCode?: string;
  status: OrderStatus;
  paymentMethod: 'cash' | 'card' | 'online';
  createdAt: string;
  estimatedTimeMinutes: number;
  preparationNotes?: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  unit: string;
  currentStock: number;
  minThreshold: number;
  category: 'dairy' | 'meat' | 'produce' | 'packaging' | 'beverage';
  lastRestocked: string;
}

export interface Coupon {
  code: string;
  discountType: 'percent' | 'fixed';
  value: number;
  minOrder: number;
  maxDiscount?: number;
  description: string;
  isActive: boolean;
  usageCount: number;
}

export interface CustomerProfile {
  id: string;
  name: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  favoriteItem: string;
  loyaltyTier: 'Bronze' | 'Silver' | 'Gold' | 'VIP Platinum';
}
