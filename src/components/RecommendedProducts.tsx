import React, { useEffect, useState } from 'react';
import { Product } from '../types';
import { getRecommendations } from '../services/recommendationService';
import { useAuth } from '../hooks/useAuth';
import { ProductCard } from './ProductCard';
import { PRODUCTS } from '../types';

interface RecommendedProductsProps {
  onProductClick: (id: string) => void;
}

export const RecommendedProducts: React.FC<RecommendedProductsProps> = ({ onProductClick }) => {
  const { user } = useAuth();
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      const recommendations = await getRecommendations(user?.uid, PRODUCTS);
      setRecommendedProducts(recommendations);
    };
    fetchRecommendations();
  }, [user?.uid]);

  if (recommendedProducts.length === 0) return null;

  return (
    <section className="py-16">
      <h2 className="text-3xl font-black mb-8">당신을 위한 추천 상품</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {recommendedProducts.map(product => (
          <ProductCard key={product.id} product={product} onClick={() => onProductClick(product.id)} onAddToCart={() => {}} />
        ))}
      </div>
    </section>
  );
};
