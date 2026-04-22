export interface PlayerProfile {
  id: string;
  uid: string;
  displayName: string;
  username: string;
  bio: string;
  avatarUrl: string;
  coverUrl: string;
  role: string; // e.g., "Assaulter", "Sniper", "IGL"
  game: string; // e.g., "BGMI", "Valorant"
  socials: {
    instagram?: string;
    twitter?: string;
    discord?: string;
    youtube?: string;
  };
  stats: {
    kdr: number;
    headshotPercentage: number;
    matchesPlayed: number;
    wins: number;
  };
  achievements: {
    id: string;
    title: string;
    date: string;
    description: string;
  }[];
  tournamentHistory: {
    id: string;
    tournamentName: string;
    rank: string;
    prize: string;
    date: string;
  }[];
  createdAt: any;
  updatedAt: any;
}
