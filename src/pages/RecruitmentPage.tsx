import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Target, Users, Shield, Smartphone, Zap, Award, Share2 } from 'lucide-react';

export const RecruitmentPage = () => {
  const [selectedGame, setSelectedGame] = useState('BGMI');

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-20">
      <div className="text-center mb-16">
        <span className="text-neon-red text-[11px] font-bold tracking-[0.3em] uppercase block mb-3">Join The Pack</span>
        <h1 className="bebas text-6xl md:text-7xl text-white tracking-widest">Apply to <span className="text-gold">BTS eSports</span></h1>
        <p className="text-white/40 text-sm uppercase tracking-widest mt-4">We are looking for disciplined, skilled players across all games.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20 px-12 md:px-32">
        {['BGMI', 'Free Fire', 'Valorant', 'COD: Mobile'].map((game) => (
          <button
            key={game}
            onClick={() => setSelectedGame(game)}
            className={`cyber-clip-sm p-4 text-[11px] font-black uppercase tracking-widest transition-all border ${
              selectedGame === game 
                ? 'bg-gold text-black border-gold' 
                : 'bg-dark-surface-2 text-white/40 border-white/5 hover:border-gold/40'
            }`}
          >
            {game}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <div className="bg-dark-surface-2 border border-gold/15 p-8 md:p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold opacity-[0.02] blur-[100px] pointer-events-none"></div>
            
            <h2 className="bebas text-3xl text-gold mb-12 tracking-widest">Application Form</h2>
            
            <form className="space-y-12" onSubmit={(e) => { e.preventDefault(); alert('Application Submitted! 🔥'); }}>
              <section>
                <div className="flex items-center gap-4 mb-6 border-b border-neon-red/20 pb-2">
                  <span className="text-[10px] font-black text-neon-red uppercase tracking-[0.2em]">01. Basic Intelligence</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormGroup label="Full Name" placeholder="Real Name" />
                  <FormGroup label="In-Game Name" placeholder="Your IGN" />
                  <FormGroup label="Game UID" placeholder="e.g. 567890123" />
                  <FormGroup label="Age" type="number" placeholder="16+" />
                  <FormGroup label="WhatsApp Number" type="tel" placeholder="+91 XXXXXXXXXX" />
                  <FormGroup label="Location" placeholder="State, India" />
                </div>
              </section>

              <section>
                <div className="flex items-center gap-4 mb-6 border-b border-neon-red/20 pb-2">
                  <span className="text-[10px] font-black text-neon-red uppercase tracking-[0.2em]">02. Combat Profile</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Select Game</label>
                    <select className="w-full bg-white/5 border border-gold/15 text-white px-4 py-3 outline-none focus:border-gold hover:bg-gold/3 focus:bg-gold/5 transition-all text-sm orbitron uppercase">
                      <option>BGMI</option>
                      <option>Free Fire</option>
                      <option>Valorant</option>
                      <option>COD: Mobile</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Role</label>
                    <select className="w-full bg-white/5 border border-gold/15 text-white px-4 py-3 outline-none focus:border-gold transition-all text-sm uppercase">
                      <option>IGL (In-Game Leader)</option>
                      <option>Assaulter</option>
                      <option>Sniper</option>
                      <option>Support</option>
                      <option>Entry Fragger</option>
                    </select>
                  </div>
                  <FormGroup label="K/D Ratio" type="number" step="0.1" placeholder="e.g. 4.2" />
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Device FPS</label>
                    <select className="w-full bg-white/5 border border-gold/15 text-white px-4 py-3 outline-none focus:border-gold transition-all text-sm uppercase">
                      <option>60 FPS</option>
                      <option>90 FPS</option>
                      <option>120 FPS</option>
                    </select>
                  </div>
                </div>
                <div className="mt-6 space-y-2">
                  <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Tournament Experience</label>
                  <textarea className="w-full bg-white/5 border border-gold/15 text-white px-4 py-3 outline-none focus:border-gold transition-all text-sm min-h-[100px] resize-none" placeholder="Describe your tournament history, scrims played..."></textarea>
                </div>
              </section>

              <button className="w-full bg-gold text-black py-5 font-black uppercase text-xs tracking-[0.3em] cyber-clip hover:bg-white transition-all">
                Submit Application →
              </button>
            </form>
          </div>
        </div>

        <div className="space-y-6">
          <InfoBox title="Mandatory Protocols">
            <ul className="text-white/40 text-[11px] font-bold uppercase tracking-widest space-y-4">
              <li className="flex gap-3"><Zap className="text-gold flex-shrink-0" size={14} /> 1 Year Competitive Exp</li>
              <li className="flex gap-3"><Zap className="text-gold flex-shrink-0" size={14} /> Active 7PM – 11PM Daily</li>
              <li className="flex gap-3"><Zap className="text-gold flex-shrink-0" size={14} /> Scrim Logs Required</li>
              <li className="flex gap-3"><Zap className="text-gold flex-shrink-0" size={14} /> Minimum 60 FPS Device</li>
              <li className="flex gap-3"><Zap className="text-gold flex-shrink-0" size={14} /> Zero Toxicity Protocol</li>
            </ul>
          </InfoBox>

          <InfoBox title="Asset Provisions">
            <ul className="text-white/40 text-[11px] font-bold uppercase tracking-widest space-y-4">
              <li className="flex gap-3"><Award className="text-neon-red flex-shrink-0" size={14} /> Paid Tournament Entries</li>
              <li className="flex gap-3"><Award className="text-neon-red flex-shrink-0" size={14} /> Performance Incentives</li>
              <li className="flex gap-3"><Award className="text-neon-red flex-shrink-0" size={14} /> Pro Management Hub</li>
              <li className="flex gap-3"><Award className="text-neon-red flex-shrink-0" size={14} /> Social Outreach & PR</li>
              <li className="flex gap-3"><Award className="text-neon-red flex-shrink-0" size={14} /> Official Brand Apparel</li>
            </ul>
          </InfoBox>

          <div className="bg-gradient-to-br from-gold/10 to-neon-red/10 border border-white/5 p-8 relative overflow-hidden">
            <h3 className="bebas text-xl text-neon-red mb-6 tracking-widest uppercase">Trial Protocol</h3>
            <div className="space-y-4 text-[10px] font-bold uppercase tracking-wider text-white/50 leading-loose">
              <div className="flex gap-4">
                <span className="text-gold">01</span>
                <span>Intelligence Screening</span>
              </div>
              <div className="flex gap-4">
                <span className="text-gold">02</span>
                <span>Administrative Verification (48h)</span>
              </div>
              <div className="flex gap-4">
                <span className="text-gold">03</span>
                <span>Tier 1 Trial Deployment</span>
              </div>
              <div className="flex gap-4">
                <span className="text-gold">04</span>
                <span>Post-Match Evaluation</span>
              </div>
              <div className="flex gap-4">
                <span className="text-gold">05</span>
                <span>Roster Assignment</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const FormGroup = ({ label, placeholder, type = "text", step }: any) => (
  <div className="space-y-2">
    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{label}</label>
    <input 
      type={type}
      step={step}
      placeholder={placeholder}
      className="w-full bg-white/5 border border-gold/15 text-white px-4 py-3 outline-none focus:border-gold hover:bg-gold/3 focus:bg-gold/5 transition-all text-sm placeholder:text-white/10"
    />
  </div>
);

const InfoBox = ({ title, children }: any) => (
  <div className="bg-dark-surface-2 border border-white/5 p-8">
     <h3 className="bebas text-xl text-gold mb-6 tracking-widest uppercase">{title}</h3>
     {children}
  </div>
);
