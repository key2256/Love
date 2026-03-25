import React from 'react';
import { getIconForCategory } from '../lib/icons';

interface FooterProps {
  onNavigate: (view: any) => void;
  onLogoClick: () => void;
}

export const Footer = ({ onNavigate, onLogoClick }: FooterProps) => {
  return (
    <footer className="bg-zinc-50 border-t border-zinc-100 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <button 
              onClick={onLogoClick}
              className="text-2xl font-black tracking-tighter text-emerald-600 mb-6 hover:opacity-80 transition-opacity"
            >
              WANDOO<span className="text-zinc-900">PRINT</span>
            </button>
            <p className="text-sm text-zinc-500 leading-relaxed">
              세상의 모든 아이디어를 굿즈로 만듭니다.<br />
              완두프린트는 당신의 창작 활동을 응원합니다.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-zinc-900 mb-6">제작 서비스</h4>
            <ul className="space-y-3 text-sm text-zinc-500">
              <li>스티커 제작</li>
              <li>지류/명함</li>
              <li>패키지 박스</li>
              <li>아크릴/굿즈</li>
              <li>커스텀 대량 주문</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-zinc-900 mb-6 flex items-center gap-2">
              {React.createElement(getIconForCategory('calendar'), { size: 16 })}
              고객 지원
            </h4>
            <ul className="space-y-3 text-sm text-zinc-500">
              <li><button onClick={() => onNavigate('guide')} className="hover:text-zinc-900 transition-colors">제작 가이드</button></li>
              <li><button onClick={() => onNavigate('faq')} className="hover:text-zinc-900 transition-colors">자주 묻는 질문</button></li>
              <li>공지사항</li>
              <li><button onClick={() => onNavigate('location')} className="hover:text-zinc-900 transition-colors">오시는 길</button></li>
              <li>이용약관</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-zinc-900 mb-6 flex items-center gap-2">
              {React.createElement(getIconForCategory('contact'), { size: 16 })}
              Contact
            </h4>
            <div className="text-sm text-zinc-500 space-y-3">
              <p>평일 10:00 - 18:00 (점심 12:30 - 13:30)</p>
              <p className="text-lg font-black text-zinc-900">1588-0000</p>
              <p>help@wandooprint.com</p>
              <p className="text-[10px] text-zinc-400 mt-4 leading-relaxed">
                (주)완두프린트 | 대표자: 홍길동 | 사업자등록번호: 123-45-67890<br />
                통신판매업신고: 제 2026-서울강남-01234호 | 서울특별시 강남구 테헤란로 123
              </p>
            </div>
          </div>
        </div>
        
        <div className="pt-8 border-t border-zinc-200 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] text-zinc-400 uppercase tracking-widest">
          <p>© 2026 WANDOO PRINT & GOODS. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-6">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Cookie Settings</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
