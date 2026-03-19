import React from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Download, Printer, Send, FileText, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import { Quotation } from '../types';

interface QuotationDocumentProps {
  quotation: Quotation;
  onBack: () => void;
  onInquiry: (quotation: Quotation) => void;
}

export const QuotationDocument: React.FC<QuotationDocumentProps> = ({ quotation, onBack, onInquiry }) => {
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
            <button className="p-3 rounded-xl bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50 transition-colors shadow-sm">
              <Download className="w-5 h-5" />
            </button>
            <button className="p-3 rounded-xl bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50 transition-colors shadow-sm">
              <Printer className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Document Body */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[40px] shadow-2xl shadow-zinc-200/50 border border-zinc-100 overflow-hidden"
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
            {/* Customer Info */}
            <div className="grid grid-cols-2 gap-12">
              <div className="space-y-4">
                <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest">To. Customer</h3>
                <div className="p-6 rounded-2xl bg-zinc-50 border border-zinc-100">
                  <p className="text-lg font-black text-zinc-900 mb-1">고객님 (귀하)</p>
                  <p className="text-sm text-zinc-500">견적 요청일: {new Date(quotation.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest">Summary</h3>
                <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-100">
                  <p className="text-xs text-emerald-600 font-bold uppercase tracking-widest mb-1">Total Amount</p>
                  <p className="text-3xl font-black text-emerald-700 tracking-tight">
                    {quotation.totalPrice.toLocaleString()}원
                  </p>
                </div>
              </div>
            </div>

            {/* Item Details */}
            <div className="space-y-6">
              <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest">Item Details</h3>
              <div className="overflow-hidden rounded-2xl border border-zinc-100">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-zinc-50 border-b border-zinc-100">
                      <th className="px-6 py-4 text-xs font-black text-zinc-500 uppercase tracking-widest">품명 및 옵션</th>
                      <th className="px-6 py-4 text-xs font-black text-zinc-500 uppercase tracking-widest text-center">수량</th>
                      <th className="px-6 py-4 text-xs font-black text-zinc-500 uppercase tracking-widest text-right">단가</th>
                      <th className="px-6 py-4 text-xs font-black text-zinc-500 uppercase tracking-widest text-right">금액</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-50">
                    <tr>
                      <td className="px-6 py-8">
                        <p className="text-lg font-black text-zinc-900 mb-2">{quotation.productName}</p>
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(quotation.options).map(([key, val]) => (
                            <span key={key} className="px-2 py-1 bg-zinc-100 rounded-md text-[10px] font-bold text-zinc-500">
                              {key}: {val}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-8 text-center font-black text-zinc-900">
                        {quotation.quantity.toLocaleString()}
                      </td>
                      <td className="px-6 py-8 text-right font-black text-zinc-900">
                        {quotation.unitPrice.toLocaleString()}원
                      </td>
                      <td className="px-6 py-8 text-right font-black text-zinc-900">
                        {quotation.totalPrice.toLocaleString()}원
                      </td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr className="bg-zinc-900 text-white">
                      <td colSpan={3} className="px-6 py-6 text-right font-bold uppercase tracking-widest text-xs">Total (VAT Included)</td>
                      <td className="px-6 py-6 text-right text-2xl font-black tracking-tight text-emerald-400">
                        {quotation.totalPrice.toLocaleString()}원
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-2 gap-8">
              <div className="p-8 rounded-3xl bg-zinc-50 border border-zinc-100 space-y-4">
                <div className="flex items-center gap-2 text-zinc-900 font-bold">
                  <Clock className="w-4 h-4 text-emerald-600" />
                  <span>예상 제작기간</span>
                </div>
                <p className="text-sm text-zinc-500 leading-relaxed">
                  본 견적의 예상 제작기간은 <span className="font-bold text-zinc-900">{quotation.leadTime}</span>입니다. 
                  파일 검수 및 결제 완료 시점부터 제작이 시작됩니다.
                </p>
              </div>
              <div className="p-8 rounded-3xl bg-zinc-50 border border-zinc-100 space-y-4">
                <div className="flex items-center gap-2 text-zinc-900 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>견적 유효기간</span>
                </div>
                <p className="text-sm text-zinc-500 leading-relaxed">
                  본 견적서는 발행일로부터 <span className="font-bold text-zinc-900">7일간</span> 유효합니다. 
                  이후에는 원자재 가격 변동에 따라 견적이 변경될 수 있습니다.
                </p>
              </div>
            </div>

            {/* Notice */}
            <div className="p-8 rounded-3xl bg-amber-50 border border-amber-100 flex gap-6">
              <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shrink-0 shadow-sm">
                <AlertTriangle className="w-6 h-6 text-amber-600" />
              </div>
              <div className="space-y-2">
                <h4 className="font-black text-amber-900">주의사항</h4>
                <ul className="text-xs text-amber-800/70 space-y-1 list-disc pl-4">
                  <li>모니터 색상(RGB)과 인쇄 색상(CMYK)은 차이가 있을 수 있습니다.</li>
                  <li>공정상 1~2mm의 재단 오차가 발생할 수 있습니다.</li>
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
              className="px-10 py-5 bg-emerald-600 text-white font-black rounded-2xl flex items-center gap-3 hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20 active:scale-[0.98]"
            >
              <Send className="w-5 h-5" />
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
