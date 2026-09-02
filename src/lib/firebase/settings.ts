import { doc, getDoc } from 'firebase/firestore';
import { db } from './config';

export async function getSetting(id: string) {
  try {
    const docRef = doc(db, 'settings', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  } catch (error) {
    console.error(`Error fetching setting ${id}:`, error);
    return null;
  }
}
