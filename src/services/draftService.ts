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
import { db, handleFirestoreError, OperationType } from '../lib/firebase';

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

  const path = 'drafts';
  try {
    if (draftId) {
      const draftRef = doc(db, path, draftId);
      await updateDoc(draftRef, draftData);
      return draftId;
    } else {
      const draftsRef = collection(db, path);
      const docRef = await addDoc(draftsRef, {
        ...draftData,
        createdAt: serverTimestamp()
      });
      return docRef.id;
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};

export const getDrafts = async (userId: string): Promise<Draft[]> => {
  const path = 'drafts';
  try {
    const draftsRef = collection(db, path);
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
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return []; // Should not reach here as handleFirestoreError throws
  }
};

export const deleteDraft = async (draftId: string) => {
  const path = 'drafts';
  try {
    const draftRef = doc(db, path, draftId);
    await deleteDoc(draftRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
};
