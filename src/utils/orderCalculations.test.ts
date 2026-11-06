import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateItemUnitPrice,
  calculateCartTotals,
  validateCoupon,
  estimatePreparationTime,
  generateWhatsAppOrderUrl,
} from './orderCalculations';
import { CartItem, Coupon, Order } from '../types';

test('calculateItemUnitPrice computes base, size, crust and toppings correctly', () => {
  const sizes = {
    'Small (8")': 10.0,
    'Regular (10")': 14.5,
    'Large (12")': 19.0,
  };
  const crusts = [
    { name: 'Hand Tossed Pan' as const, price: 0 },
    { name: 'Cheese Stuffed Crust' as const, price: 2.5 },
  ];
  const toppings = [
    { name: 'Extra Mozzarella', price: 1.5 },
    { name: 'Jalapenos', price: 1.0 },
  ];

  // Base test with Regular size, Cheese Stuffed crust, and 2 toppings
  const price = calculateItemUnitPrice(
    12.0,
    sizes,
    'Regular (10")',
    crusts,
    'Cheese Stuffed Crust',
    toppings
  );
  // Expected: 14.50 (Regular size) + 2.50 (crust) + 1.50 + 1.00 (toppings) = 19.50
  assert.equal(price, 19.5);
});

test('calculateCartTotals computes subtotal, coupon discount, delivery fee and tax', () => {
  const dummyItems: CartItem[] = [
    {
      cartItemId: '1',
      menuItemId: 'p-1',
      name: 'NYC Pepperoni',
      category: 'Pepperoni Pizza',
      image: '',
      unitPrice: 15.0,
      quantity: 2,
      totalPrice: 30.0,
      selectedToppings: [],
    },
  ];

  // Under $35 threshold -> delivery fee applies ($3.99)
  const totalsNoDiscount = calculateCartTotals(dummyItems, null, 'delivery');
  assert.equal(totalsNoDiscount.subtotal, 30.0);
  assert.equal(totalsNoDiscount.deliveryFee, 3.99);
  assert.equal(totalsNoDiscount.discount, 0);
  assert.equal(totalsNoDiscount.tax, 2.4); // 8% of 30.00
  assert.equal(totalsNoDiscount.total, 36.39); // 30 + 2.4 + 3.99

  // Over $35 threshold -> free delivery
  const largeItems: CartItem[] = [
    {
      cartItemId: '1',
      menuItemId: 'p-1',
      name: 'NYC Pepperoni',
      category: 'Pepperoni Pizza',
      image: '',
      unitPrice: 20.0,
      quantity: 2,
      totalPrice: 40.0,
      selectedToppings: [],
    },
  ];
  const coupon20: Coupon = {
    code: 'GOPIZZA20',
    discountType: 'percent',
    value: 20,
    minOrder: 25,
    description: '20% off',
    isActive: true,
    usageCount: 0,
  };

  const totalsWithCoupon = calculateCartTotals(largeItems, coupon20, 'delivery');
  assert.equal(totalsWithCoupon.subtotal, 40.0);
  assert.equal(totalsWithCoupon.discount, 8.0); // 20% of 40
  assert.equal(totalsWithCoupon.deliveryFee, 0.0); // 40 >= 35
  assert.equal(totalsWithCoupon.tax, 2.56); // 8% of 32
  assert.equal(totalsWithCoupon.total, 34.56); // 32 + 2.56
});

test('validateCoupon checks validity and minimum spending', () => {
  const coupons: Coupon[] = [
    {
      code: 'WELCOME10',
      discountType: 'fixed',
      value: 10,
      minOrder: 30,
      description: '$10 off $30+',
      isActive: true,
      usageCount: 0,
    },
    {
      code: 'EXPIRED50',
      discountType: 'percent',
      value: 50,
      minOrder: 10,
      description: '50% off',
      isActive: false,
      usageCount: 5,
    },
  ];

  const invalidCode = validateCoupon('BADCODE', 50, coupons);
  assert.equal(invalidCode.valid, false);

  const belowMin = validateCoupon('WELCOME10', 25, coupons);
  assert.equal(belowMin.valid, false);
  assert.match(belowMin.error || '', /Minimum order of \$30.00/);

  const expired = validateCoupon('EXPIRED50', 50, coupons);
  assert.equal(expired.valid, false);

  const valid = validateCoupon('welcome10', 35, coupons); // case-insensitive
  assert.equal(valid.valid, true);
  assert.equal(valid.coupon?.code, 'WELCOME10');
});

test('estimatePreparationTime produces reasonable ranges', () => {
  assert.equal(estimatePreparationTime([]), 20);
  const items: CartItem[] = [
    {
      cartItemId: '1',
      menuItemId: 'p-1',
      name: 'Pizza',
      category: 'Classic Pizza',
      image: '',
      unitPrice: 15,
      quantity: 3,
      totalPrice: 45,
      selectedToppings: [],
    },
  ];
  const time = estimatePreparationTime(items);
  assert.ok(time >= 20 && time <= 45);
});

test('generateWhatsAppOrderUrl builds valid wa.me link with encoded details', () => {
  const dummyOrder: Order = {
    id: 'GP-101',
    orderNumber: 101,
    customerName: 'Marcus Bell',
    customerPhone: '+1-555-0199',
    orderType: 'delivery',
    deliveryAddress: '742 Evergreen Terrace',
    items: [
      {
        cartItemId: 'c-1',
        menuItemId: 'm-1',
        name: 'Super Supreme',
        category: 'Supreme Pizza',
        image: '',
        unitPrice: 18.99,
        quantity: 1,
        totalPrice: 18.99,
        selectedToppings: [{ name: 'Extra Cheese', price: 1.5 }],
      },
    ],
    subtotal: 18.99,
    discount: 0,
    deliveryFee: 3.99,
    tax: 1.52,
    total: 24.5,
    status: 'new',
    paymentMethod: 'cash',
    createdAt: new Date().toISOString(),
    estimatedTimeMinutes: 25,
  };

  const url = generateWhatsAppOrderUrl(dummyOrder, '18004674992');
  assert.ok(url.startsWith('https://wa.me/18004674992?text='));
  assert.ok(url.includes('Marcus%20Bell') || url.includes('Marcus'));
  assert.ok(url.includes('Super%20Supreme') || url.includes('Supreme'));
});
