import { Product, CartItem } from '../types';

export const createDefaultCartItem = (product: Product): CartItem => {
  const defaultOptions: Record<string, string> = {};
  
  product.options.forEach(option => {
    if (option.values && option.values.length > 0) {
      defaultOptions[option.name] = option.values[0].label;
    } else if (option.type === 'number') {
      defaultOptions[option.name] = '1';
    } else if (option.type === 'text') {
      defaultOptions[option.name] = '';
    }
  });

  return {
    id: `${product.id}-${Date.now()}`,
    product,
    options: defaultOptions,
    quantity: product.minQuantity,
    unitPrice: product.basePrice,
    totalPrice: product.basePrice * product.minQuantity
  };
};
