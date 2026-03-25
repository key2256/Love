import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shapes, 
  Layers, 
  Scissors, 
  Droplets, 
  Paintbrush, 
  FileUp, 
  ShoppingCart, 
  Package,
  CheckCircle2,
  Sparkles,
  Info
} from 'lucide-react';
import { Product } from '../../../types';
import { 
  FOLDING_DIRECTION_ICONS, 
  FOLDING_TYPE_ICONS, 
  SHAPE_ICONS,
  PRODUCT_CONFIG 
} from './constants';
import { TermTooltip } from '../../UXComponents';

const POST_TERM_TOOLTIPS: Record<string, { description: string; imageUrl?: string }> = {
  '모양커팅': {
    description: '원하는 모양대로 칼선을 내어 자르는 가공입니다. 자유로운 형태의 스티커나 엽서 제작 시 사용합니다.',
    imageUrl: 'https://picsum.photos/seed/shape/400/250'
  },
  '코팅': {
    description: '인쇄물 표면에 얇은 필름을 입혀 내구성을 높이고 광택을 조절하는 가공입니다. 유광/무광 선택이 가능합니다.',
    imageUrl: 'https://picsum.photos/seed/coating/400/250'
  },
  '귀돌이': {
    description: '명함의 모서리를 둥글게 깎는 가공입니다. 부드러운 인상을 주며 모서리 마모를 방지합니다.',
    imageUrl: 'https://picsum.photos/seed/corner/400/250'
  },
  '타공': {
    description: '종이에 구멍을 뚫는 가공입니다. 택(Tag)이나 고리를 걸 때 사용합니다.',
    imageUrl: 'https://picsum.photos/seed/hole/400/250'
  },
  '오시': {
    description: '종이가 잘 접히도록 누름 자국을 내는 가공입니다. 두꺼운 종이가 터지는 것을 방지합니다.',
    imageUrl: 'https://picsum.photos/seed/crease/400/250'
  },
  '미싱': {
    description: '손으로 쉽게 뜯을 수 있도록 점선 모양의 구멍을 내는 가공입니다. 쿠폰이나 티켓에 주로 사용됩니다.',
    imageUrl: 'https://picsum.photos/seed/perforation/400/250'
  },
  '접지': {
    description: '인쇄물을 일정한 형태로 접는 가공입니다. 리플렛이나 안내문 제작 시 필수적인 단계입니다.',
    imageUrl: 'https://picsum.photos/seed/fold/400/250'
  },
  '화이트 인쇄': {
    description: '투명지나 유색지에 흰색 잉크를 먼저 인쇄하여 색상을 선명하게 표현하는 기법입니다.',
    imageUrl: 'https://picsum.photos/seed/white/400/250'
  }
};

interface PostProcessingSectionProps {
  product: Product;
  selectedOptions: Record<string, string>;
  handleOptionChange: (name: string, value: string) => void;
  pattern: string;
  expandedPostOption: string | null;
  setExpandedPostOption: (option: string | null) => void;
  materialOptionName?: string;
  isTemplateProduct?: boolean;
  selectedBusinessCardGroup?: string;
}

export const PostProcessingSection: React.FC<PostProcessingSectionProps> = ({
  product,
  selectedOptions,
  handleOptionChange,
  pattern,
  expandedPostOption,
  setExpandedPostOption,
  materialOptionName,
  isTemplateProduct,
  selectedBusinessCardGroup
}) => {
  const getPriceLabel = (optionName: string, valueLabel: string) => {
    const option = product.options.find(o => o.name === optionName);
    const value = option?.values.find(v => v.label === valueLabel);
    if (!value || !value.priceModifier || value.priceModifier === 0) return '';
    return ` (+${value.priceModifier.toLocaleString()}원)`;
  };

  const renderOptionButtons = (optionName: string, currentVal: string, onChange: (val: string) => void, columns: number = 2) => {
    const option = product.options.find(o => o.name === optionName);
    if (!option || !option.values) return null;

    return (
      <div className={`grid gap-2 grid-cols-${columns}`}>
        {option.values.map(v => (
          <button
            key={v.label}
            onClick={() => onChange(v.label)}
            className={`py-3 px-2 rounded-xl text-[11px] font-bold border transition-all flex flex-col items-center justify-center gap-1 ${
              currentVal === v.label
                ? 'bg-zinc-900 border-zinc-900 text-white shadow-md'
                : 'bg-white border-zinc-200 text-zinc-500 hover:border-emerald-200'
            }`}
          >
            <span>{v.label}</span>
            {v.priceModifier && v.priceModifier !== 0 && (
              <span className={`text-[9px] ${currentVal === v.label ? 'text-emerald-300' : 'text-emerald-600'}`}>
                +{v.priceModifier.toLocaleString()}원
              </span>
            )}
          </button>
        ))}
      </div>
    );
  };

  const config = PRODUCT_CONFIG[product.id];
  const isTemplate = !!isTemplateProduct;

  const postOptions = [
    { 
      id: 'shape-cutting', 
      name: '모양커팅', 
      icon: <Shapes className="w-5 h-5" />, 
      active: true, 
      hidden: !config?.allowedPostProcessing?.includes('모양커팅') || isTemplate || product.id === 'stk-postcard-standard'
    },
    { 
      id: 'coating', 
      name: '코팅', 
      icon: <Layers className="w-5 h-5" />, 
      active: selectedOptions['코팅'] !== '없음' && selectedOptions['코팅'] !== undefined, 
      hidden: !config?.allowedPostProcessing?.includes('코팅') || 
              (pattern === 'FOLDED_BUSINESS_CARD' && selectedBusinessCardGroup !== '기본 대중형'),
      disabled: pattern === 'FOLDED_BUSINESS_CARD' && selectedBusinessCardGroup !== '기본 대중형',
      warningMessage: pattern === 'FOLDED_BUSINESS_CARD' && selectedBusinessCardGroup !== '기본 대중형' 
                      ? '고급 감성형 용지는 코팅을 지원하지 않습니다.' : undefined
    },
    { 
      id: 'rounding', 
      name: '귀돌이', 
      icon: <Scissors className="w-5 h-5" />, 
      active: selectedOptions['귀돌이'] === '있음',
      hidden: !config?.allowedPostProcessing?.includes('귀돌이')
    },
    { 
      id: 'punching', 
      name: '타공', 
      icon: <Droplets className="w-5 h-5" />, 
      active: selectedOptions['타공'] === '있음', 
      hidden: !config?.allowedPostProcessing?.includes('타공')
    },
    { 
      id: 'creasing', 
      name: '오시', 
      icon: <Paintbrush className="w-5 h-5" />, 
      active: selectedOptions['오시'] === '있음', 
      hidden: !config?.allowedPostProcessing?.includes('오시') || isTemplate
    },
    { 
      id: 'perforation', 
      name: '미싱', 
      icon: <Scissors className="w-5 h-5" />, 
      active: selectedOptions['미싱'] === '있음', 
      hidden: !config?.allowedPostProcessing?.includes('미싱') || isTemplate
    },
    { 
      id: 'folding', 
      name: '접지', 
      icon: <FileUp className="w-5 h-5" />, 
      active: true, 
      hidden: !config?.allowedPostProcessing?.includes('접지') || isTemplate || product.id === 'stk-postcard-standard',
      isBasicInclusion: pattern === 'FOLDED_BUSINESS_CARD'
    },
    { 
      id: 'packaging', 
      name: '포장', 
      icon: <ShoppingCart className="w-5 h-5" />, 
      active: selectedOptions['폴리백 개별포장'] === '있음' || selectedOptions['폴리백 개별 포장'] === '있음', 
      hidden: (!config?.allowedPostProcessing?.includes('폴리백 개별포장') && !config?.allowedPostProcessing?.includes('폴리백 개별 포장')) || isTemplate
    },
    { 
      id: 'white-printing', 
      name: '화이트 인쇄', 
      icon: <Paintbrush className="w-5 h-5" />, 
      active: selectedOptions['화이트 인쇄'] === '있음', 
      hidden: !config?.allowedPostProcessing?.includes('화이트 인쇄') || 
              (materialOptionName ? selectedOptions[materialOptionName] !== '투명/PET' : (selectedOptions['재질'] !== '투명/PET' && selectedOptions['용지'] !== '투명/PET')) || isTemplate || product.id === 'stk-postcard-standard'
    },
    { 
      id: 'special-effects', 
      name: '특수 효과', 
      icon: <Sparkles className="w-5 h-5" />, 
      active: selectedOptions['후가공 옵션'] !== '없음' && selectedOptions['후가공 옵션'] !== undefined, 
      hidden: !config?.allowedPostProcessing?.includes('후가공 옵션') || isTemplate || product.id === 'stk-postcard-standard' || product.id === 'stk-postcard-shape' || product.id === 'stk-postcard-premium'
    },
    { 
      id: 'case', 
      name: '케이스', 
      icon: <Package className="w-5 h-5" />, 
      active: selectedOptions['명함케이스'] !== '없음' && selectedOptions['명함케이스'] !== undefined, 
      hidden: !config?.allowedPostProcessing?.includes('명함케이스')
    }
  ].filter(item => {
    if (pattern === 'BUSINESS_CARD' && product.id === 'bc-standard') {
      return ['코팅', '코팅 종류', '귀돌이', '타공', '케이스'].includes(item.name);
    }
    if (pattern === 'FOLDED_BUSINESS_CARD') {
      return ['코팅', '귀돌이', '타공', '오시', '접지', '특수 효과', '케이스'].includes(item.name);
    }
    return !item.hidden;
  });

  return (
    <div className="space-y-6 pt-4 border-t border-zinc-100">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-1 h-4 bg-emerald-500 rounded-full" />
          <label className="text-sm font-black text-zinc-900 uppercase tracking-tight">
            후가공 선택
          </label>
        </div>
        {pattern === 'FOLDED_BUSINESS_CARD' && (
          <div className="px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-full">
            접지 가공 기본 포함
          </div>
        )}
        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
          아이콘을 클릭하여 상세 옵션 선택
        </span>
      </div>

      <div className="bg-zinc-50/50 rounded-[32px] p-6 border border-zinc-100 space-y-6">
        <div className="grid grid-cols-4 gap-3">
          {postOptions.map(item => {
            const isExpanded = expandedPostOption === item.id;
            return (
              <div
                key={item.id}
                onClick={() => setExpandedPostOption(isExpanded ? null : item.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setExpandedPostOption(isExpanded ? null : item.id);
                  }
                }}
                role="button"
                tabIndex={0}
                className={`flex flex-col items-center gap-2 group transition-all cursor-pointer outline-none ${
                  isExpanded ? 'scale-110' : 'hover:scale-105'
                }`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-sm ${
                  isExpanded 
                    ? 'bg-emerald-600 text-white shadow-emerald-600/20' 
                    : item.active
                      ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                      : 'bg-white text-zinc-400 border border-zinc-100 group-hover:border-zinc-300'
                }`}>
                  {item.icon}
                </div>
                <div className="flex items-center gap-1">
                  <span className={`text-[10px] font-black whitespace-nowrap transition-colors ${
                    isExpanded ? 'text-emerald-600' : item.active ? 'text-zinc-900' : 'text-zinc-400'
                  }`}>
                    {item.name}
                  </span>
                  {(item as any).required && (
                    <span className="text-[10px] font-black text-red-500 ml-0.5">*</span>
                  )}
                  {POST_TERM_TOOLTIPS[item.name] && (
                    <TermTooltip 
                      term={item.name} 
                      description={POST_TERM_TOOLTIPS[item.name].description} 
                      imageUrl={POST_TERM_TOOLTIPS[item.name].imageUrl}
                    >
                      <span className="sr-only">정보</span>
                    </TermTooltip>
                  )}
                </div>
                {(item as any).warningMessage && (
                  <span className="text-[9px] text-red-500 font-bold mt-1 text-center">
                    { (item as any).warningMessage }
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          {expandedPostOption === 'shape-cutting' && (
            <motion.div
              key="shape-cutting"
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-4 border-t border-zinc-200/50 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-zinc-900 uppercase tracking-widest">모양커팅 상세 설정</h4>
                  <button onClick={() => setExpandedPostOption(null)} className="text-[10px] font-bold text-zinc-400 hover:text-zinc-600">닫기</button>
                </div>
                <div className="space-y-4">
                  {product.id === 'stk-postcard-shape' ? (
                    <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span className="text-xs font-bold text-emerald-900">기본 포함 항목</span>
                      </div>
                      <p className="text-[11px] text-emerald-700 leading-relaxed">
                        모양 엽서는 모양커팅 가공이 기본 포함됩니다.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-2">
                        {product.options.find(o => o.name === '모양커팅')?.values.map((v, index) => (
                          <button
                            key={v.label + index}
                            onClick={() => handleOptionChange('모양커팅', v.label)}
                            className={`py-3 rounded-xl text-[11px] font-bold border transition-all ${
                              selectedOptions['모양커팅'] === v.label
                                ? 'bg-zinc-900 border-zinc-900 text-white shadow-md'
                                : 'bg-white border-zinc-200 text-zinc-500 hover:border-emerald-200'
                            }`}
                          >
                            {v.label}{getPriceLabel('모양커팅', v.label)}
                          </button>
                        ))}
                      </div>
                      {selectedOptions['모양커팅'] === '있음' && (
                        <div className="space-y-3 animate-in fade-in slide-in-from-top-1">
                          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">모양 선택</span>
                          <div className="grid grid-cols-4 gap-2">
                            {product.options.find(o => o.name === '모양커팅 형태')?.values.map((v, index) => (
                              <div key={v.label + index} className="flex flex-col items-center gap-2">
                                <button
                                  onClick={() => handleOptionChange('모양커팅 형태', v.label)}
                                  className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center transition-all ${
                                    selectedOptions['모양커팅 형태'] === v.label
                                      ? 'bg-emerald-500 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)] scale-110'
                                      : 'bg-zinc-50 border-zinc-100 hover:border-zinc-200'
                                  }`}
                                >
                                  <div className={`transition-colors ${selectedOptions['모양커팅 형태'] === v.label ? 'text-white' : 'text-zinc-900'}`}>
                                    {SHAPE_ICONS[v.label] || <Shapes className="w-6 h-6" />}
                                  </div>
                                </button>
                                <span className={`text-[9px] font-bold transition-colors text-center leading-tight ${selectedOptions['모양커팅 형태'] === v.label ? 'text-emerald-700' : 'text-zinc-500'}`}>
                                  {v.label}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {expandedPostOption === 'coating' && (
            <motion.div
              key="coating"
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-4 border-t border-zinc-200/50 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-zinc-900 uppercase tracking-widest">코팅 상세 설정</h4>
                  <button onClick={() => setExpandedPostOption(null)} className="text-[10px] font-bold text-zinc-400 hover:text-zinc-600">닫기</button>
                </div>
                <div className="space-y-4">
                  {(() => {
                    const coatingOption = product.options.find(o => o.name === '코팅');
                    if (!coatingOption) return null;
                    return (
                      <div className={`grid gap-2 ${coatingOption.values && coatingOption.values.length > 3 ? 'grid-cols-2' : 'grid-cols-3'}`}>
                        {coatingOption.values?.map((v, index) => (
                          <button
                            key={v.label + index}
                            onClick={() => {
                              handleOptionChange('코팅', v.label);
                              if (v.label === '없음') handleOptionChange('코팅 면수', '단면');
                            }}
                            className={`py-3 rounded-xl text-[11px] font-bold border transition-all flex flex-col items-center justify-center gap-1 ${
                              selectedOptions['코팅'] === v.label
                                ? 'bg-zinc-900 border-zinc-900 text-white shadow-md'
                                : 'bg-white border-zinc-200 text-zinc-500 hover:border-emerald-200'
                            }`}
                          >
                            <span>{v.label}</span>
                            {v.priceModifier && v.priceModifier !== 0 && (
                              <span className={`text-[9px] ${selectedOptions['코팅'] === v.label ? 'text-emerald-300' : 'text-emerald-600'}`}>
                                +{v.priceModifier.toLocaleString()}원
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    );
                  })()}
                  {selectedOptions['코팅'] !== '없음' && product.options.some(o => o.name === '코팅 면수') && (
                    <div className="grid grid-cols-2 gap-2 animate-in fade-in slide-in-from-top-1">
                      {product.options.find(o => o.name === '코팅 면수')?.values.map((side, index) => (
                        <button
                          key={side.label + index}
                          onClick={() => handleOptionChange('코팅 면수', side.label)}
                          className={`py-3 rounded-xl text-[11px] font-bold border transition-all flex flex-col items-center justify-center gap-1 ${
                            selectedOptions['코팅 면수'] === side.label
                              ? 'bg-emerald-600 border-emerald-600 text-white shadow-md'
                              : 'bg-white border-zinc-200 text-zinc-500 hover:border-emerald-200'
                          }`}
                        >
                          <span>{side.label}</span>
                          {side.priceModifier && side.priceModifier !== 0 && (
                            <span className={`text-[9px] ${selectedOptions['코팅 면수'] === side.label ? 'text-emerald-100' : 'text-emerald-600'}`}>
                              +{side.priceModifier.toLocaleString()}원
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {expandedPostOption === 'rounding' && (
            <motion.div
              key="rounding"
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-4 border-t border-zinc-200/50 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-zinc-900 uppercase tracking-widest">귀돌이 상세 설정</h4>
                  <button onClick={() => setExpandedPostOption(null)} className="text-[10px] font-bold text-zinc-400 hover:text-zinc-600">닫기</button>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    {product.options.find(o => o.name === '귀돌이')?.values.map((v, index) => (
                      <button
                        key={v.label + index}
                        onClick={() => handleOptionChange('귀돌이', v.label)}
                        className={`py-3 rounded-xl text-[11px] font-bold border transition-all flex flex-col items-center justify-center gap-1 ${
                          selectedOptions['귀돌이'] === v.label
                            ? 'bg-zinc-900 border-zinc-900 text-white shadow-md'
                            : 'bg-white border-zinc-200 text-zinc-500 hover:border-emerald-200'
                        }`}
                      >
                        <span>{v.label}</span>
                        {v.priceModifier && v.priceModifier !== 0 && (
                          <span className={`text-[9px] ${selectedOptions['귀돌이'] === v.label ? 'text-emerald-300' : 'text-emerald-600'}`}>
                            +{v.priceModifier.toLocaleString()}원
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                  {selectedOptions['귀돌이'] === '있음' && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-top-1">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <span className="text-[10px] font-bold text-zinc-400 uppercase">크기</span>
                          <div className="grid grid-cols-2 gap-2">
                            {product.options.find(o => o.name === '귀돌이 크기')?.values.map((v, index) => (
                              <button
                                key={v.label + index}
                                onClick={() => handleOptionChange('귀돌이 크기', v.label)}
                                className={`py-2 rounded-lg text-[11px] font-bold border transition-all flex flex-col items-center justify-center gap-0.5 ${
                                  selectedOptions['귀돌이 크기'] === v.label
                                    ? 'bg-emerald-100 border-emerald-500 text-emerald-700'
                                    : 'bg-white border-zinc-200 text-zinc-500'
                                }`}
                              >
                                <span>{v.label}</span>
                                {v.priceModifier && v.priceModifier !== 0 && (
                                  <span className="text-[8px] opacity-70">+{v.priceModifier.toLocaleString()}원</span>
                                )}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <span className="text-[10px] font-bold text-zinc-400 uppercase">면수</span>
                          <div className="grid grid-cols-2 gap-2">
                            {product.options.find(o => o.name === '귀돌이 면수')?.values.map((v, index) => (
                              <button
                                key={v.label + index}
                                onClick={() => handleOptionChange('귀돌이 면수', v.label)}
                                className={`py-2 rounded-lg text-[11px] font-bold border transition-all flex flex-col items-center justify-center gap-0.5 ${
                                  selectedOptions['귀돌이 면수'] === v.label
                                    ? 'bg-emerald-100 border-emerald-500 text-emerald-700'
                                    : 'bg-white border-zinc-200 text-zinc-500'
                                }`}
                              >
                                <span>{v.label}</span>
                                {v.priceModifier && v.priceModifier !== 0 && (
                                  <span className="text-[8px] opacity-70">+{v.priceModifier.toLocaleString()}원</span>
                                )}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                      {selectedOptions['귀돌이 면수'] === '1면' && (
                        <div className="space-y-2">
                          <span className="text-[10px] font-bold text-zinc-400 uppercase">방향 선택</span>
                          <div className="grid grid-cols-4 gap-2">
                            {[
                              { id: '상단좌', icon: 'rounded-tl-xl' },
                              { id: '상단우', icon: 'rounded-tr-xl' },
                              { id: '하단좌', icon: 'rounded-bl-xl' },
                              { id: '하단우', icon: 'rounded-br-xl' }
                            ].map(dir => (
                              <button
                                key={dir.id}
                                onClick={() => handleOptionChange('귀돌이 방향', dir.id)}
                                className={`aspect-square rounded-xl border-2 flex flex-col items-center justify-center gap-1 transition-all ${
                                  selectedOptions['귀돌이 방향'] === dir.id
                                    ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                                    : 'bg-white border-zinc-100 text-zinc-400 hover:border-zinc-200'
                                }`}
                              >
                                <div className={`w-6 h-4 border-2 border-current ${dir.icon}`} />
                                <span className="text-[9px] font-black">{dir.id}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {expandedPostOption === 'punching' && (
            <motion.div
              key="punching"
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-4 border-t border-zinc-200/50 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-zinc-900 uppercase tracking-widest">타공 상세 설정</h4>
                  <button onClick={() => setExpandedPostOption(null)} className="text-[10px] font-bold text-zinc-400 hover:text-zinc-600">닫기</button>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    {product.options.find(o => o.name === '타공')?.values.map((v, index) => (
                      <button
                        key={v.label + index}
                        onClick={() => handleOptionChange('타공', v.label)}
                        className={`py-3 rounded-xl text-[11px] font-bold border transition-all flex flex-col items-center justify-center gap-1 ${
                          selectedOptions['타공'] === v.label
                            ? 'bg-zinc-900 border-zinc-900 text-white shadow-md'
                            : 'bg-white border-zinc-200 text-zinc-500 hover:border-emerald-200'
                        }`}
                      >
                        <span>{v.label}</span>
                        {v.priceModifier && v.priceModifier !== 0 && (
                          <span className={`text-[9px] ${selectedOptions['타공'] === v.label ? 'text-emerald-300' : 'text-emerald-600'}`}>
                            +{v.priceModifier.toLocaleString()}원
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                  {selectedOptions['타공'] === '있음' && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-top-1">
                      <div className="space-y-2">
                        <span className="text-[10px] font-bold text-zinc-400 uppercase">타공 크기</span>
                        <div className="grid grid-cols-3 gap-2">
                          {product.options.find(o => o.name === '타공 크기')?.values.map((v, index) => (
                            <button
                              key={v.label + index}
                              onClick={() => handleOptionChange('타공 크기', v.label)}
                              className={`py-2 rounded-lg text-[11px] font-bold border transition-all flex flex-col items-center justify-center gap-0.5 ${
                                selectedOptions['타공 크기'] === v.label
                                  ? 'bg-emerald-100 border-emerald-500 text-emerald-700'
                                  : 'bg-white border-zinc-200 text-zinc-500'
                              }`}
                            >
                              <span>{v.label}</span>
                              {v.priceModifier && v.priceModifier !== 0 && (
                                <span className="text-[8px] opacity-70">+{v.priceModifier.toLocaleString()}원</span>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <span className="text-[10px] font-bold text-zinc-400 uppercase">타공 개수/위치 설명</span>
                        <input
                          type="text"
                          value={selectedOptions['타공 설명'] || ''}
                          onChange={(e) => handleOptionChange('타공 설명', e.target.value)}
                          placeholder={pattern === 'POSTCARD' ? '예: 중앙 상단 1개 / 좌측 상단 1개 등' : '예: 2공 / 좌측 상단 1개, 우측 상단 1개 / 간격 50mm'}
                          className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-100 focus:border-emerald-500 outline-none font-medium text-[11px] transition-colors"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {expandedPostOption === 'creasing' && (
            <motion.div
              key="creasing"
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-4 border-t border-zinc-200/50 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-zinc-900 uppercase tracking-widest">오시 상세 설정</h4>
                  <button onClick={() => setExpandedPostOption(null)} className="text-[10px] font-bold text-zinc-400 hover:text-zinc-600">닫기</button>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    {product.options.find(o => o.name === '오시')?.values.map((v, index) => (
                      <button
                        key={v.label + index}
                        onClick={() => handleOptionChange('오시', v.label)}
                        className={`py-3 rounded-xl text-[11px] font-bold border transition-all flex flex-col items-center justify-center gap-1 ${
                          selectedOptions['오시'] === v.label
                            ? 'bg-zinc-900 border-zinc-900 text-white shadow-md'
                            : 'bg-white border-zinc-200 text-zinc-500 hover:border-emerald-200'
                        }`}
                      >
                        <span>{v.label}</span>
                        {v.priceModifier && v.priceModifier !== 0 && (
                          <span className={`text-[9px] ${selectedOptions['오시'] === v.label ? 'text-emerald-300' : 'text-emerald-600'}`}>
                            +{v.priceModifier.toLocaleString()}원
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                  {selectedOptions['오시'] === '있음' && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-top-1">
                      <div className="space-y-2">
                        <span className="text-[10px] font-bold text-zinc-400 uppercase">줄 수</span>
                        <div className="grid grid-cols-3 gap-2">
                          {product.options.find(o => o.name === '오시 줄 수')?.values.map((v, index) => (
                            <button
                              key={v.label + index}
                              onClick={() => handleOptionChange('오시 줄 수', v.label)}
                              className={`py-2 rounded-lg text-[11px] font-bold border transition-all flex flex-col items-center justify-center gap-0.5 ${
                                selectedOptions['오시 줄 수'] === v.label
                                  ? 'bg-emerald-100 border-emerald-500 text-emerald-700'
                                  : 'bg-white border-zinc-200 text-zinc-500'
                              }`}
                            >
                              <span>{v.label}</span>
                              {v.priceModifier && v.priceModifier !== 0 && (
                                <span className="text-[8px] opacity-70">+{v.priceModifier.toLocaleString()}원</span>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <span className="text-[10px] font-bold text-zinc-400 uppercase">오시 위치 설명</span>
                        <input
                          type="text"
                          value={selectedOptions['오시 설명'] || ''}
                          onChange={(e) => handleOptionChange('오시 설명', e.target.value)}
                          placeholder="예: 중앙 세로 1줄 / 상단 20mm 지점 가로 1줄 등"
                          className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-100 focus:border-emerald-500 outline-none font-medium text-[11px] transition-colors"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {expandedPostOption === 'perforation' && (
            <motion.div
              key="perforation"
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-4 border-t border-zinc-200/50 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-zinc-900 uppercase tracking-widest">미싱 상세 설정</h4>
                  <button onClick={() => setExpandedPostOption(null)} className="text-[10px] font-bold text-zinc-400 hover:text-zinc-600">닫기</button>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    {product.options.find(o => o.name === '미싱')?.values.map((v, index) => (
                      <button
                        key={v.label + index}
                        onClick={() => handleOptionChange('미싱', v.label)}
                        className={`py-3 rounded-xl text-[11px] font-bold border transition-all flex flex-col items-center justify-center gap-1 ${
                          selectedOptions['미싱'] === v.label
                            ? 'bg-zinc-900 border-zinc-900 text-white shadow-md'
                            : 'bg-white border-zinc-200 text-zinc-500 hover:border-emerald-200'
                        }`}
                      >
                        <span>{v.label}</span>
                        {v.priceModifier && v.priceModifier !== 0 && (
                          <span className={`text-[9px] ${selectedOptions['미싱'] === v.label ? 'text-emerald-300' : 'text-emerald-600'}`}>
                            +{v.priceModifier.toLocaleString()}원
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                  {selectedOptions['미싱'] === '있음' && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-top-1">
                      <div className="space-y-2">
                        <span className="text-[10px] font-bold text-zinc-400 uppercase">줄 수</span>
                        <div className="grid grid-cols-3 gap-2">
                          {product.options.find(o => o.name === '미싱 줄 수')?.values.map((v, index) => (
                            <button
                              key={v.label + index}
                              onClick={() => handleOptionChange('미싱 줄 수', v.label)}
                              className={`py-2 rounded-lg text-[11px] font-bold border transition-all flex flex-col items-center justify-center gap-0.5 ${
                                selectedOptions['미싱 줄 수'] === v.label
                                  ? 'bg-emerald-100 border-emerald-500 text-emerald-700'
                                  : 'bg-white border-zinc-200 text-zinc-500'
                              }`}
                            >
                              <span>{v.label}</span>
                              {v.priceModifier && v.priceModifier !== 0 && (
                                <span className="text-[8px] opacity-70">+{v.priceModifier.toLocaleString()}원</span>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <span className="text-[10px] font-bold text-zinc-400 uppercase">미싱 위치 설명</span>
                        <input
                          type="text"
                          value={selectedOptions['미싱 설명'] || ''}
                          onChange={(e) => handleOptionChange('미싱 설명', e.target.value)}
                          placeholder="예: 중앙 세로 1줄 / 우측 30mm 지점 세로 1줄 등"
                          className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-100 focus:border-emerald-500 outline-none font-medium text-[11px] transition-colors"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {expandedPostOption === 'folding' && (
            <motion.div
              key="folding"
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-4 border-t border-zinc-200/50 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-zinc-900 uppercase tracking-widest">접지 상세 설정</h4>
                  <button onClick={() => setExpandedPostOption(null)} className="text-[10px] font-bold text-zinc-400 hover:text-zinc-600">닫기</button>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    {product.options.find(o => o.name === '접지')?.values.filter(v => v.label !== '없음').map((v, index) => (
                      <button
                        key={v.label + index}
                        onClick={() => handleOptionChange('접지', v.label)}
                        className={`py-3 rounded-xl text-[11px] font-bold border transition-all flex flex-col items-center justify-center gap-1 ${
                          selectedOptions['접지'] === v.label
                            ? 'bg-zinc-900 border-zinc-900 text-white shadow-md'
                            : 'bg-white border-zinc-200 text-zinc-500 hover:border-emerald-200'
                        }`}
                      >
                        <span>{v.label}</span>
                        {v.priceModifier && v.priceModifier !== 0 && (
                          <span className={`text-[9px] ${selectedOptions['접지'] === v.label ? 'text-emerald-300' : 'text-emerald-600'}`}>
                            +{v.priceModifier.toLocaleString()}원
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                  {selectedOptions['접지'] === '있음' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-top-1">
                      <div className="space-y-3">
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">접지 방향</span>
                        <div className="flex gap-4">
                          {product.options.find(o => o.name === '접지 방향')?.values.map((v, index) => (
                            <div key={v.label + index} className="flex flex-col items-center gap-2">
                              <button
                                onClick={() => handleOptionChange('접지 방향', v.label)}
                                className={`w-16 h-16 rounded-2xl border-2 flex items-center justify-center transition-all ${
                                  selectedOptions['접지 방향'] === v.label
                                    ? 'bg-emerald-500 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)] scale-110'
                                    : 'bg-zinc-50 border-zinc-100 hover:border-zinc-200'
                                }`}
                              >
                                <div className={`transition-colors ${selectedOptions['접지 방향'] === v.label ? 'text-white' : 'text-zinc-900'}`}>
                                  {FOLDING_DIRECTION_ICONS[v.label]}
                                </div>
                              </button>
                              <span className={`text-[10px] font-bold transition-colors ${selectedOptions['접지 방향'] === v.label ? 'text-emerald-700' : 'text-zinc-500'}`}>
                                {v.label === '가로형' ? '가로접지방향' : '세로접지방향'}
                                {v.priceModifier && v.priceModifier !== 0 && (
                                  <span className="block text-[8px] opacity-70">+{v.priceModifier.toLocaleString()}원</span>
                                )}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-3">
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">접지 형태</span>
                        <div className="flex flex-wrap gap-x-2 gap-y-4 justify-start">
                          {product.options.find(o => o.name === '접지 형태')?.values.map((v, index) => (
                            <div key={v.label + index} className="flex flex-col items-center gap-2 w-[calc(25%-8px)] min-w-[60px]">
                              <button
                                onClick={() => handleOptionChange('접지 형태', v.label)}
                                className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center transition-all ${
                                  selectedOptions['접지 형태'] === v.label
                                    ? 'bg-emerald-500 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)] scale-110'
                                    : 'bg-zinc-50 border-zinc-100 hover:border-zinc-200'
                                }`}
                              >
                                <div className={`transition-colors ${selectedOptions['접지 형태'] === v.label ? 'text-white' : 'text-zinc-900'}`}>
                                  {FOLDING_TYPE_ICONS[v.label]}
                                </div>
                              </button>
                              <span className={`text-[9px] font-bold text-center leading-tight px-1 transition-colors ${selectedOptions['접지 형태'] === v.label ? 'text-emerald-700' : 'text-zinc-500'}`}>
                                {v.label}
                                {v.priceModifier && v.priceModifier !== 0 && (
                                  <span className="block text-[8px] opacity-70">+{v.priceModifier.toLocaleString()}원</span>
                                )}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="mt-6 space-y-4">
                        <div className="p-3 rounded-2xl bg-red-50/50 border border-red-100/50">
                          <p className="text-[10px] text-red-500 font-medium leading-relaxed">
                            ※ 3단, 대문, 반대문 접지의 경우 반드시 접지 가이드를 다운로드하여 작업해주세요.<br />
                            ※ 대문, 반대문 접지 : 안쪽 면보다 접히는 면이 짧아, 접었을 때 안쪽 면이 보일 수 있습니다.
                          </p>
                        </div>
                        <button className="w-full py-3 rounded-full border border-zinc-200 text-[11px] font-bold text-zinc-600 hover:bg-zinc-50 transition-colors flex items-center justify-center gap-2">
                          접지가이드 다운로드
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {expandedPostOption === 'packaging' && (
            <motion.div
              key="packaging"
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-4 border-t border-zinc-200/50 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-zinc-900 uppercase tracking-widest">포장 상세 설정</h4>
                  <button onClick={() => setExpandedPostOption(null)} className="text-[10px] font-bold text-zinc-400 hover:text-zinc-600">닫기</button>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    {product.options.find(o => o.name === '폴리백 개별포장')?.values.map((v, index) => (
                      <button
                        key={v.label + index}
                        onClick={() => handleOptionChange('폴리백 개별포장', v.label)}
                        className={`py-3 rounded-xl text-[11px] font-bold border transition-all flex flex-col items-center justify-center gap-1 ${
                          selectedOptions['폴리백 개별포장'] === v.label
                            ? 'bg-zinc-900 border-zinc-900 text-white shadow-md'
                            : 'bg-white border-zinc-200 text-zinc-500 hover:border-emerald-200'
                        }`}
                      >
                        <span>{v.label}</span>
                        {v.priceModifier && v.priceModifier !== 0 && (
                          <span className={`text-[9px] ${selectedOptions['폴리백 개별포장'] === v.label ? 'text-emerald-300' : 'text-emerald-600'}`}>
                            +{v.priceModifier.toLocaleString()}원
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                  {selectedOptions['폴리백 개별포장'] === '있음' && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-top-1">
                      <div className="space-y-2">
                        <span className="text-[10px] font-bold text-zinc-400 uppercase">폴리백 사이즈</span>
                        <div className="grid grid-cols-3 gap-2">
                          {product.options.find(o => o.name === '폴리백 사이즈')?.values.map((v, index) => (
                            <button
                              key={v.label + index}
                              onClick={() => handleOptionChange('폴리백 사이즈', v.label)}
                              className={`py-2 rounded-lg text-[11px] font-bold border transition-all flex flex-col items-center justify-center gap-0.5 ${
                                selectedOptions['폴리백 사이즈'] === v.label
                                  ? 'bg-emerald-100 border-emerald-500 text-emerald-700'
                                  : 'bg-white border-zinc-200 text-zinc-500'
                              }`}
                            >
                              <span>{v.label}</span>
                              {v.priceModifier && v.priceModifier !== 0 && (
                                <span className="text-[8px] opacity-70">+{v.priceModifier.toLocaleString()}원</span>
                              )}
                            </button>
                          ))}
                        </div>
                        <p className="text-[10px] text-zinc-400 mt-1">* 인쇄물 사이즈보다 큰 폴리백을 선택해주세요.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {expandedPostOption === 'white-printing' && (
            <motion.div
              key="white-printing"
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-4 border-t border-zinc-200/50 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-zinc-900 uppercase tracking-widest">화이트 인쇄 설정</h4>
                  <button onClick={() => setExpandedPostOption(null)} className="text-[10px] font-bold text-zinc-400 hover:text-zinc-600">닫기</button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {product.options.find(o => o.name === '화이트 인쇄')?.values.map((v, index) => (
                    <button
                      key={v.label + index}
                      onClick={() => handleOptionChange('화이트 인쇄', v.label)}
                      className={`py-3 rounded-xl text-[11px] font-bold border transition-all flex flex-col items-center justify-center gap-1 ${
                        selectedOptions['화이트 인쇄'] === v.label
                          ? 'bg-zinc-900 border-zinc-900 text-white shadow-md'
                          : 'bg-white border-zinc-200 text-zinc-500 hover:border-emerald-200'
                      }`}
                    >
                      <span>{v.label}</span>
                      {v.priceModifier && v.priceModifier !== 0 && (
                        <span className={`text-[9px] ${selectedOptions['화이트 인쇄'] === v.label ? 'text-emerald-300' : 'text-emerald-600'}`}>
                          +{v.priceModifier.toLocaleString()}원
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {expandedPostOption === 'special-effects' && (
            <motion.div
              key="special-effects"
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-4 border-t border-zinc-200/50 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-zinc-900 uppercase tracking-widest">특수 효과 설정</h4>
                  <button onClick={() => setExpandedPostOption(null)} className="text-[10px] font-bold text-zinc-400 hover:text-zinc-600">닫기</button>
                </div>
                <div className="space-y-4">
                  {(() => {
                    const effectOption = product.options.find(o => o.name === '후가공 옵션');
                    if (!effectOption) return null;
                    return (
                      <div className="grid grid-cols-2 gap-2">
                        {effectOption.values?.map((v, index) => (
                          <button
                            key={v.label + index}
                            onClick={() => handleOptionChange('후가공 옵션', v.label)}
                            className={`py-3 rounded-xl text-[11px] font-bold border transition-all flex flex-col items-center justify-center gap-1 ${
                              selectedOptions['후가공 옵션'] === v.label
                                ? 'bg-zinc-900 border-zinc-900 text-white shadow-md'
                                : 'bg-white border-zinc-200 text-zinc-500 hover:border-emerald-200'
                            }`}
                          >
                            <span>{v.label}</span>
                            {v.priceModifier && v.priceModifier !== 0 && (
                              <span className={`text-[9px] ${selectedOptions['후가공 옵션'] === v.label ? 'text-emerald-300' : 'text-emerald-600'}`}>
                                +{v.priceModifier.toLocaleString()}원
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              </div>
            </motion.div>
          )}

          {expandedPostOption === 'case' && (
            <motion.div
              key="case"
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-4 border-t border-zinc-200/50 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-zinc-900 uppercase tracking-widest">케이스 선택</h4>
                  <button onClick={() => setExpandedPostOption(null)} className="text-[10px] font-bold text-zinc-400 hover:text-zinc-600">닫기</button>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {product.options.find(o => o.name === '명함케이스')?.values.map((v, index) => (
                    <button
                      key={v.label + index}
                      onClick={() => handleOptionChange('명함케이스', v.label)}
                      className={`w-full py-3 px-4 rounded-xl text-[11px] font-bold border transition-all text-left flex items-center justify-between ${
                        selectedOptions['명함케이스'] === v.label
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-sm'
                          : 'bg-white border-zinc-100 text-zinc-500 hover:border-zinc-300'
                      }`}
                    >
                      <div className="flex flex-col">
                        <span>{v.label}</span>
                        {v.priceModifier && v.priceModifier !== 0 && (
                          <span className="text-[9px] text-emerald-600">+{v.priceModifier.toLocaleString()}원</span>
                        )}
                      </div>
                      {selectedOptions['명함케이스'] === v.label && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
