import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { scrimService, Scrim } from '../lib/scrimService';
import { Gamepad2, ArrowLeft, Send, CheckCircle2, Lock, Clock } from 'lucide-react';
import { motion } from 'motion/react';
import { auth } from '../lib/firebase';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

const schema = z.object({
  teamName: z.string().min(3, "Team name is too short"),
  captainName: z.string().min(2, "Captain name is required"),
  captainDiscord: z.string().min(5, "Valid Discord ID required"),
  captainEmail: z.string().email("Invalid email address"),
  phoneNumber: z.string().min(10, "Valid phone number required"),
});

type FormData = z.infer<typeof schema>;

export const ScrimRegistrationPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [scrim, setScrim] = useState<Scrim | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(auth.currentUser);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  const login = async () => {
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
    } catch (error: any) {
      if (error.code !== 'auth/popup-closed-by-user') {
        console.error('Auth error:', error);
      }
    }
  };

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema)
  });

  useEffect(() => {
    if (id) {
      scrimService.getScrimById(id).then(data => {
        if (data) setScrim(data as any);
        setLoading(false);
      });
    }
  }, [id]);

  const onSubmit = async (data: FormData) => {
    if (!id || !scrim || !user) return;
    
    // Save to Firestore
    await scrimService.registerForScrim({
      scrimId: id,
      teamName: data.teamName,
      captainName: data.captainName,
      captainDiscord: data.captainDiscord,
      captainEmail: data.captainEmail,
      phoneNumber: data.phoneNumber,
      game: scrim.game,
    });

    // Save to Google Sheets
    try {
      await fetch('/api/register-scrim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          scrimTitle: scrim.title,
          game: scrim.game,
          time: scrim.time
        })
      });
    } catch (err) {
      console.error('Google Sheets Sync Failed:', err);
    }

    setSubmitted(true);
  };

  if (loading) return <div className="p-20 text-center animate-pulse gold-text-gradient font-black">SYNCHRONIZING DRILL DATA...</div>;
  if (!scrim) return <div className="p-20 text-center">Scrim sector not found</div>;

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 min-h-screen flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 bg-gold/10 border border-gold flex items-center justify-center mb-8">
          <Lock size={40} className="text-gold" />
        </div>
        <h2 className="bebas text-5xl text-white mb-4 tracking-widest">Login Required</h2>
        <p className="text-white/40 uppercase tracking-[0.2em] text-[11px] font-bold max-w-sm mb-12 italic">
          Tactical data access restricted. Please authenticate to join the practice session.
        </p>
        <button onClick={login} className="bg-gold text-black px-12 py-5 font-black uppercase text-[11px] tracking-[0.3em] cyber-clip hover:bg-white transition-all">
          Initialize Auth Sequence →
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-20 min-h-screen">
      <div className="mb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div>
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gold/40 hover:text-gold transition-colors mb-6 uppercase text-[10px] font-black tracking-[0.4em]">
            <ArrowLeft size={14} /> Global Map
          </button>
          <h1 className="bebas text-6xl md:text-7xl text-white tracking-widest leading-none">Book <span className="text-gold">Slot</span></h1>
        </div>
        <div className="text-right">
           <span className="text-neon-red text-[11px] font-bold tracking-[0.3em] uppercase block mb-1">Operational Drill</span>
           <span className="orbitron text-white text-sm font-black uppercase tracking-widest">{scrim.title}</span>
        </div>
      </div>

      {submitted ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-dark-surface-2 border border-gold/15 p-16 md:p-32 text-center flex flex-col items-center gap-10"
        >
          <div className="w-20 h-20 bg-gold/10 border border-gold flex items-center justify-center pulse-gold">
            <CheckCircle2 size={40} className="text-gold" />
          </div>
          <div>
            <h2 className="bebas text-5xl text-white mb-6 uppercase tracking-widest">Slot <span className="text-gold">Secured</span></h2>
            <p className="text-white/40 uppercase tracking-[0.2em] text-[11px] font-bold max-w-sm mx-auto leading-relaxed">
              Drill coordinates confirmed. Team identification accepted for the {scrim.time} session.
            </p>
          </div>
          <button onClick={() => navigate('/scrims')} className="bg-gold text-black px-12 py-5 font-black uppercase text-[11px] tracking-[0.3em] cyber-clip hover:bg-white transition-all">
            Back to Drills →
          </button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="space-y-6">
            <div className="bg-dark-surface-2 border border-white/5 p-8 cyber-clip-sm">
              <h3 className="bebas text-2xl text-gold mb-6 tracking-widest uppercase">Drill Details</h3>
              <div className="space-y-6">
                <div>
                  <span className="text-[10px] uppercase font-black tracking-[0.2em] text-white/30 block mb-2">Game Sector</span>
                  <span className="orbitron text-white text-sm font-bold uppercase">{scrim.game}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-black tracking-[0.2em] text-white/30 block mb-2">Sync Time</span>
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-gold" />
                    <span className="orbitron text-gold text-lg font-black">{scrim.time} IST</span>
                  </div>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-black tracking-[0.2em] text-white/30 block mb-2">Availability</span>
                  <span className="orbitron text-white text-sm font-bold uppercase">{scrim.slotsFilled} / {scrim.slotsTotal} Occupied</span>
                </div>
              </div>
            </div>

            <div className="bg-gold/5 border border-gold/20 p-8">
              <h3 className="bebas text-xl text-gold mb-6 tracking-widest uppercase">Protocol</h3>
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] leading-loose">
                Please be present exactly 15 minutes before sync time in our Discord sector. Failure to materialize will result in slot forfeiture.
              </p>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-dark-surface-2 border border-gold/15 p-8 md:p-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gold opacity-[0.02] blur-[100px] pointer-events-none"></div>
              
              <h2 className="bebas text-3xl text-gold mb-12 tracking-widest uppercase">Team Credentials</h2>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Team Tag</label>
                    <input {...register('teamName')} className="w-full bg-white/5 border border-gold/15 text-white px-4 py-3 outline-none focus:border-gold transition-all text-sm uppercase placeholder:opacity-10" placeholder="Clan Name" />
                    {errors.teamName && <p className="text-neon-red text-[9px] font-bold uppercase tracking-widest">{errors.teamName.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Officer Name</label>
                    <input {...register('captainName')} className="w-full bg-white/5 border border-gold/15 text-white px-4 py-3 outline-none focus:border-gold transition-all text-sm uppercase placeholder:opacity-10" placeholder="Captain IGN" />
                    {errors.captainName && <p className="text-neon-red text-[9px] font-bold uppercase tracking-widest">{errors.captainName.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Signal (Discord)</label>
                    <input {...register('captainDiscord')} className="w-full bg-white/5 border border-gold/15 text-white px-4 py-3 outline-none focus:border-gold transition-all text-sm" placeholder="User#0000" />
                    {errors.captainDiscord && <p className="text-neon-red text-[9px] font-bold uppercase tracking-widest">{errors.captainDiscord.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Direct Link (WhatsApp)</label>
                    <input {...register('phoneNumber')} className="w-full bg-white/5 border border-gold/15 text-white px-4 py-3 outline-none focus:border-gold transition-all text-sm" placeholder="+91 XXXXXXXX" />
                    {errors.phoneNumber && <p className="text-neon-red text-[9px] font-bold uppercase tracking-widest">{errors.phoneNumber.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Contact Node (Email)</label>
                    <input {...register('captainEmail')} className="w-full bg-white/5 border border-gold/15 text-white px-4 py-3 outline-none focus:border-gold transition-all text-sm" placeholder="contact@clan.com" />
                    {errors.captainEmail && <p className="text-neon-red text-[9px] font-bold uppercase tracking-widest">{errors.captainEmail.message}</p>}
                  </div>
                </div>

                <button 
                  disabled={isSubmitting}
                  className="w-full bg-gold text-black py-5 font-black uppercase text-xs tracking-[0.3em] cyber-clip hover:bg-white transition-all disabled:opacity-50"
                  type="submit"
                >
                  {isSubmitting ? 'UPDATING DRILL LOGS...' : 'Initiate Drill Access →'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
