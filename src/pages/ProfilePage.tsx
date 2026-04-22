import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  Target, 
  Award, 
  Gamepad2, 
  Instagram, 
  Twitter, 
  Youtube, 
  ExternalLink,
  Edit2,
  Share2,
  Calendar,
  Users,
  Star,
  Zap,
  Info
} from 'lucide-react';
import { auth } from '../lib/firebase';
import { profileService } from '../lib/profileService';
import { PlayerProfile } from '../types';
import { EditProfileModal } from '../components/EditProfileModal';

export const ProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const [profile, setProfile] = useState<PlayerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const currentUser = auth.currentUser;
  const isOwner = currentUser?.uid === profile?.uid;

  useEffect(() => {
    if (id) {
      loadProfile(id);
    }
  }, [id]);

  const loadProfile = async (uid: string) => {
    setLoading(true);
    try {
      const data = await profileService.getProfile(uid);
      if (data) {
        setProfile(data);
      } else if (currentUser?.uid === uid) {
        // Create a default profile if it doesn't exist for the current user
        const defaultProfile: Partial<PlayerProfile> = {
          uid: currentUser.uid,
          displayName: currentUser.displayName || 'New Player',
          username: currentUser.email?.split('@')[0] || 'player',
          bio: 'Building the next generation of pros.',
          avatarUrl: currentUser.photoURL || '',
          coverUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80',
          role: 'Trainee',
          game: 'BGMI',
          socials: {},
          stats: { kdr: 0, headshotPercentage: 0, matchesPlayed: 0, wins: 0 },
          achievements: [],
          tournamentHistory: []
        };
        await profileService.createProfile(defaultProfile);
        setProfile(defaultProfile as PlayerProfile);
      }
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-dark flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-gold/20 border-t-gold rounded-full animate-spin"></div>
          <span className="text-gold text-xs font-black uppercase tracking-widest">Scanning Intel...</span>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-bg-dark flex flex-col items-center justify-center p-4">
        <h2 className="bebas text-4xl text-white mb-4">Profile Not Found</h2>
        <p className="text-white/40 mb-8">This operative is not in our database.</p>
        <Link to="/" className="text-gold border border-gold/40 px-8 py-3 uppercase text-xs font-black tracking-widest hover:bg-gold/10 transition-all">Return to Home</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-dark">
      {/* Cover Image */}
      <div className="relative h-64 md:h-80 w-full overflow-hidden">
        <img 
          src={profile.coverUrl} 
          alt="Cover" 
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-dark to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gold/20" />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 -mt-24 relative z-10">
        <div className="flex flex-col md:flex-row gap-8 items-end justify-between mb-12">
          <div className="flex flex-col md:flex-row gap-6 items-end">
            <div className="relative group">
              <div className="w-40 h-40 border-2 border-gold/40 p-1 bg-bg-dark cyber-clip">
                <img 
                  src={profile.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.username}`} 
                  alt={profile.displayName} 
                  className="w-full h-full object-cover cyber-clip"
                />
              </div>
              {isOwner && (
                <button 
                  onClick={() => setIsEditModalOpen(true)}
                  className="absolute bottom-2 right-2 bg-gold text-black p-2 rounded-full shadow-lg hover:scale-110 transition-transform"
                >
                  <Edit2 size={16} />
                </button>
              )}
            </div>

            <div className="mb-4">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="bebas text-5xl md:text-7xl text-white tracking-widest leading-none">{profile.displayName}</h1>
                <span className="bg-neon-red/10 border border-neon-red/30 text-neon-red text-[10px] font-black px-2 py-0.5 uppercase tracking-tighter">Verified Operative</span>
              </div>
              <p className="orbitron text-gold/60 text-sm font-bold tracking-widest uppercase mb-4">@{profile.username} • {profile.role}</p>
              <div className="flex gap-4">
                {profile.socials.instagram && (
                  <a href={profile.socials.instagram} target="_blank" rel="noreferrer" className="text-white/40 hover:text-gold transition-colors">
                    <Instagram size={20} />
                  </a>
                )}
                {profile.socials.twitter && (
                  <a href={profile.socials.twitter} target="_blank" rel="noreferrer" className="text-white/40 hover:text-gold transition-colors">
                    <Twitter size={20} />
                  </a>
                )}
                {profile.socials.youtube && (
                  <a href={profile.socials.youtube} target="_blank" rel="noreferrer" className="text-white/40 hover:text-gold transition-colors">
                    <Youtube size={20} />
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-4 mb-4">
            {isOwner ? (
              <button 
                onClick={() => setIsEditModalOpen(true)}
                className="bg-gold text-black px-8 py-3 font-black uppercase text-xs tracking-widest cyber-clip-sm hover:bg-white transition-all flex items-center gap-2"
              >
                <Edit2 size={16} /> Update Intel
              </button>
            ) : (
              <button className="border border-gold/40 text-gold px-8 py-3 font-black uppercase text-xs tracking-widest cyber-clip-sm hover:bg-gold/10 transition-all flex items-center gap-2">
                <Share2 size={16} /> Share Profile
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-24">
          {/* Bio & Stats */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-dark-surface p-8 border border-white/5 cyber-clip-sm">
              <h3 className="bebas text-2xl text-gold mb-4 uppercase tracking-widest flex items-center gap-2">
                <Info size={18} className="text-gold" /> Personnel Bio
              </h3>
              <p className="text-white/60 leading-relaxed text-sm italic">
                "{profile.bio}"
              </p>
            </div>

            <div className="bg-dark-surface p-8 border border-white/5 cyber-clip-sm">
              <h3 className="bebas text-2xl text-gold mb-6 uppercase tracking-widest flex items-center gap-2">
                <Zap size={18} className="text-gold" /> Combat Performance
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <span className="text-[10px] text-white/30 uppercase tracking-widest block mb-1">Kill/Death Ratio</span>
                  <span className="orbitron text-2xl font-black text-white">{profile.stats.kdr}</span>
                </div>
                <div>
                  <span className="text-[10px] text-white/30 uppercase tracking-widest block mb-1">HS Percentage</span>
                  <span className="orbitron text-2xl font-black text-white">{profile.stats.headshotPercentage}%</span>
                </div>
                <div>
                  <span className="text-[10px] text-white/30 uppercase tracking-widest block mb-1">Matches</span>
                  <span className="orbitron text-2xl font-black text-white">{profile.stats.matchesPlayed}</span>
                </div>
                <div>
                  <span className="text-[10px] text-white/30 uppercase tracking-widest block mb-1">Wins</span>
                  <span className="orbitron text-2xl font-black text-gold">{profile.stats.wins}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tournament History & Achievements */}
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-dark-surface p-8 border border-white/5 cyber-clip-sm">
              <div className="flex justify-between items-center mb-8">
                <h3 className="bebas text-3xl text-white uppercase tracking-widest flex items-center gap-2">
                  <Trophy size={22} className="text-gold" /> Tournament History
                </h3>
                <span className="text-[10px] text-white/20 uppercase tracking-widest font-bold">Past Operations</span>
              </div>
              
              {profile.tournamentHistory.length > 0 ? (
                <div className="space-y-4">
                  {profile.tournamentHistory.map((item, idx) => (
                    <div key={idx} className="bg-white/5 p-4 border-l-2 border-gold flex items-center justify-between group hover:bg-white/10 transition-all">
                      <div>
                        <h4 className="orbitron text-white font-bold text-sm uppercase mb-1">{item.tournamentName}</h4>
                        <p className="text-[10px] text-white/40 uppercase tracking-widest flex items-center gap-2">
                          <Calendar size={12} /> {item.date}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="block text-gold font-black uppercase text-sm tracking-widest">{item.rank}</span>
                        <span className="text-[9px] text-white/30 font-bold uppercase">{item.prize}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border border-white/5 border-dashed">
                  <p className="text-white/20 italic text-sm">No recorded tournament deployments.</p>
                </div>
              )}
            </div>

            <div className="bg-dark-surface p-8 border border-white/5 cyber-clip-sm">
                <h3 className="bebas text-3xl text-white uppercase tracking-widest mb-8 flex items-center gap-2">
                  <Award size={22} className="text-gold" /> Career Achievements
                </h3>
                
                {profile.achievements.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {profile.achievements.map((ach, idx) => (
                            <div key={idx} className="bg-white/5 p-6 border border-white/5 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-12 h-12 bg-gold/10 flex items-center justify-center">
                                    <Star size={16} className="text-gold" />
                                </div>
                                <h4 className="orbitron text-gold font-bold text-xs uppercase mb-2">{ach.title}</h4>
                                <p className="text-white/50 text-[11px] leading-relaxed mb-3">{ach.description}</p>
                                <span className="text-[9px] text-white/20 uppercase font-black">{ach.date}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 border border-white/5 border-dashed">
                        <p className="text-white/20 italic text-sm">Awaiting first major milestone.</p>
                    </div>
                )}
            </div>
          </div>
        </div>
      </div>

      <EditProfileModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        profile={profile}
        onUpdate={setProfile}
      />
    </div>
  );
};
