import React from 'react';
import { Trophy, Calendar, Users, Gamepad2 } from 'lucide-react';
import { Tournament } from '../lib/tournamentService';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

interface TournamentCardProps {
  tournament: Tournament;
}

export const TournamentCard: React.FC<TournamentCardProps> = ({ tournament }) => {
  const pct = 56; // Mock percentage for now, ideally calculated from slots
  
  return (
    <div className="bg-dark-surface-2 border border-gold/15 overflow-hidden transition-all hover:border-gold-dim hover:translate-y-[-3px] flex flex-col group">
      <div className="bg-gradient-to-br from-gold/10 to-neon-red/10 p-6 border-b border-gold/10 relative">
        <div className="flex justify-between items-start mb-4">
          <span className="text-[10px] font-bold tracking-[0.2em] text-gold uppercase underline decoration-gold/30 underline-offset-4">
            {tournament.game.toUpperCase()}
          </span>
          <span className={`text-[9px] font-black uppercase tracking-[0.15em] px-3 py-1 cyber-clip-sm ${tournament.status === 'open' ? 'bg-green-500/20 text-green-400 border border-green-500/40' : 'bg-neon-red/20 text-neon-red border border-neon-red/40'}`}>
            {tournament.status?.toUpperCase() || 'OPEN'}
          </span>
        </div>
        <h3 className="bebas text-2xl text-white tracking-widest">{tournament.title}</h3>
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <span className="text-[10px] text-white/30 uppercase tracking-[0.15em] block mb-1">Prize Pool</span>
            <span className="orbitron text-gold font-bold text-base leading-none block">{tournament.prizePool}</span>
          </div>
          <div>
            <span className="text-[10px] text-white/30 uppercase tracking-[0.15em] block mb-1">Entry Fee</span>
            <span className="orbitron text-gold font-bold text-base leading-none block">{tournament.fee}</span>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between text-[11px] font-bold text-white/30 uppercase tracking-widest mb-2">
            <span>Registrations</span>
            <span>{pct}%</span>
          </div>
          <div className="h-1.5 bg-white/5 cyber-clip-sm overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: `${pct}%` }}
              className="h-full bg-gradient-to-r from-gold to-neon-red"
            />
          </div>
        </div>

        <Link 
          to={`/tournaments/${tournament.id}/register`}
          className="mt-auto block w-full bg-gold text-black text-center py-3.5 font-black uppercase text-[11px] tracking-[0.2em] cyber-clip hover:bg-gold-light transition-all"
        >
          Register Now
        </Link>
      </div>
    </div>
  );
};
