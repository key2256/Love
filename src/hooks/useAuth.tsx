import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from '../lib/firebase';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  signInWithNaver: (naverUser: any) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Ensure user document exists in Firestore
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (!userDoc.exists()) {
            await setDoc(userDocRef, {
              uid: firebaseUser.uid,
              name: firebaseUser.displayName || 'Anonymous',
              email: firebaseUser.email || '',
              role: 'user'
            });
          }
          setUser(firebaseUser);
        } catch (error) {
          console.error('Error syncing user data:', error);
          handleFirestoreError(error, OperationType.GET, `users/${firebaseUser.uid}`);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast.success('성공적으로 로그인되었습니다.');
    } catch (error: any) {
      console.error('Sign in error:', error);
      if (error.code === 'auth/popup-closed-by-user') {
        toast.error('로그인 팝업이 닫혔습니다. 다시 시도해주세요.');
      } else {
        toast.error('로그인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      }
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      toast.success('성공적으로 로그인되었습니다.');
    } catch (error: any) {
      console.error('Email sign in error:', error);
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        toast.error('이메일 또는 비밀번호가 올바르지 않습니다.');
      } else {
        toast.error('로그인 중 오류가 발생했습니다.');
      }
      throw error;
    }
  };

  const signUpWithEmail = async (email: string, pass: string, name: string) => {
    try {
      const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, pass);
      await updateProfile(firebaseUser, { displayName: name });
      
      // Sync with Firestore
      const userDocRef = doc(db, 'users', firebaseUser.uid);
      await setDoc(userDocRef, {
        uid: firebaseUser.uid,
        name: name,
        email: email,
        role: 'user'
      });
      
      toast.success('회원가입이 완료되었습니다.');
    } catch (error: any) {
      console.error('Email sign up error:', error);
      if (error.code === 'auth/email-already-in-use') {
        toast.error('이미 사용 중인 이메일입니다.');
      } else {
        toast.error('회원가입 중 오류가 발생했습니다.');
      }
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success('비밀번호 재설정 이메일이 발송되었습니다.');
    } catch (error: any) {
      console.error('Password reset error:', error);
      if (error.code === 'auth/user-not-found') {
        toast.error('해당 이메일로 가입된 사용자가 없습니다.');
      } else {
        toast.error('비밀번호 재설정 이메일 발송 중 오류가 발생했습니다.');
      }
      throw error;
    }
  };

  const signInWithNaver = async (naverUser: any) => {
    try {
      // Sync with Firestore using Naver ID as UID
      const userDocRef = doc(db, 'users', `naver_${naverUser.id}`);
      const userDoc = await getDoc(userDocRef);
      
      const userData = {
        uid: `naver_${naverUser.id}`,
        name: naverUser.name || naverUser.nickname || 'Naver User',
        email: naverUser.email || '',
        photoURL: naverUser.profile_image || '',
        provider: 'naver',
        role: 'user'
      };

      if (!userDoc.exists()) {
        await setDoc(userDocRef, userData);
      } else {
        await setDoc(userDocRef, userData, { merge: true });
      }

      // Manually set user state since this isn't a Firebase Auth user
      // In a real app, you'd use Firebase Custom Token
      setUser({
        uid: userData.uid,
        email: userData.email,
        displayName: userData.name,
        photoURL: userData.photoURL,
        emailVerified: true,
        isAnonymous: false,
        metadata: {},
        providerData: [],
        refreshToken: '',
        tenantId: null,
        delete: async () => {},
        getIdToken: async () => '',
        getIdTokenResult: async () => ({} as any),
        reload: async () => {},
        toJSON: () => ({})
      } as any);
      
      toast.success('네이버 계정으로 로그인되었습니다.');
    } catch (error) {
      console.error('Naver sync error:', error);
      toast.error('네이버 로그인 처리 중 오류가 발생했습니다.');
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      toast.success('로그아웃되었습니다.');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('로그아웃 중 오류가 발생했습니다.');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signInWithEmail, signUpWithEmail, resetPassword, signInWithNaver, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
