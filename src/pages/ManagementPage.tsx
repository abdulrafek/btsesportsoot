import React from 'react';
import { motion } from 'motion/react';
import { Trophy, Users, Briefcase, Smartphone, Share2, Globe, Rocket, Download, Mail } from 'lucide-react';

export const ManagementPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-20">
      <div className="text-center mb-16">
        <span className="text-neon-red text-[11px] font-bold tracking-[0.3em] uppercase block mb-3">Professional Services</span>
        <h1 className="bebas text-6xl md:text-7xl text-white tracking-widest">eSports <span className="text-gold">Management</span></h1>
        <p className="text-white/40 text-sm uppercase tracking-widest mt-4">Full-service management for teams, brands, and players in the South Asian eSports ecosystem.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-32">
        {[
          { icon: Trophy, title: 'Tournament Logic', desc: 'Sourcing, hosting, and officiating professional BGMI / Multi-game circuits with broadcast support.' },
          { icon: Users, title: 'Roster Dynamics', desc: 'Roster management, scrim scheduling, performance analytics, and player wellness programs.' },
          { icon: Briefcase, title: 'Corporate Outreach', desc: 'Direct bridge between elite gaming talent and global brand sponsorship pipelines.' },
          { icon: Smartphone, title: 'Identity Growth', desc: 'Content strategy, YouTube development, and cross-platform player branding.' },
          { icon: Share2, title: 'Signal Control', desc: 'Strategic social media management and tactical PR for digital dominance.' },
          { icon: Globe, title: 'Hub Logistics', desc: 'Daily lobby administration, opponent matching, and data-driven debriefing.' }
        ].map((service, i) => (
          <div key={i} className="bg-dark-surface-2 p-10 border border-white/5 relative group hover:border-gold/30 transition-all">
            <service.icon className="text-gold mb-8 group-hover:scale-110 transition-transform" size={40} />
            <h3 className="bebas text-2xl text-gold mb-4 tracking-widest uppercase">{service.title}</h3>
            <p className="text-[11px] font-bold text-white/30 uppercase tracking-widest leading-loose">{service.desc}</p>
            <div className="absolute top-0 right-0 w-16 h-16 bg-gold opacity-0 group-hover:opacity-[0.03] transition-opacity"></div>
          </div>
        ))}
      </div>

      <div className="bg-dark-surface-2 border border-gold/15 p-8 md:p-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className="bebas text-4xl md:text-5xl text-white mb-6 uppercase tracking-widest">Partner with <span className="text-gold">BTS eSports</span></h2>
          <p className="text-[12px] font-bold text-white/40 uppercase tracking-widest leading-loose mb-10 max-w-md">
            Reach thousands of active professional gamers. Our infrastructure connects your brand to a high-density, highly engaged eSports audience.
          </p>
          
          <div className="flex flex-wrap gap-4 mb-12">
            <button className="btn-primary cyber-clip bg-gold text-black px-8 py-4 font-black uppercase text-[10px] tracking-widest flex items-center gap-3">
              <Download size={14} /> Download Media Kit
            </button>
            <button className="btn-secondary cyber-clip border border-gold text-gold px-8 py-4 font-black uppercase text-[10px] tracking-widest">
              Partner Protocol
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { val: '40+', label: 'Active Roster' },
              { val: '10K+', label: 'Social Density' },
              { val: '30+', label: 'Ops Logged' },
              { val: '5', label: 'Battle Fronts' }
            ].map((stat, i) => (
              <div key={i} className="bg-white/5 border border-white/5 p-4 text-center">
                <span className="orbitron block text-gold text-xl font-black mb-1">{stat.val}</span>
                <span className="text-[7px] text-white/30 uppercase font-black tracking-widest">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-black/40 border border-gold/10 p-8 md:p-12">
          <h3 className="bebas text-2xl text-gold mb-8 tracking-widest uppercase">Sponsor Enquiry</h3>
          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert('Enquiry Sent!'); }}>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Brand / Entity Name</label>
              <input className="w-full bg-white/5 border border-gold/15 text-white px-4 py-3 outline-none focus:border-gold transition-all text-sm" placeholder="Your brand name" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Contact Identity</label>
              <input className="w-full bg-white/5 border border-gold/15 text-white px-4 py-3 outline-none focus:border-gold transition-all text-sm" placeholder="Name" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Communication Link</label>
              <input className="w-full bg-white/5 border border-gold/15 text-white px-4 py-3 outline-none focus:border-gold transition-all text-sm" placeholder="contact@brand.com" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Allocation Range</label>
              <select className="w-full bg-white/5 border border-gold/15 text-white px-4 py-3 outline-none focus:border-gold transition-all text-sm uppercase">
                <option>₹10,000 – ₹50,000</option>
                <option>₹50,000 – ₹2,00,000</option>
                <option>₹2,00,000+</option>
                <option>Strategic Discussion</option>
              </select>
            </div>
            <button className="w-full bg-gold text-black py-4 font-black uppercase text-[10px] tracking-[0.3em] cyber-clip-sm hover:bg-white transition-all">
               Dispatch Enquiry →
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
