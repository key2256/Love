import * as React from 'react';
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  User, 
  Package, 
  FileText, 
  Settings, 
  ChevronRight, 
  LogOut,
  Camera,
  Shield,
  Bell,
  CreditCard,
  Heart
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';

interface MyPageProps {
  onNavigate: (view: 'drafts' | 'orders' | 'home') => void;
}

export default function MyPage({ onNavigate }: MyPageProps) {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({
    drafts: 0,
    orders: 0
  });

  useEffect(() => {
    if (!user) return;

    const fetchStats = async () => {
      try {
        const draftsQuery = query(collection(db, 'drafts'), where('userId', '==', user.uid));
        const ordersQuery = query(collection(db, 'orders'), where('userId', '==', user.uid));
        
        const [draftsSnap, ordersSnap] = await Promise.all([
          getDocs(draftsQuery),
          getDocs(ordersQuery)
        ]);

        setStats({
          drafts: draftsSnap.size,
          orders: ordersSnap.size
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, [user]);

  if (!user) return null;

  const menuItems = [
    {
      id: 'orders',
      title: '주문 내역',
      description: '최근 주문하신 내역을 확인하세요',
      icon: Package,
      color: 'bg-blue-50 text-blue-600',
      action: () => onNavigate('orders')
    },
    {
      id: 'drafts',
      title: '임시 저장함',
      description: '작업 중인 견적서가 보관되어 있습니다',
      icon: FileText,
      color: 'bg-emerald-50 text-emerald-600',
      action: () => onNavigate('drafts')
    },
    {
      id: 'wishlist',
      title: '관심 상품',
      description: '찜해둔 상품들을 모아보세요',
      icon: Heart,
      color: 'bg-rose-50 text-rose-600',
      action: () => {}
    },
    {
      id: 'payment',
      title: '결제 수단 관리',
      description: '등록된 카드 및 결제 정보를 관리합니다',
      icon: CreditCard,
      color: 'bg-amber-50 text-amber-600',
      action: () => {}
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Profile Header */}
      <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-xl shadow-zinc-200/50 border border-zinc-100 mb-8">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-zinc-50 shadow-inner bg-zinc-100 flex items-center justify-center">
              {user.photoURL ? (
                <img 
                  src={user.photoURL} 
                  alt={user.displayName || ''} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <User className="w-12 h-12 text-zinc-300" />
              )}
            </div>
            <button className="absolute bottom-0 right-0 p-2 bg-zinc-900 text-white rounded-full shadow-lg hover:bg-emerald-600 transition-colors">
              <Camera size={16} />
            </button>
          </div>

          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
              <h1 className="text-3xl font-black text-zinc-900">{user.displayName || '사용자'}</h1>
              <span className="px-3 py-1 bg-zinc-100 text-zinc-500 text-xs font-bold rounded-full uppercase tracking-wider">
                {user.providerData[0]?.providerId === 'google.com' ? 'Google' : user.uid.startsWith('naver_') ? 'Naver' : 'Email'}
              </span>
            </div>
            <p className="text-zinc-500 font-medium mb-6">{user.email}</p>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <button className="px-6 py-2 bg-zinc-900 text-white rounded-full text-sm font-bold hover:bg-emerald-600 transition-all active:scale-95">
                프로필 수정
              </button>
              <button 
                onClick={() => logout()}
                className="px-6 py-2 border-2 border-zinc-100 text-zinc-500 rounded-full text-sm font-bold hover:bg-zinc-50 hover:text-zinc-900 transition-all active:scale-95 flex items-center gap-2"
              >
                <LogOut size={16} />
                로그아웃
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
            <div className="bg-zinc-50 rounded-3xl p-6 text-center border border-zinc-100">
              <div className="text-2xl font-black text-zinc-900 mb-1">{stats.orders}</div>
              <div className="text-xs font-bold text-zinc-400 uppercase tracking-widest">주문건수</div>
            </div>
            <div className="bg-zinc-50 rounded-3xl p-6 text-center border border-zinc-100">
              <div className="text-2xl font-black text-zinc-900 mb-1">{stats.drafts}</div>
              <div className="text-xs font-bold text-zinc-400 uppercase tracking-widest">임시저장</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Menu */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={item.action}
            className="group bg-white p-6 rounded-[32px] border border-zinc-100 hover:border-zinc-900 hover:shadow-xl hover:shadow-zinc-200/50 transition-all text-left flex items-center gap-6"
          >
            <div className={`w-14 h-14 rounded-2xl ${item.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
              <item.icon size={24} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-zinc-900 mb-1">{item.title}</h3>
              <p className="text-xs text-zinc-500">{item.description}</p>
            </div>
            <ChevronRight className="text-zinc-300 group-hover:text-zinc-900 group-hover:translate-x-1 transition-all" size={20} />
          </button>
        ))}
      </div>

      {/* Settings Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-black text-zinc-900 px-4 mb-4">계정 설정</h2>
        <div className="bg-white rounded-[32px] border border-zinc-100 overflow-hidden">
          {[
            { icon: Bell, title: '알림 설정', desc: '주문 및 마케팅 알림 관리' },
            { icon: Shield, title: '보안 및 개인정보', desc: '비밀번호 변경 및 보안 설정' },
            { icon: Settings, title: '서비스 설정', desc: '기본 배송지 및 선호 설정' }
          ].map((setting, idx) => (
            <button
              key={idx}
              className={`w-full flex items-center gap-4 p-6 hover:bg-zinc-50 transition-colors ${
                idx !== 2 ? 'border-b border-zinc-50' : ''
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-500">
                <setting.icon size={20} />
              </div>
              <div className="flex-1 text-left">
                <h4 className="text-sm font-bold text-zinc-900">{setting.title}</h4>
                <p className="text-xs text-zinc-400">{setting.desc}</p>
              </div>
              <ChevronRight size={16} className="text-zinc-300" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
