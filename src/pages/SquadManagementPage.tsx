import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  MoreVertical, 
  CheckCircle, 
  Copy, 
  LogOut, 
  ExternalLink, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  UserPlus, 
  MessageSquare,
  ChevronRight,
  User as UserIcon,
  Search,
  Trophy
} from 'lucide-react';
import { auth } from '../lib/firebase';
import { Link } from 'react-router-dom';

interface Player {
  id: string;
  ign: string;
  realName: string;
  role: string;
  image: string;
  verified: boolean;
  isIGL?: boolean;
}

const INITIAL_SQUAD: Player[] = [
  {
    id: '1',
    ign: 'BTSxDyno',
    realName: 'Vishnu Ram',
    role: 'FRAGGER',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=200&h=200',
    verified: true,
    isIGL: true
  },
  {
    id: '2',
    ign: 'BTSxSprayOP',
    realName: 'Sri Dharshan',
    role: 'FRAGGER',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200&h=200',
    verified: true
  },
  {
    id: '3',
    ign: 'BTSxROMEO',
    realName: 'Varun Js',
    role: 'FRAGGER',
    image: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&q=80&w=200&h=200',
    verified: true
  },
  {
    id: '4',
    ign: 'BTSxHopeOG',
    realName: 'Sanjai B',
    role: 'FRAGGER',
    image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200&h=200',
    verified: true
  }
];

export const SquadManagementPage = () => {
  const [activeTab, setActiveTab] = useState<'my_team' | 'transfer_requests' | 'tournaments'>('my_team');
  const [teamVisibility, setTeamVisibility] = useState(true);
  const [lookingForPlayers, setLookingForPlayers] = useState(false);
  const [squad, setSquad] = useState<Player[]>(INITIAL_SQUAD);
  const [substitutes, setSubstitutes] = useState<Player[]>([]);

  const teamCode = "d5343e";

  const copyCode = () => {
    navigator.clipboard.writeText(teamCode);
    alert('Team Code Copied!');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans">
      {/* Header Info */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-12 pb-6 border-b border-white/5">
        <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full border-2 border-[#fdb813] p-1 overflow-hidden relative">
              <img 
                src="https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=100&h=100" 
                className="w-full h-full rounded-full object-cover"
                alt="Team Logo"
              />
            </div>
            <button className="absolute -bottom-1 left-1/2 -translate-x-1/2 p-1 bg-black/80 rounded border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
              <LogOut size={10} className="rotate-270" />
            </button>
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <h1 className="text-2xl font-black text-[#fdb813] uppercase tracking-wide">BTS eSports</h1>
              <button className="text-white/40 hover:text-white transition-colors">
                <ExternalLink size={16} />
              </button>
              <div className="ml-auto flex gap-3">
                <button className="px-4 py-1.5 border border-white/10 rounded text-[10px] uppercase font-bold text-white/60 hover:bg-white/5 transition-all flex items-center gap-2">
                  <LogOut size={12} className="text-neon-red" />
                  Leave Team
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-end">
              <div>
                <span className="text-[9px] uppercase font-bold text-white/30 tracking-widest block mb-2">Team code</span>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold">{teamCode}</span>
                  <button onClick={copyCode} className="text-white/30 hover:text-white"><Copy size={14} /></button>
                </div>
              </div>

              <div>
                <span className="text-[9px] uppercase font-bold text-white/30 tracking-widest block mb-2 min-w-[100px] flex items-center gap-1">
                  Verification <ShieldCheck size={10} />
                </span>
                <span className="text-xs font-bold text-green-500">Verified</span>
              </div>

              <div>
                <span className="text-[9px] uppercase font-bold text-white/30 tracking-widest block mb-2 min-w-[100px] flex items-center gap-1">
                  Team visibility <ShieldCheck size={10} />
                </span>
                <button 
                  onClick={() => setTeamVisibility(!teamVisibility)}
                  className={`w-8 h-4 rounded-full relative transition-colors ${teamVisibility ? 'bg-[#fdb813]' : 'bg-white/20'}`}
                >
                  <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${teamVisibility ? 'left-[16px]' : 'left-[4px]'}`} />
                </button>
              </div>

              <div>
                <span className="text-[9px] uppercase font-bold text-white/30 tracking-widest block mb-2 min-w-[100px] flex items-center gap-1">
                  Looking for players <ShieldCheck size={10} />
                </span>
                <button 
                  onClick={() => setLookingForPlayers(!lookingForPlayers)}
                  className={`w-8 h-4 rounded-full relative transition-colors ${lookingForPlayers ? 'bg-[#fdb813]' : 'bg-white/20'}`}
                >
                  <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${lookingForPlayers ? 'left-[16px]' : 'left-[4px]'}`} />
                </button>
              </div>

              <div>
                <span className="text-[9px] uppercase font-bold text-white/30 tracking-widest block mb-2">Discord Server</span>
                <button className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider text-white/60 hover:bg-white/10 transition-all">
                  <MessageSquare size={12} />
                  Discord
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-12 mt-12">
          {[
            { id: 'my_team', label: 'MY TEAM' },
            { id: 'transfer_requests', label: 'TRANSFER REQUESTS' },
            { id: 'tournaments', label: 'TOURNAMENTS' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-4 text-[10px] font-black tracking-[0.2em] transition-all relative ${
                activeTab === tab.id ? 'text-[#fdb813]' : 'text-white/40 hover:text-white'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#fdb813]" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <AnimatePresence mode="wait">
          {activeTab === 'my_team' && (
            <motion.div
              key="my_team"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="mb-12">
                <h2 className="text-[11px] font-black text-[#fdb813] uppercase tracking-[0.2em] mb-8">MY TEAM</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {squad.map((player) => (
                    <PlayerCard key={player.id} player={player} />
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-[11px] font-black text-[#fdb813] uppercase tracking-[0.2em] mb-8">SUBSTITUTE</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {substitutes.map((player) => (
                    <PlayerCard key={player.id} player={player} />
                  ))}
                  
                  {/* The "One player add square" */}
                  <button className="h-[280px] bg-black border border-dashed border-white/20 flex flex-col items-center justify-center gap-4 group hover:border-[#fdb813]/40 transition-all rounded-lg">
                    <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/30 group-hover:text-[#fdb813] group-hover:border-[#fdb813]/40 transition-all">
                      <Plus size={20} />
                    </div>
                    <span className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] group-hover:text-[#fdb813]/60 transition-all">Add player</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'transfer_requests' && (
            <motion.div
              key="transfer_requests"
              className="py-20 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <UserPlus className="text-white/20" size={32} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-widest">Incoming Requests</h3>
              <p className="text-white/40 text-xs uppercase tracking-widest">No pending transfer requests at this time.</p>
            </motion.div>
          )}

          {activeTab === 'tournaments' && (
            <motion.div
              key="tournaments"
              className="py-20 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
               <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trophy className="text-white/20" size={32} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-widest">Team Missions</h3>
              <p className="text-white/40 text-xs uppercase tracking-widest">Visit the Arena to register your squad for operations.</p>
              <Link to="/tournaments" className="inline-block mt-8 text-[#fdb813] border-b border-[#fdb813]/40 pb-1 text-[10px] font-black uppercase tracking-widest hover:border-[#fdb813] transition-all">Go to Arena →</Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const PlayerCard: React.FC<{ player: Player }> = ({ player }) => (
  <div className="bg-[#121212] border border-white/10 rounded-lg overflow-hidden group hover:border-[#fdb813]/30 transition-all flex flex-col">
    <div className="p-4 flex items-center justify-between bg-black/40 border-b border-white/5">
      <div className="flex items-center gap-2">
        <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">
          {player.isIGL ? 'TEAM IGL' : 'PLAYER'}
        </span>
        <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter ${player.isIGL ? 'bg-indigo-500/20 text-indigo-400' : 'bg-blue-500/20 text-blue-400'}`}>
          {player.isIGL ? 'IGL' : player.role}
        </div>
        {player.verified && <CheckCircle size={12} className="text-green-500" />}
      </div>
    </div>

    <div className="relative p-1 bg-[#1a1a1a]">
      <img src={player.image} className="w-full h-48 object-cover rounded" alt={player.ign} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
    </div>

    <div className="p-4 bg-[#121212] border-t border-white/5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-sm font-black text-white uppercase tracking-wide group-hover:text-[#fdb813] transition-colors">{player.ign}</h4>
          <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">{player.realName}</p>
        </div>
        <div className="w-8 h-8 rounded bg-black border border-white/10 flex items-center justify-center">
          <img 
            src="https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=20&h=20" 
            className="w-4 h-4 rounded-sm object-cover opacity-50"
            alt="Team Logo"
          />
        </div>
      </div>

      <div className="flex gap-2">
        <button className="flex-1 bg-[#fdb813] text-black py-2 rounded text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all">
          View Profile
        </button>
        <button className="w-10 flex items-center justify-center border border-white/10 rounded text-white/40 hover:text-white transition-all">
          <MoreVertical size={16} />
        </button>
      </div>
    </div>
  </div>
);
