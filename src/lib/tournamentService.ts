import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  Timestamp,
  doc,
  getDoc
} from 'firebase/firestore';
import { db, handleFirestoreError } from './firebase';

export interface Tournament {
  id?: string;
  title: string;
  game: 'BGMI' | 'Free Fire' | 'COD';
  status: 'upcoming' | 'ongoing' | 'completed';
  type: 'Solo' | 'Duo' | 'Squad';
  fee: string;
  prizePool: string;
  startDate: string;
  description: string;
  imageUrl?: string;
}

export interface Registration {
  id?: string;
  tournamentId: string;
  teamName: string;
  captainName: string;
  captainDiscord: string;
  captainEmail: string;
  phoneNumber?: string;
  players: string[];
  game: string;
  createdAt: any;
}

const TOURNAMENTS_COLLECTION = 'tournaments';
const REGISTRATIONS_COLLECTION = 'registrations';

export const tournamentService = {
  async getAllTournaments() {
    try {
      const q = query(collection(db, TOURNAMENTS_COLLECTION), orderBy('startDate', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Tournament));
    } catch (error) {
      handleFirestoreError(error, 'list', TOURNAMENTS_COLLECTION);
    }
  },

  async getTournamentById(id: string) {
    try {
      const docRef = doc(db, TOURNAMENTS_COLLECTION, id);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        return { id: snapshot.id, ...snapshot.data() } as Tournament;
      }
      return null;
    } catch (error) {
      handleFirestoreError(error, 'get', `${TOURNAMENTS_COLLECTION}/${id}`);
    }
  },

  async registerTeam(registration: Omit<Registration, 'id' | 'createdAt'>) {
    try {
      const docRef = await addDoc(collection(db, REGISTRATIONS_COLLECTION), {
        ...registration,
        createdAt: Timestamp.now()
      });
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, 'create', REGISTRATIONS_COLLECTION);
    }
  },

  async addTournament(tournament: Omit<Tournament, 'id'>) {
    try {
      const docRef = await addDoc(collection(db, TOURNAMENTS_COLLECTION), tournament);
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, 'create', TOURNAMENTS_COLLECTION);
    }
  },

  async getRegistrationsByTournament(tournamentId: string) {
    try {
      const q = query(collection(db, REGISTRATIONS_COLLECTION), where('tournamentId', '==', tournamentId));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Registration));
    } catch (error) {
      handleFirestoreError(error, 'list', REGISTRATIONS_COLLECTION);
    }
  }
};
