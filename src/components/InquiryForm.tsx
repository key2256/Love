import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Send, Upload, X, FileText, User, Mail, Phone, MessageSquare, CheckCircle2 } from 'lucide-react';
import { Quotation } from '../types';

interface InquiryFormProps {
  quotation?: Quotation;
  onClose: () => void;
}

export const InquiryForm: React.FC<InquiryFormProps> = ({ quotation, onClose }) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: quotation 
      ? `[견적 정보]\n품명: ${quotation.productName}\n수량: ${quotation.quantity.toLocaleString()}개\n옵션: ${Object.entries(quotation.options).map(([k, v]) => `${k}: ${v}`).join(', ')}\n총 금액: ${quotation.totalPrice.toLocaleString()}원\n\n[문의 내용]\n`
      : ''
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call
    setTimeout(() => {
      setIsSubmitted(true);
    }, 1000);
  };

  if (isSubmitted) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-[40px] p-12 max-w-md w-full text-center shadow-2xl"
        >
          <div className="w-20 h-20 rounded-3xl bg-emerald-100 flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
          </div>
          <h2 className="text-3xl font-black text-zinc-900 mb-4 tracking-tighter">문의가 접수되었습니다!</h2>
          <p className="text-zinc-500 font-medium mb-10 leading-relaxed">
            담당자가 내용을 검토한 후<br />
            빠른 시일 내에 연락드리겠습니다.
          </p>
          <button 
            onClick={onClose}
            className="w-full py-5 bg-zinc-900 text-white font-black rounded-2xl hover:bg-zinc-800 transition-all active:scale-[0.98]"
          >
            확인
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-sm overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[40px] w-full max-w-2xl shadow-2xl overflow-hidden my-8"
      >
        <div className="p-8 border-b border-zinc-100 flex items-center justify-between bg-zinc-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-black tracking-tighter uppercase">Inquiry</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                <User className="w-3 h-3" /> 성함 / 업체명
              </label>
              <input 
                required
                type="text"
                value={formData.name}
                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-6 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
                placeholder="홍길동"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                <Mail className="w-3 h-3" /> 이메일
              </label>
              <input 
                required
                type="email"
                value={formData.email}
                onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-6 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
                placeholder="example@email.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
              <Phone className="w-3 h-3" /> 연락처
            </label>
            <input 
              required
              type="tel"
              value={formData.phone}
              onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              className="w-full px-6 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
              placeholder="010-0000-0000"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
              <FileText className="w-3 h-3" /> 문의 내용
            </label>
            <textarea 
              required
              rows={6}
              value={formData.message}
              onChange={e => setFormData(prev => ({ ...prev, message: e.target.value }))}
              className="w-full px-6 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium resize-none"
              placeholder="제작하시려는 상품에 대해 자세히 적어주세요."
            />
          </div>

          {/* File Upload */}
          <div className="space-y-4">
            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
              <Upload className="w-3 h-3" /> 파일 첨부 (작업 가이드 확인 필수)
            </label>
            <div className="relative">
              <input 
                type="file"
                multiple
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="p-8 border-2 border-dashed border-zinc-200 rounded-3xl bg-zinc-50 flex flex-col items-center justify-center gap-3 group-hover:border-emerald-500 transition-colors">
                <Upload className="w-8 h-8 text-zinc-300 group-hover:text-emerald-500 transition-colors" />
                <p className="text-sm text-zinc-500 font-medium">파일을 드래그하거나 클릭하여 업로드하세요.</p>
                <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">AI, PDF, PSD, JPG (Max 50MB)</p>
              </div>
            </div>

            {files.length > 0 && (
              <div className="grid grid-cols-1 gap-2">
                {files.map((file, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-zinc-50 border border-zinc-100 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center border border-zinc-100">
                        <FileText className="w-4 h-4 text-zinc-400" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-zinc-900 truncate max-w-[200px]">{file.name}</p>
                        <p className="text-[10px] text-zinc-400 font-bold uppercase">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                    <button 
                      type="button"
                      onClick={() => removeFile(i)}
                      className="p-2 hover:bg-zinc-200 rounded-lg transition-colors text-zinc-400"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button 
            type="submit"
            className="w-full py-6 bg-emerald-600 text-white font-black rounded-2xl flex items-center justify-center gap-3 hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20 active:scale-[0.98]"
          >
            <Send className="w-5 h-5" />
            <span>문의하기 접수</span>
          </button>
        </form>
      </motion.div>
    </div>
  );
};
