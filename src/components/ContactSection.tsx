import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, MessageCircle, Send, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'What is your average delivery time?',
      a: 'Our target is 30 minutes or under from order placement. All pizzas are baked fresh in 500° ovens and dispatched in heated thermal carriers.',
    },
    {
      q: 'Do you offer customized pizza toppings and crust options?',
      a: 'Yes! Every pizza can be customized with 4 crust options (including Cheese Stuffed and Garlic Crown Crust), plus 11+ gourmet toppings.',
    },
    {
      q: 'How does WhatsApp ordering work?',
      a: 'When you choose "Order via WhatsApp", our system pre-formats your exact order details, selected toppings, address, and pricing into a ready-to-send WhatsApp message.',
    },
    {
      q: 'Do you cater for office parties, birthdays, or large gatherings?',
      a: 'Absolutely! Our Weekend Giant Party Boxes and Family Combos are built for groups of 10 to 100+. Call our hotline for bulk corporate pricing.',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !message) return;
    setFormSubmitted(true);
    setTimeout(() => {
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    }, 1500);
  };

  return (
    <section id="contact" className="py-16 sm:py-24 bg-stone-900/60 relative border-t border-stone-800/80 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 bg-stone-900 border border-stone-800 rounded-full px-3.5 py-1 text-xs font-black uppercase tracking-wider text-amber-400">
            <Phone className="w-3.5 h-3.5" />
            <span>Customer Care & Locations</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            GET IN TOUCH WITH GO PIZZA
          </h2>
          <p className="text-sm sm:text-base text-stone-400">
            Have a catering question, delivery feedback, or wanting to book a large celebration? Our team is at your service 7 days a week.
          </p>
        </div>

        {/* Contact Info Cards & Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Cards (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-stone-950 border border-stone-800 rounded-3xl p-6 space-y-4 shadow-xl">
              <h3 className="text-base font-extrabold text-white">Flagship Restaurant Location</h3>
              
              <div className="space-y-3 text-xs text-stone-300">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-bold">GO PIZZA Downtown Kitchen</strong>
                    <span className="text-stone-400">742 Gourmet Ave, Food Hub District, NY 10001</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-2 border-t border-stone-900">
                  <Clock className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-bold">Operating & Delivery Hours</strong>
                    <span className="text-stone-400">Monday – Sunday: 11:00 AM – 02:00 AM (Late Night)</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-2 border-t border-stone-900">
                  <Phone className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-bold">Hotlines & Direct Line</strong>
                    <span className="text-stone-400">+1 (800) GO-PIZZA • (800) 467-4992</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-2 border-t border-stone-900">
                  <Mail className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-bold">Email Support</strong>
                    <span className="text-stone-400">orders@gopizzashop.com</span>
                  </div>
                </div>
              </div>

              {/* WhatsApp Call to Action */}
              <div className="pt-2">
                <a
                  href="https://wa.me/18004674992?text=Hi%20GO%20PIZZA%20SHOP!%20I%20would%20like%20to%20inquire%20about%20ordering."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs py-3 px-4 rounded-2xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-emerald-950/40"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat on WhatsApp Directly</span>
                </a>
              </div>
            </div>

            {/* FAQs Accordion */}
            <div className="bg-stone-950 border border-stone-800 rounded-3xl p-6 space-y-3 shadow-xl">
              <h3 className="text-sm font-extrabold text-white mb-2">Frequently Asked Questions</h3>
              <div className="space-y-2">
                {faqs.map((faq, idx) => {
                  const isOpen = activeFaq === idx;
                  return (
                    <div key={faq.q} className="border border-stone-800/80 rounded-2xl overflow-hidden bg-stone-900/50">
                      <button
                        type="button"
                        onClick={() => setActiveFaq(isOpen ? null : idx)}
                        className="w-full p-3.5 text-left text-xs font-bold text-stone-200 flex items-center justify-between gap-2"
                      >
                        <span>{faq.q}</span>
                        {isOpen ? <ChevronUp className="w-4 h-4 text-amber-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-stone-500 shrink-0" />}
                      </button>
                      {isOpen && (
                        <div className="p-3.5 pt-0 text-xs text-stone-400 leading-relaxed border-t border-stone-800/50">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Form (7 cols) */}
          <div className="lg:col-span-7 bg-stone-950 border border-stone-800 rounded-3xl p-6 sm:p-8 shadow-xl">
            <h3 className="text-xl font-extrabold text-white mb-1">Send a Message or Catering Request</h3>
            <p className="text-xs text-stone-400 mb-6">
              Fill out your details and our restaurant management team will respond in under 15 minutes.
            </p>

            {formSubmitted ? (
              <div className="p-8 text-center bg-emerald-950/30 border border-emerald-500/30 rounded-2xl space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h4 className="text-base font-bold text-white">Thank You for Reaching Out!</h4>
                <p className="text-xs text-stone-300">
                  Your message has been dispatched to our restaurant manager. We'll be in touch shortly.
                </p>
                <button
                  type="button"
                  onClick={() => setFormSubmitted(false)}
                  className="bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold py-2 px-4 rounded-xl"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-stone-300 font-semibold block mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. David Miller"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2.5 text-white placeholder-stone-600 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="text-stone-300 font-semibold block mb-1">Phone Number</label>
                    <input
                      type="tel"
                      placeholder="e.g. +1 (555) 019-4822"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2.5 text-white placeholder-stone-600 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-stone-300 font-semibold block mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2.5 text-white placeholder-stone-600 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-stone-300 font-semibold block mb-1">Your Message or Catering Details *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell us about your event, feedback, or custom pizza requests..."
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2.5 text-white placeholder-stone-600 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-black py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-red-950/40 transition-transform active:scale-[0.99]"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message to GO PIZZA Team</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
