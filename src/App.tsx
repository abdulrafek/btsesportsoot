/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Users, LayoutDashboard, Info, Home as HomeIcon, Gamepad2, Shield, LogIn, Disc as Discord, Menu, X, Rocket, Briefcase } from 'lucide-react';
import { useState, useEffect } from 'react';
import { auth } from './lib/firebase';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';

// Page Imports
import { TournamentsPage } from './pages/TournamentsPage';
import { RegistrationPage } from './pages/RegistrationPage';
import { ScrimRegistrationPage } from './pages/ScrimRegistrationPage';
import { ScrimsPage } from './pages/ScrimsPage';
import { SquadManagementPage } from './pages/SquadManagementPage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { AboutPage } from './pages/AboutPage';
import { AdminPage } from './pages/AdminPage';
import { RosterPage } from './pages/RosterPage';
import { RecruitmentPage } from './pages/RecruitmentPage';
import { ManagementPage } from './pages/ManagementPage';
import { ProfilePage } from './pages/ProfilePage';

// Home Component Implementation
const TournamentSlider = () => {
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    tournamentService.getAllTournaments().then(data => {
      if (data) setTournaments(data);
    });
  }, []);

  useEffect(() => {
    if (tournaments.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % tournaments.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [tournaments]);

  if (tournaments.length === 0) return null;

  return (
    <section className="bg-black/50 border-y border-gold/10 py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
          <div className="max-w-xl">
            <span className="text-neon-red text-[11px] font-bold tracking-[0.3em] uppercase block mb-3">Live Briefing</span>
            <h2 className="bebas text-5xl md:text-6xl text-white tracking-widest uppercase">Ongoing <span className="text-gold">Operations</span></h2>
          </div>
          <Link to="/tournaments" className="text-gold text-[10px] font-black uppercase tracking-[0.2em] border-b border-gold/40 pb-1 hover:border-gold transition-all">View All Arenas →</Link>
        </div>

        <div className="relative h-[400px] md:h-[300px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="absolute inset-0 grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-dark-surface-2 border border-white/5 p-8 md:p-12 cyber-clip"
            >
              <div className="md:col-span-8">
                <div className="flex items-center gap-4 mb-4">
                  <span className="bg-neon-red px-3 py-1 text-[9px] font-black uppercase tracking-widest text-white">{tournaments[currentIndex].game}</span>
                  <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest">{tournaments[currentIndex].type}</span>
                </div>
                <h3 className="bebas text-4xl md:text-6xl text-white mb-6 uppercase tracking-widest">{tournaments[currentIndex].title}</h3>
                <div className="flex flex-wrap gap-8">
                  <div>
                    <span className="text-[10px] text-white/30 uppercase tracking-widest block mb-1">Prize Pool</span>
                    <span className="orbitron text-gold text-2xl font-black">{tournaments[currentIndex].prizePool}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-white/30 uppercase tracking-widest block mb-1">Access Status</span>
                    <span className="orbitron text-white text-xl font-bold uppercase">{tournaments[currentIndex].fee}</span>
                  </div>
                </div>
              </div>
              <div className="md:col-span-4 flex justify-end">
                <Link 
                  to={`/tournaments/${tournaments[currentIndex].id}/register`}
                  className="bg-gold text-black px-12 py-5 font-black uppercase text-xs tracking-[0.3em] cyber-clip-sm hover:bg-white transition-all shadow-[0_0_20px_rgba(255,215,0,0.2)]"
                >
                  Join Operation
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Dots */}
          <div className="absolute -bottom-12 left-0 flex gap-2">
            {tournaments.map((_, i) => (
              <button 
                key={i} 
                onClick={() => setCurrentIndex(i)}
                className={`h-1 transition-all ${i === currentIndex ? 'w-12 bg-gold' : 'w-4 bg-white/10'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// Tournament service import needed for Home
import { tournamentService } from './lib/tournamentService';

const Home = () => {
  return (
    <div id="home" className="page active">
      <div className="hero-bg absolute inset-0 hero-gradient grid-lines pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-24 md:py-40 grid grid-cols-1 md:grid-cols-2 gap-16 items-center relative z-10">
        <div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block bg-neon-red/15 border border-neon-red/40 text-neon-red text-[10px] font-bold tracking-[0.2em] px-4 py-1.5 uppercase mb-8"
          >
            🔥 India's Premier eSports Organization
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="bebas text-7xl md:text-[7rem] leading-[0.95] tracking-[0.02em] mb-8"
          >
            <span className="text-white block">Rise.</span>
            <span className="text-gold block gold-text-stroke">Dominate.</span>
            <span className="text-neon-red block">Conquer.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-white/60 text-lg md:text-xl leading-relaxed mb-12 max-w-lg"
          >
            BTS eSports is building the next generation of competitive gaming talent in India. Join us and compete at the highest level.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex gap-4 flex-wrap"
          >
            <Link to="/recruitment" className="btn-primary cyber-clip bg-gold text-black px-10 py-4 font-bold uppercase tracking-widest text-sm hover:translate-y-[-2px] transition-all">
              Join Now
            </Link>
            <Link to="/tournaments" className="btn-secondary cyber-clip border border-gold text-gold px-10 py-4 font-bold uppercase tracking-widest text-sm hover:bg-gold/10 hover:translate-y-[-2px] transition-all">
              View Tournaments
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {[
            { num: '40+', label: 'Active Players', pulse: true },
            { num: '5', label: 'Divisions' },
            { num: '30+', label: 'Tournaments Hosted' },
            { num: 'TOP 10', label: 'Global Rank' }
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className={`p-8 border border-white/5 bg-white/5 cyber-clip-sm ${stat.pulse ? 'pulse-gold' : ''}`}
            >
              <span className="orbitron block text-3xl font-black text-gold mb-2">{stat.num}</span>
              <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">{stat.label}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Tournament Slider */}
      <TournamentSlider />

      {/* Games Section */}
      <section className="bg-gold/5 border-y border-gold/10 py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <span className="text-neon-red text-[11px] font-bold tracking-[0.3em] uppercase block mb-3">Our Games</span>
            <h2 className="bebas text-5xl md:text-6xl text-white tracking-widest">Multi-Game <span className="text-gold">Expansion</span></h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '🎮', name: 'BGMI', desc: 'Battlegrounds Mobile India', status: 'Active' },
              { icon: '🔥', name: 'Free Fire', desc: 'Garena Free Fire MAX', status: 'Coming Soon' },
              { icon: '🎯', name: 'Valorant', desc: 'Riot Games Tactical FPS', status: 'Coming Soon' },
              { icon: '💀', name: 'COD: Mobile', desc: 'Call of Duty Mobile', status: 'Coming Soon' }
            ].map((game, i) => (
              <div key={i} className="bg-dark-surface-2 p-8 border border-white/5 text-center transition-all hover:border-gold/40 hover:translate-y-[-4px] relative group pointer-events-auto cursor-pointer">
                <div className="text-4xl mb-4">{game.icon}</div>
                <h3 className="orbitron text-gold font-bold mb-2 uppercase">{game.name}</h3>
                <p className="text-[10px] text-white/40 uppercase tracking-wider mb-6">{game.desc}</p>
                <span className={`text-[9px] font-bold uppercase tracking-widest px-4 py-1 rounded-full border ${game.status === 'Active' ? 'bg-green-500/10 text-green-500 border-green-500/30' : 'bg-neon-red/10 text-neon-red border-neon-red/30'}`}>
                  {game.status}
                </span>
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gold scale-x-0 group-hover:scale-x-100 transition-transform"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

const Navbar = () => {
  const [user, setUser] = useState(auth.currentUser);
  const location = useLocation();
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsubscribe();
  }, []);

  // Lock scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenu) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [mobileMenu]);

  // Close menu on location change
  useEffect(() => {
    setMobileMenu(false);
  }, [location.pathname]);

  const login = async () => {
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
    } catch (error: any) {
      if (error.code === 'auth/popup-closed-by-user') {
        console.log('Login popup closed by user');
      } else {
        console.error('Auth error:', error);
      }
    }
  };
  const logout = () => signOut(auth);

  const navItems = [
    { name: 'Home', path: '/', icon: <HomeIcon size={18} /> },
    { name: 'Tournaments', path: '/tournaments', icon: <Trophy size={18} /> },
    { name: 'Ranking', path: '/leaderboard', icon: <Users size={18} /> },
    { name: 'Roster', path: '/roster', icon: <Shield size={18} /> },
    { name: 'Recruitment', path: '/recruitment', icon: <Briefcase size={18} /> },
    { name: 'Management', path: '/management', icon: <LayoutDashboard size={18} /> },
    { name: 'About', path: '/about', icon: <Info size={18} /> },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/95 border-b border-gold/20 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        <Link 
          to="/" 
          className="orbitron text-xl font-black text-gold tracking-[0.1em] flex items-center gap-1"
          onClick={() => setMobileMenu(false)}
        >
          BTS<span className="text-neon-red">⚡</span>ESPORTS
        </Link>
        
        <div className="hidden lg:flex items-center gap-2">
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path} 
              className={`text-[11px] uppercase tracking-[0.1em] font-bold px-4 py-2 transition-all hover:text-gold hover:bg-gold/5 ${location.pathname === item.path ? 'text-gold bg-gold/10' : 'text-white/50'}`}
            >
              {item.name}
            </Link>
          ))}
          
          {user ? (
            <div className="flex items-center gap-4 ml-4">
               {user.email === 'editingvideo123456@gmail.com' && (
                 <Link to="/admin" className="text-[10px] font-black uppercase tracking-widest text-gold border border-gold/40 px-3 py-1 hover:bg-gold/10 transition-all">Control</Link>
               )}
               <Link 
                 to={`/profile/${user.uid}`} 
                 className="w-8 h-8 rounded-full border border-gold/40 p-0.5 hover:border-gold transition-all"
               >
                 <img 
                   src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} 
                   className="w-full h-full rounded-full object-cover"
                   alt="Profile"
                 />
               </Link>
               <button onClick={logout} className="text-[11px] text-white/50 hover:text-white uppercase font-bold tracking-widest transition-colors">Logout</button>
            </div>
          ) : (
            <button onClick={login} className="ml-4 bg-gold text-black text-[11px] font-black uppercase tracking-widest px-6 py-2 cyber-clip-sm hover:bg-gold-light transition-all">
              Sign In
            </button>
          )}
        </div>

        <button 
          className="lg:hidden text-gold z-50 relative p-2" 
          onClick={() => setMobileMenu(!mobileMenu)}
          aria-label="Toggle menu"
        >
          <motion.div
            animate={{ rotate: mobileMenu ? 90 : 0 }}
            transition={{ duration: 0.2 }}
          >
            {mobileMenu ? <X /> : <Menu />}
          </motion.div>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenu && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[40] lg:hidden"
          >
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/95 backdrop-blur-md"
              onClick={() => setMobileMenu(false)}
            />

            {/* Menu Content */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute inset-y-0 right-0 w-[80%] max-w-sm bg-dark-surface border-l border-gold/20 p-8 flex flex-col shadow-2xl overflow-y-auto"
            >
              <div className="mb-12 flex items-center justify-between">
                <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-white/30">Intelligence Hub</span>
                <span className="h-px flex-1 bg-gold/10 ml-4"></span>
              </div>

              <motion.div 
                className="flex flex-col gap-2"
                variants={{
                  show: {
                    transition: {
                      staggerChildren: 0.1
                    }
                  }
                }}
                initial="hidden"
                animate="show"
              >
                {navItems.map((item, idx) => (
                  <motion.div
                    key={item.path}
                    variants={{
                      hidden: { opacity: 0, x: 20 },
                      show: { opacity: 1, x: 0 }
                    }}
                  >
                    <Link 
                      to={item.path} 
                      onClick={() => setMobileMenu(false)}
                      className={`flex items-center gap-4 text-sm uppercase tracking-[0.2em] font-bold p-4 cyber-clip-sm transition-all group ${
                        location.pathname === item.path 
                        ? 'bg-gold/10 text-gold' 
                        : 'text-white/40 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <span className={`${location.pathname === item.path ? 'text-gold' : 'text-white/20 group-hover:text-gold'} transition-colors`}>
                        {item.icon}
                      </span>
                      {item.name}
                    </Link>
                  </motion.div>
                ))}

                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    show: { opacity: 1, y: 0 }
                  }}
                  className="mt-8 pt-8 border-t border-white/5"
                >
                  {user ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 px-4 mb-4">
                        <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center border border-gold/40 text-gold text-xs font-bold">
                          {user.displayName?.charAt(0) || user.email?.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-white uppercase truncate">{user.displayName || 'Agent'}</span>
                          <span className="text-[9px] text-white/30 truncate">{user.email}</span>
                        </div>
                      </div>
                      {user.email === 'editingvideo123456@gmail.com' && (
                        <Link 
                          to="/admin" 
                          onClick={() => setMobileMenu(false)}
                          className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-gold border border-gold/20 p-4 hover:bg-gold/10 transition-all"
                        >
                          <LayoutDashboard size={18} />
                          Control Panel
                        </Link>
                      )}
                      <button 
                        onClick={() => { logout(); setMobileMenu(false); }}
                        className="w-full flex items-center gap-4 text-[11px] text-white/40 hover:text-white uppercase font-bold tracking-widest p-4 transition-colors"
                      >
                        <LogIn size={18} className="rotate-180" />
                        Terminate Session
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => { login(); setMobileMenu(false); }}
                      className="w-full bg-gold text-black text-xs font-black uppercase tracking-widest p-4 cyber-clip-sm hover:bg-white transition-all flex items-center justify-center gap-3"
                    >
                      <LogIn size={18} />
                      Establish Auth
                    </button>
                  )}
                </motion.div>
              </motion.div>

              <div className="mt-auto pt-12">
                <div className="flex gap-4 justify-center">
                   <p className="text-[9px] text-white/20 uppercase tracking-[0.2em] font-bold italic">Building the next generation</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-bg-dark font-sans selection:bg-gold selection:text-black">
        <Navbar />
        <main className="flex-grow pt-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tournaments" element={<TournamentsPage />} />
            <Route path="/tournaments/:id/register" element={<RegistrationPage />} />
            <Route path="/scrims" element={<ScrimsPage />} />
            <Route path="/scrims/:id/register" element={<ScrimRegistrationPage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/roster" element={<RosterPage />} />
            <Route path="/squad" element={<SquadManagementPage />} />
            <Route path="/recruitment" element={<RecruitmentPage />} />
            <Route path="/management" element={<ManagementPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/profile/:id" element={<ProfilePage />} />
          </Routes>
        </main>
        
        <footer className="bg-dark-surface border-t border-gold/10 pt-16 pb-8 px-4 md:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
              <div>
                <Link to="/" className="orbitron text-xl font-black text-gold tracking-[0.1em] flex items-center gap-1 mb-6">
                  BTS<span className="text-neon-red">⚡</span>ESPORTS
                </Link>
                <p className="text-white/40 text-sm leading-relaxed mb-6">India's premier competitive gaming organization. Building the next generation of professional eSports talent.</p>
                <div className="text-[10px] text-white/30 uppercase tracking-widest font-bold">📍 India | 🎮 BGMI + More</div>
              </div>
              
              <div>
                <h4 className="text-gold text-[11px] font-black uppercase tracking-[0.2em] mb-6">Quick Links</h4>
                <ul className="space-y-4">
                   <li><Link to="/" className="text-white/40 hover:text-gold transition-colors text-sm">Home</Link></li>
                   <li><Link to="/tournaments" className="text-white/40 hover:text-gold transition-colors text-sm">Tournaments</Link></li>
                   <li><Link to="/leaderboard" className="text-white/40 hover:text-gold transition-colors text-sm">Rankings</Link></li>
                   <li><Link to="/roster" className="text-white/40 hover:text-gold transition-colors text-sm">Roster</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="text-gold text-[11px] font-black uppercase tracking-[0.2em] mb-6">Organization</h4>
                <ul className="space-y-4">
                   <li><Link to="/recruitment" className="text-white/40 hover:text-gold transition-colors text-sm">Recruitment</Link></li>
                   <li><Link to="/management" className="text-white/40 hover:text-gold transition-colors text-sm">Management</Link></li>
                   <li><Link to="/about" className="text-white/40 hover:text-gold transition-colors text-sm">About</Link></li>
                   <li><AdminLink /></li>
                </ul>
              </div>

              <div>
                <h4 className="text-gold text-[11px] font-black uppercase tracking-[0.2em] mb-6">Games</h4>
                <ul className="space-y-4">
                  <li className="text-white/40 text-sm">BGMI</li>
                  <li className="text-white/20 text-sm italic">Free Fire – Soon</li>
                  <li className="text-white/20 text-sm italic">Valorant – Soon</li>
                  <li className="text-white/20 text-sm italic">COD: Mobile – Soon</li>
                </ul>
              </div>
            </div>

            <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
              <p className="text-white/20 text-[10px] uppercase tracking-widest font-bold">© 2025 BTS eSports. All rights reserved.</p>
              <div className="flex gap-4">
                {[
                  { icon: '📸', label: 'Instagram' },
                  { icon: '▶', label: 'YouTube' },
                  { icon: '💬', label: 'Discord' },
                  { icon: '📱', label: 'WhatsApp' }
                ].map((social, i) => (
                  <button key={i} className="w-10 h-10 border border-gold/20 flex items-center justify-center text-white/50 hover:border-gold hover:text-gold transition-all">
                    {social.icon}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

const AdminLink = () => {
    const [user, setUser] = useState(auth.currentUser);
    useEffect(() => {
        return onAuthStateChanged(auth, (u) => setUser(u));
    }, []);
    if (user?.email === 'editingvideo123456@gmail.com') {
        return <Link to="/admin" className="text-white/40 hover:text-gold transition-colors text-sm">Admin Portal</Link>;
    }
    return <span className="text-white/20 text-sm italic">Member Access</span>;
}


