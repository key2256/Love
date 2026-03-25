import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, User, ArrowRight, Github, Chrome, MessageCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'sonner';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup' | 'reset';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'login' }) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'reset'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signInWithEmail, signUpWithEmail, resetPassword, signInWithNaver } = useAuth();

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Validate origin is from AI Studio preview or localhost
      const origin = event.origin;
      if (!origin.endsWith('.run.app') && !origin.includes('localhost')) {
        return;
      }

      if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
        if (event.data.provider === 'naver') {
          signInWithNaver(event.data.user);
          onClose();
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [signInWithNaver, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === 'login') {
        await signInWithEmail(email, password);
        onClose();
      } else if (mode === 'signup') {
        await signUpWithEmail(email, password, name);
        onClose();
      } else if (mode === 'reset') {
        await resetPassword(email);
        setMode('login');
      }
    } catch (error) {
      // Errors are handled in useAuth
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'naver' | 'kakao') => {
    if (provider === 'google') {
      await signIn();
      onClose();
    } else if (provider === 'naver') {
      try {
        const response = await fetch('/api/auth/naver/url');
        if (!response.ok) throw new Error('Failed to get Naver auth URL');
        const { url } = await response.json();
        
        window.open(url, 'naver_login', 'width=600,height=700');
      } catch (error) {
        console.error('Naver login error:', error);
        toast.error('네이버 로그인 창을 열 수 없습니다.');
      }
    } else {
      toast.info(`${provider.charAt(0).toUpperCase() + provider.slice(1)} 로그인은 현재 준비 중입니다.`);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-white rounded-[40px] shadow-2xl overflow-hidden"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full hover:bg-zinc-100 text-zinc-400 hover:text-zinc-900 transition-all z-10"
          >
            <X size={24} />
          </button>

          <div className="p-8 md:p-12">
            {/* Header */}
            <div className="text-center mb-10">
              <h2 className="text-3xl font-black text-zinc-900 mb-3 tracking-tight">
                {mode === 'login' ? '반가워요!' : mode === 'signup' ? '환영합니다!' : '비밀번호 찾기'}
              </h2>
              <p className="text-zinc-500 font-medium">
                {mode === 'login' 
                  ? '완두프린트의 다양한 서비스를 이용해보세요.' 
                  : mode === 'signup' 
                    ? '간단한 정보 입력으로 시작해보세요.' 
                    : '가입하신 이메일 주소를 입력해주세요.'}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-emerald-500 transition-colors" size={20} />
                  <input
                    type="text"
                    placeholder="이름"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all"
                  />
                </div>
              )}

              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-emerald-500 transition-colors" size={20} />
                <input
                  type="email"
                  placeholder="이메일 주소"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all"
                />
              </div>

              {mode !== 'reset' && (
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-emerald-500 transition-colors" size={20} />
                  <input
                    type="password"
                    placeholder="비밀번호"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all"
                  />
                </div>
              )}

              {mode === 'login' && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setMode('reset')}
                    className="text-xs font-bold text-zinc-400 hover:text-emerald-600 transition-colors"
                  >
                    비밀번호를 잊으셨나요?
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-5 rounded-2xl bg-zinc-900 text-white font-black text-sm hover:bg-emerald-600 transition-all shadow-xl shadow-zinc-200 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    {mode === 'login' ? '로그인' : mode === 'signup' ? '회원가입' : '비밀번호 재설정 메일 발송'}
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-10">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-100"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-4 text-zinc-400 font-bold tracking-widest">또는</span>
              </div>
            </div>

            {/* Social Logins */}
            <div className="grid grid-cols-3 gap-4">
              <button
                onClick={() => handleSocialLogin('google')}
                className="flex items-center justify-center p-4 rounded-2xl bg-white border border-zinc-100 hover:bg-zinc-50 transition-all shadow-sm group"
                title="Google 로그인"
              >
                <Chrome size={20} className="text-zinc-600 group-hover:text-emerald-600 transition-colors" />
              </button>
              <button
                onClick={() => handleSocialLogin('naver')}
                className="flex items-center justify-center p-4 rounded-2xl bg-[#03C75A] hover:bg-[#02b351] transition-all shadow-sm group"
                title="Naver 로그인"
              >
                <span className="text-white font-black text-lg">N</span>
              </button>
              <button
                onClick={() => handleSocialLogin('kakao')}
                className="flex items-center justify-center p-4 rounded-2xl bg-[#FEE500] hover:bg-[#fada00] transition-all shadow-sm group"
                title="Kakao 로그인"
              >
                <MessageCircle size={20} className="text-[#3C1E1E] fill-[#3C1E1E]" />
              </button>
            </div>

            {/* Footer */}
            <div className="mt-10 text-center">
              <p className="text-sm text-zinc-500 font-medium">
                {mode === 'login' ? (
                  <>
                    아직 회원이 아니신가요?{' '}
                    <button
                      onClick={() => setMode('signup')}
                      className="text-emerald-600 font-bold hover:underline"
                    >
                      회원가입
                    </button>
                  </>
                ) : (
                  <>
                    이미 계정이 있으신가요?{' '}
                    <button
                      onClick={() => setMode('login')}
                      className="text-emerald-600 font-bold hover:underline"
                    >
                      로그인
                    </button>
                  </>
                )}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
