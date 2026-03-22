import React from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Download, Printer, Send, FileText, CheckCircle2, Clock, AlertTriangle, ShoppingCart, Layers, Sparkles } from 'lucide-react';
import { Quotation, POSTCARD_MATERIALS, BUSINESS_CARD_MATERIALS } from '../types';

interface QuotationDocumentProps {
  quotation: Quotation;
  onBack: () => void;
  onInquiry: (quotation: Quotation) => void;
}

export const QuotationDocument: React.FC<QuotationDocumentProps> = ({ quotation, onBack, onInquiry }) => {
  const postcardPaper = POSTCARD_MATERIALS.find(m => `${m.name} ${m.weight}` === (quotation.options['용지 선택'] || quotation.options['용지']));
  const businessCardPaper = BUSINESS_CARD_MATERIALS.find(m => `${m.name} ${m.weight}` === (quotation.options['용지 선택'] || quotation.options['용지']));
  const selectedPaper = postcardPaper || businessCardPaper;

  const getAutoPrecautions = () => {
    const precautions = [];
    if (selectedPaper) {
      if (['골드시리오펄', '크라프트보드', '마제스틱마블화이트', '띤또레또'].includes(selectedPaper.name)) {
        precautions.push('코팅, 스코딕스 가공을 추천하지 않는 용지입니다.');
      }
      if (['백색모조', 'E-보드 Y04', '얼스팩'].includes(selectedPaper.name)) {
        precautions.push('재생지 및 특수지 특성상 색상 편차가 발생할 수 있습니다.');
      }
      if (selectedPaper.name === '띤또레또') {
        precautions.push('필기용 또는 시향지 용도로 부적합할 수 있으니 테스트를 권장합니다.');
      }
    }
    return precautions;
  };

  const autoPrecautions = getAutoPrecautions();

  return (
    <div className="min-h-screen bg-zinc-50 pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header Actions */}
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 transition-colors group"
          >
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-bold">이전으로</span>
          </button>
          <div className="flex gap-3">
            <button className="p-3 rounded-xl bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50 hover:border-zinc-300 transition-all shadow-sm active:scale-95">
              <Download className="w-5 h-5" />
            </button>
            <button className="p-3 rounded-xl bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50 hover:border-zinc-300 transition-all shadow-sm active:scale-95">
              <Printer className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Document Body */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[32px] shadow-2xl shadow-zinc-200/50 border border-zinc-100 overflow-hidden"
        >
          {/* Document Header */}
          <div className="p-12 border-b-4 border-emerald-600 bg-zinc-900 text-white flex justify-between items-start">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-3xl font-black tracking-tighter uppercase">Quotation</h1>
              </div>
              <div className="space-y-1">
                <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest">Quotation Number</p>
                <p className="text-xl font-black text-emerald-400 tracking-tight">{quotation.id}</p>
              </div>
            </div>
            <div className="text-right">
              <h2 className="text-2xl font-black mb-4">완두프린트</h2>
              <div className="text-sm text-zinc-400 space-y-1 font-medium">
                <p>서울특별시 중구 을지로 123</p>
                <p>T. 02-123-4567 | F. 02-123-4568</p>
                <p>E. help@wandooprint.com</p>
              </div>
            </div>
          </div>

          <div className="p-12 space-y-12">
            {/* Customer Info & Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-4">
                <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest">To. Customer</h3>
                <div className="p-8 rounded-[32px] bg-zinc-50/50 border border-zinc-100">
                  <p className="text-lg font-black text-zinc-900 mb-1">고객님 (귀하)</p>
                  <p className="text-sm text-zinc-500">견적 요청일: {new Date(quotation.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest">Summary</h3>
                <div className="p-8 rounded-[32px] bg-emerald-50/50 border border-emerald-100">
                  <p className="text-xs text-emerald-600 font-bold uppercase tracking-widest mb-1">Total Amount</p>
                  <p className="text-3xl font-black text-emerald-700 tracking-tight">
                    {quotation.totalPrice.toLocaleString()}원
                  </p>
                </div>
              </div>
            </div>

            {/* Reorganized Item Details */}
            <div className="space-y-8">
              <div className="flex items-center gap-2">
                <div className="w-1 h-4 bg-emerald-500 rounded-full" />
                <ShoppingCart className="w-4 h-4 text-zinc-400" />
                <h3 className="text-sm font-black text-zinc-900 uppercase tracking-tight">Item Details</h3>
              </div>
              
              <div className="grid grid-cols-1 gap-8">
                {/* 1. Product Info */}
                <div className="p-8 rounded-[32px] bg-zinc-50/50 border border-zinc-100">
                  <div className="flex items-center gap-2 mb-6">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">상품 정보</h4>
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-2xl font-black text-zinc-900">{quotation.productName}</p>
                      <p className="text-sm text-zinc-500 mt-1">수량: {quotation.quantity.toLocaleString()}개</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-zinc-400 font-bold">단가</p>
                      <p className="text-xl font-black text-zinc-900">{quotation.unitPrice.toLocaleString()}원</p>
                    </div>
                  </div>
                </div>

                {/* 2. Paper Info */}
                <div className="p-8 rounded-[32px] bg-white border border-zinc-100 shadow-sm">
                  <div className="flex items-center gap-2 mb-6">
                    <Layers className="w-4 h-4 text-emerald-500" />
                    <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">용지 정보</h4>
                  </div>
                  {selectedPaper ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <div>
                          <p className="text-xs text-zinc-400 font-bold mb-1">용지명 / 평량</p>
                          <p className="text-lg font-black text-zinc-900">{selectedPaper.name} {selectedPaper.weight}</p>
                        </div>
                        <div>
                          <p className="text-xs text-zinc-400 font-bold mb-1">용지군</p>
                          <span className="px-3 py-1 bg-zinc-100 rounded-full text-[10px] font-black text-zinc-600">
                            {selectedPaper.group}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <p className="text-xs text-zinc-400 font-bold mb-1">핵심 특징</p>
                          <p className="text-sm text-zinc-600 font-medium">{selectedPaper.features}</p>
                        </div>
                        <div>
                          <p className="text-xs text-zinc-400 font-bold mb-1">추천 용도</p>
                          <p className="text-sm text-emerald-600 font-bold">{selectedPaper.recommendedUse}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-zinc-500 font-bold">
                      {quotation.options['용지 선택'] || quotation.options['용지'] || '선택된 용지 정보가 없습니다.'}
                    </p>
                  )}
                </div>

                {/* 3. Print & Post-processing */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="p-8 rounded-[32px] bg-zinc-50/50 border border-zinc-100">
                    <div className="flex items-center gap-2 mb-6">
                      <Printer className="w-4 h-4 text-emerald-500" />
                      <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">인쇄 정보</h4>
                    </div>
                    <div className="space-y-2">
                      {Object.entries(quotation.options)
                        .filter(([key]) => key.includes('인쇄') || key.includes('도수'))
                        .map(([key, val]) => (
                          <div key={key} className="flex justify-between items-center">
                            <span className="text-xs text-zinc-500 font-bold">{key}</span>
                            <span className="text-sm font-black text-zinc-900">{val}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                  <div className="p-8 rounded-[32px] bg-zinc-50/50 border border-zinc-100">
                    <div className="flex items-center gap-2 mb-6">
                      <Sparkles className="w-4 h-4 text-emerald-500" />
                      <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">후가공 정보</h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {/* Business Card Specific Formatting */}
                      {quotation.options['코팅'] && quotation.options['코팅'] !== '없음' && (
                        <span className="px-3 py-1.5 bg-white border border-zinc-200 rounded-xl text-[10px] font-bold text-zinc-600">
                          코팅: {quotation.options['코팅']} / {quotation.options['코팅 면수']}
                        </span>
                      )}
                      {quotation.options['귀돌이'] === '있음' && (
                        <span className="px-3 py-1.5 bg-white border border-zinc-200 rounded-xl text-[10px] font-bold text-zinc-600">
                          귀돌이: {quotation.options['귀돌이 크기']} / {quotation.options['귀돌이 면수']} {quotation.options['귀돌이 면수'] === '1면' ? `/ ${quotation.options['귀돌이 방향']}` : ''}
                        </span>
                      )}
                      {quotation.options['타공'] === '있음' && (
                        <span className="px-3 py-1.5 bg-white border border-zinc-200 rounded-xl text-[10px] font-bold text-zinc-600">
                          타공: {quotation.options['타공 크기']} / {quotation.options['타공 설명']}
                        </span>
                      )}
                      {quotation.options['명함케이스'] && quotation.options['명함케이스'] !== '없음' && (
                        <span className="px-3 py-1.5 bg-white border border-zinc-200 rounded-xl text-[10px] font-bold text-zinc-600">
                          명함케이스: {quotation.options['명함케이스']}
                        </span>
                      )}
                      
                      {/* Standard Options (excluding those already handled) */}
                      {Object.entries(quotation.options)
                        .filter(([key]) => 
                          !key.includes('용지') && 
                          !key.includes('인쇄') && 
                          !key.includes('도수') && 
                          !key.includes('사이즈') && 
                          !key.includes('규격') &&
                          !['코팅', '코팅 면수', '귀돌이', '귀돌이 크기', '귀돌이 면수', '귀돌이 방향', '타공', '타공 크기', '타공 설명', '명함케이스'].includes(key)
                        )
                        .map(([key, val]) => (
                          <span key={key} className="px-3 py-1.5 bg-white border border-zinc-200 rounded-xl text-[10px] font-bold text-zinc-600">
                            {key}: {val}
                          </span>
                        ))}
                      {Object.entries(quotation.options).filter(([key]) => 
                        !key.includes('용지') && 
                        !key.includes('인쇄') && 
                        !key.includes('도수') && 
                        !key.includes('사이즈') && 
                        !key.includes('규격')
                      ).length === 0 && (
                        <span className="text-xs text-zinc-400 font-medium">선택된 후가공 옵션이 없습니다.</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Price Info */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <div className="w-1 h-4 bg-emerald-500 rounded-full" />
                <h3 className="text-sm font-black text-zinc-900 uppercase tracking-tight">Amount Details</h3>
              </div>
              <div className="overflow-hidden rounded-[32px] border border-zinc-100 shadow-xl shadow-zinc-200/50">
                <div className="p-10 bg-zinc-900 text-white flex justify-between items-center">
                  <span className="text-sm font-bold uppercase tracking-widest opacity-60">Total Amount (VAT Included)</span>
                  <span className="text-4xl font-black tracking-tighter text-emerald-400">
                    {quotation.totalPrice.toLocaleString()}원
                  </span>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-8 rounded-[32px] bg-zinc-50/50 border border-zinc-100 space-y-4">
                <div className="flex items-center gap-2 text-zinc-900 font-bold">
                  <Clock className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm">예상 제작 및 수령</span>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-zinc-500 leading-relaxed">
                    예상 제작기간: <span className="font-bold text-zinc-900">{quotation.leadTime}</span>
                  </p>
                  <p className="text-sm text-zinc-500 leading-relaxed">
                    예상 수령일: <span className="font-bold text-emerald-600">{quotation.estimatedDeliveryDate}</span>
                  </p>
                </div>
              </div>
              <div className="p-8 rounded-[32px] bg-zinc-50/50 border border-zinc-100 space-y-4">
                <div className="flex items-center gap-2 text-zinc-900 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm">견적 유효기간</span>
                </div>
                <p className="text-sm text-zinc-500 leading-relaxed">
                  본 견적서는 발행일로부터 <span className="font-bold text-zinc-900">7일간</span> 유효합니다. 
                </p>
              </div>
            </div>

            {/* Notice */}
            <div className="p-8 rounded-[32px] bg-amber-50/50 border border-amber-100 flex gap-6">
              <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shrink-0 shadow-sm">
                <AlertTriangle className="w-6 h-6 text-amber-600" />
              </div>
              <div className="space-y-2">
                <h4 className="font-black text-amber-900 text-sm">주의사항</h4>
                <ul className="text-xs text-amber-800/70 space-y-1 list-disc pl-4">
                  <li>모니터 색상(RGB)과 인쇄 색상(CMYK)은 차이가 있을 수 있습니다.</li>
                  <li>공정상 1~2mm의 재단 오차가 발생할 수 있습니다.</li>
                  {autoPrecautions.map((p, i) => (
                    <li key={i} className="font-bold text-amber-900">{p}</li>
                  ))}
                  <li>주문 제작 상품 특성상 제작 시작 후에는 취소 및 환불이 불가합니다.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Footer CTA */}
          <div className="p-12 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-bold text-zinc-900">위 견적 내용으로 제작을 진행하시겠습니까?</p>
              <p className="text-xs text-zinc-400">문의하기를 통해 작업 파일을 전달해 주시면 전문가가 검수를 도와드립니다.</p>
            </div>
            <button 
              onClick={() => onInquiry(quotation)}
              className="px-10 py-5 bg-emerald-600 text-white font-black rounded-2xl flex items-center gap-3 hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20 active:scale-[0.98] group"
            >
              <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              <span>견적 내용으로 문의하기</span>
            </button>
          </div>
        </motion.div>

        {/* Bottom Info */}
        <div className="mt-12 text-center text-xs text-zinc-400 font-medium">
          <p>© 2026 Wandoo Print. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};
