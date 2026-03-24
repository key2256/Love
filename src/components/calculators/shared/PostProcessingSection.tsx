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
  CheckCircle2
} from 'lucide-react';
import { Product } from '../../../types';
import { 
  FOLDING_DIRECTION_ICONS, 
  FOLDING_TYPE_ICONS, 
  PRODUCT_CONFIG 
} from './constants';

interface PostProcessingSectionProps {
  product: Product;
  selectedOptions: Record<string, string>;
  handleOptionChange: (name: string, value: string) => void;
  pattern: string;
  expandedPostOption: string | null;
  setExpandedPostOption: (option: string | null) => void;
}

export const PostProcessingSection: React.FC<PostProcessingSectionProps> = ({
  product,
  selectedOptions,
  handleOptionChange,
  pattern,
  expandedPostOption,
  setExpandedPostOption
}) => {
  const config = PRODUCT_CONFIG[product.id];

  const postOptions = [
    { 
      id: 'white-ink', 
      name: '화이트인쇄', 
      icon: <Paintbrush className="w-5 h-5" />, 
      active: selectedOptions['화이트인쇄'] === '있음', 
      hidden: !config?.allowedPostProcessing?.includes('화이트인쇄')
    },
    { 
      id: 'coating', 
      name: '코팅', 
      icon: <Layers className="w-5 h-5" />, 
      active: selectedOptions['코팅'] !== '없음' && selectedOptions['코팅'] !== undefined, 
      hidden: !config?.allowedPostProcessing?.includes('코팅')
    },
    { 
      id: 'rounding', 
      name: '귀돌이', 
      icon: <Scissors className="w-5 h-5" />, 
      active: selectedOptions['귀돌이'] === '있음',
      hidden: !config?.allowedPostProcessing?.includes('귀돌이')
    },
    { 
      id: 'cutting', 
      name: '재단', 
      icon: <Shapes className="w-5 h-5" />, 
      active: selectedOptions['재단'] !== '없음' && selectedOptions['재단'] !== undefined,
      hidden: !config?.allowedPostProcessing?.includes('재단')
    },
    { 
      id: 'packaging', 
      name: '포장', 
      icon: <Package className="w-5 h-5" />, 
      active: selectedOptions['폴리백 개별포장'] === '있음' || selectedOptions['폴리백 개별 포장'] === '있음', 
      hidden: !config?.allowedPostProcessing?.includes('폴리백 개별포장') && !config?.allowedPostProcessing?.includes('폴리백 개별 포장')
    }
  ].filter(item => !item.hidden);

  return (
    <div className="space-y-6 pt-4 border-t border-zinc-100">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-1 h-4 bg-emerald-500 rounded-full" />
          <label className="text-sm font-black text-zinc-900 uppercase tracking-tight">
            후가공 선택
          </label>
        </div>
        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
          아이콘을 클릭하여 상세 옵션 선택
        </span>
      </div>

      <div className="bg-zinc-50/50 rounded-[32px] p-6 border border-zinc-100 space-y-6">
        <div className="grid grid-cols-4 gap-3">
          {postOptions.map(item => {
            const isExpanded = expandedPostOption === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setExpandedPostOption(isExpanded ? null : item.id)}
                className={`flex flex-col items-center gap-2 group transition-all ${
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
                <span className={`text-[10px] font-black whitespace-nowrap transition-colors ${
                  isExpanded ? 'text-emerald-600' : item.active ? 'text-zinc-900' : 'text-zinc-400'
                }`}>
                  {item.name}
                </span>
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          {expandedPostOption === 'white-ink' && (
            <motion.div
              key="white-ink"
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-4 border-t border-zinc-200/50 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-zinc-900 uppercase tracking-widest">화이트인쇄 상세 설정</h4>
                  <button onClick={() => setExpandedPostOption(null)} className="text-[10px] font-bold text-zinc-400 hover:text-zinc-600">닫기</button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {product.options.find(o => o.name === '화이트인쇄')?.values.map(v => (
                    <button
                      key={v.label}
                      onClick={() => handleOptionChange('화이트인쇄', v.label)}
                      className={`py-3 rounded-xl text-[11px] font-bold border transition-all ${
                        selectedOptions['화이트인쇄'] === v.label
                          ? 'bg-zinc-900 border-zinc-900 text-white shadow-md'
                          : 'bg-white border-zinc-200 text-zinc-500 hover:border-emerald-200'
                      }`}
                    >
                      {v.label}
                    </button>
                  ))}
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
                        {coatingOption.values?.map(v => (
                          <button
                            key={v.label}
                            onClick={() => {
                              handleOptionChange('코팅', v.label);
                              if (v.label === '없음') handleOptionChange('코팅 면수', '단면');
                            }}
                            className={`py-3 rounded-xl text-[11px] font-bold border transition-all ${
                              selectedOptions['코팅'] === v.label
                                ? 'bg-zinc-900 border-zinc-900 text-white shadow-md'
                                : 'bg-white border-zinc-200 text-zinc-500 hover:border-emerald-200'
                            }`}
                          >
                            {v.label}
                          </button>
                        ))}
                      </div>
                    );
                  })()}
                  {selectedOptions['코팅'] !== '없음' && product.options.some(o => o.name === '코팅 면수') && (
                    <div className="grid grid-cols-2 gap-2 animate-in fade-in slide-in-from-top-1">
                      {product.options.find(o => o.name === '코팅 면수')?.values.map(side => (
                        <button
                          key={side.label}
                          onClick={() => handleOptionChange('코팅 면수', side.label)}
                          className={`py-3 rounded-xl text-[11px] font-bold border transition-all ${
                            selectedOptions['코팅 면수'] === side.label
                              ? 'bg-emerald-600 border-emerald-600 text-white shadow-md'
                              : 'bg-white border-zinc-200 text-zinc-500 hover:border-emerald-200'
                          }`}
                        >
                          {side.label}
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
                    {product.options.find(o => o.name === '귀돌이')?.values.map(v => (
                      <button
                        key={v.label}
                        onClick={() => handleOptionChange('귀돌이', v.label)}
                        className={`py-3 rounded-xl text-[11px] font-bold border transition-all ${
                          selectedOptions['귀돌이'] === v.label
                            ? 'bg-zinc-900 border-zinc-900 text-white shadow-md'
                            : 'bg-white border-zinc-200 text-zinc-500 hover:border-emerald-200'
                        }`}
                      >
                        {v.label}
                      </button>
                    ))}
                  </div>
                  {selectedOptions['귀돌이'] === '있음' && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-top-1">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <span className="text-[10px] font-bold text-zinc-400 uppercase">크기</span>
                          <div className="grid grid-cols-2 gap-2">
                            {product.options.find(o => o.name === '귀돌이 크기')?.values.map(v => (
                              <button
                                key={v.label}
                                onClick={() => handleOptionChange('귀돌이 크기', v.label)}
                                className={`py-2 rounded-lg text-[11px] font-bold border transition-all ${
                                  selectedOptions['귀돌이 크기'] === v.label
                                    ? 'bg-emerald-100 border-emerald-500 text-emerald-700'
                                    : 'bg-white border-zinc-200 text-zinc-500'
                                }`}
                              >
                                {v.label}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <span className="text-[10px] font-bold text-zinc-400 uppercase">면수</span>
                          <div className="grid grid-cols-2 gap-2">
                            {product.options.find(o => o.name === '귀돌이 면수')?.values.map(v => (
                              <button
                                key={v.label}
                                onClick={() => handleOptionChange('귀돌이 면수', v.label)}
                                className={`py-2 rounded-lg text-[11px] font-bold border transition-all ${
                                  selectedOptions['귀돌이 면수'] === v.label
                                    ? 'bg-emerald-100 border-emerald-500 text-emerald-700'
                                    : 'bg-white border-zinc-200 text-zinc-500'
                                }`}
                              >
                                {v.label}
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

          {expandedPostOption === 'cutting' && (
            <motion.div
              key="cutting"
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-4 border-t border-zinc-200/50 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-zinc-900 uppercase tracking-widest">재단 상세 설정</h4>
                  <button onClick={() => setExpandedPostOption(null)} className="text-[10px] font-bold text-zinc-400 hover:text-zinc-600">닫기</button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {product.options.find(o => o.name === '재단')?.values.map(v => (
                    <button
                      key={v.label}
                      onClick={() => handleOptionChange('재단', v.label)}
                      className={`py-3 rounded-xl text-[11px] font-bold border transition-all ${
                        selectedOptions['재단'] === v.label
                          ? 'bg-zinc-900 border-zinc-900 text-white shadow-md'
                          : 'bg-white border-zinc-200 text-zinc-500 hover:border-emerald-200'
                      }`}
                    >
                      {v.label}
                    </button>
                  ))}
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
                    {product.options.find(o => o.name === '폴리백 개별포장')?.values.map(v => (
                      <button
                        key={v.label}
                        onClick={() => handleOptionChange('폴리백 개별포장', v.label)}
                        className={`py-3 rounded-xl text-[11px] font-bold border transition-all ${
                          selectedOptions['폴리백 개별포장'] === v.label
                            ? 'bg-zinc-900 border-zinc-900 text-white shadow-md'
                            : 'bg-white border-zinc-200 text-zinc-500 hover:border-emerald-200'
                        }`}
                      >
                        {v.label}
                      </button>
                    ))}
                  </div>
                  {selectedOptions['폴리백 개별포장'] === '있음' && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-top-1">
                      <div className="space-y-2">
                        <span className="text-[10px] font-bold text-zinc-400 uppercase">폴리백 사이즈</span>
                        <div className="grid grid-cols-3 gap-2">
                          {product.options.find(o => o.name === '폴리백 사이즈')?.values.map(v => (
                            <button
                              key={v.label}
                              onClick={() => handleOptionChange('폴리백 사이즈', v.label)}
                              className={`py-2 rounded-lg text-[11px] font-bold border transition-all ${
                                selectedOptions['폴리백 사이즈'] === v.label
                                  ? 'bg-emerald-100 border-emerald-500 text-emerald-700'
                                  : 'bg-white border-zinc-200 text-zinc-500'
                              }`}
                            >
                              {v.label}
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

        </AnimatePresence>
      </div>
    </div>
  );
};
