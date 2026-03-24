import React, { useState } from 'react';
import { Share2, Link, Facebook, MessageCircle, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SocialShareProps {
  title: string;
  url?: string;
  className?: string;
}

export const SocialShare: React.FC<SocialShareProps> = ({ title, url, className = "" }) => {
  const [showOptions, setShowOptions] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = url || window.location.href;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const shareToFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  const shareToKakao = () => {
    // In a real app, you'd use Kakao SDK. For now, we'll use a generic share link if available or just a placeholder
    // Kakao doesn't have a simple URL share like FB/Twitter without SDK for full features, 
    // but we can use the story share or just a placeholder for this demo.
    alert('카카오톡 공유 기능은 실제 서비스에서 Kakao SDK 연동이 필요합니다.');
  };

  return (
    <div className={`relative ${className}`} onClick={(e) => e.stopPropagation()}>
      <button
        onClick={() => setShowOptions(!showOptions)}
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-100 text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900 transition-all font-bold text-xs uppercase tracking-widest"
      >
        <Share2 className="w-4 h-4" />
        공유하기
      </button>

      <AnimatePresence>
        {showOptions && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowOptions(false)}
              className="fixed inset-0 z-40"
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute bottom-full mb-4 left-0 z-50 bg-white rounded-3xl shadow-2xl shadow-zinc-200/50 border border-zinc-100 p-3 flex gap-2 min-w-[200px]"
            >
              <button
                onClick={handleCopyLink}
                className="flex-1 flex flex-col items-center gap-2 p-3 rounded-2xl hover:bg-zinc-50 transition-colors group"
                title="링크 복사"
              >
                <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-600 group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-colors">
                  {copied ? <Check className="w-5 h-5" /> : <Link className="w-5 h-5" />}
                </div>
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                  {copied ? '복사됨' : '링크 복사'}
                </span>
              </button>

              <button
                onClick={shareToKakao}
                className="flex-1 flex flex-col items-center gap-2 p-3 rounded-2xl hover:bg-zinc-50 transition-colors group"
                title="카카오톡 공유"
              >
                <div className="w-10 h-10 rounded-full bg-[#FEE500] flex items-center justify-center text-[#3C1E1E] group-hover:opacity-80 transition-opacity">
                  <MessageCircle className="w-5 h-5 fill-current" />
                </div>
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">카카오톡</span>
              </button>

              <button
                onClick={shareToFacebook}
                className="flex-1 flex flex-col items-center gap-2 p-3 rounded-2xl hover:bg-zinc-50 transition-colors group"
                title="페이스북 공유"
              >
                <div className="w-10 h-10 rounded-full bg-[#1877F2] flex items-center justify-center text-white group-hover:opacity-80 transition-opacity">
                  <Facebook className="w-5 h-5 fill-current" />
                </div>
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">페이스북</span>
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
