import React, { useState } from 'react';
import { Sparkles, Share2, Copy, Check, Download, Palette, Image as ImageIcon, Flame, MessageCircle, ArrowLeft } from 'lucide-react';
import { Logo } from './Logo';

interface MarketingStudioProps {
  onBackToStore: () => void;
}

export const MarketingStudio: React.FC<MarketingStudioProps> = ({ onBackToStore }) => {
  const [format, setFormat] = useState<'square' | 'story' | 'banner'>('square');
  const [headline, setHeadline] = useState('WEEKEND PIZZA PARTY FEAST');
  const [tagline, setTagline] = useState('HOT, MELTY & DELIVERED IN UNDER 30 MINS');
  const [discountBadge, setDiscountBadge] = useState('FLAT 25% OFF');
  const [couponCode, setCouponCode] = useState('GOPIZZA20');
  const [phoneNumber, setPhoneNumber] = useState('+1 (800) GO-PIZZA');
  const [selectedImage, setSelectedImage] = useState('https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80');
  const [copiedBroadcast, setCopiedBroadcast] = useState(false);

  const templates = [
    {
      name: 'Weekend Mega Pizza Party',
      headline: 'WEEKEND PIZZA PARTY FEAST',
      tagline: 'HOT, MELTY & DELIVERED IN UNDER 30 MINS',
      badge: 'FLAT 25% OFF',
      code: 'WEEKEND50',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80',
    },
    {
      name: 'Midnight Pepperoni Craving',
      headline: 'CRAVING CRISP NYC PEPPERONI?',
      tagline: 'ORDER NOW & GET FREE CRUST UPGRADE',
      badge: 'BUY 1 GET 1 AT 50%',
      code: 'SUPERDEAL',
      image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=1200&q=80',
    },
    {
      name: 'Family Mega Feast Special',
      headline: 'THE ULTIMATE FAMILY COMBO',
      tagline: '2 LARGE PIZZAS + WINGS + FRIES + COKE',
      badge: 'SAVE $18 TODAY',
      code: 'GOPIZZA20',
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1200&q=80',
    },
    {
      name: 'Chef Royal Crown Crust',
      headline: 'SIGNATURE 8-POCKET CROWN CRUST',
      tagline: 'STUFFED WITH HERBED GARLIC CREAM CHEESE',
      badge: "CHEF'S SPECIAL",
      code: 'ROYALTY',
      image: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?auto=format&fit=crop&w=1200&q=80',
    },
  ];

  const applyTemplate = (t: typeof templates[0]) => {
    setHeadline(t.headline);
    setTagline(t.tagline);
    setDiscountBadge(t.badge);
    setCouponCode(t.code);
    setSelectedImage(t.image);
  };

  const handleCopyBroadcast = () => {
    const text = `🍕 *SPECIAL DEAL ALERT FROM GO PIZZA SHOP!* 🍕\n\n` +
      `🔥 *${headline}*\n` +
      `✨ ${tagline}\n\n` +
      `💥 Special Promo: *${discountBadge}*\n` +
      `🎟️ Use Coupon Code: *${couponCode}* at checkout\n\n` +
      `🛵 Fast 30-Minute Delivery or Hot Store Pickup\n` +
      `📞 Call or WhatsApp: ${phoneNumber}\n` +
      `Order now for crispy crust and oozing Wisconsin mozzarella!`;

    navigator.clipboard.writeText(text);
    setCopiedBroadcast(true);
    setTimeout(() => setCopiedBroadcast(false), 2500);
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col">
      {/* Top Bar */}
      <header className="bg-stone-900 border-b border-stone-800 px-6 py-4 sticky top-0 z-30 flex items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBackToStore}
            aria-label="Back to restaurant storefront"
            className="w-9 h-9 rounded-xl bg-stone-800 text-stone-300 hover:text-white hover:bg-stone-700 flex items-center justify-center transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg font-black text-white flex items-center gap-2">
              MARKETING & PROMO STUDIO
              <span className="text-[10px] font-bold uppercase bg-amber-400 text-stone-950 px-2 py-0.5 rounded">
                PRO CREATIVE
              </span>
            </h1>
            <p className="text-xs text-stone-400">Create high-impact social flyers, WhatsApp banners & deal campaigns</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleCopyBroadcast}
          className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2.5 px-4 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-emerald-950/40"
        >
          {copiedBroadcast ? <Check className="w-4 h-4 stroke-[3]" /> : <MessageCircle className="w-4 h-4" />}
          <span>{copiedBroadcast ? 'Copied to Clipboard!' : 'Copy WhatsApp Broadcast Text'}</span>
        </button>
      </header>

      {/* Main Studio Grid */}
      <main className="p-6 flex-1 max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Controls Column (5 cols) */}
        <div className="lg:col-span-5 bg-stone-900/70 border border-stone-800 rounded-3xl p-6 space-y-6 shadow-xl">
          {/* Preset Templates */}
          <div>
            <label className="text-xs font-bold text-amber-400 uppercase tracking-wider block mb-2.5">
              1. Choose Campaign Preset
            </label>
            <div className="grid grid-cols-2 gap-2">
              {templates.map(t => (
                <button
                  key={t.name}
                  type="button"
                  onClick={() => applyTemplate(t)}
                  className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all ${
                    headline === t.headline
                      ? 'border-amber-400 bg-amber-400/10 text-white'
                      : 'border-stone-800 bg-stone-950/40 text-stone-400 hover:border-stone-700 hover:text-stone-200'
                  }`}
                >
                  {t.name}
                </button>
              ))}
            </div>
          </div>

          {/* Format Selector */}
          <div>
            <label className="text-xs font-bold text-amber-400 uppercase tracking-wider block mb-2.5">
              2. Canvas Aspect Ratio
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setFormat('square')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                  format === 'square'
                    ? 'border-rose-500 bg-rose-500/10 text-white'
                    : 'border-stone-800 text-stone-400'
                }`}
              >
                1:1 Square (IG/FB)
              </button>
              <button
                type="button"
                onClick={() => setFormat('story')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                  format === 'story'
                    ? 'border-rose-500 bg-rose-500/10 text-white'
                    : 'border-stone-800 text-stone-400'
                }`}
              >
                9:16 Story (Status)
              </button>
              <button
                type="button"
                onClick={() => setFormat('banner')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                  format === 'banner'
                    ? 'border-rose-500 bg-rose-500/10 text-white'
                    : 'border-stone-800 text-stone-400'
                }`}
              >
                16:9 Banner
              </button>
            </div>
          </div>

          {/* Copy Customization */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
              3. Customize Promotional Text
            </label>

            <div>
              <span className="text-[11px] text-stone-400 block mb-1">Headline</span>
              <input
                type="text"
                value={headline}
                onChange={e => setHeadline(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>

            <div>
              <span className="text-[11px] text-stone-400 block mb-1">Tagline / Subheading</span>
              <input
                type="text"
                value={tagline}
                onChange={e => setTagline(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[11px] text-stone-400 block mb-1">Discount Tag</span>
                <input
                  type="text"
                  value={discountBadge}
                  onChange={e => setDiscountBadge(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
              <div>
                <span className="text-[11px] text-stone-400 block mb-1">Coupon Code</span>
                <input
                  type="text"
                  value={couponCode}
                  onChange={e => setCouponCode(e.target.value.toUpperCase())}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-white font-mono uppercase"
                />
              </div>
            </div>

            <div>
              <span className="text-[11px] text-stone-400 block mb-1">Order Hotline</span>
              <input
                type="text"
                value={phoneNumber}
                onChange={e => setPhoneNumber(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
          </div>
        </div>

        {/* Live Canvas Mockup (7 cols) */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="w-full flex justify-between items-center mb-3">
            <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">
              Live High-Fidelity Poster Mockup
            </span>
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> High-Resolution Ready
            </span>
          </div>

          {/* Rendered Mockup Frame */}
          <div
            className={`relative rounded-3xl overflow-hidden shadow-2xl border-4 border-stone-800 select-none bg-stone-950 flex flex-col justify-between transition-all ${
              format === 'square'
                ? 'w-full max-w-lg aspect-square'
                : format === 'story'
                ? 'w-full max-w-sm aspect-[9/16]'
                : 'w-full aspect-[16/9]'
            }`}
          >
            {/* Background Appetizing Image */}
            <img
              src={selectedImage}
              alt="Promotion background"
              className="absolute inset-0 w-full h-full object-cover scale-105"
            />
            {/* Gradients for contrast & typography */}
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-stone-950/70" />
            <div className="absolute inset-0 bg-radial from-transparent via-stone-950/40 to-stone-950/80" />

            {/* Poster Header */}
            <div className="relative z-10 p-6 flex justify-between items-start">
              <Logo size="md" showTagline />
              <div className="bg-red-600 text-white font-black text-xs px-3 py-1.5 rounded-full shadow-lg shadow-red-950 uppercase tracking-wider animate-bounce">
                {discountBadge}
              </div>
            </div>

            {/* Poster Middle Content */}
            <div className="relative z-10 px-6 text-center space-y-2">
              <span className="text-amber-400 font-extrabold text-xs sm:text-sm tracking-widest uppercase block">
                ★ PREMIUM ARTISAN CRUST ★
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight leading-none drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
                {headline}
              </h2>
              <p className="text-xs sm:text-sm font-bold text-stone-300 tracking-wide uppercase max-w-md mx-auto drop-shadow-md">
                {tagline}
              </p>
            </div>

            {/* Poster Footer Banner */}
            <div className="relative z-10 p-5 bg-gradient-to-t from-stone-950 to-stone-950/90 border-t border-stone-800/80 flex items-center justify-between gap-3">
              <div>
                <span className="text-[10px] text-stone-400 uppercase font-bold block">
                  Use Promo Code at Checkout
                </span>
                <span className="font-mono text-base font-black text-amber-400 tracking-wider">
                  {couponCode}
                </span>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-stone-400 uppercase font-bold block">
                  Order Hotline
                </span>
                <span className="text-xs sm:text-sm font-black text-white">
                  {phoneNumber}
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
