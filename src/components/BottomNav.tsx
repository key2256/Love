import React from 'react';
import { Home, Search, ShoppingCart, User } from 'lucide-react';

interface BottomNavProps {
  onNavigate: (view: any) => void;
  onCartClick: () => void;
  onProfileClick: () => void;
  onHomeClick: () => void;
  onSearchClick: () => void;
  cartCount: number;
}

export const BottomNav = ({ onNavigate, onCartClick, onProfileClick, onHomeClick, onSearchClick, cartCount }: BottomNavProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-zinc-100 lg:hidden flex justify-around items-center h-16 shadow-lg">
      <button onClick={onHomeClick} className="flex flex-col items-center justify-center gap-1 text-zinc-600 hover:text-emerald-600 transition-colors">
        <Home size={20} />
        <span className="text-[10px] font-bold">홈</span>
      </button>
      <button onClick={onSearchClick} className="flex flex-col items-center justify-center gap-1 text-zinc-600 hover:text-emerald-600 transition-colors">
        <Search size={20} />
        <span className="text-[10px] font-bold">검색</span>
      </button>
      <button onClick={onCartClick} className="flex flex-col items-center justify-center gap-1 text-zinc-600 hover:text-emerald-600 transition-colors relative">
        <ShoppingCart size={20} />
        <span className="text-[10px] font-bold">장바구니</span>
        {cartCount > 0 && (
            <span className="absolute top-0 right-2 w-4 h-4 bg-emerald-500 text-zinc-900 text-[10px] flex items-center justify-center rounded-full font-bold">
              {cartCount}
            </span>
        )}
      </button>
      <button onClick={onProfileClick} className="flex flex-col items-center justify-center gap-1 text-zinc-600 hover:text-emerald-600 transition-colors">
        <User size={20} />
        <span className="text-[10px] font-bold">마이</span>
      </button>
    </div>
  );
};
