import React, { useState, useEffect } from 'react';
import { TournamentCard } from '../components/TournamentCard';
import { tournamentService, Tournament } from '../lib/tournamentService';
import { Trophy, Filter } from 'lucide-react';
import { motion } from 'motion/react';

export const TournamentsPage = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'All' | 'BGMI' | 'Free Fire' | 'COD'>('All');

  useEffect(() => {
    const fetchTournaments = async () => {
      const data = await tournamentService.getAllTournaments();
      if (data) setTournaments(data);
      setLoading(false);
    };
    fetchTournaments();
  }, []);

  const filteredTournaments = filter === 'All' 
    ? tournaments 
    : tournaments.filter(t => t.game === filter);

   return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-20 min-h-screen">
      <div className="text-center mb-20">
        <span className="text-neon-red text-[11px] font-bold tracking-[0.3em] uppercase block mb-3">Compete</span>
        <h1 className="bebas text-6xl md:text-7xl text-white tracking-widest">Active <span className="text-gold">Tournaments</span></h1>
        <p className="text-white/40 text-sm uppercase tracking-widest mt-4">Register now to compete. All matches are held on official servers.</p>
      </div>

      <div className="flex flex-wrap gap-3 justify-center mb-16">
        {['All', 'BGMI', 'Free Fire', 'COD'].map((btn) => (
          <button
            key={btn}
            onClick={() => setFilter(btn as any)}
            className={`cyber-clip-sm px-8 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all ${
              filter === btn 
                ? 'bg-gold text-black' 
                : 'bg-dark-surface-2 text-white/40 border border-white/5 hover:border-gold/40'
            }`}
          >
            {btn === 'All' ? 'All Games' : btn}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-dark-surface-2 border border-white/5 h-96 animate-pulse cyber-clip"></div>
          ))}
        </div>
      ) : filteredTournaments.length > 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredTournaments.map(t => (
            <TournamentCard key={t.id} tournament={t} />
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-40 bg-dark-surface-2 border border-dashed border-gold/20 flex flex-col items-center gap-6">
          <Trophy size={48} className="text-white/10" />
          <p className="text-white/20 uppercase tracking-[0.5em] text-[10px] font-black">No operational missions found for {filter}.</p>
        </div>
      )}
    </div>
  );
};
