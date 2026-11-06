import React from 'react';
import { Award, Flame, Wheat, Heart, Star, Quote } from 'lucide-react';

export const AboutSection: React.FC = () => {
  const testimonials = [
    {
      name: 'Michael Chang',
      role: 'Local Food Critic',
      rating: 5,
      comment: "GO PIZZA SHOP sets the benchmark for crust texture in the city. The cupping pepperoni pizza with their garlic butter crown crust is honestly life-changing.",
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    },
    {
      name: 'Sarah Jenkins',
      role: 'Family of 4',
      rating: 5,
      comment: "The Weekend Party Box fed all our guests with leftovers to spare. Piping hot delivery in 24 minutes flat. Our official Friday night tradition!",
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    },
    {
      name: 'Chef Tariq Al-Mansoor',
      role: 'Artisan Baker',
      rating: 5,
      comment: "You can taste the 48-hour cold dough fermentation immediately. Crisp bottom, airy crumb, and superior whole-milk mozzarella melt.",
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    },
  ];

  return (
    <section id="about" className="py-16 sm:py-24 bg-stone-950 relative scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Visual Showcase (5 cols) */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden border-2 border-stone-800 shadow-2xl aspect-[4/5] bg-stone-900 group">
              <img
                src="https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?auto=format&fit=crop&w=800&q=80"
                alt="GO PIZZA Stone Oven Baking"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent" />
              
              <div className="absolute bottom-6 left-6 right-6 p-5 rounded-2xl bg-stone-900/90 border border-stone-800 backdrop-blur-md">
                <span className="text-amber-400 font-mono text-xs font-bold uppercase tracking-wider block">
                  CRAFTED WITH OBSESSION
                </span>
                <h4 className="text-lg font-black text-white mt-1">
                  100% Scratch Kitchen & 500° Stone Baking
                </h4>
              </div>
            </div>
          </div>

          {/* Text Story (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 bg-stone-900 border border-stone-800 rounded-full px-3.5 py-1 text-xs font-black uppercase tracking-wider text-amber-400">
              <Award className="w-3.5 h-3.5" />
              <span>The GO PIZZA Standard</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              WE DON'T JUST BAKE PIZZA. <br />
              <span className="text-amber-400">WE PERFECT EVERY BITE.</span>
            </h2>

            <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
              GO PIZZA SHOP was founded with a singular, uncompromising mission: to bridge the gap between fast delivery convenience and authentic artisan pizzeria quality.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
              <div className="bg-stone-900/70 border border-stone-800/80 rounded-2xl p-4.5 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Wheat className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-white">48h Cold Fermentation</h3>
                <p className="text-xs text-stone-400 leading-relaxed">
                  Our dough rises slowly for 2 full days, resulting in easy digestion, complex sourdough notes, and an airy crisp crust.
                </p>
              </div>

              <div className="bg-stone-900/70 border border-stone-800/80 rounded-2xl p-4.5 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-red-600/10 border border-red-500/20 text-red-400 flex items-center justify-center">
                  <Flame className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-white">Authentic San Marzano</h3>
                <p className="text-xs text-stone-400 leading-relaxed">
                  Plum tomatoes grown in volcanic soil, crushed with fresh sweet basil, Greek oregano, and cold-pressed extra virgin olive oil.
                </p>
              </div>

              <div className="bg-stone-900/70 border border-stone-800/80 rounded-2xl p-4.5 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 flex items-center justify-center">
                  <Heart className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-white">100% Real Wisconsin Cheese</h3>
                <p className="text-xs text-stone-400 leading-relaxed">
                  Zero imitation shreds. Only whole-milk mozzarella and aged cheddar blended for that famous elastic golden cheese pull.
                </p>
              </div>

              <div className="bg-stone-900/70 border border-stone-800/80 rounded-2xl p-4.5 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Award className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-white">Hot Box Thermal Sealing</h3>
                <p className="text-xs text-stone-400 leading-relaxed">
                  Custom-insulated delivery carriers keep your food at peak 160°F oven temperature until it touches your dining table.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="space-y-6 pt-8 border-t border-stone-800/80">
          <div className="text-center space-y-1.5">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Real Customer Stories
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              Loved by 15,000+ Pizza Connoisseurs
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map(t => (
              <div
                key={t.name}
                className="bg-stone-900/70 border border-stone-800 rounded-3xl p-6 flex flex-col justify-between space-y-4 shadow-xl"
              >
                <div className="space-y-3">
                  <div className="flex text-amber-400 gap-1">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-stone-300 italic leading-relaxed">
                    "{t.comment}"
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-3 border-t border-stone-800/60">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-10 h-10 rounded-full object-cover border border-amber-500/40"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-white">{t.name}</h4>
                    <span className="text-[11px] text-stone-400">{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
