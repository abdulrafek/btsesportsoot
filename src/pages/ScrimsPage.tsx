import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { scrimService, Scrim } from '../lib/scrimService';
import { Gamepad2, Users, Clock, Lock, Unlock } from 'lucide-react';
import { motion } from 'motion/react';

export const ScrimsPage = () => {
  const [scrims, setScrims] = useState<Scrim[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    scrimService.getAllScrims().then(data => {
      if (data) setScrims(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 gap-8">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-[0.4em] text-gold mb-2 block">Daily Operations</span>
          <h1 className="text-6xl md:text-8xl font-black italic uppercase text-white tracking-tighter leading-none">Combat Drills</h1>
        </div>
        <p className="text-white/30 uppercase tracking-[0.3em] text-[10px] font-bold max-w-xs md:text-right">High-intensity practice sessions with coordinated tactical responses.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {loading ? (
          [1, 2].map(i => <div key={i} className="h-40 border border-gold/10 bg-bg-dark animate-pulse"></div>)
        ) : scrims.length > 0 ? (
          scrims.map((scrim) => (
            <motion.div 
              initial={{ x: -10, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              key={scrim.id} 
              className="border border-gold/10 bg-bg-dark group hover:bg-gold/5 transition-colors p-10 flex flex-col md:flex-row gap-12 items-center"
            >
              <div className="w-24 h-24 border border-gold/20 flex items-center justify-center font-black text-4xl italic text-gold/40 group-hover:text-gold transition-colors">
                {scrim.game.charAt(0)}
              </div>

              <div className="flex-grow">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gold">{scrim.game}</span>
                  <div className="w-8 h-[1px] bg-gold/20"></div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">{scrim.time} IST</span>
                </div>
                
                <h3 className="text-3xl font-black uppercase tracking-tighter text-white mb-2 italic">{scrim.title}</h3>
                
                <div className="flex items-center gap-8 text-[11px] font-bold uppercase tracking-widest text-white/30">
                  <div className="flex items-center gap-3">
                    <Users size={14} className="text-gold/40" />
                    <span>Deployment: {scrim.slotsFilled}/{scrim.slotsTotal}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock size={14} className="text-gold/40" />
                    <span>Synchronize: {scrim.time}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4 w-full md:w-auto">
                <Link 
                  to={scrim.status === 'open' && scrim.slotsFilled < scrim.slotsTotal ? `/scrims/${scrim.id}/register` : '#'}
                  className={`px-12 py-4 bg-gold text-black font-black uppercase tracking-[0.3em] text-[10px] text-center hover:bg-white transition-all ${
                    (scrim.status === 'closed' || scrim.slotsFilled >= scrim.slotsTotal) ? 'opacity-20 grayscale pointer-events-none' : ''
                  }`}
                >
                  {scrim.status === 'open' ? 'Initiate Entry' : 'Locked'}
                </Link>
                <div className="flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-white/20">
                  {scrim.status === 'open' ? <Unlock size={12} /> : <Lock size={12} />}
                  Status: {scrim.status}
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="py-40 text-center border border-gold/10 bg-bg-dark">
             <p className="text-white/20 uppercase tracking-[0.5em] text-[10px] font-black italic">No operational drills scheduled for today.</p>
          </div>
        )}
      </div>
    </div>
  );
};
