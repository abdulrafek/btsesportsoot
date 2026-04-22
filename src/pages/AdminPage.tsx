import React, { useState, useEffect } from 'react';
import { auth } from '../lib/firebase';
import { tournamentService, Tournament, Registration } from '../lib/tournamentService';
import { scrimService, Scrim } from '../lib/scrimService';
import { LayoutDashboard, Users, Trophy, Plus, FileText, Download, CheckCircle, Clock, Lock, Send } from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { motion } from 'motion/react';

export const AdminPage = () => {
  const [activeTab, setActiveTab] = useState<'tournaments' | 'registrations' | 'scrims'>('tournaments');
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [scrims, setScrims] = useState<Scrim[]>([]);
  const [user, setUser] = useState(auth.currentUser);

  useEffect(() => {
    if (user?.email === 'editingvideo123456@gmail.com') { 
        fetchData();
    }
  }, [user, activeTab]);

  const fetchData = async () => {
    if (activeTab === 'tournaments') {
        const data = await tournamentService.getAllTournaments();
        if (data) setTournaments(data);
    } else if (activeTab === 'scrims') {
        const data = await scrimService.getAllScrims();
        if (data) setScrims(data);
    } else if (activeTab === 'registrations') {
        const ts = await tournamentService.getAllTournaments();
        if (ts && ts.length > 0) {
            const regs = await tournamentService.getRegistrationsByTournament(ts[0].id!);
            if (regs) setRegistrations(regs);
        }
    }
  };

  const seedData = async () => {
      await tournamentService.addTournament({
          title: "BTS WINTER SHOWDOWN",
          game: "BGMI",
          status: "upcoming",
          type: "Squad",
          fee: "Free",
          prizePool: "₹50,000",
          startDate: "2026-05-15",
          description: "Premium BGMI Tournament with high-stakes gameplay."
      });
      await tournamentService.addTournament({
        title: "FIREBOLT CUP",
        game: "Free Fire",
        status: "ongoing",
        type: "Squad",
        fee: "Free",
        prizePool: "₹25,000",
        startDate: "2026-04-30",
        description: "Intense Free Fire action for the pro squads."
      });
      await tournamentService.addTournament({
        title: "OPS RED: COD MOBILE",
        game: "COD",
        status: "upcoming",
        type: "Squad",
        fee: "₹100",
        prizePool: "₹30,000",
        startDate: "2026-06-10",
        description: "Tactical combat in COD Mobile."
      });

      await scrimService.addScrim({
          title: "Elite Pro Practice",
          game: "BGMI",
          time: "09:00 PM",
          slotsTotal: 25,
          fee: "Free",
          status: "open"
      });
      await scrimService.addScrim({
          title: "Tier 1 Drills",
          game: "Free Fire",
          time: "08:00 PM",
          slotsTotal: 12,
          fee: "Free",
          status: "open"
      });
      await scrimService.addScrim({
          title: "Daily Scrims #44",
          game: "BGMI",
          time: "10:30 PM",
          slotsTotal: 25,
          fee: "Free",
          status: "open"
      });
      fetchData();
  };

  const exportToCSV = () => {
    const headers = ["Team Name", "Captain", "Discord", "Email", "Phone", "Players"];
    const rows = registrations.map(r => [
        r.teamName,
        r.captainName,
        r.captainDiscord,
        r.captainEmail,
        r.phoneNumber || '',
        r.players.join(', ')
    ]);
    
    let csvContent = "data:text/csv;charset=utf-8," 
        + headers.join(",") + "\n"
        + rows.map(e => e.join(",")).join("\n");
        
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `registrations_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
  };

  if (!user || user.email !== 'editingvideo123456@gmail.com') {
      return (
          <div className="p-20 text-center flex flex-col items-center gap-10 min-h-screen">
              <div className="w-20 h-20 bg-neon-red/10 border border-neon-red flex items-center justify-center">
                  <Lock className="text-neon-red" size={40} />
              </div>
              <div>
                <h1 className="bebas text-5xl text-white mb-4 tracking-widest uppercase">Access <span className="text-neon-red">Restricted</span></h1>
                <p className="text-white/40 text-[11px] font-bold uppercase tracking-[0.2em] max-w-sm mx-auto leading-relaxed">
                  The BTS Command Center is only accessible to verified high-level administrators.
                </p>
              </div>
          </div>
      );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-20 min-h-screen">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12 mb-20">
        <div>
          <span className="text-neon-red text-[11px] font-bold tracking-[0.3em] uppercase block mb-3">Administrator Mode</span>
          <h1 className="bebas text-6xl md:text-7xl text-white tracking-widest">Operational <span className="text-gold">Hub</span></h1>
        </div>

        <div className="flex flex-wrap gap-4">
            <button onClick={seedData} className="px-8 py-3 bg-neon-red/10 border border-neon-red/30 text-neon-red text-[10px] font-black uppercase tracking-widest hover:bg-neon-red/20 transition-all cyber-clip-sm">
              Initialize Demo Stream
            </button>
            <button onClick={exportToCSV} className="px-8 py-3 bg-gold text-black text-[10px] font-black uppercase tracking-widest flex items-center gap-2 cyber-clip hover:bg-white transition-all">
                <Download size={14} /> Extraction Logic (CSV)
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-8">
          {[
              { id: 'tournaments', name: 'Field Missions', icon: Trophy },
              { id: 'registrations', name: 'Intelligence', icon: FileText },
              { id: 'scrims', name: 'Time Logs', icon: Clock },
          ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-4 p-6 text-[11px] font-black uppercase tracking-[0.2em] transition-all border ${
                  activeTab === tab.id 
                    ? 'bg-gold text-black border-gold' 
                    : 'bg-dark-surface-2 text-white/30 border-white/5 hover:border-gold/30 hover:text-gold'
                }`}
              >
                  <tab.icon size={18} />
                  {tab.name}
              </button>
          ))}
      </div>

      <div className="bg-dark-surface-2 border border-gold/15 p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold opacity-[0.02] blur-[100px] pointer-events-none"></div>
          
          {activeTab === 'tournaments' && (
              <div className="space-y-4">
                  {tournaments.map(t => (
                      <div key={t.id} className="p-6 bg-white/5 border border-white/5 flex justify-between items-center group hover:border-gold/30 transition-all">
                          <div>
                              <p className="orbitron text-gold font-bold text-sm uppercase tracking-tight mb-2">{t.title}</p>
                              <div className="flex items-center gap-4 text-[9px] text-white/30 uppercase font-black tracking-widest">
                                <span>{t.game}</span>
                                <span className="opacity-20">|</span>
                                <span>{t.startDate}</span>
                              </div>
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-widest px-4 py-1 border border-white/10 cyber-clip-sm bg-white/5">{t.status}</span>
                      </div>
                  ))}
                  {tournaments.length === 0 && <p className="text-center py-20 text-white/20 uppercase tracking-[0.4em] text-[10px] font-black italic">No operational missions recorded.</p>}
              </div>
          )}

          {activeTab === 'registrations' && (
              <div className="overflow-x-auto">
                   <table className="w-full text-left border-collapse min-w-[700px]">
                        <thead>
                            <tr className="border-b border-gold/10 text-gold/40 uppercase text-[10px] font-black tracking-widest">
                                <th className="p-6">Identity</th>
                                <th className="p-6">Commander</th>
                                <th className="p-6">Signal</th>
                                <th className="p-6">Roster Unit</th>
                            </tr>
                        </thead>
                        <tbody className="text-[11px] font-bold uppercase tracking-widest">
                            {registrations.map(r => (
                                <tr key={r.id} className="border-b border-white/5 hover:bg-gold/5 transition-colors group">
                                    <td className="p-6 text-white group-hover:text-gold transition-colors">{r.teamName}</td>
                                    <td className="p-6 text-white/50">{r.captainName}</td>
                                    <td className="p-6 orbitron text-white/30 text-[9px]">{r.captainDiscord}</td>
                                    <td className="p-6 text-white/20 truncate max-w-xs">{r.players.join(', ')}</td>
                                </tr>
                            ))}
                        </tbody>
                   </table>
                   {registrations.length === 0 && <p className="text-center py-20 text-white/20 uppercase tracking-[0.4em] text-[10px] font-black italic">No intelligence data for current mission.</p>}
              </div>
          )}

          {activeTab === 'scrims' && (
              <div className="space-y-4">
                  {scrims.map(s => (
                      <div key={s.id} className="p-6 bg-white/5 border border-white/5 flex justify-between items-center group hover:border-gold/30 transition-all">
                          <div>
                              <p className="orbitron text-white font-bold text-sm tracking-tight mb-2 group-hover:text-gold transition-colors uppercase">{s.title}</p>
                              <div className="flex items-center gap-4 text-[9px] text-white/30 uppercase font-black tracking-widest">
                                <span>{s.game}</span>
                                <span className="opacity-20">|</span>
                                <span>{s.time}</span>
                              </div>
                          </div>
                          <div className="text-right">
                              <p className="orbitron text-gold font-black text-xl">{s.slotsFilled}/{s.slotsTotal}</p>
                              <p className="text-[8px] text-white/30 uppercase font-black tracking-widest">Node Occupancy</p>
                          </div>
                      </div>
                  ))}
                  {scrims.length === 0 && <p className="text-center py-20 text-white/20 uppercase tracking-[0.4em] text-[10px] font-black italic">No time logs for active scrim sectors.</p>}
              </div>
          )}
      </div>
    </div>
  );
};
