import React from 'react';
import { FileText, HelpCircle, PhoneCall, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

interface TrustSectionProps {
  onNavigate: (view: 'home' | 'detail' | 'category' | 'guide' | 'inquiry' | 'custom_inquiry' | 'portfolio' | 'location') => void;
}

export const TrustSection = ({ onNavigate }: TrustSectionProps) => {
  const trustItems = [
    {
      icon: <FileText className="w-6 h-6" />,
      title: "제작 가이드",
      description: "처음 주문하시는 분들을 위한 파일 작업 가이드",
      link: "가이드 보기",
      view: 'guide' as const
    },
    {
      icon: <HelpCircle className="w-6 h-6" />,
      title: "자주 묻는 질문",
      description: "주문, 배송, 제작에 대해 궁금한 점을 해결하세요",
      link: "FAQ 바로가기",
      view: 'guide' as const // Assuming FAQ is in guide for now
    },
    {
      icon: <PhoneCall className="w-6 h-6" />,
      title: "1:1 문의",
      description: "전문 상담사가 친절하게 답변해 드립니다",
      link: "문의하기",
      view: 'inquiry' as const
    },
    {
      icon: <CheckCircle2 className="w-6 h-6" />,
      title: "품질 보증",
      description: "완두프린트만의 꼼꼼한 검수와 제작 공정",
      link: "자세히 보기",
      view: 'portfolio' as const // Or somewhere else
    }
  ];

  return (
    <section className="py-24 bg-white border-t border-zinc-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {trustItems.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              onClick={() => onNavigate(item.view)}
              className="p-8 rounded-2xl border border-zinc-100 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-500/5 transition-all group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <h3 className="text-lg font-bold text-zinc-900 mb-3">{item.title}</h3>
              <p className="text-sm text-zinc-500 mb-8 leading-loose tracking-wide">
                {item.description}
              </p>
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest group-hover:underline">
                {item.link} →
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
