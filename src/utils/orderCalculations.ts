import { CartItem, Coupon, CrustOption, Order, PizzaTopping, SizeOption } from '../types';

export function calculateItemUnitPrice(
  basePrice: number,
  sizes?: Partial<Record<SizeOption, number>>,
  selectedSize?: SizeOption,
  crusts?: Array<{ name: CrustOption; price: number }>,
  selectedCrust?: CrustOption,
  selectedToppings: { name: string; price: number }[] = []
): number {
  let price = basePrice;

  // If size specific pricing exists
  if (selectedSize && sizes && sizes[selectedSize] !== undefined) {
    price = sizes[selectedSize]!;
  }

  // Add crust surcharge if any
  if (selectedCrust && crusts) {
    const crustMatch = crusts.find(c => c.name === selectedCrust);
    if (crustMatch) {
      price += crustMatch.price;
    }
  }

  // Add toppings
  const toppingsTotal = selectedToppings.reduce((acc, t) => acc + (t.price || 0), 0);
  price += toppingsTotal;

  return Number(price.toFixed(2));
}

export interface CartTotals {
  subtotal: number;
  discount: number;
  deliveryFee: number;
  tax: number;
  total: number;
  freeDeliveryThreshold: number;
  amountNeededForFreeDelivery: number;
}

export function calculateCartTotals(
  items: CartItem[],
  coupon: Coupon | null = null,
  orderType: 'delivery' | 'pickup' = 'delivery',
  taxRate: number = 0.08
): CartTotals {
  const FREE_DELIVERY_THRESHOLD = 35.00;
  const STANDARD_DELIVERY_FEE = 3.99;

  const subtotal = Number(
    items.reduce((sum, item) => sum + (item.totalPrice || item.unitPrice * item.quantity), 0).toFixed(2)
  );

  let discount = 0;
  if (coupon && coupon.isActive && subtotal >= coupon.minOrder) {
    if (coupon.discountType === 'percent') {
      const calculated = (subtotal * coupon.value) / 100;
      discount = coupon.maxDiscount ? Math.min(calculated, coupon.maxDiscount) : calculated;
    } else {
      discount = Math.min(coupon.value, subtotal);
    }
  }
  discount = Number(discount.toFixed(2));

  let deliveryFee = 0;
  if (orderType === 'delivery') {
    deliveryFee = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : STANDARD_DELIVERY_FEE;
  }

  const taxableAmount = Math.max(0, subtotal - discount);
  const tax = Number((taxableAmount * taxRate).toFixed(2));
  const total = Number((taxableAmount + tax + deliveryFee).toFixed(2));

  const amountNeededForFreeDelivery = Math.max(0, Number((FREE_DELIVERY_THRESHOLD - subtotal).toFixed(2)));

  return {
    subtotal,
    discount,
    deliveryFee,
    tax,
    total,
    freeDeliveryThreshold: FREE_DELIVERY_THRESHOLD,
    amountNeededForFreeDelivery,
  };
}

export function validateCoupon(
  code: string,
  subtotal: number,
  availableCoupons: Coupon[]
): { valid: boolean; coupon?: Coupon; error?: string } {
  const normalized = code.trim().toUpperCase();
  if (!normalized) {
    return { valid: false, error: 'Please enter a coupon code.' };
  }

  const found = availableCoupons.find(c => c.code.toUpperCase() === normalized);
  if (!found) {
    return { valid: false, error: 'Invalid coupon code. Check spelling or try GOPIZZA20.' };
  }

  if (!found.isActive) {
    return { valid: false, error: 'This coupon has expired or is inactive.' };
  }

  if (subtotal < found.minOrder) {
    return {
      valid: false,
      coupon: found,
      error: `Minimum order of $${found.minOrder.toFixed(2)} required for coupon ${found.code}.`,
    };
  }

  return { valid: true, coupon: found };
}

export function formatCurrency(amount: number): string {
  return `$${Number(amount || 0).toFixed(2)}`;
}

export function estimatePreparationTime(items: CartItem[]): number {
  if (!items || items.length === 0) return 20;
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const baseMinutes = 18;
  const estimated = baseMinutes + Math.min(itemCount * 2, 22);
  return estimated;
}

export function generateWhatsAppOrderUrl(order: Order, restaurantPhoneNumber: string = '18004674992'): string {
  const itemsText = order.items
    .map(item => {
      let desc = `• ${item.quantity}x *${item.name}*`;
      if (item.size) desc += ` [${item.size}]`;
      if (item.crust) desc += ` [${item.crust}]`;
      desc += ` - ${formatCurrency(item.totalPrice)}`;
      if (item.selectedToppings && item.selectedToppings.length > 0) {
        desc += `\n   + Extra: ${item.selectedToppings.map(t => t.name).join(', ')}`;
      }
      if (item.specialInstructions) {
        desc += `\n   Note: "${item.specialInstructions}"`;
      }
      return desc;
    })
    .join('\n');

  const message = `🍕 *GO PIZZA SHOP - NEW ORDER #${order.orderNumber}* 🍕\n` +
    `----------------------------------------\n` +
    `👤 *Customer:* ${order.customerName}\n` +
    `📞 *Phone:* ${order.customerPhone}\n` +
    `🛵 *Fulfillment:* ${order.orderType.toUpperCase()}\n` +
    (order.orderType === 'delivery' ? `📍 *Address:* ${order.deliveryAddress}\n` : `🏬 *Pickup:* GO PIZZA Downtown Kitchen\n`) +
    (order.deliveryInstructions ? `📝 *Delivery Note:* ${order.deliveryInstructions}\n` : '') +
    `💳 *Payment:* ${order.paymentMethod.toUpperCase()}\n` +
    `----------------------------------------\n` +
    `🍽️ *ORDER ITEMS:*\n${itemsText}\n` +
    `----------------------------------------\n` +
    `Subtotal: ${formatCurrency(order.subtotal)}\n` +
    (order.discount > 0 ? `Discount (${order.couponCode || 'PROMO'}): -${formatCurrency(order.discount)}\n` : '') +
    `Tax (8%): ${formatCurrency(order.tax)}\n` +
    `Delivery: ${order.deliveryFee === 0 ? 'FREE' : formatCurrency(order.deliveryFee)}\n` +
    `*TOTAL DUE:* *${formatCurrency(order.total)}*\n` +
    `----------------------------------------\n` +
    `⏰ *Estimated Time:* ~${order.estimatedTimeMinutes} mins\n` +
    `Thank you for choosing GO PIZZA SHOP! 🔥`;

  return `https://wa.me/${restaurantPhoneNumber.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
}
