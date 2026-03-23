import React from 'react';
import { FileText } from 'lucide-react';
import { Product } from '../../types';
import { QuantitySection } from './shared/QuantitySection';
import { SummarySection } from './shared/SummarySection';
import { FileUploadSection } from './shared/FileUploadSection';
import { getNoteGroup } from './constants';

interface NoteCalculatorProps {
  product: Product;
  selectedOptions: Record<string, any>;
  handleOptionChange: (name: string, value: string) => void;
  quantity: number;
  setQuantity: (qty: number | ((prev: number) => number)) => void;
  unitPrice: number;
  discountRate: number;
  estimatedDeliveryDate: string;
  totalPrice: number;
}

export const NoteCalculator: React.FC<NoteCalculatorProps> = ({
  product,
  selectedOptions,
  handleOptionChange,
  quantity,
  setQuantity,
  unitPrice,
  discountRate,
  estimatedDeliveryDate,
  totalPrice
}) => {
  const springOrder = ['규격', '표지 구성', '표지 코팅', '내지 종류', '내지 색상', '내지 장수', '스프링 방향', '스프링 색상'];
  const leatherOrder = ['규격', '커버 스타일', '커버 인쇄', '엣지 마감', '내지 종류', '내지 색상', '내지 장수'];
  const saddleOrder = ['규격', '표지 구성', '표지 코팅', '내지 종류', '내지 색상', '페이지 수', '제본 안내'];
  const order = product.id === 'note-spring' ? springOrder : product.id === 'note-saddle' ? saddleOrder : leatherOrder;

  const filteredOptions = (product.id === 'note-saddle' ? [...product.options, { name: '제본 안내', type: 'radio', values: [] }] : product.options)
    .filter(opt => {
      const normalizedName = opt.name.replace(/\s/g, '');
      const noteExclusions = ['제작수량', '수량', '주문수량'];
      if (noteExclusions.includes(normalizedName)) return false;
      
      const generalExclusions = [
        '재단방식', '코팅유무', '후가공옵션', '후가공', '화이트인쇄', '넘버링', '스코딕스', '포장옵션', 
        '부분UV', '모양코팅', '표지코팅', '코팅방식', '코팅', '코팅면수', '귀돌이', '귀돌이크기', '귀돌이면수', '귀돌이방향',
        '타공', '타공크기', '타공설명', '오시', '오시줄수', '오시설명', '미싱', '미싱줄수', '미싱설명',
        '접지', '접지방향', '접지형태', '폴리백개별포장', '폴리백사이즈', '명함케이스',
        '후가공효과', '후가공선택', '모양커팅',
        '낱장 접착', '측면 인쇄', '엣지디자인', '거치대', '케이스'
      ];
      
      if (generalExclusions.includes(normalizedName)) {
        if (normalizedName === '표지코팅' || normalizedName === '커버인쇄' || normalizedName === '엣지마감') {
          // Keep these for Note
        } else {
          return false;
        }
      }

      if (opt.visibleIf) {
        const parentVal = selectedOptions[opt.visibleIf.optionName];
        if (parentVal !== opt.visibleIf.value) return false;
      }

      return true;
    })
    .sort((a, b) => order.indexOf(a.name) - order.indexOf(b.name));

  return (
    <div className="space-y-10">
      <QuantitySection product={product} quantity={quantity} setQuantity={setQuantity} />

      {/* Note Specification Info */}
      <div className="p-8 rounded-[32px] bg-zinc-900 text-white space-y-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[80px] rounded-full -mr-32 -mt-32" />
        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="text-lg font-black tracking-tight">기본 사양 안내</h4>
            <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-[0.2em]">Default Specifications</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5 text-zinc-400" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-zinc-500 mb-1 uppercase tracking-widest">표지 용지</p>
              <p className="text-sm font-black text-white leading-tight">
                {product.id === 'note-spring' ? '아트지 300g' : product.id === 'note-saddle' ? '스노우 250g' : '고급 인조가죽 커버'}
              </p>
              <p className="text-[10px] text-zinc-500 mt-1 leading-relaxed">
                {product.id === 'note-spring' ? '두툼하고 부드러운 질감' : product.id === 'note-saddle' ? '가볍고 유연한 표지' : '고급스러운 질감과 내구성'}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5 text-zinc-400" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-zinc-500 mb-1 uppercase tracking-widest">내지 용지</p>
              <p className="text-sm font-black text-white leading-tight">
                {product.id === 'note-spring' ? '백색 모조 80g' : product.id === 'note-saddle' ? '백색 모조 100g' : '미색 모조 100g'}
              </p>
              <p className="text-[10px] text-zinc-500 mt-1 leading-relaxed">
                비침이 적고 필기감이 부드러운 용지
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Options Section */}
      <div className="space-y-8">
        {filteredOptions.map((option, index, array) => (
          <div key={option.name} className="space-y-4">
            {(() => {
              const currentGroup = getNoteGroup(option.name);
              const prevOption = array[index - 1];
              const prevGroup = prevOption ? getNoteGroup(prevOption.name) : null;
              
              if (currentGroup && currentGroup !== prevGroup) {
                if (product.id === 'note-saddle' && (currentGroup === '후가공 선택' || currentGroup === '제본/마감')) return null;
                return (
                  <div className="pt-12 pb-6 flex items-center gap-4">
                    <div className="h-px flex-1 bg-zinc-100" />
                    <span className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.3em] whitespace-nowrap bg-white px-4">
                      {currentGroup}
                    </span>
                    <div className="h-px flex-1 bg-zinc-100" />
                  </div>
                );
              }
              return null;
            })()}

            <div className="flex items-center gap-2">
              <div className="w-1 h-4 bg-emerald-500 rounded-full" />
              <label className="text-sm font-black text-zinc-900 uppercase tracking-tight">
                {option.name}
              </label>
            </div>

            {option.name === '제본 안내' ? (
              <div className="p-6 rounded-3xl bg-zinc-50 border border-zinc-100 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white border border-zinc-200 flex items-center justify-center shadow-sm">
                  <FileText className="w-6 h-6 text-zinc-400" />
                </div>
                <div>
                  <p className="text-sm font-black text-zinc-900">중앙 스테이플 제본</p>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5">Fixed Specification</p>
                  <p className="text-[10px] text-zinc-500 mt-1 leading-relaxed">
                    실제본과 유사한 깔끔한 마감으로<br />
                    페이지 펼침성이 매우 우수한 제본 방식입니다.
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {option.values?.map((val) => {
                  const isSelected = selectedOptions[option.name] === val.label;
                  return (
                    <button
                      key={val.label}
                      onClick={() => handleOptionChange(option.name, val.label)}
                      className={`py-4 px-6 rounded-2xl text-xs font-bold border transition-all text-center flex flex-col items-center justify-center gap-1 ${
                        isSelected
                          ? 'bg-zinc-900 border-zinc-900 text-white shadow-xl shadow-zinc-900/20 scale-[1.02]'
                          : 'bg-white border-zinc-100 text-zinc-500 hover:border-emerald-200'
                      }`}
                    >
                      <span>{val.label}</span>
                      {val.priceModifier !== undefined && val.priceModifier !== 0 && (
                        <span className={`text-[10px] opacity-70 ${isSelected ? 'text-zinc-400' : 'text-zinc-400'}`}>
                          {val.priceModifier > 0 ? `+${val.priceModifier.toLocaleString()}원` : `${val.priceModifier.toLocaleString()}원`}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      <FileUploadSection />

      <SummarySection 
        product={product}
        selectedOptions={selectedOptions}
        pattern="NOTE"
        customSize={{ width: '', height: '' }}
        unitPrice={unitPrice}
        discountRate={discountRate}
        estimatedDeliveryDate={estimatedDeliveryDate}
        totalPrice={totalPrice}
      />
    </div>
  );
};
