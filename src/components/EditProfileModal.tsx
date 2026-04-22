import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Save, Instagram, Twitter, Youtube, User, FileText, Gamepad2, Award } from 'lucide-react';
import { PlayerProfile } from '../types';
import { profileService } from '../lib/profileService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  profile: PlayerProfile;
  onUpdate: (profile: PlayerProfile) => void;
}

export const EditProfileModal: React.FC<Props> = ({ isOpen, onClose, profile, onUpdate }) => {
  const [formData, setFormData] = useState<Partial<PlayerProfile>>(profile);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await profileService.updateProfile(profile.uid, formData);
      onUpdate({ ...profile, ...formData });
      onClose();
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/90 backdrop-blur-sm"
          onClick={onClose}
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-2xl bg-dark-surface border border-gold/20 shadow-2xl overflow-hidden cyber-clip-sm"
        >
          <div className="flex items-center justify-between p-6 border-b border-white/5">
            <h2 className="bebas text-3xl text-white tracking-widest uppercase">Update Operative <span className="text-gold">Intel</span></h2>
            <button onClick={onClose} className="text-white/40 hover:text-gold transition-colors">
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
            <div className="space-y-8">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-bold block mb-2">Display Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                    <input 
                      type="text"
                      className="w-full bg-white/5 border border-white/10 p-3 pl-12 text-sm text-white focus:border-gold outline-none transition-all"
                      value={formData.displayName}
                      onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-bold block mb-2">Username</label>
                  <input 
                    type="text"
                    className="w-full bg-white/5 border border-white/10 p-3 text-sm text-white focus:border-gold outline-none transition-all"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-bold block mb-2">Personnel Bio</label>
                <div className="relative">
                  <FileText className="absolute left-4 top-4 text-white/20" size={16} />
                  <textarea 
                    className="w-full bg-white/5 border border-white/10 p-3 pl-12 text-sm text-white focus:border-gold outline-none transition-all min-h-[100px] resize-none italic"
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-bold block mb-2">Primary Role</label>
                  <select 
                    className="w-full bg-white/5 border border-white/10 p-3 text-sm text-white focus:border-gold outline-none transition-all appearance-none"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  >
                    <option value="Assaulter">Assaulter</option>
                    <option value="Sniper">Sniper</option>
                    <option value="IGL">IGL</option>
                    <option value="Filter">Filter</option>
                    <option value="Support">Support</option>
                    <option value="Trainee">Trainee</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-bold block mb-2">Social Hubs</label>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Instagram size={16} className="text-white/20" />
                      <input 
                        type="text" 
                        placeholder="Instagram URL"
                        className="flex-1 bg-white/5 border border-white/10 p-2 text-xs text-white outline-none focus:border-gold"
                        value={formData.socials?.instagram || ''}
                        onChange={(e) => setFormData({ ...formData, socials: { ...formData.socials, instagram: e.target.value } })}
                      />
                    </div>
                    <div className="flex items-center gap-4">
                      <Youtube size={16} className="text-white/20" />
                      <input 
                        type="text" 
                        placeholder="YouTube URL"
                        className="flex-1 bg-white/5 border border-white/10 p-2 text-xs text-white outline-none focus:border-gold"
                        value={formData.socials?.youtube || ''}
                        onChange={(e) => setFormData({ ...formData, socials: { ...formData.socials, youtube: e.target.value } })}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* URL Overrides */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/5">
                <div>
                  <label className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-bold block mb-2">Avatar Image URL</label>
                  <input 
                    type="text"
                    className="w-full bg-white/5 border border-white/10 p-3 text-xs text-white focus:border-gold outline-none transition-all"
                    value={formData.avatarUrl}
                    onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                    placeholder="Link to profile image"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-bold block mb-2">Cover Banner URL</label>
                  <input 
                    type="text"
                    className="w-full bg-white/5 border border-white/10 p-3 text-xs text-white focus:border-gold outline-none transition-all"
                    value={formData.coverUrl}
                    onChange={(e) => setFormData({ ...formData, coverUrl: e.target.value })}
                    placeholder="Link to banner image"
                  />
                </div>
              </div>
            </div>

            <div className="mt-12 flex gap-4">
              <button 
                type="submit" 
                disabled={isSaving}
                className="flex-1 bg-gold text-black px-8 py-4 font-black uppercase text-xs tracking-[0.3em] cyber-clip-sm hover:bg-white transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSaving ? (
                   <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                ) : <Save size={18} />}
                Synchronize Intel
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
