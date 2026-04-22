import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  query, 
  where, 
  getDocs,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';
import { PlayerProfile } from '../types';

const COLLECTION = 'profiles';

export const profileService = {
  async getProfile(uid: string): Promise<PlayerProfile | null> {
    const docRef = doc(db, COLLECTION, uid);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as PlayerProfile;
    }
    return null;
  },

  async createProfile(profile: Partial<PlayerProfile>): Promise<void> {
    if (!profile.uid) throw new Error('UID is required');
    const docRef = doc(db, COLLECTION, profile.uid);
    await setDoc(docRef, {
      ...profile,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  },

  async updateProfile(uid: string, data: Partial<PlayerProfile>): Promise<void> {
    const docRef = doc(db, COLLECTION, uid);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  },

  async getProfileByUsername(username: string): Promise<PlayerProfile | null> {
    const q = query(collection(db, COLLECTION), where('username', '==', username));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() } as PlayerProfile;
    }
    return null;
  }
};
