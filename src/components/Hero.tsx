import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, FileText, MessageSquare, ShoppingBag, BookOpen } from 'lucide-react';

interface HeroProps {
  onExplore: () => void;
  onNavigate: (view: 'home' | 'detail' | 'category' | 'guide' | 'inquiry' | 'custom_inquiry' | 'portfolio' | 'location' | 'usage_ordering') => void;
}

export const Hero: React.FC<HeroProps> = ({ onExplore, onNavigate }) => {
  return (
    <section className="relative pt-24 pb-12 lg:pt-48 lg:pb-32 overflow-hidden bg-zinc-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(#333_1px,transparent_1px)] [background-size:40px_40px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-3 py-1 lg:px-4 lg:py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] lg:text-sm font-bold mb-4 lg:mb-6 border border-emerald-500/20">
              1장부터 주문 가능한 소량 굿즈 제작
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-7xl font-black text-white mb-4 lg:mb-8 leading-[1.2] lg:leading-[1.1] tracking-tight">
              내 디자인으로 <br className="hidden sm:block" />
              <span className="text-emerald-400">세상에 하나뿐인</span> <br />
              굿즈를 만드세요
            </h1>
            <p className="text-sm sm:text-base lg:text-xl text-zinc-400 mb-8 lg:mb-12 leading-relaxed font-medium max-w-md">
              스티커, 지류, 아크릴 굿즈부터 패키지까지. <br className="hidden lg:block" />
              전문 디자이너가 아니어도 괜찮습니다. 완두프린트가 도와드릴게요.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 lg:gap-4">
              <button
                onClick={onExplore}
                className="w-full sm:w-auto px-6 lg:px-8 py-3.5 lg:py-4 bg-emerald-500 hover:bg-emerald-400 text-zinc-900 font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 group"
              >
                <ShoppingBag className="w-4 h-4 lg:w-5 lg:h-5" />
                상품 보러가기
                <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <div className="flex gap-2 w-full sm:w-auto">
                <button 
                  onClick={() => onNavigate('usage_ordering')}
                  className="flex-1 sm:flex-none px-4 lg:px-8 py-3.5 lg:py-4 bg-white hover:bg-zinc-100 text-zinc-900 font-bold rounded-xl transition-all flex items-center justify-center gap-2 text-sm lg:text-base"
                >
                  <BookOpen className="w-4 h-4 lg:w-5 lg:h-5" />
                  용도별
                </button>

                <button 
                  onClick={() => onNavigate('inquiry')}
                  className="flex-1 sm:flex-none px-4 lg:px-8 py-3.5 lg:py-4 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 border border-zinc-700 text-sm lg:text-base"
                >
                  <MessageSquare className="w-4 h-4 lg:w-5 lg:h-5" />
                  견적문의
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Floating Elements / Visuals */}
      <div className="hidden lg:block absolute top-1/2 right-0 -translate-y-1/2 w-1/3 h-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
          animate={{ opacity: 1, scale: 1, rotate: -5 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative w-full h-full flex items-center justify-center"
        >
          <div className="w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl absolute" />
          <div className="grid grid-cols-2 gap-4 relative">
            <div className="w-48 h-64 bg-zinc-800 rounded-2xl border border-white/10 shadow-2xl rotate-6 -translate-y-8 overflow-hidden">
               <img src="https://picsum.photos/seed/sticker/400/600" alt="Sticker Example" className="w-full h-full object-cover opacity-80" referrerPolicy="no-referrer" />
            </div>
            <div className="w-48 h-64 bg-zinc-800 rounded-2xl border border-white/10 shadow-2xl -rotate-6 translate-y-8 overflow-hidden">
               <img src="https://picsum.photos/seed/goods/400/600" alt="Goods Example" className="w-full h-full object-cover opacity-80" referrerPolicy="no-referrer" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
