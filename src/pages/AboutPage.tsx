import React from 'react';
import { Target, Users, Shield, Github, Twitter, MessageSquare, Globe, Rocket } from 'lucide-react';
import { motion } from 'motion/react';

export const AboutPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-20 flex flex-col gap-32 min-h-screen">
      {/* Hero */}
      <section className="text-center">
        <span className="text-neon-red text-[11px] font-bold tracking-[0.3em] uppercase block mb-3">Organization Pulse</span>
        <h1 className="bebas text-6xl md:text-8xl text-white tracking-widest leading-[0.9]">Beyond The <span className="text-gold">Standard</span></h1>
        <p className="text-white/40 text-sm uppercase tracking-[0.3em] font-bold mt-8 max-w-2xl mx-auto leading-loose italic">
          "Rise, Dominate, Conquer." – The BTS Creed since inception.
        </p>
      </section>

      {/* Corporate Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Ops Logged', val: '240+' },
          { label: 'Roster Mass', val: '1,200+' },
          { label: 'Asset Cycle', val: '₹15L+' },
          { label: 'Signal Command', val: '10K+' },
        ].map((stat, i) => (
          <div key={i} className="bg-dark-surface-2 p-12 border border-white/5 text-center relative overflow-hidden group hover:border-gold/30 transition-all">
            <span className="orbitron block text-4xl font-black text-white mb-2 group-hover:text-gold transition-colors">{stat.val}</span>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">{stat.label}</span>
            <div className="absolute top-0 left-0 w-1 h-0 bg-gold group-hover:h-full transition-all"></div>
          </div>
        ))}
      </div>

      {/* Identity Pillars */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <Pillar 
          icon={Target} 
          title="Tactical Edge" 
          desc="Standardizing professional mobile combat through high-density drills and verified competitive simulations." 
        />
        <Pillar 
          icon={Shield} 
          title="Protocol Zero" 
          desc="Zero-tolerance anti-cheat framework ensuring absolute meritocracy across every tournament vertical." 
        />
        <Pillar 
          icon={Rocket} 
          title="Roster Scaling" 
          desc="Empowering verified clans with brand growth protocols and high-performance management infrastructures." 
        />
      </section>

      {/* Signal Command */}
      <section className="bg-gold/5 border border-gold/15 p-12 md:p-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold opacity-[0.03] blur-[150px] pointer-events-none"></div>
        <div className="flex flex-col lg:flex-row justify-between items-center gap-16">
          <div className="max-w-xl">
            <h2 className="bebas text-4xl md:text-5xl text-white mb-6 tracking-widest uppercase">Signal <span className="text-gold">Incoming</span></h2>
            <p className="text-[11px] font-bold text-white/40 uppercase tracking-[0.25em] leading-loose">Access intelligence reports, live deployment status, and official clan coordination protocols. The Discord hub is our primary tactical node.</p>
          </div>
          <div className="flex gap-6">
            <SocialIcon icon={MessageSquare} label="Discord" />
            <SocialIcon icon={Twitter} label="X / Twitter" />
            <SocialIcon icon={Globe} label="Portal" />
          </div>
        </div>
      </section>
    </div>
  );
};

const Pillar = ({ icon: Icon, title, desc }: any) => (
  <div className="bg-dark-surface-2 p-12 border border-white/5 cyber-clip-sm group hover:border-gold/20 transition-all">
    <div className="mb-8 p-4 bg-gold/5 w-fit group-hover:bg-gold/10 transition-colors">
      <Icon className="text-gold" size={28} />
    </div>
    <h3 className="bebas text-2xl text-white mb-6 uppercase tracking-widest group-hover:text-gold transition-colors">{title}</h3>
    <p className="text-[11px] font-bold uppercase tracking-widest text-white/30 leading-loose">{desc}</p>
  </div>
);

const SocialIcon = ({ icon: Icon, label }: any) => (
  <div className="flex flex-col items-center gap-4 group cursor-pointer">
    <div className="w-16 h-16 bg-black border border-gold/20 flex items-center justify-center group-hover:border-gold transition-all relative">
      <Icon className="text-gold group-hover:scale-110 transition-transform" size={24} />
      <div className="absolute inset-0 bg-gold/5 scale-0 group-hover:scale-100 transition-transform"></div>
    </div>
    <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white/20 group-hover:text-gold transition-colors">{label}</span>
  </div>
);
