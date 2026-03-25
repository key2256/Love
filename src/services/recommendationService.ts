import { collection, addDoc, query, where, getDocs, serverTimestamp, orderBy, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Product } from '../types';

export const trackView = async (userId: string | undefined, productId: string) => {
  if (!userId) return;
  try {
    await addDoc(collection(db, 'userViews'), {
      userId,
      productId,
      viewedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error tracking view:', error);
  }
};

export const getRecommendations = async (userId: string | undefined, allProducts: Product[]): Promise<Product[]> => {
  if (!userId) return [];

  try {
    // 1. Get viewed products
    const viewsQuery = query(collection(db, 'userViews'), where('userId', '==', userId), orderBy('viewedAt', 'desc'), limit(20));
    const viewsSnapshot = await getDocs(viewsQuery);
    const viewedProductIds = new Set(viewsSnapshot.docs.map(doc => doc.data().productId));

    // 2. Get purchased products
    const ordersQuery = query(collection(db, 'orders'), where('userId', '==', userId));
    const ordersSnapshot = await getDocs(ordersQuery);
    const purchasedProductIds = new Set<string>();
    ordersSnapshot.docs.forEach(doc => {
      doc.data().items.forEach((item: any) => purchasedProductIds.add(item.product.id));
    });

    // 3. Score products
    const scores = new Map<string, number>();
    
    // Get categories of interest
    const categoriesOfInterest = new Set<string>();
    allProducts.forEach(p => {
      if (viewedProductIds.has(p.id)) categoriesOfInterest.add(p.category);
      if (purchasedProductIds.has(p.id)) categoriesOfInterest.add(p.category);
    });

    allProducts.forEach(p => {
      if (viewedProductIds.has(p.id) || purchasedProductIds.has(p.id)) return; // Skip already viewed/purchased

      let score = 0;
      if (categoriesOfInterest.has(p.category)) score += 1;
      // Add more sophisticated scoring if needed
      
      if (score > 0) scores.set(p.id, score);
    });

    // 4. Return top recommendations
    return allProducts
      .filter(p => scores.has(p.id))
      .sort((a, b) => (scores.get(b.id) || 0) - (scores.get(a.id) || 0))
      .slice(0, 4);

  } catch (error) {
    console.error('Error getting recommendations:', error);
    return [];
  }
};
