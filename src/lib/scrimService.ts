import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy,
  doc,
  getDoc,
  updateDoc,
  increment
} from 'firebase/firestore';
import { db, handleFirestoreError } from './firebase';

export interface Scrim {
  id?: string;
  title: string;
  game: 'BGMI' | 'Free Fire' | 'COD';
  time: string;
  slotsTotal: number;
  slotsFilled: number;
  fee: string;
  status: 'open' | 'closed';
}

export interface ScrimRegistration {
  id?: string;
  scrimId: string;
  teamName: string;
  captainName: string;
  captainDiscord: string;
  captainEmail: string;
  phoneNumber?: string;
  game: string;
  createdAt: any;
}

const SCRIMS_COLLECTION = 'scrims';
const SCRIM_REGISTRATIONS_COLLECTION = 'scrim_registrations';

export const scrimService = {
  async getAllScrims() {
    try {
      const q = query(collection(db, SCRIMS_COLLECTION), orderBy('time', 'asc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Scrim));
    } catch (error) {
      handleFirestoreError(error, 'list', SCRIMS_COLLECTION);
    }
  },

  async getScrimById(id: string) {
    try {
      const docRef = doc(db, SCRIMS_COLLECTION, id);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        return { id: snapshot.id, ...snapshot.data() } as Scrim;
      }
      return null;
    } catch (error) {
      handleFirestoreError(error, 'get', `${SCRIMS_COLLECTION}/${id}`);
    }
  },

  async addScrim(scrim: Omit<Scrim, 'id' | 'slotsFilled'>) {
    try {
      const docRef = await addDoc(collection(db, SCRIMS_COLLECTION), {
        ...scrim,
        slotsFilled: 0
      });
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, 'create', SCRIMS_COLLECTION);
    }
  },

  async registerForScrim(registration: Omit<ScrimRegistration, 'id' | 'createdAt'>) {
    try {
      // 1. Add registration record
      const docRef = await addDoc(collection(db, SCRIM_REGISTRATIONS_COLLECTION), {
        ...registration,
        createdAt: new Date().toISOString()
      });

      // 2. Increment slotsFilled
      const scrimRef = doc(db, SCRIMS_COLLECTION, registration.scrimId);
      await updateDoc(scrimRef, {
        slotsFilled: increment(1)
      });

      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, 'create', SCRIM_REGISTRATIONS_COLLECTION);
    }
  },

  async bookSlot(scrimId: string) {
    try {
      const docRef = doc(db, SCRIMS_COLLECTION, scrimId);
      await updateDoc(docRef, {
        slotsFilled: increment(1)
      });
    } catch (error) {
      handleFirestoreError(error, 'update', `${SCRIMS_COLLECTION}/${scrimId}`);
    }
  }
};
