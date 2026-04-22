import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User, Trophy, Gamepad2 } from 'lucide-react';

const players = [
  { id:1, ign:'BTS•Ragnar', role:'IGL', kd:'5.4', div:'prime', matches:120, color:'#FFD700' },
  { id:2, ign:'BTS•Shadow', role:'Assaulter', kd:'6.2', div:'prime', matches:115, color:'#FFD700' },
  { id:3, ign:'BTS•Phantom', role:'Sniper', kd:'7.1', div:'prime', matches:108, color:'#FFD700' },
  { id:4, ign:'BTS•Venom', role:'Support', kd:'4.8', div:'prime', matches:98, color:'#FFD700' },
  { id:5, ign:'BTS•Ghost', role:'Assaulter', kd:'5.9', div:'prime', matches:102, color:'#FFD700' },
  { id:6, ign:'BTS•Raven', role:'IGL', kd:'4.5', div:'arise', matches:90, color:'#FF2244' },
  { id:7, ign:'BTS•Blaze', role:'Assaulter', kd:'5.7', div:'arise', matches:88, color:'#FF2244' },
  { id:8, ign:'BTS•Hunter', role:'Sniper', kd:'6.8', div:'arise', matches:85, color:'#FF2244' },
  { id:9, ign:'BTS•Striker', role:'Support', kd:'4.2', div:'arise', matches:82, color:'#FF2244' },
  { id:10, ign:'BTS•Fury', role:'Assaulter', kd:'6.0', div:'arise', matches:79, color:'#FF2244' },
  { id:11, ign:'BTS•Titan', role:'IGL', kd:'4.9', div:'boys', matches:75, color:'#4488FF' },
  { id:12, ign:'BTS•Axe', role:'Assaulter', kd:'5.3', div:'boys', matches:72, color:'#4488FF' },
  { id:13, ign:'BTS•Nova', role:'Sniper', kd:'6.5', div:'boys', matches:70, color:'#4488FF' },
  { id:14, ign:'BTS•Comet', role:'Support', kd:'4.1', div:'boys', matches:68, color:'#4488FF' },
  { id:15, ign:'BTS•Nexus', role:'Assaulter', kd:'5.8', div:'boys', matches:65, color:'#4488FF' },
  { id:16, ign:'BTS•Scout', role:'Assaulter', kd:'7.5', div:'scout', matches:110, color:'#AA44FF' },
  { id:17, ign:'BTS•Hawk', role:'Sniper', kd:'7.8', div:'scout', matches:108, color:'#AA44FF' },
  { id:18, ign:'BTS•Eagle', role:'Assaulter', kd:'7.2', div:'scout', matches:105, color:'#AA44FF' },
  { id:19, ign:'BTS•Lynx', role:'IGL', kd:'5.1', div:'scout', matches:100, color:'#AA44FF' },
  { id:20, ign:'BTS•Wolf', role:'Support', kd:'4.6', div:'scout', matches:95, color:'#AA44FF' },
  { id:21, ign:'BTS•Madara', role:'IGL', kd:'5.5', div:'uchihas', matches:88, color:'#FF8800' },
  { id:22, ign:'BTS•Itachi', role:'Assaulter', kd:'6.3', div:'uchihas', matches:85, color:'#FF8800' },
  { id:23, ign:'BTS•Sasuke', role:'Sniper', kd:'6.9', div:'uchihas', matches:82, color:'#FF8800' },
  { id:24, ign:'BTS•Obito', role:'Support', kd:'4.4', div:'uchihas', matches:80, color:'#FF8800' },
  { id:25, ign:'BTS•Kakashi', role:'Assaulter', kd:'5.6', div:'uchihas', matches:78, color:'#FF8800' },
];

const divInfo: Record<string, any> = {
  arise:   { name:'BTS Arise',    color:'#FF2244', desc:'Elite competitive lineup.' },
  boys:    { name:'BTS Boys',     color:'#4488FF', desc:'Strong coordination & aggressive gameplay.' },
  prime:   { name:'BTS Prime',    color:'#FFD700', desc:'Top ranked tournament squad.' },
  scout:   { name:'BTS ScoutGod', color:'#AA44FF', desc:'Assaulter-heavy domination squad.' },
  uchihas: { name:'BTS Uchihas',  color:'#FF8800', desc:'Strategic late-game control team.' },
};

export const RosterPage = () => {
  const [filter, setFilter] = useState('all');

  const filteredPlayers = filter === 'all' ? players : players.filter(p => p.div === filter);

  const divisions = ['all', ...Object.keys(divInfo)];

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-20 relative">
      <div className="text-center mb-16">
        <span className="text-neon-red text-[11px] font-bold tracking-[0.3em] uppercase block mb-3">The Squad</span>
        <h1 className="bebas text-6xl md:text-7xl text-white tracking-widest">Our <span className="text-gold">Roster</span></h1>
      </div>

      <div className="flex flex-wrap gap-3 justify-center mb-16">
        {divisions.map((div) => (
          <button
            key={div}
            onClick={() => setFilter(div)}
            className={`cyber-clip-sm px-6 py-2 text-[10px] uppercase font-bold tracking-widest transition-all ${
              filter === div 
                ? 'bg-gold text-black' 
                : 'bg-white/5 text-white/40 border border-white/10 hover:border-gold/40'
            }`}
          >
            {div === 'all' ? 'All Divisions' : divInfo[div].name}
          </button>
        ))}
      </div>

      <div className="space-y-20">
        {Object.entries(divInfo).map(([id, info]) => {
          const divPlayers = players.filter(p => p.div === id);
          if (filter !== 'all' && filter !== id) return null;

          return (
            <div key={id} className="division-section">
              <div className="flex items-center gap-6 mb-8 border-b border-gold/10 pb-4">
                <div className="w-1 h-8" style={{ backgroundColor: info.color }}></div>
                <h2 className="bebas text-3xl text-white tracking-widest">{info.name}</h2>
                <div className="ml-auto text-[10px] text-white/30 uppercase font-bold tracking-widest">
                  {divPlayers.length} Members
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {divPlayers.map((player) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    key={player.id}
                    className="bg-dark-surface-2 p-6 border border-white/5 text-center group relative overflow-hidden transition-all hover:border-gold/40 hover:translate-y-[-4px]"
                  >
                    <div 
                      className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center orbitron text-xl font-black text-black border-2 border-gold/30"
                      style={{ background: `linear-gradient(135deg, ${player.color}, #FF2244)` }}
                    >
                      {player.ign.split('•')[1]?.charAt(0) || 'P'}
                    </div>
                    <h3 className="orbitron text-[11px] font-black text-white uppercase mb-1">{player.ign}</h3>
                    <p className="text-[9px] text-gold uppercase tracking-[0.2em] font-bold mb-4">{player.role}</p>
                    
                    <div className="flex justify-center gap-6 border-t border-white/5 pt-4">
                       <div className="text-center">
                         <span className="orbitron block text-gold text-sm font-bold">{player.kd}</span>
                         <span className="text-[7px] text-white/30 uppercase font-black">K/D</span>
                       </div>
                       <div className="text-center">
                         <span className="orbitron block text-gold text-sm font-bold">{player.matches}</span>
                         <span className="text-[7px] text-white/30 uppercase font-black">Games</span>
                       </div>
                    </div>
                    
                    <div className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent transition-all duration-500 group-hover:left-[100%] pointer-events-none"></div>
                  </motion.div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
