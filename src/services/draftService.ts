import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  getDocs, 
  serverTimestamp,
  orderBy,
  Timestamp
} from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface Draft {
  id: string;
  userId: string;
  productId: string;
  productName: string;
  options: Record<string, any>;
  quantity: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface SaveDraftParams {
  userId: string;
  productId: string;
  productName: string;
  options: Record<string, any>;
  quantity: number;
  draftId?: string;
}

export const saveDraft = async ({
  userId,
  productId,
  productName,
  options,
  quantity,
  draftId
}: SaveDraftParams) => {
  const draftData = {
    userId,
    productId,
    productName,
    options,
    quantity,
    updatedAt: serverTimestamp()
  };

  if (draftId) {
    const draftRef = doc(db, 'drafts', draftId);
    await updateDoc(draftRef, draftData);
    return draftId;
  } else {
    const draftsRef = collection(db, 'drafts');
    const docRef = await addDoc(draftsRef, {
      ...draftData,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  }
};

export const getDrafts = async (userId: string): Promise<Draft[]> => {
  const draftsRef = collection(db, 'drafts');
  const q = query(
    draftsRef, 
    where('userId', '==', userId),
    orderBy('updatedAt', 'desc')
  );
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Draft));
};

export const deleteDraft = async (draftId: string) => {
  const draftRef = doc(db, 'drafts', draftId);
  await deleteDoc(draftRef);
};
