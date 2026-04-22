import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Trophy, Medal, Target } from 'lucide-react';
import { motion } from 'motion/react';

interface LeaderboardEntry {
  id: string;
  teamName: string;
  game: string;
  matchesPlayed: number;
  points: number;
  wins: number;
}

export const LeaderboardPage = () => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [game, setGame] = useState('BGMI');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        const q = query(
          collection(db, 'leaderboards'), 
          orderBy('points', 'desc'),
          limit(50)
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as LeaderboardEntry));
        setEntries(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, [game]);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-20 min-h-screen">
      <div className="text-center mb-20">
        <span className="text-neon-red text-[11px] font-bold tracking-[0.3em] uppercase block mb-3">Global Standings</span>
        <h1 className="bebas text-6xl md:text-7xl text-white tracking-widest">Elite <span className="text-gold">Hall of Fame</span></h1>
        <p className="text-white/40 text-sm uppercase tracking-widest mt-4">Rankings based on official tournament and scrim performance.</p>
      </div>

      <div className="flex flex-wrap gap-3 justify-center mb-16">
        {['BGMI', 'Free Fire', 'COD', 'Valorant'].map(g => (
          <button 
            key={g}
            onClick={() => setGame(g)}
            className={`cyber-clip-sm px-8 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all border ${
              game === g 
                ? 'bg-gold text-black border-gold' 
                : 'bg-dark-surface-2 text-white/40 border-white/5 hover:border-gold/40'
            }`}
          >
            {g}
          </button>
        ))}
      </div>

      <div className="bg-dark-surface-2 border border-gold/15 overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-gold/10 bg-gold/5">
              <th className="p-8 bebas text-xl tracking-widest text-gold w-32">Rank</th>
              <th className="p-8 bebas text-xl tracking-widest text-gold text-center">Team Identity</th>
              <th className="hidden md:table-cell p-8 bebas text-xl tracking-widest text-gold text-center">Efficiency</th>
              <th className="p-8 bebas text-xl tracking-widest text-gold text-right">Points</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [1, 2, 3, 4, 5].map(i => (
                <tr key={i} className="animate-pulse border-b border-white/5">
                  <td colSpan={4} className="p-12 h-20"></td>
                </tr>
              ))
            ) : entries.length > 0 ? (
              entries.map((entry, idx) => (
                <motion.tr 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={entry.id} 
                  className={`border-b border-white/5 hover:bg-gold/5 transition-colors group ${
                    idx === 0 ? 'bg-gradient-to-r from-gold/10 to-transparent' : 
                    idx === 1 ? 'bg-gradient-to-r from-white/5 to-transparent' : 
                    idx === 2 ? 'bg-gradient-to-r from-neon-red/5 to-transparent' : ''
                  }`}
                >
                  <td className="p-8">
                    <span className={`orbitron text-3xl font-black italic tracking-tighter ${
                      idx === 0 ? 'text-gold pulse-gold' : 
                      idx === 1 ? 'text-white/60' : 
                      idx === 2 ? 'text-neon-red' : 'text-white/20'
                    }`}>
                      {(idx + 1).toString().padStart(2, '0')}
                    </span>
                  </td>
                  <td className="p-8">
                    <div className="flex flex-col items-center">
                      <span className="orbitron text-lg font-black text-white group-hover:text-gold transition-colors">{entry.teamName}</span>
                      <span className="text-[8px] text-white/30 uppercase tracking-[0.2em] font-bold">Verified Organization</span>
                    </div>
                  </td>
                  <td className="hidden md:table-cell p-8 text-center">
                    <div className="flex flex-col items-center">
                      <span className="orbitron text-white/50 text-sm">{entry.wins || 0} / {entry.matchesPlayed || 0}</span>
                      <span className="text-[7px] text-white/20 uppercase font-black tracking-widest">W/L Status</span>
                    </div>
                  </td>
                  <td className="p-8 text-right">
                    <span className={`orbitron text-3xl font-black italic tracking-tighter ${idx < 3 ? 'text-gold' : 'text-white/40'}`}>
                      {entry.points}
                    </span>
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="p-40 text-center text-white/20 uppercase tracking-[0.5em] text-[10px] font-black">
                  No operational data available for {game} grid.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
