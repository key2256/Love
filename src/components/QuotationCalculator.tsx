import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calculator, 
  Clock, 
  CheckCircle2, 
  ShoppingCart, 
  FileText, 
  FileUp, 
  ChevronDown, 
  ChevronUp,
  Scissors,
  Layers,
  Sparkles,
  Hash,
  Zap,
  Package,
  Paintbrush,
  Droplets,
  HelpCircle,
  Check,
  Info,
  Shapes,
  AlertCircle,
  BookOpen,
  Book,
  Palette,
  Settings,
  Type,
  Layout
} from 'lucide-react';
import { Product, Quotation, PAPER_MATERIALS, POSTCARD_MATERIALS, BUSINESS_CARD_MATERIALS, BusinessCardPaperMaterial, DESIGN_CARD_TEMPLATES, Template } from '../types';

interface QuotationCalculatorProps {
  product: Product;
  onGenerateQuotation: (quotation: Quotation) => void;
}

const NOTE_GROUPS = {
  '외부 구성': ['규격', '표지 구성', '커버 스타일'],
  '후가공 선택': ['표지 코팅', '커버 인쇄', '엣지 마감'],
  '내부 구성': ['내지 종류', '내지 색상', '내지 장수', '페이지 수'],
  '제본/마감': ['스프링 방향', '스프링 색상', '제본 안내']
};

const getNoteGroup = (optionName: string) => {
  if (NOTE_GROUPS['외부 구성'].includes(optionName)) return '외부 구성';
  if (NOTE_GROUPS['후가공 선택'].includes(optionName)) return '후가공 선택';
  if (NOTE_GROUPS['내부 구성'].includes(optionName)) return '내부 구성';
  if (NOTE_GROUPS['제본/마감'].includes(optionName)) return '제본/마감';
  return null;
};

const FOLDING_DIRECTION_ICONS: Record<string, React.ReactNode> = {
  '가로형': (
    <svg viewBox="0 0 40 40" className="w-8 h-8 stroke-current fill-none" strokeWidth="1.5">
      <rect x="10" y="10" width="20" height="20" />
      <line x1="10" y1="20" x2="30" y2="20" />
    </svg>
  ),
  '세로형': (
    <svg viewBox="0 0 40 40" className="w-8 h-8 stroke-current fill-none" strokeWidth="1.5">
      <rect x="10" y="10" width="20" height="20" />
      <line x1="20" y1="10" x2="20" y2="30" />
    </svg>
  )
};

const FOLDING_TYPE_ICONS: Record<string, React.ReactNode> = {
  '2단접지': (
    <svg viewBox="0 0 40 40" className="w-8 h-8 stroke-current fill-none" strokeWidth="1.5">
      <path d="M12 10 L28 10 L28 30 L12 30 Z" />
      <path d="M20 10 L20 30" />
    </svg>
  ),
  '3단접지': (
    <svg viewBox="0 0 40 40" className="w-8 h-8 stroke-current fill-none" strokeWidth="1.5">
      <path d="M10 10 L30 10 L30 30 L10 30 Z" />
      <path d="M16.6 10 L16.6 30" />
      <path d="M23.3 10 L23.3 30" />
    </svg>
  ),
  '4단접지': (
    <svg viewBox="0 0 40 40" className="w-8 h-8 stroke-current fill-none" strokeWidth="1.5">
      <path d="M8 10 L32 10 L32 30 L8 30 Z" />
      <path d="M14 10 L14 30" />
      <path d="M20 10 L20 30" />
      <path d="M26 10 L26 30" />
    </svg>
  ),
  '대문접지': (
    <svg viewBox="0 0 40 40" className="w-8 h-8 stroke-current fill-none" strokeWidth="1.5">
      <path d="M10 10 L30 10 L30 30 L10 30 Z" />
      <path d="M15 10 L15 30" />
      <path d="M25 10 L25 30" />
    </svg>
  ),
  '반대문접지': (
    <svg viewBox="0 0 40 40" className="w-8 h-8 stroke-current fill-none" strokeWidth="1.5">
      <path d="M10 10 L30 10 L30 30 L10 30 Z" />
      <path d="M15 10 L15 30" />
    </svg>
  ),
  '4단 병풍접지': (
    <svg viewBox="0 0 40 40" className="w-8 h-8 stroke-current fill-none" strokeWidth="1.5">
      <path d="M8 10 L14 10 L14 30 L8 30 Z M14 10 L20 10 L20 30 L14 30 Z M20 10 L26 10 L26 30 L20 30 Z M26 10 L32 10 L32 30 L26 30 Z" />
    </svg>
  ),
  'N모양 3단접지': (
    <svg viewBox="0 0 40 40" className="w-8 h-8 stroke-current fill-none" strokeWidth="1.5">
      <path d="M10 10 L16.6 10 L16.6 30 L10 30 Z M16.6 10 L23.3 10 L23.3 30 L16.6 30 Z M23.3 10 L30 10 L30 30 L23.3 30 Z" />
    </svg>
  )
};

const SHAPE_ICONS: Record<string, React.ReactNode> = {
  '라운드형': (
    <svg viewBox="0 0 40 40" className="w-8 h-8 fill-current">
      <path d="M8 32V16C8 9.37 13.37 4 20 4C26.63 4 32 9.37 32 16V32H8Z" />
    </svg>
  ),
  '티켓형': (
    <svg viewBox="0 0 40 40" className="w-10 h-10 fill-current">
      <path d="M6 12C6 10.9 6.9 10 8 10H32C33.1 10 34 10.9 34 12V16.5C32.62 16.5 31.5 17.62 31.5 19C31.5 20.38 32.62 21.5 34 21.5V28C34 29.1 33.1 30 32 30H8C6.9 30 6 29.1 6 28V21.5C7.38 21.5 8.5 20.38 8.5 19C8.5 17.62 7.38 16.5 6 16.5V12Z" />
    </svg>
  ),
  '원형': (
    <svg viewBox="0 0 40 40" className="w-8 h-8 fill-current">
      <circle cx="20" cy="20" r="14" />
    </svg>
  ),
  '자유형': (
    <svg viewBox="0 0 40 40" className="w-10 h-10 fill-current">
      <path d="M12 10L18 20H6L12 10Z" />
      <rect x="22" y="10" width="10" height="10" rx="1" />
      <path d="M20 22L22.5 27H27.5L23.5 30L25 35L20 32L15 35L16.5 30L12.5 27H17.5L20 22Z" />
    </svg>
  )
};

const MEMO_SIZE_ICONS: Record<string, React.ReactNode> = {
  '90 x 90 mm': (
    <svg viewBox="0 0 40 40" className="w-8 h-8 fill-current">
      <rect x="10" y="10" width="20" height="20" rx="2" />
    </svg>
  ),
  '90 x 60 mm': (
    <svg viewBox="0 0 40 40" className="w-8 h-8 fill-current">
      <rect x="8" y="13" width="24" height="14" rx="2" />
    </svg>
  ),
  '40 x 90 mm': (
    <svg viewBox="0 0 40 40" className="w-8 h-8 fill-current">
      <rect x="15" y="8" width="10" height="24" rx="2" />
    </svg>
  ),
  '직접입력': (
    <svg viewBox="0 0 40 40" className="w-8 h-8 fill-current">
      <path d="M10 10h20v20H10z" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 2" />
      <path d="M20 15v10M15 20h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
};

const NOTE_SIZE_ICONS: Record<string, React.ReactNode> = {
  'B6 (128x182)': (
    <svg viewBox="0 0 40 40" className="w-8 h-8 fill-current">
      <rect x="14" y="10" width="12" height="20" rx="1" />
    </svg>
  ),
  'A5 (148x210)': (
    <svg viewBox="0 0 40 40" className="w-8 h-8 fill-current">
      <rect x="12" y="8" width="16" height="24" rx="1" />
    </svg>
  ),
  'B5 (182x257)': (
    <svg viewBox="0 0 40 40" className="w-8 h-8 fill-current">
      <rect x="10" y="7" width="20" height="26" rx="1" />
    </svg>
  ),
  'A4 (210x297)': (
    <svg viewBox="0 0 40 40" className="w-8 h-8 fill-current">
      <rect x="8" y="6" width="24" height="28" rx="1" />
    </svg>
  ),
  'A3 (297x420)': (
    <svg viewBox="0 0 40 40" className="w-8 h-8 fill-current">
      <rect x="6" y="4" width="28" height="32" rx="1" />
    </svg>
  )
};

const SPRING_COLOR_ICONS: Record<string, React.ReactNode> = {
  '검정': (
    <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-700" />
  ),
  '하양': (
    <div className="w-8 h-8 rounded-full bg-white border border-zinc-200" />
  ),
  '은색': (
    <div className="w-8 h-8 rounded-full bg-zinc-300 border border-zinc-400" />
  )
};

const COVER_TYPE_ICONS: Record<string, React.ReactNode> = {
  '소프트커버': <Book className="w-8 h-8" />,
  '하드커버 2mm': <BookOpen className="w-8 h-8" />,
  '하드커버': <BookOpen className="w-8 h-8" />
};

const NOTE_INNER_ICONS: Record<string, React.ReactNode> = {
  '무지': (
    <svg viewBox="0 0 40 40" className="w-8 h-8 stroke-current fill-none" strokeWidth="2">
      <rect x="10" y="10" width="20" height="20" />
    </svg>
  ),
  '드로잉용지 300g': (
    <svg viewBox="0 0 40 40" className="w-8 h-8 stroke-current fill-none" strokeWidth="2">
      <rect x="10" y="10" width="20" height="20" />
      <path d="M15 15 L25 25 M25 15 L15 25" strokeWidth="1" opacity="0.3" />
    </svg>
  ),
  '드로잉용지': (
    <svg viewBox="0 0 40 40" className="w-8 h-8 stroke-current fill-none" strokeWidth="2">
      <rect x="10" y="10" width="20" height="20" />
    </svg>
  ),
  '필기용지': (
    <svg viewBox="0 0 40 40" className="w-8 h-8 stroke-current fill-none" strokeWidth="2">
      <rect x="10" y="10" width="20" height="20" />
      <line x1="13" y1="15" x2="27" y2="15" strokeWidth="1" />
      <line x1="13" y1="20" x2="27" y2="20" strokeWidth="1" />
      <line x1="13" y1="25" x2="27" y2="25" strokeWidth="1" />
    </svg>
  ),
  '줄(라인)': (
    <svg viewBox="0 0 40 40" className="w-8 h-8 stroke-current fill-none" strokeWidth="2">
      <rect x="10" y="10" width="20" height="20" />
      <line x1="13" y1="15" x2="27" y2="15" />
      <line x1="13" y1="20" x2="27" y2="20" />
      <line x1="13" y1="25" x2="27" y2="25" />
    </svg>
  ),
  '모눈(그리드)': (
    <svg viewBox="0 0 40 40" className="w-8 h-8 stroke-current fill-none" strokeWidth="1.5">
      <rect x="10" y="10" width="20" height="20" />
      <line x1="15" y1="10" x2="15" y2="30" />
      <line x1="20" y1="10" x2="20" y2="30" />
      <line x1="25" y1="10" x2="25" y2="30" />
      <line x1="10" y1="15" x2="30" y2="15" />
      <line x1="10" y1="20" x2="30" y2="20" />
      <line x1="10" y1="25" x2="30" y2="25" />
    </svg>
  ),
  '도트': (
    <svg viewBox="0 0 40 40" className="w-8 h-8 fill-current">
      <circle cx="15" cy="15" r="1.5" />
      <circle cx="20" cy="15" r="1.5" />
      <circle cx="25" cy="15" r="1.5" />
      <circle cx="15" cy="20" r="1.5" />
      <circle cx="20" cy="20" r="1.5" />
      <circle cx="25" cy="20" r="1.5" />
      <circle cx="15" cy="25" r="1.5" />
      <circle cx="20" cy="25" r="1.5" />
      <circle cx="25" cy="25" r="1.5" />
    </svg>
  )
};

const POSTCARD_CONFIG: Record<string, {
  allowedGroups?: string[];
  allowedMaterials?: string[];
  allowedPostProcessing?: string[];
}> = {
  'stk-postcard-standard': {
    allowedGroups: ['기본 대중형'],
  },
  'stk-postcard-special': {
    allowedMaterials: ['아트지 250g', '스노우 250g'],
    allowedPostProcessing: ['인쇄 도수', '코팅', '귀돌이', '타공'],
  },
  'stk-postcard-shape': {
    allowedGroups: ['기본 대중형', '고급 감성형', '친환경/내추럴형'],
    allowedPostProcessing: ['인쇄 도수', '모양커팅', '코팅', '귀돌이', '타공', '오시', '미싱', '접지', '폴리백 개별포장'],
  },
  'stk-postcard-premium': {
    allowedGroups: ['고급 감성형', '친환경/내추럴형', '컬러/특수지형'],
  },
  'stk-postcard-effect': {
    allowedGroups: ['기본 대중형', '고급 감성형'],
  }
};

export const QuotationCalculator: React.FC<QuotationCalculatorProps> = ({ product, onGenerateQuotation }) => {
  const [quantity, setQuantity] = useState(product.minQuantity);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    product.options.forEach(opt => {
      if (opt.type === 'text') {
        initial[opt.name] = '';
      } else if (opt.values && opt.values.length > 0) {
        initial[opt.name] = opt.values[0].label;
      } else {
        initial[opt.name] = '';
      }
    });
    return initial;
  });
  const [totalPrice, setTotalPrice] = useState(0);
  const [unitPrice, setUnitPrice] = useState(0);
  const [discountRate, setDiscountRate] = useState(0);
  const [estimatedDeliveryDate, setEstimatedDeliveryDate] = useState('');
  const [customSize, setCustomSize] = useState({ width: '', height: '' });
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);
  const [selectedPostcardGroup, setSelectedPostcardGroup] = useState<string | null>(null);
  const [selectedBusinessCardGroup, setSelectedBusinessCardGroup] = useState<string | null>(null);
  const [expandedPostOption, setExpandedPostOption] = useState<string | null>(null);

  const getLayoutPattern = (product: Product) => {
    if (product.category === 'sticker') return 'STICKER';
    if (product.category === 'card-paper' && product.subCategory.includes('엽서')) return 'POSTCARD';
    if (product.id === 'bc-template') return 'DESIGN_CARD';
    if (product.id === 'bc-standard' || product.id === 'bc-premium') return 'BUSINESS_CARD';
    if (product.id === 'bc-folded') return 'FOLDED_BUSINESS_CARD';
    if (product.id === 'memo-standard') return 'MEMO_PAD';
    if (product.id === 'note-spring' || product.id === 'note-leather' || product.id === 'note-saddle') return 'NOTE';
    if (product.id.startsWith('drawing-')) return 'DRAWING_BOOK';
    if (product.category === 'card-paper') return 'PAPER_GOODS';
    if (product.category === 'binding-booklet' || product.id === 'note-spring') return 'BINDING_GOODS';
    if (product.category === 'poster-promo') return 'LARGE_FORMAT';
    if (product.category === 'package-supply') return 'PACKAGE';
    return 'DEFAULT';
  };

  const pattern = getLayoutPattern(product);

  const getNoteSubPattern = (product: Product) => {
    if (product.id === 'note-spring') return 'NOTE_SPIRAL';
    if (product.id === 'note-leather') return 'NOTE_LEATHER';
    if (product.id === 'note-saddle') return 'NOTE_SADDLE';
    return 'NOTE_SPIRAL';
  };

  const noteSubPattern = pattern === 'NOTE' ? getNoteSubPattern(product) : null;

  const FoldedPreview = ({ type, direction }: { type: string, direction: string }) => {
    const is3Fold = type === '3단 명함';
    const isVertical = direction === '세로형';

    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center gap-4 p-6 bg-zinc-50 rounded-3xl border border-zinc-100"
      >
        <div className={`relative ${isVertical ? 'w-32 h-48' : 'w-48 h-32'} bg-white rounded-lg border-2 border-zinc-200 shadow-sm overflow-hidden flex transition-all duration-500`}>
          {isVertical ? (
            <div className="flex flex-col w-full h-full">
              <div className="flex-1 border-b border-dashed border-emerald-400 relative">
                 <span className="absolute top-1 left-1 text-[8px] font-bold text-zinc-300 uppercase">Panel 1</span>
              </div>
              {is3Fold && <div className="flex-1 border-b border-dashed border-emerald-400 relative">
                 <span className="absolute top-1 left-1 text-[8px] font-bold text-zinc-300 uppercase">Panel 2</span>
              </div>}
              <div className="flex-1 relative">
                 <span className="absolute top-1 left-1 text-[8px] font-bold text-zinc-300 uppercase">{is3Fold ? 'Panel 3' : 'Panel 2'}</span>
              </div>
            </div>
          ) : (
            <div className="flex w-full h-full">
              <div className="flex-1 border-r border-dashed border-emerald-400 relative">
                 <span className="absolute top-1 left-1 text-[8px] font-bold text-zinc-300 uppercase">Panel 1</span>
              </div>
              {is3Fold && <div className="flex-1 border-r border-dashed border-emerald-400 relative">
                 <span className="absolute top-1 left-1 text-[8px] font-bold text-zinc-300 uppercase">Panel 2</span>
              </div>}
              <div className="flex-1 relative">
                 <span className="absolute top-1 left-1 text-[8px] font-bold text-zinc-300 uppercase">{is3Fold ? 'Panel 3' : 'Panel 2'}</span>
              </div>
            </div>
          )}
        </div>
        <div className="text-center space-y-1">
          <p className="text-xs font-black text-zinc-900">{type} {direction}</p>
          <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">
            {is3Fold ? '2개의 접는 선 (오시)' : '1개의 접는 선 (오시)'}
          </p>
        </div>
      </motion.div>
    );
  };

  const WorkPrecautions = () => (
    <div className="mt-12 p-8 bg-zinc-900 rounded-[32px] text-white space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center">
          <FileText className="w-4 h-4 text-emerald-400" />
        </div>
        <div>
          <h4 className="text-sm font-black tracking-tight">작업 유의사항 안내</h4>
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Folded Card Work Guide</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
        {[
          '모든 데이터는 작업 사이즈 기준으로 접수',
          '상하좌우 2mm 재단 여유 포함',
          '중요한 텍스트/로고는 재단선 안쪽 3mm 이상',
          '재단 오차 1~2mm 가능',
          '300dpi 이상 권장',
          '오시는 템플릿 위치 기준 진행',
          '접지 명함은 접힌 상태로 배송되지 않음'
        ].map((text, i) => (
          <div key={i} className="flex items-start gap-3 group">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0 group-hover:scale-125 transition-transform" />
            <span className="text-[11px] font-medium text-zinc-400 leading-relaxed group-hover:text-zinc-200 transition-colors">
              {text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  // Initialize expanded group based on default selected material
  useEffect(() => {
    if (pattern === 'DESIGN_CARD' && selectedOptions['수량']) {
      const qty = parseInt(selectedOptions['수량'].replace('매', '')) || 100;
      if (qty !== quantity) {
        setQuantity(qty);
      }
    }
  }, [selectedOptions['수량'], pattern]);

  useEffect(() => {
    if (pattern === 'STICKER') {
      const materialOption = product.options.find(opt => opt.name.includes('재질') || opt.name.includes('용지'));
      if (materialOption) {
        const selectedValue = selectedOptions[materialOption.name];
        const material = PAPER_MATERIALS.find(m => m.name === selectedValue);
        if (material) {
          setExpandedGroup(material.group);
        } else {
          setExpandedGroup('일반/기본 용지');
        }
      }
    } else if (pattern === 'POSTCARD') {
      const config = POSTCARD_CONFIG[product.id];
      
      if (product.id === 'stk-postcard-special') {
        setSelectedPostcardGroup(null);
        const materialOption = product.options.find(opt => opt.name.includes('용지'));
        if (materialOption && !selectedOptions[materialOption.name]) {
          handleOptionChange(materialOption.name, '아트지 250g');
        }
      } else if (config) {
        const currentGroup = selectedOptions['용지 그룹'] || config.allowedGroups?.[0] || '기본 대중형';
        setSelectedPostcardGroup(currentGroup);
        
        const materialOption = product.options.find(opt => opt.name === '상세 용지 (기본)') || 
                               product.options.find(opt => opt.name.includes('용지') && opt.name !== '용지 그룹');
        if (materialOption) {
          const currentVal = selectedOptions[materialOption.name];
          const currentMaterial = POSTCARD_MATERIALS.find(m => `${m.name} ${m.weight}` === currentVal);
          
          if (!currentVal || !currentMaterial || !config.allowedGroups?.includes(currentMaterial.group)) {
            const firstMaterial = POSTCARD_MATERIALS.find(m => m.group === currentGroup);
            if (firstMaterial) {
              handleOptionChange(materialOption.name, `${firstMaterial.name} ${firstMaterial.weight}`);
            }
          }
        }
      }
    } else if (pattern === 'BUSINESS_CARD') {
      const materialOption = product.options.find(opt => opt.name.includes('용지'));
      if (materialOption) {
        const selectedValue = selectedOptions[materialOption.name];
        const material = BUSINESS_CARD_MATERIALS.find(m => `${m.name} ${m.weight}` === selectedValue);
        if (material) {
          setSelectedBusinessCardGroup(material.group);
        } else {
          // Default to first available group for this product
          const availableGroups = Array.from(new Set(product.options.find(opt => opt.name.includes('용지'))?.values?.map(v => {
            const m = BUSINESS_CARD_MATERIALS.find(bm => `${bm.name} ${bm.weight}` === v.label);
            return m?.group;
          }).filter(Boolean)));
          setSelectedBusinessCardGroup((availableGroups[0] as string) || '기본 대중형');
        }
      }
    }
  }, [product.id, pattern]);

  useEffect(() => {
    let pricePerUnit = product.basePrice;
    
    product.options.forEach(opt => {
      // Check conditional visibility
      if (opt.visibleIf) {
        const parentVal = selectedOptions[opt.visibleIf.optionName];
        if (parentVal !== opt.visibleIf.value) return;
      }

      if (opt.values) {
        if (opt.type === 'checkbox') {
          const selectedList = selectedOptions[opt.name]?.split(', ').filter(Boolean) || [];
          if (opt.name === '재단 방식') {
            // Special logic for combined cutting
            if (selectedList.includes('완칼 재단') && selectedList.includes('반칼 재단')) {
              pricePerUnit += 1500;
            } else {
              selectedList.forEach(valLabel => {
                const val = opt.values?.find(v => v.label === valLabel);
                if (val?.priceModifier) pricePerUnit += val.priceModifier;
              });
            }
          } else {
            selectedList.forEach(valLabel => {
              const val = opt.values?.find(v => v.label === valLabel);
              if (val?.priceModifier) pricePerUnit += val.priceModifier;
            });
          }
        } else {
          const selectedValue = opt.values.find(v => v.label === selectedOptions[opt.name]);
          if (selectedValue?.priceModifier) {
            pricePerUnit += selectedValue.priceModifier;
          }
        }
      }
    });

    // Quantity-based discount logic
    let currentDiscount = 0;
    if (quantity >= 1000) currentDiscount = 0.15;
    else if (quantity >= 500) currentDiscount = 0.10;
    else if (quantity >= 100) currentDiscount = 0.05;
    
    setDiscountRate(currentDiscount);
    const discountedUnitPrice = Math.round(pricePerUnit * (1 - currentDiscount));
    setUnitPrice(discountedUnitPrice);
    setTotalPrice(discountedUnitPrice * quantity);

    // Estimated delivery date calculation
    const days = parseInt(product.leadTime.match(/\d+/)?.[0] || '3');
    const date = new Date();
    date.setDate(date.getDate() + days + 2); // +2 for shipping/buffer
    setEstimatedDeliveryDate(date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' }));
  }, [product, quantity, selectedOptions]);

  const handleOptionChange = (name: string, value: string) => {
    const option = product.options.find(opt => opt.name === name);
    if (option?.type === 'checkbox') {
      setSelectedOptions(prev => {
        const currentValues = prev[name] ? prev[name].split(', ').filter(Boolean) : [];
        const newValues = currentValues.includes(value)
          ? currentValues.filter(v => v !== value)
          : [...currentValues, value];
        return { ...prev, [name]: newValues.join(', ') };
      });
    } else {
      setSelectedOptions(prev => ({ ...prev, [name]: value }));
    }
  };

  const handlePostcardGroupChange = (group: string) => {
    setSelectedPostcardGroup(group);
    
    // Automatically select the first material in the group
    // For general postcards, we specifically target '상세 용지 (기본)'
    const materialOption = product.options.find(opt => opt.name === '상세 용지 (기본)') || 
                           product.options.find(opt => opt.name.includes('용지') && opt.name !== '용지 그룹');
    
    if (materialOption) {
      const firstMaterial = POSTCARD_MATERIALS.find(m => m.group === group);
      if (firstMaterial) {
        handleOptionChange(materialOption.name, `${firstMaterial.name} ${firstMaterial.weight}`);
      }
    }
  };

  const handleGenerate = () => {
    if (pattern === 'MEMO_PAD' && selectedOptions['사이즈'] === '직접입력') {
      const w = parseInt(customSize.width) || 0;
      const h = parseInt(customSize.height) || 0;
      if (w > 90 || h > 90) {
        alert('직접입력 사이즈는 최대 90 x 90 mm 이하만 가능합니다.');
        return;
      }
    }

    const quotation: Quotation = {
      id: `Q-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      productId: product.id,
      productName: product.name,
      options: {
        ...selectedOptions,
        ...((selectedOptions['사이즈'] === '직접입력' || selectedOptions['규격(mm)'] === '직접입력' || selectedOptions['작업 사이즈'] === '직접입력') 
          ? { '사이즈 상세': `${customSize.width}x${customSize.height}mm` } 
          : {})
      },
      quantity,
      unitPrice,
      totalPrice,
      leadTime: product.leadTime,
      estimatedDeliveryDate,
      createdAt: new Date().toISOString(),
    };
    onGenerateQuotation(quotation);
  };

  return (
    <div className="bg-white rounded-[32px] border border-zinc-100 shadow-xl shadow-zinc-200/50 overflow-hidden">
      <div className="p-8 bg-zinc-900 text-white">
        <div className="flex items-center gap-3 mb-2">
          <Calculator className="w-5 h-5 text-emerald-400" />
          <h3 className="text-xl font-black tracking-tight">실시간 견적 계산기</h3>
        </div>
        <p className="text-zinc-400 text-sm">원하는 옵션을 선택하면 즉시 예상 금액을 확인하실 수 있습니다.</p>
      </div>

      <div className="p-8 space-y-8">
        {/* Quantity */}
        {pattern !== 'DESIGN_CARD' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-1 h-4 bg-emerald-500 rounded-full" />
                <Hash className="w-4 h-4 text-zinc-400" />
                <label className="text-sm font-black text-zinc-900 uppercase tracking-tight">주문 수량</label>
              </div>
              <span className="text-xs font-bold text-emerald-600">최소 {product.minQuantity}개부터</span>
            </div>
            <div className="flex items-center gap-4">
              <input 
                type="number" 
                min={product.minQuantity}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(product.minQuantity, parseInt(e.target.value) || 0))}
                className="flex-1 px-6 py-4 rounded-2xl bg-zinc-50 border border-zinc-100 focus:border-emerald-500 outline-none font-bold text-lg transition-colors h-[64px]"
              />
              <div className="flex gap-2 h-[64px]">
                {[10, 50, 100].map(add => (
                  <button 
                    key={add}
                    onClick={() => setQuantity(prev => prev + add)}
                    className="px-4 py-4 rounded-xl bg-zinc-100 text-zinc-600 text-xs font-bold hover:bg-zinc-200 transition-colors h-full"
                  >
                    +{add}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Options */}
        <div className="space-y-8">
          {/* Drawing Book Options */}
          {pattern === 'DRAWING_BOOK' && (
            <div className="space-y-10">
              {product.options.map((option) => {
                const isSelected = (val: string) => selectedOptions[option.name] === val;
                
                return (
                  <div key={option.name} className="space-y-6">
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-4 bg-emerald-500 rounded-full" />
                      {option.name === '규격' && <Layout className="w-4 h-4 text-zinc-400" />}
                      {option.name === '제본 방향' && <Settings className="w-4 h-4 text-zinc-400" />}
                      {option.name === '커버 종류' && <Book className="w-4 h-4 text-zinc-400" />}
                      {option.name === '표지 코팅' && <Sparkles className="w-4 h-4 text-zinc-400" />}
                      {option.name === '용지' && <Layers className="w-4 h-4 text-zinc-400" />}
                      {option.name === '스프링 색상' && <Palette className="w-4 h-4 text-zinc-400" />}
                      <label className="text-sm font-black text-zinc-900 uppercase tracking-tight">{option.name}</label>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {option.values?.map((val) => {
                        const active = isSelected(val.label);
                        const isSimpleButton = option.name === '표지 코팅';
                        const icon = option.name === '규격' ? NOTE_SIZE_ICONS[val.label] : 
                                     option.name === '제본 방향' ? FOLDING_DIRECTION_ICONS[val.label] :
                                     option.name === '커버 종류' ? COVER_TYPE_ICONS[val.label] :
                                     option.name === '용지' ? NOTE_INNER_ICONS[val.label] :
                                     option.name === '스프링 색상' ? SPRING_COLOR_ICONS[val.label] : null;

                        return (
                          <button
                            key={val.label}
                            onClick={() => handleOptionChange(option.name, val.label)}
                            className={`flex ${isSimpleButton ? 'flex-row justify-center py-4' : 'flex-col items-center gap-3 p-4'} rounded-2xl border-2 transition-all ${
                              active
                                ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg scale-[1.02]'
                                : 'bg-white border-zinc-100 text-zinc-500 hover:border-zinc-200'
                            }`}
                          >
                            {!isSimpleButton && icon && (
                              <div className={`${active ? 'text-emerald-400' : 'text-zinc-300'}`}>
                                {icon}
                              </div>
                            )}
                            <span className="text-xs font-black">{val.label}</span>
                            {val.priceModifier !== 0 && (
                              <span className={`text-[10px] font-bold ${active ? 'text-emerald-400' : 'text-emerald-600'}`}>
                                +{val.priceModifier.toLocaleString()}원
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Postcard Material Selection */}
          {pattern === 'POSTCARD' && (() => {
            const config = POSTCARD_CONFIG[product.id];
            const materialOptionName = product.options.find(opt => opt.name === '상세 용지 (기본)')?.name || 
                                     product.options.find(opt => opt.name.includes('용지') && opt.name !== '용지 그룹')?.name || '용지 선택';
            
            if (product.id === 'stk-postcard-special') {
              return (
                <div className="space-y-6">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-4 bg-emerald-500 rounded-full" />
                    <Layers className="w-4 h-4 text-zinc-400" />
                    <label className="text-sm font-black text-zinc-900 uppercase tracking-tight">용지 선택</label>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {['아트지 250g', '스노우 250g'].map((label) => {
                      const isSelected = selectedOptions[materialOptionName] === label;
                      return (
                        <button
                          key={label}
                          onClick={() => handleOptionChange(materialOptionName, label)}
                          className={`py-4 px-5 rounded-2xl text-sm font-bold border transition-all ${
                            isSelected
                              ? 'bg-zinc-900 border-zinc-900 text-white shadow-lg'
                              : 'bg-white border-zinc-200 text-zinc-600 hover:border-zinc-400'
                          }`}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            }

            if (!config) return null;

            const availableGroups = config.allowedGroups || ['기본 대중형'];

            return (
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-4 bg-emerald-500 rounded-full" />
                  <Layers className="w-4 h-4 text-zinc-400" />
                  <label className="text-sm font-black text-zinc-900 uppercase tracking-tight">
                    {materialOptionName}
                  </label>
                </div>
                
                <div className="space-y-6">
                  {/* Show group selection if more than one group is allowed */}
                  {availableGroups.length > 1 && (
                    <div className="grid grid-cols-2 gap-3">
                      {availableGroups.map((group) => (
                        <button
                          key={group}
                          onClick={() => handlePostcardGroupChange(group)}
                          className={`py-4 px-5 rounded-2xl text-sm font-bold border transition-all ${
                            selectedPostcardGroup === group
                              ? 'bg-zinc-900 border-zinc-900 text-white shadow-lg'
                              : 'bg-white border-zinc-200 text-zinc-600 hover:border-zinc-400'
                          }`}
                        >
                          {group}
                        </button>
                      ))}
                    </div>
                  )}

                  {selectedPostcardGroup && (
                    <div className="grid grid-cols-1 gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                      {POSTCARD_MATERIALS.filter(m => m.group === selectedPostcardGroup).map((material) => {
                        const isSelected = selectedOptions[materialOptionName] === `${material.name} ${material.weight}`;
                        
                        return (
                          <button
                            key={material.id}
                            onClick={() => handleOptionChange(materialOptionName, `${material.name} ${material.weight}`)}
                            className={`p-5 rounded-2xl border text-left transition-all relative group ${
                              isSelected
                                ? 'bg-emerald-50 border-emerald-500 ring-1 ring-emerald-500'
                                : 'bg-white border-zinc-100 hover:border-zinc-300'
                            }`}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <span className={`text-sm font-black ${isSelected ? 'text-emerald-900' : 'text-zinc-900'}`}>
                                  {material.name}
                                </span>
                                <span className="ml-2 text-xs text-zinc-400 font-bold">{material.weight}</span>
                              </div>
                              <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-tighter ${
                                isSelected ? 'bg-emerald-200 text-emerald-700' : 'bg-zinc-100 text-zinc-500'
                              }`}>
                                {material.recommendationLabel}
                              </span>
                            </div>
                            <p className={`text-[11px] leading-relaxed ${isSelected ? 'text-emerald-700/70' : 'text-zinc-500'}`}>
                              {material.features}
                            </p>
                            
                            {isSelected && (
                              <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="mt-4 pt-4 border-t border-emerald-100 space-y-2"
                              >
                                <div className="flex gap-2">
                                  <span className="text-[10px] font-black text-emerald-600 uppercase shrink-0">추천용도:</span>
                                  <span className="text-[10px] text-emerald-800/70">{material.recommendedUse}</span>
                                </div>
                                <div className="flex gap-2">
                                  <span className="text-[10px] font-black text-amber-600 uppercase shrink-0">주의사항:</span>
                                  <span className="text-[10px] text-amber-800/70">{material.precautions}</span>
                                </div>
                              </motion.div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })()}

          {/* Business Card Material Selection */}
          {pattern === 'BUSINESS_CARD' && product.options.filter(opt => opt.name.includes('용지')).map((option) => (
            <div key={option.name} className="space-y-6">
              <div className="flex items-center gap-2">
                <div className="w-1 h-4 bg-emerald-500 rounded-full" />
                <Layers className="w-4 h-4 text-zinc-400" />
                <label className="text-sm font-black text-zinc-900 uppercase tracking-tight">
                  {option.name}
                </label>
              </div>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-3">
                  {['기본 대중형', '고급 감성형', '내추럴/친환경형', '특수지/프리미엄형']
                    .filter(group => {
                      if (product.id === 'bc-standard') return group === '기본 대중형';
                      if (product.id === 'bc-premium') return group !== '기본 대중형';
                      return true;
                    })
                    .map((group) => (
                      <button
                        key={group}
                        onClick={() => setSelectedBusinessCardGroup(group)}
                        className={`py-4 px-5 rounded-2xl text-sm font-bold border transition-all ${
                          selectedBusinessCardGroup === group
                            ? 'bg-zinc-900 border-zinc-900 text-white shadow-lg'
                            : 'bg-white border-zinc-200 text-zinc-600 hover:border-zinc-400'
                        }`}
                      >
                        {group}
                      </button>
                    ))}
                </div>

                {selectedBusinessCardGroup && (
                  <div className="grid grid-cols-1 gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                    {BUSINESS_CARD_MATERIALS.filter(m => m.group === selectedBusinessCardGroup).map((material) => {
                        const isSelected = selectedOptions[option.name] === `${material.name} ${material.weight}`;
                        return (
                          <button
                            key={material.id}
                            onClick={() => handleOptionChange(option.name, `${material.name} ${material.weight}`)}
                            className={`p-5 rounded-2xl border text-left transition-all relative group ${
                              isSelected
                                ? 'bg-emerald-50 border-emerald-500 ring-1 ring-emerald-500'
                                : 'bg-white border-zinc-100 hover:border-zinc-300'
                            }`}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <span className={`text-sm font-black ${isSelected ? 'text-emerald-900' : 'text-zinc-900'}`}>
                                  {material.name}
                                </span>
                                <span className="ml-2 text-xs text-zinc-400 font-bold">{material.weight}</span>
                              </div>
                              <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-tighter ${
                                isSelected ? 'bg-emerald-200 text-emerald-700' : 'bg-zinc-100 text-zinc-500'
                              }`}>
                                {material.recommendationLabel}
                              </span>
                            </div>
                            <p className={`text-[11px] leading-relaxed ${isSelected ? 'text-emerald-700/70' : 'text-zinc-500'}`}>
                              {material.features}
                            </p>
                            
                            {isSelected && (
                              <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="mt-4 pt-4 border-t border-emerald-100 space-y-2"
                              >
                                <div className="flex gap-2">
                                  <span className="text-[10px] font-black text-emerald-600 uppercase shrink-0">추천용도:</span>
                                  <span className="text-[10px] text-emerald-800/70">{material.recommendedUse}</span>
                                </div>
                                <div className="flex gap-2">
                                  <span className="text-[10px] font-black text-amber-600 uppercase shrink-0">주의사항:</span>
                                  <span className="text-[10px] text-amber-800/70">{material.precautions}</span>
                                </div>
                              </motion.div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                )}
              </div>
            </div>
          ))}

          {/* Default Options */}
          {pattern !== 'DRAWING_BOOK' && pattern !== 'POSTCARD' && pattern !== 'BUSINESS_CARD' && pattern !== 'DESIGN_CARD' && pattern !== 'NOTE' && (
            <div className="space-y-8">
              {product.options.map((option) => {
                const isSelected = (val: string) => selectedOptions[option.name] === val;
                
                return (
                  <div key={option.name} className="space-y-6">
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-4 bg-emerald-500 rounded-full" />
                      <label className="text-sm font-black text-zinc-900 uppercase tracking-tight">{option.name}</label>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {option.values?.map((val) => {
                        const active = isSelected(val.label);
                        return (
                          <button
                            key={val.label}
                            onClick={() => handleOptionChange(option.name, val.label)}
                            className={`py-4 px-5 rounded-2xl text-sm font-bold border transition-all ${
                              active
                                ? 'bg-zinc-900 border-zinc-900 text-white shadow-lg scale-[1.02]'
                                : 'bg-white border-zinc-100 text-zinc-600 hover:border-zinc-400'
                            }`}
                          >
                            {val.label}
                            {val.priceModifier !== 0 && (
                              <span className={`ml-2 text-[10px] ${active ? 'text-emerald-400' : 'text-emerald-600'}`}>
                                +{val.priceModifier.toLocaleString()}원
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Business Card, Design Card & Postcard Post-processing Options (Icon Grid Pattern) */}
          {(pattern === 'BUSINESS_CARD' || pattern === 'DESIGN_CARD' || pattern === 'POSTCARD') && (() => {
            const config = pattern === 'POSTCARD' ? POSTCARD_CONFIG[product.id] : null;
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
                  {/* Icon Grid */}
                  <div className="grid grid-cols-4 gap-3">
                    {[
                      { 
                        id: 'shape-cutting', 
                        name: '모양커팅', 
                        icon: <Shapes className="w-5 h-5" />, 
                        active: true, 
                        hidden: !config?.allowedPostProcessing?.includes('모양커팅')
                      },
                      { 
                        id: 'coating', 
                        name: '코팅', 
                        icon: <Layers className="w-5 h-5" />, 
                        active: selectedOptions['코팅'] !== '없음', 
                        hidden: product.id === 'bc-premium' || (config?.allowedPostProcessing && !config.allowedPostProcessing.includes('코팅'))
                      },
                      { 
                        id: 'rounding', 
                        name: '귀돌이', 
                        icon: <Scissors className="w-5 h-5" />, 
                        active: selectedOptions['귀돌이'] === '있음',
                        hidden: config?.allowedPostProcessing && !config.allowedPostProcessing.includes('귀돌이')
                      },
                      { 
                        id: 'punching', 
                        name: '타공', 
                        icon: <Droplets className="w-5 h-5" />, 
                        active: selectedOptions['타공'] === '있음', 
                        hidden: pattern === 'DESIGN_CARD' || (config?.allowedPostProcessing && !config.allowedPostProcessing.includes('타공'))
                      },
                      { 
                        id: 'creasing', 
                        name: '오시', 
                        icon: <Paintbrush className="w-5 h-5" />, 
                        active: selectedOptions['오시'] === '있음', 
                        hidden: pattern !== 'POSTCARD' || (config?.allowedPostProcessing && !config.allowedPostProcessing.includes('오시'))
                      },
                      { 
                        id: 'perforation', 
                        name: '미싱', 
                        icon: <Scissors className="w-5 h-5" />, 
                        active: selectedOptions['미싱'] === '있음', 
                        hidden: pattern !== 'POSTCARD' || (config?.allowedPostProcessing && !config.allowedPostProcessing.includes('미싱'))
                      },
                      { 
                        id: 'folding', 
                        name: '접지', 
                        icon: <FileUp className="w-5 h-5" />, 
                        active: selectedOptions['접지'] === '있음', 
                        hidden: pattern !== 'POSTCARD' || (config?.allowedPostProcessing && !config.allowedPostProcessing.includes('접지'))
                      },
                      { 
                        id: 'packaging', 
                        name: '포장', 
                        icon: <ShoppingCart className="w-5 h-5" />, 
                        active: selectedOptions['폴리백 개별포장'] === '있음', 
                        hidden: pattern !== 'POSTCARD' || (config?.allowedPostProcessing && !config.allowedPostProcessing.includes('폴리백 개별포장'))
                      },
                      { 
                        id: 'case', 
                        name: '케이스', 
                        icon: <Package className="w-5 h-5" />, 
                        active: selectedOptions['명함케이스'] !== '없음', 
                        hidden: pattern === 'DESIGN_CARD' || pattern === 'POSTCARD'
                      }
                    ].filter(item => !item.hidden).map(item => {
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

                {/* Expanded Sub-options */}
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
                          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                            <div className="flex items-center gap-2 mb-2">
                              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                              <span className="text-xs font-bold text-emerald-900">기본 포함 항목</span>
                            </div>
                            <p className="text-[11px] text-emerald-700 leading-relaxed">
                              모양 엽서는 모양커팅 가공이 기본 포함됩니다.
                            </p>
                          </div>
                          <div className="grid grid-cols-1 gap-2">
                            <button
                              disabled
                              className="py-3 rounded-xl text-[11px] font-bold border bg-zinc-900 border-zinc-900 text-white shadow-md cursor-default"
                            >
                              기본 포함
                            </button>
                          </div>
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
                            {product.options.find(o => o.name === '타공')?.values.map(v => (
                              <button
                                key={v.label}
                                onClick={() => handleOptionChange('타공', v.label)}
                                className={`py-3 rounded-xl text-[11px] font-bold border transition-all ${
                                  selectedOptions['타공'] === v.label
                                    ? 'bg-zinc-900 border-zinc-900 text-white shadow-md'
                                    : 'bg-white border-zinc-200 text-zinc-500 hover:border-emerald-200'
                                }`}
                              >
                                {v.label}
                              </button>
                            ))}
                          </div>
                          {selectedOptions['타공'] === '있음' && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-top-1">
                              <div className="space-y-2">
                                <span className="text-[10px] font-bold text-zinc-400 uppercase">타공 크기</span>
                                <div className="grid grid-cols-3 gap-2">
                                  {product.options.find(o => o.name === '타공 크기')?.values.map(v => (
                                    <button
                                      key={v.label}
                                      onClick={() => handleOptionChange('타공 크기', v.label)}
                                      className={`py-2 rounded-lg text-[11px] font-bold border transition-all ${
                                        selectedOptions['타공 크기'] === v.label
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
                              {product.options.find(o => o.name === '오시')?.values.map(v => (
                                <button
                                  key={v.label}
                                  onClick={() => handleOptionChange('오시', v.label)}
                                  className={`py-3 rounded-xl text-[11px] font-bold border transition-all ${
                                    selectedOptions['오시'] === v.label
                                      ? 'bg-zinc-900 border-zinc-900 text-white shadow-md'
                                      : 'bg-white border-zinc-200 text-zinc-500 hover:border-emerald-200'
                                  }`}
                                >
                                  {v.label}
                                </button>
                              ))}
                            </div>
                            {selectedOptions['오시'] === '있음' && (
                              <div className="space-y-4 animate-in fade-in slide-in-from-top-1">
                                <div className="space-y-2">
                                  <span className="text-[10px] font-bold text-zinc-400 uppercase">줄 수</span>
                                  <div className="grid grid-cols-3 gap-2">
                                    {product.options.find(o => o.name === '오시 줄 수')?.values.map(v => (
                                      <button
                                        key={v.label}
                                        onClick={() => handleOptionChange('오시 줄 수', v.label)}
                                        className={`py-2 rounded-lg text-[11px] font-bold border transition-all ${
                                          selectedOptions['오시 줄 수'] === v.label
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
                              {product.options.find(o => o.name === '미싱')?.values.map(v => (
                                <button
                                  key={v.label}
                                  onClick={() => handleOptionChange('미싱', v.label)}
                                  className={`py-3 rounded-xl text-[11px] font-bold border transition-all ${
                                    selectedOptions['미싱'] === v.label
                                      ? 'bg-zinc-900 border-zinc-900 text-white shadow-md'
                                      : 'bg-white border-zinc-200 text-zinc-500 hover:border-emerald-200'
                                  }`}
                                >
                                  {v.label}
                                </button>
                              ))}
                            </div>
                            {selectedOptions['미싱'] === '있음' && (
                              <div className="space-y-4 animate-in fade-in slide-in-from-top-1">
                                <div className="space-y-2">
                                  <span className="text-[10px] font-bold text-zinc-400 uppercase">줄 수</span>
                                  <div className="grid grid-cols-3 gap-2">
                                    {product.options.find(o => o.name === '미싱 줄 수')?.values.map(v => (
                                      <button
                                        key={v.label}
                                        onClick={() => handleOptionChange('미싱 줄 수', v.label)}
                                        className={`py-2 rounded-lg text-[11px] font-bold border transition-all ${
                                          selectedOptions['미싱 줄 수'] === v.label
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
                              {product.options.find(o => o.name === '접지')?.values.map(v => (
                                <button
                                  key={v.label}
                                  onClick={() => handleOptionChange('접지', v.label)}
                                  className={`py-3 rounded-xl text-[11px] font-bold border transition-all ${
                                    selectedOptions['접지'] === v.label
                                      ? 'bg-zinc-900 border-zinc-900 text-white shadow-md'
                                      : 'bg-white border-zinc-200 text-zinc-500 hover:border-emerald-200'
                                  }`}
                                >
                                  {v.label}
                                </button>
                              ))}
                            </div>
                            {selectedOptions['접지'] === '있음' && (
                              <div className="space-y-6 animate-in fade-in slide-in-from-top-1">
                                  <div className="space-y-3">
                                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">접지 방향</span>
                                    <div className="flex gap-4">
                                      {product.options.find(o => o.name === '접지 방향')?.values.map(v => (
                                        <div key={v.label} className="flex flex-col items-center gap-2">
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
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                  <div className="space-y-3">
                                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">접지 형태</span>
                                    <div className="flex flex-wrap gap-x-2 gap-y-4 justify-start">
                                      {product.options.find(o => o.name === '접지 형태')?.values.map(v => (
                                        <div key={v.label} className="flex flex-col items-center gap-2 w-[calc(25%-8px)] min-w-[60px]">
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
                          {product.options.find(o => o.name === '명함케이스')?.values.map(v => (
                            <button
                              key={v.label}
                              onClick={() => handleOptionChange('명함케이스', v.label)}
                              className={`w-full py-3 px-4 rounded-xl text-[11px] font-bold border transition-all text-left flex items-center justify-between ${
                                selectedOptions['명함케이스'] === v.label
                                  ? 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-sm'
                                  : 'bg-white border-zinc-100 text-zinc-500 hover:border-zinc-300'
                              }`}
                            >
                              <span>{v.label}</span>
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
        })()}

          {/* 1. Material Selection (Special UI for Stickers) */}
          {pattern === 'STICKER' && product.options.filter(opt => opt.name.includes('재질') || opt.name.includes('용지')).map((option) => (
            <div key={option.name} className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-1 h-4 bg-emerald-500 rounded-full" />
                <label className="text-sm font-black text-zinc-900 uppercase tracking-tight">
                  {option.name}
                </label>
              </div>
              <div className="space-y-3">
                {['일반/기본 용지', '방수/합성지', '투명/PET', '메탈/광택 특수 재질', '프리미엄 라벨(GMUND)'].map(group => {
                  const materialsInGroup = PAPER_MATERIALS.filter(m => m.group === group);
                  
                  if (materialsInGroup.length === 0) return null;

                  const isExpanded = expandedGroup === group;
                  const hasSelectedInGroup = materialsInGroup.some(m => selectedOptions[option.name] === m.name);

                  return (
                    <div key={group} className="border border-zinc-100 rounded-2xl overflow-hidden bg-zinc-50/50">
                      <button
                        onClick={() => setExpandedGroup(isExpanded ? null : group)}
                        className={`w-full px-6 py-4 flex items-center justify-between transition-colors ${
                          isExpanded ? 'bg-zinc-100' : 'hover:bg-zinc-100/50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`text-xs font-black uppercase tracking-widest ${
                            hasSelectedInGroup ? 'text-emerald-600' : 'text-zinc-500'
                          }`}>
                            {group}
                          </span>
                          {hasSelectedInGroup && !isExpanded && (
                            <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                              {selectedOptions[option.name]}
                            </span>
                          )}
                        </div>
                        {isExpanded ? <ChevronUp className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
                      </button>
                      
                      {isExpanded && (
                        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-2 bg-white">
                          {materialsInGroup.map((material) => {
                            const isSelected = selectedOptions[option.name] === material.name;
                            const productOptionValue = option.values?.find(v => v.label === material.name);
                            
                            // Use price modifier from product if available, otherwise use a default based on group
                            let priceModifier = productOptionValue?.priceModifier;
                            if (priceModifier === undefined) {
                              if (group === '일반/기본 용지') priceModifier = 0;
                              else if (group === '방수/합성지') priceModifier = 500;
                              else if (group === '투명/PET') priceModifier = 1500;
                              else if (group === '메탈/광택 특수 재질') priceModifier = 2000;
                              else if (group === '프리미엄 라벨(GMUND)') priceModifier = 3000;
                              else priceModifier = 0;
                            }
                            
                            return (
                              <button
                                key={material.id}
                                onClick={() => handleOptionChange(option.name, material.name)}
                                className={`group p-4 rounded-xl text-left border transition-all ${
                                  isSelected
                                    ? 'bg-emerald-50 border-emerald-500 ring-1 ring-emerald-500'
                                    : 'bg-white border-zinc-100 hover:border-emerald-200 hover:bg-zinc-50'
                                }`}
                              >
                                <div className="flex items-center justify-between mb-1">
                                  <span className={`text-sm font-bold ${isSelected ? 'text-emerald-900' : 'text-zinc-900'}`}>
                                    {material.name}
                                  </span>
                                  {priceModifier !== 0 && (
                                    <span className={`text-[10px] font-bold ${isSelected ? 'text-emerald-600' : 'text-zinc-400'}`}>
                                      {priceModifier > 0 ? `+${priceModifier.toLocaleString()}원` : `${priceModifier.toLocaleString()}원`}
                                    </span>
                                  )}
                                </div>
                                {material.shortDescription && (
                                  <p className={`text-[11px] leading-relaxed ${isSelected ? 'text-emerald-700/70' : 'text-zinc-400'}`}>
                                    {material.shortDescription}
                                  </p>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* 2. Standard Options */}
          {pattern === 'NOTE' && (
            <div className="mb-10 p-8 rounded-[40px] bg-zinc-50 border border-zinc-100 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center shadow-sm">
                  <Settings className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <p className="text-xs font-black text-zinc-900 uppercase tracking-tight">기본 사양 요약</p>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Base Specifications</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center shadow-sm shrink-0">
                    <BookOpen className="w-5 h-5 text-zinc-400" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-zinc-400 mb-1 uppercase tracking-widest">표지/커버</p>
                    <p className="text-sm font-black text-zinc-900 leading-tight">
                      {product.id === 'note-spring' ? '스노우 300g + 무광코팅' : product.id === 'note-saddle' ? `스노우 200g + ${selectedOptions['표지 코팅'] || '무광코팅'}` : '프리미엄 인조가죽'}
                    </p>
                    <p className="text-[10px] text-zinc-500 mt-1 leading-relaxed">
                      {product.id === 'note-spring' ? '두툼하고 부드러운 질감' : product.id === 'note-saddle' ? '가볍고 유연한 표지' : '고급스러운 질감과 내구성'}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center shadow-sm shrink-0">
                    <FileText className="w-5 h-5 text-zinc-400" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-zinc-400 mb-1 uppercase tracking-widest">내지 용지</p>
                    <p className="text-sm font-black text-zinc-900 leading-tight">
                      {product.id === 'note-spring' ? '백색 모조 80g' : product.id === 'note-saddle' ? '백색 모조 100g' : '미색 모조 100g'}
                    </p>
                    <p className="text-[10px] text-zinc-500 mt-1 leading-relaxed">
                      비침이 적고 필기감이 부드러운 용지
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {pattern !== 'DRAWING_BOOK' && (product.id === 'note-saddle' ? [...product.options, { name: '제본 안내', type: 'radio', values: [] }] : product.options).filter(opt => {
            const normalizedName = opt.name.replace(/\s/g, '');
            const isIconGridPattern = pattern === 'BUSINESS_CARD' || pattern === 'DESIGN_CARD' || pattern === 'POSTCARD';

            // Check conditional visibility
            if (opt.visibleIf) {
              const parentVal = selectedOptions[opt.visibleIf.optionName];
              if (parentVal !== opt.visibleIf.value) return false;
            }

            // Exclude options handled by icon grid or redundant quantity
            if (isIconGridPattern) {
              const handledByIconGrid = [
                '코팅', '코팅종류', '코팅면수', '귀돌이', '귀돌이사용', '귀돌이크기', '귀돌이면수', '귀돌이방향', 
                '타공', '타공사용', '구멍크기', '타공크기', '타공설명', '명함케이스',
                '오시', '오시줄수', '오시설명', '미싱', '미싱줄수', '미싱설명', '접지', '접지방향', '접지형태', 
                '폴리백개별포장', '폴리백사이즈', '제작수량', '수량', '주문수량'
              ].includes(normalizedName);
              if (handledByIconGrid) return false;
            }

            if (pattern === 'DESIGN_CARD') {
              // Only show basic specs in standard list, user info and finishing handled specially
              return !['코팅', '귀돌이', '귀돌이 크기', '귀돌이 면수', '귀돌이 방향', '템플릿 선택', '이름', '직함', '연락처', '이메일', '주소/SNS', '로고 업로드', '요청사항'].includes(opt.name);
            }

            if (pattern === 'STICKER') {
              return !opt.name.includes('재질') && 
                     !opt.name.includes('용지') && 
                     !['재단방식', '코팅유무', '후가공옵션', '화이트인쇄', '넘버링', '스코딕스', '포장옵션', '부분UV', '모양코팅', '제작수량', '수량', '주문수량'].includes(normalizedName);
            }

            // General exclusions for all patterns
            const generalExclusions = [
              '재단방식', '코팅유무', '후가공옵션', '후가공', '화이트인쇄', '넘버링', '스코딕스', '포장옵션', 
              '부분UV', '모양코팅', '표지코팅', '코팅방식', '코팅', '코팅면수', '귀돌이', '귀돌이크기', '귀돌이면수', '귀돌이방향',
              '타공', '타공크기', '타공설명', '오시', '오시줄수', '오시설명', '미싱', '미싱줄수', '미싱설명',
              '접지', '접지방향', '접지형태', '폴리백개별포장', '폴리백사이즈', '명함케이스',
              '후가공효과', '제작수량', '수량', '주문수량', '후가공선택', '모양커팅',
              '낱장 접착', '측면 인쇄', '엣지디자인', '거치대', '케이스'
            ];
            
            if (generalExclusions.includes(normalizedName)) {
              // Special case: allow certain options for NOTE pattern
              if (pattern === 'NOTE' && (normalizedName === '표지코팅' || normalizedName === '커버인쇄' || normalizedName === '엣지마감')) {
                // Continue
              } else {
                return false;
              }
            }

            if (pattern === 'MEMO_PAD') {
              const memoExclusions = [
                '후가공', '낱장 접착', '측면 인쇄', '엣지디자인', '거치대', '케이스',
                '제작수량', '수량', '주문수량'
              ];
              if (memoExclusions.includes(normalizedName)) return false;
              if (normalizedName === '용지') return false;
              return true;
            }

            if (pattern === 'NOTE') {
              const noteExclusions = ['제작수량', '수량', '주문수량'];
              if (noteExclusions.includes(normalizedName)) return false;
              return true;
            }

            if (opt.name.includes('용지')) return false;

            return true;
          }).sort((a, b) => {
            if (pattern === 'NOTE') {
              const springOrder = ['규격', '표지 구성', '표지 코팅', '내지 종류', '내지 색상', '내지 장수', '스프링 방향', '스프링 색상'];
              const leatherOrder = ['규격', '커버 스타일', '커버 인쇄', '엣지 마감', '내지 종류', '내지 색상', '내지 장수'];
              const saddleOrder = ['규격', '표지 구성', '표지 코팅', '내지 종류', '내지 색상', '페이지 수', '제본 안내'];
              const order = product.id === 'note-spring' ? springOrder : product.id === 'note-saddle' ? saddleOrder : leatherOrder;
              return order.indexOf(a.name) - order.indexOf(b.name);
            }
            return 0;
          }).map((option, index, array) => (
            <div key={option.name} className="space-y-4">
              {pattern === 'NOTE' && (() => {
                const currentGroup = getNoteGroup(option.name);
                const prevOption = array[index - 1];
                const prevGroup = prevOption ? getNoteGroup(prevOption.name) : null;
                
                if (currentGroup && currentGroup !== prevGroup) {
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
              {pattern === 'MEMO_PAD' && option.name === '두께' && (
                <div className="space-y-4 pb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-4 bg-emerald-500 rounded-full" />
                    <label className="text-sm font-black text-zinc-900 uppercase tracking-tight">
                      기본 용지 사양
                    </label>
                  </div>
                  <div className="p-6 rounded-3xl bg-zinc-50 border border-zinc-100 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white border border-zinc-200 flex items-center justify-center shadow-sm">
                      <FileText className="w-6 h-6 text-zinc-400" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-zinc-900">백색 모조지 70g</p>
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5">Fixed Specification</p>
                      <p className="text-[10px] text-zinc-500 mt-1 leading-relaxed">
                        필기감이 우수하고 잉크 번짐이 적어<br />
                        메모지 제작에 가장 최적화된 용지입니다.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-2">
                <div className="w-1 h-4 bg-emerald-500 rounded-full" />
                <label className="text-sm font-black text-zinc-900 uppercase tracking-tight">
                  {option.name}
                </label>
              </div>
              {option.type === 'text' ? (
                <input
                  type="text"
                  value={selectedOptions[option.name]}
                  onChange={(e) => handleOptionChange(option.name, e.target.value)}
                  placeholder={option.placeholder || `${option.name}을 입력해주세요.`}
                  className="w-full px-6 py-4 rounded-2xl bg-zinc-50 border border-zinc-100 focus:border-emerald-500 outline-none font-bold text-sm transition-colors"
                />
              ) : option.name === '모양 선택' ? (
                <div className="grid grid-cols-2 gap-3">
                  {option.values?.map((val) => (
                    <button
                      key={val.label}
                      onClick={() => handleOptionChange(option.name, val.label)}
                      className={`group p-4 rounded-[28px] border-2 transition-all flex flex-col items-center gap-3 ${
                        selectedOptions[option.name] === val.label
                          ? 'bg-emerald-50 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.1)]'
                          : 'bg-white border-zinc-100 hover:border-zinc-200'
                      }`}
                    >
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${
                        selectedOptions[option.name] === val.label
                          ? 'bg-emerald-500 text-white scale-110 shadow-lg'
                          : 'bg-zinc-50 text-zinc-400 group-hover:bg-zinc-100 group-hover:text-zinc-600'
                      }`}>
                        {SHAPE_ICONS[val.label]}
                      </div>
                      <div className="text-center">
                        <span className={`text-[11px] font-black uppercase tracking-widest ${
                          selectedOptions[option.name] === val.label ? 'text-emerald-900' : 'text-zinc-500'
                        }`}>
                          {val.label}
                        </span>
                        {val.priceModifier !== undefined && val.priceModifier !== 0 && (
                          <span className={`block text-[9px] font-bold mt-0.5 ${
                            selectedOptions[option.name] === val.label ? 'text-emerald-600' : 'text-zinc-400'
                          }`}>
                            {val.priceModifier > 0 ? `+${val.priceModifier.toLocaleString()}원` : `${val.priceModifier.toLocaleString()}원`}
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              ) : (pattern === 'MEMO_PAD' && option.name === '사이즈') ? (
                <div className="grid grid-cols-2 gap-3">
                  {option.values?.map((val) => {
                    const isSelected = selectedOptions[option.name] === val.label;
                    const [sizeText, unit] = val.label.split(' mm');
                    const subLabel = val.label === '90 x 90 mm' ? '정사각형' :
                                   val.label === '90 x 60 mm' ? '가로형' :
                                   val.label === '40 x 90 mm' ? '세로형' :
                                   val.label === '직접입력' ? '커스텀' : '';

                    return (
                      <button
                        key={val.label}
                        onClick={() => handleOptionChange(option.name, val.label)}
                        className={`group p-4 rounded-[28px] border-2 transition-all flex flex-col items-center gap-3 ${
                          isSelected
                            ? 'bg-emerald-50 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.1)]'
                            : 'bg-white border-zinc-100 hover:border-zinc-200'
                        }`}
                      >
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${
                          isSelected
                            ? 'bg-emerald-500 text-white scale-110 shadow-lg'
                            : 'bg-zinc-50 text-zinc-400 group-hover:bg-zinc-100 group-hover:text-zinc-600'
                        }`}>
                          {MEMO_SIZE_ICONS[val.label]}
                        </div>
                        <div className="text-center">
                          <p className={`text-[10px] font-black uppercase tracking-widest mb-0.5 ${
                            isSelected ? 'text-emerald-600' : 'text-zinc-400'
                          }`}>
                            {subLabel}
                          </p>
                          <div className="flex items-baseline justify-center gap-0.5">
                            <span className={`text-sm font-black ${
                              isSelected ? 'text-emerald-900' : 'text-zinc-900'
                            }`}>
                              {sizeText}
                            </span>
                            {unit !== undefined && (
                              <span className={`text-[10px] font-bold ${
                                isSelected ? 'text-emerald-600' : 'text-zinc-400'
                              }`}>
                                mm
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (pattern === 'NOTE' && option.name === '규격') ? (
                <div className="grid grid-cols-3 gap-3">
                  {option.values?.map((val) => {
                    const isSelected = selectedOptions[option.name] === val.label;
                    return (
                      <button
                        key={val.label}
                        onClick={() => handleOptionChange(option.name, val.label)}
                        className={`group p-4 rounded-3xl border-2 transition-all flex flex-col items-center gap-3 ${
                          isSelected
                            ? 'bg-emerald-50 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.1)]'
                            : 'bg-white border-zinc-100 hover:border-zinc-200'
                        }`}
                      >
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                          isSelected
                            ? 'bg-emerald-500 text-white shadow-lg'
                            : 'bg-zinc-50 text-zinc-400 group-hover:bg-zinc-100 group-hover:text-zinc-600'
                        }`}>
                          {NOTE_SIZE_ICONS[val.label]}
                        </div>
                        <div className="text-center">
                          <p className={`text-[11px] font-black uppercase tracking-widest ${
                            isSelected ? 'text-emerald-900' : 'text-zinc-500'
                          }`}>
                            {val.label.split(' ')[0]}
                          </p>
                          <p className={`text-[9px] font-bold ${
                            isSelected ? 'text-emerald-600' : 'text-zinc-400'
                          }`}>
                            {val.label.split(' ')[1]}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (pattern === 'NOTE' && option.name === '내지 종류') ? (
                <div className="grid grid-cols-2 gap-3">
                  {option.values?.map((val) => {
                    const isSelected = selectedOptions[option.name] === val.label;
                    return (
                      <button
                        key={val.label}
                        onClick={() => handleOptionChange(option.name, val.label)}
                        className={`group p-4 rounded-3xl border-2 transition-all flex items-center gap-4 ${
                          isSelected
                            ? 'bg-emerald-50 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.1)]'
                            : 'bg-white border-zinc-100 hover:border-zinc-200'
                        }`}
                      >
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                          isSelected
                            ? 'bg-emerald-500 text-white shadow-lg'
                            : 'bg-zinc-50 text-zinc-400 group-hover:bg-zinc-100 group-hover:text-zinc-600'
                        }`}>
                          {NOTE_INNER_ICONS[val.label]}
                        </div>
                        <div className="text-left">
                          <p className={`text-sm font-black ${
                            isSelected ? 'text-emerald-900' : 'text-zinc-900'
                          }`}>
                            {val.label}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (pattern === 'NOTE' && option.name === '내지 색상') ? (
                <div className="grid grid-cols-2 gap-3">
                  {option.values?.map((val) => {
                    const isSelected = selectedOptions[option.name] === val.label;
                    const colorHex = val.label === '백색' ? '#FFFFFF' : '#F5F5DC';
                    return (
                      <button
                        key={val.label}
                        onClick={() => handleOptionChange(option.name, val.label)}
                        className={`py-4 px-5 rounded-2xl text-sm font-bold border transition-all text-left relative overflow-hidden flex items-center gap-3 ${
                          isSelected
                            ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                            : 'bg-white border-zinc-200 text-zinc-600 hover:border-emerald-200'
                        }`}
                      >
                        <div 
                          className={`w-4 h-4 rounded-full border ${isSelected ? 'border-white/30' : 'border-zinc-200'}`}
                          style={{ backgroundColor: colorHex }}
                        />
                        <span className="relative z-10">{val.label}</span>
                      </button>
                    );
                  })}
                </div>
              ) : (pattern === 'NOTE' && (option.name === '내지 장수' || option.name === '페이지 수')) ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    {option.values?.map((val) => {
                      const isSelected = selectedOptions[option.name] === val.label;
                      return (
                        <button
                          key={val.label}
                          onClick={() => handleOptionChange(option.name, val.label)}
                          className={`group p-4 rounded-3xl border-2 transition-all flex items-center justify-between ${
                            isSelected
                              ? 'bg-emerald-50 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.1)]'
                              : 'bg-white border-zinc-100 hover:border-zinc-200'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                              isSelected
                                ? 'bg-emerald-500 text-white shadow-lg'
                                : 'bg-zinc-50 text-zinc-400 group-hover:bg-zinc-100 group-hover:text-zinc-600'
                            }`}>
                              <Layers className="w-5 h-5" />
                            </div>
                            <span className={`text-sm font-black ${
                              isSelected ? 'text-emerald-900' : 'text-zinc-900'
                            }`}>
                              {val.label}
                            </span>
                          </div>
                          {val.priceModifier !== undefined && val.priceModifier !== 0 && (
                            <span className={`text-[11px] font-bold ${
                              isSelected ? 'text-emerald-600' : 'text-zinc-400'
                            }`}>
                              {val.priceModifier > 0 ? `+${val.priceModifier.toLocaleString()}원` : `${val.priceModifier.toLocaleString()}원`}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  {option.name === '페이지 수' && (
                    <p className="text-[10px] font-bold text-emerald-600 flex items-center gap-1.5 px-2">
                      <Info className="w-3 h-3" />
                      페이지 수는 4의 배수 기준으로 제작됩니다.
                    </p>
                  )}
                </div>
              ) : (pattern === 'NOTE' && (option.name === '표지 구성' || option.name === '커버 스타일' || option.name === '표지 코팅')) ? (
                <div className="grid grid-cols-2 gap-3">
                  {option.values?.map((val) => {
                    const isSelected = selectedOptions[option.name] === val.label;
                    return (
                      <button
                        key={val.label}
                        onClick={() => handleOptionChange(option.name, val.label)}
                        className={`py-4 px-5 rounded-2xl text-sm font-bold border transition-all text-left relative overflow-hidden ${
                          isSelected
                            ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                            : 'bg-white border-zinc-200 text-zinc-600 hover:border-emerald-200'
                        }`}
                      >
                        <span className="relative z-10">{val.label}</span>
                        {val.priceModifier !== undefined && val.priceModifier !== 0 && (
                          <span className={`block text-[10px] mt-1 opacity-70 ${isSelected ? 'text-white' : 'text-zinc-400'}`}>
                            {val.priceModifier > 0 ? `+${val.priceModifier.toLocaleString()}원` : `${val.priceModifier.toLocaleString()}원`}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              ) : (pattern === 'NOTE' && option.name === '제본 안내') ? (
                <div className="p-6 bg-zinc-50 rounded-3xl border border-zinc-100 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center shadow-sm">
                      <Book className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-zinc-900">중철 제본 안내</p>
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Saddle Stitch Binding</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs text-zinc-600 leading-relaxed">
                      • 가운데 철심으로 고정되는 방식입니다.
                    </p>
                    <p className="text-xs text-zinc-600 leading-relaxed">
                      • 얇은 노트, 소책자, 브랜드북 제작에 적합합니다.
                    </p>
                    <p className="text-xs text-emerald-600 font-bold leading-relaxed">
                      • 페이지 수는 4의 배수(8p, 16p, 24p, 32p)로 제작됩니다.
                    </p>
                  </div>
                </div>
              ) : (pattern === 'NOTE' && (option.name === '스프링 방향' || option.name === '스프링 색상' || option.name === '커버 인쇄' || option.name === '엣지 마감')) ? (
                <div className="grid grid-cols-2 gap-3">
                  {option.values?.map((val) => {
                    const isSelected = selectedOptions[option.name] === val.label;
                    return (
                      <button
                        key={val.label}
                        onClick={() => handleOptionChange(option.name, val.label)}
                        className={`py-4 px-5 rounded-2xl text-sm font-bold border transition-all text-left relative overflow-hidden ${
                          isSelected
                            ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                            : 'bg-white border-zinc-200 text-zinc-600 hover:border-emerald-200'
                        }`}
                      >
                        <span className="relative z-10">{val.label}</span>
                        {val.priceModifier !== undefined && val.priceModifier !== 0 && (
                          <span className={`block text-[10px] mt-1 opacity-70 ${isSelected ? 'text-white' : 'text-zinc-400'}`}>
                            {val.priceModifier > 0 ? `+${val.priceModifier.toLocaleString()}원` : `${val.priceModifier.toLocaleString()}원`}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              ) : (pattern === 'MEMO_PAD' && option.name === '두께') ? (
                <div className="grid grid-cols-1 gap-3">
                  {option.values?.map((val) => {
                    const isSelected = selectedOptions[option.name] === val.label;
                    const [title, sheets] = val.label.split(' · ');
                    
                    return (
                      <button
                        key={val.label}
                        onClick={() => handleOptionChange(option.name, val.label)}
                        className={`group p-5 rounded-3xl border-2 transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-emerald-50 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.1)]'
                            : 'bg-white border-zinc-100 hover:border-zinc-200'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                            isSelected
                              ? 'bg-emerald-500 text-white shadow-lg'
                              : 'bg-zinc-50 text-zinc-400 group-hover:bg-zinc-100 group-hover:text-zinc-600'
                          }`}>
                            <Layers className="w-6 h-6" />
                          </div>
                          <div className="text-left">
                            <p className={`text-sm font-black ${
                              isSelected ? 'text-emerald-900' : 'text-zinc-900'
                            }`}>
                              {title}
                            </p>
                            <p className={`text-[10px] font-bold uppercase tracking-widest ${
                              isSelected ? 'text-emerald-600' : 'text-zinc-400'
                            }`}>
                              {sheets}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          {val.priceModifier !== undefined && val.priceModifier !== 0 && (
                            <p className={`text-xs font-black ${
                              isSelected ? 'text-emerald-600' : 'text-zinc-400'
                            }`}>
                              {val.priceModifier > 0 ? `+${val.priceModifier.toLocaleString()}원` : `${val.priceModifier.toLocaleString()}원`}
                            </p>
                          )}
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-1 transition-all ${
                            isSelected ? 'border-emerald-500 bg-emerald-500' : 'border-zinc-200'
                          }`}>
                            {isSelected && <Check className="w-3 h-3 text-white" />}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {option.values?.map((val) => (
                    <button
                      key={val.label}
                      onClick={() => handleOptionChange(option.name, val.label)}
                      className={`py-4 px-5 rounded-2xl text-sm font-bold border transition-all text-left relative overflow-hidden ${
                        selectedOptions[option.name] === val.label
                          ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                          : 'bg-white border-zinc-200 text-zinc-600 hover:border-emerald-200'
                      }`}
                    >
                      <span className="relative z-10">{val.label}</span>
                      {val.priceModifier !== undefined && val.priceModifier !== 0 && (
                        <span className={`block text-[10px] mt-1 opacity-70 ${selectedOptions[option.name] === val.label ? 'text-white' : 'text-zinc-400'}`}>
                          {val.priceModifier > 0 ? `+${val.priceModifier.toLocaleString()}원` : `${val.priceModifier.toLocaleString()}원`}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}

              {pattern === 'MEMO_PAD' && option.name === '사이즈' && selectedOptions['사이즈'] === '직접입력' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-4 pt-2"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">가로 (mm)</label>
                      <input
                        type="number"
                        value={customSize.width}
                        onChange={(e) => {
                          const val = e.target.value;
                          setCustomSize(prev => ({ ...prev, width: val }));
                        }}
                        placeholder="최대 90"
                        className={`w-full px-4 py-3 rounded-xl bg-white border font-bold text-sm outline-none transition-all ${
                          parseInt(customSize.width) > 90 ? 'border-red-500 text-red-600' : 'border-zinc-200 focus:border-emerald-500'
                        }`}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">세로 (mm)</label>
                      <input
                        type="number"
                        value={customSize.height}
                        onChange={(e) => {
                          const val = e.target.value;
                          setCustomSize(prev => ({ ...prev, height: val }));
                        }}
                        placeholder="최대 90"
                        className={`w-full px-4 py-3 rounded-xl bg-white border font-bold text-sm outline-none transition-all ${
                          parseInt(customSize.height) > 90 ? 'border-red-500 text-red-600' : 'border-zinc-200 focus:border-emerald-500'
                        }`}
                      />
                    </div>
                  </div>
                  {(parseInt(customSize.width) > 90 || parseInt(customSize.height) > 90) && (
                    <p className="text-[10px] font-bold text-red-500 flex items-center gap-1.5 ml-1">
                      <AlertCircle className="w-3 h-3" />
                      직접입력은 최대 90 x 90mm 이하만 가능합니다.
                    </p>
                  )}
                  <p className="text-[10px] font-bold text-zinc-400 italic ml-1">
                    * 90 x 90mm 이내로 입력해주세요.
                  </p>
                </motion.div>
              )}

              {pattern === 'MEMO_PAD' && option.name === '두께' && (
                <div className="pt-2">
                  {/* Thickness options are already rendered by the standard loop above */}
                </div>
              )}

              {option.name === '용도' && selectedOptions['용도'] === '도장 쿠폰용' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-start gap-3"
                >
                  <Sparkles className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-[11px] font-black text-emerald-900 uppercase tracking-tight">추천 용지 안내</p>
                    <p className="text-[11px] leading-relaxed text-emerald-700/80 font-medium">
                      모조지 / 크라프트보드 / 인바이런먼트 크라프트 추천<br />
                      <span className="text-[10px] opacity-70">도장 후 빠르게 건조되고 번짐이 적습니다.</span>
                    </p>
                  </div>
                </motion.div>
              )}
              {pattern === 'FOLDED_BUSINESS_CARD' && option.name === '방향' && (
                <FoldedPreview 
                  type={selectedOptions['접지 형태'] || '2단 명함'} 
                  direction={selectedOptions['방향'] || '가로형'} 
                />
              )}
              {pattern === 'DESIGN_CARD' && option.name === '템플릿 카테고리' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {DESIGN_CARD_TEMPLATES.filter(t => t.category === selectedOptions['템플릿 카테고리']).map((template) => (
                      <button
                        key={template.id}
                        onClick={() => handleOptionChange('템플릿 선택', template.id)}
                        className={`group relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                          selectedOptions['템플릿 선택'] === template.id
                            ? 'border-emerald-500 ring-2 ring-emerald-500/10'
                            : 'border-zinc-100 hover:border-emerald-200'
                        }`}
                      >
                        <img 
                          src={template.image} 
                          alt={template.name}
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          referrerPolicy="no-referrer"
                        />
                        {selectedOptions['템플릿 선택'] === template.id && (
                          <div className="absolute inset-0 bg-emerald-500/20 flex items-center justify-center">
                            <div className="bg-emerald-500 text-white p-1 rounded-full shadow-lg">
                              <Check className="w-4 h-4" />
                            </div>
                          </div>
                        )}
                        <div className="absolute bottom-0 left-0 right-0 p-1.5 bg-black/40 backdrop-blur-[2px]">
                          <p className="text-[9px] font-black text-white truncate text-center uppercase tracking-tighter">{template.name}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {(option.name === '사이즈' || option.name === '규격(mm)' || option.name === '작업 사이즈') && selectedOptions[option.name] === '직접입력' && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="grid grid-cols-2 gap-4 pt-2"
                >
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">가로 (mm)</label>
                    <input 
                      type="number" 
                      value={customSize.width}
                      onChange={(e) => setCustomSize(prev => ({ ...prev, width: e.target.value }))}
                      placeholder="50"
                      className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-100 focus:border-emerald-500 outline-none text-sm font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">세로 (mm)</label>
                    <input 
                      type="number" 
                      value={customSize.height}
                      onChange={(e) => setCustomSize(prev => ({ ...prev, height: e.target.value }))}
                      placeholder="50"
                      className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-100 focus:border-emerald-500 outline-none text-sm font-bold"
                    />
                  </div>
                </motion.div>
              )}
            </div>
          ))}

          {/* 3. Post-processing Section (후가공) */}
          {(() => {
            // If handled by icon grid, skip standard list rendering for these specific options
            const isIconGridPattern = pattern === 'BUSINESS_CARD' || pattern === 'DESIGN_CARD' || pattern === 'POSTCARD';
            if (isIconGridPattern || pattern === 'NOTE' || pattern === 'DRAWING_BOOK') return null;

            const postProcessingOptions = product.options.filter(opt => {
              const normalizedName = opt.name.replace(/\s/g, '');
              
              const isPostProcessing = [
                '재단방식', '코팅유무', '후가공옵션', '후가공', '화이트인쇄', '넘버링', '스코딕스', '포장옵션', 
                '부분UV', '모양코팅', '표지코팅', '코팅방식', '코팅', '귀돌이', 
                '타공', '오시', '후가공효과'
              ].includes(normalizedName);

              if (!isPostProcessing) return false;

              return true;
            });

            // Special check for White Ink: only show if material is transparent
            const materialOption = product.options.find(opt => opt.name.includes('재질') || opt.name.includes('용지'));
            const selectedMaterialName = materialOption ? selectedOptions[materialOption.name] : null;
            const selectedMaterial = PAPER_MATERIALS.find(m => m.name === selectedMaterialName);
            const isTransparent = selectedMaterial?.transparent || false;

            let visiblePostOptions = postProcessingOptions.filter(opt => {
              if (pattern === 'MEMO_PAD') return false;
              if (opt.name.includes('화이트 인쇄') && !isTransparent) return false;
              return true;
            });

            if (visiblePostOptions.length === 0) return null;

            const getIcon = (name: string) => {
              const n = name.replace(/\s/g, '');
              if (n === '재단방식' || n === '모양커팅') return <Scissors className="w-5 h-5" />;
              if (n === '코팅유무' || n === '표지코팅' || n === '코팅방식' || n === '코팅') return <Layers className="w-5 h-5" />;
              if (n === '후가공옵션' || n === '후가공' || n === '부분UV' || n === '후가공효과') return <Sparkles className="w-5 h-5" />;
              if (n === '화이트인쇄') return <Paintbrush className="w-5 h-5" />;
              if (n === '넘버링') return <Hash className="w-5 h-5" />;
              if (n === '스코딕스') return <Zap className="w-5 h-5" />;
              if (n === '포장옵션') return <Package className="w-5 h-5" />;
              if (n.includes('귀도리') || n.includes('귀돌이')) return <Scissors className="w-5 h-5" />;
              if (n.includes('타공') || n.includes('구멍')) return <Droplets className="w-5 h-5" />;
              if (n.includes('오시')) return <Layers className="w-5 h-5" />;
              return <Droplets className="w-5 h-5" />;
            };

            const getDisplayName = (name: string) => {
              const n = name.replace(/\s/g, '');
              if (n === '재단방식') return '재단';
              if (n === '모양커팅') return '모양커팅';
              if (n === '코팅유무' || n === '표지코팅' || n === '코팅방식' || n === '코팅') return '코팅';
              if (n === '후가공옵션' || n === '후가공' || n === '후가공효과') return '후가공';
              if (n === '화이트인쇄') return '화이트인쇄';
              if (n === '포장옵션') return '개별포장';
              if (n.includes('귀도리') || n.includes('귀돌이')) return '귀도리';
              if (n.includes('타공') || n.includes('구멍')) return '타공';
              if (n.includes('오시')) return '오시';
              return name;
            };

            const isOptionActive = (name: string) => {
              const val = selectedOptions[name];
              return val && val !== '없음' && val !== '안함' && val !== '코팅 없음' && val !== '기본 포장' && val !== '';
            };

            const expandedOption = visiblePostOptions.find(opt => opt.name === expandedPostOption);

            return (
              <div className="space-y-6 pt-4">
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
                  {/* Icon Grid */}
                  <div className="grid grid-cols-4 sm:grid-cols-7 gap-3">
                    {visiblePostOptions.map(option => {
                      const isShapeCutting = option.name === '모양커팅';
                      const isActive = isShapeCutting ? true : isOptionActive(option.name);
                      const isExpanded = expandedPostOption === option.name;
                      
                      return (
                        <button
                          key={option.name}
                          onClick={() => {
                            if (isShapeCutting) return;
                            setExpandedPostOption(isExpanded ? null : option.name);
                          }}
                          className={`flex flex-col items-center gap-2 group transition-all ${
                            isShapeCutting ? 'cursor-default' : isExpanded ? 'scale-110' : 'hover:scale-105'
                          }`}
                        >
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-sm ${
                            isShapeCutting
                              ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                              : isExpanded 
                                ? 'bg-emerald-600 text-white shadow-emerald-600/20' 
                                : isActive
                                  ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                  : 'bg-white text-zinc-400 border border-zinc-100 group-hover:border-zinc-300'
                          }`}>
                            {getIcon(option.name)}
                          </div>
                          <div className="flex flex-col items-center">
                            <span className={`text-[10px] font-black whitespace-nowrap transition-colors ${
                              isShapeCutting ? 'text-emerald-600' : isExpanded ? 'text-emerald-600' : isActive ? 'text-zinc-900' : 'text-zinc-400'
                            }`}>
                              {getDisplayName(option.name)}
                            </span>
                            {isShapeCutting && (
                              <span className="text-[8px] font-bold text-emerald-500/80 leading-none mt-0.5">기본 포함</span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {product.id === 'stk-postcard-shape' && (
                    <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 mb-6">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span className="text-xs font-bold text-emerald-900">기본 포함 항목</span>
                      </div>
                      <p className="text-[11px] text-emerald-700 leading-relaxed">
                        모양 엽서는 모양커팅 가공이 기본 포함됩니다.
                      </p>
                    </div>
                  )}

                  {/* Expanded Sub-options */}
                  <AnimatePresence mode="wait">
                    {expandedOption && (
                      <motion.div
                        key={expandedOption.name}
                        initial={{ opacity: 0, y: -10, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                        exit={{ opacity: 0, y: -10, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-4 border-t border-zinc-200/50 space-y-4">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-black text-zinc-900 uppercase tracking-widest">
                              {expandedOption.name} 상세 설정
                            </h4>
                            <button 
                              onClick={() => setExpandedPostOption(null)}
                              className="text-[10px] font-bold text-zinc-400 hover:text-zinc-600"
                            >
                              닫기
                            </button>
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {expandedOption.values?.map((val) => {
                              const isSelected = expandedOption.type === 'checkbox'
                                ? selectedOptions[expandedOption.name]?.split(', ').includes(val.label)
                                : selectedOptions[expandedOption.name] === val.label;
                              return (
                                <button
                                  key={val.label}
                                  onClick={() => handleOptionChange(expandedOption.name, val.label)}
                                  className={`py-3 px-4 rounded-xl text-[11px] font-bold border transition-all text-center flex flex-col items-center justify-center gap-1 ${
                                    isSelected
                                      ? 'bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-600/20'
                                      : 'bg-white border-zinc-200 text-zinc-500 hover:border-emerald-200'
                                  }`}
                                >
                                  <div className="flex items-center gap-2">
                                    {expandedOption.type === 'checkbox' && (
                                      <div className={`w-3 h-3 rounded border flex items-center justify-center ${
                                        isSelected ? 'bg-white border-white' : 'border-zinc-300'
                                      }`}>
                                        {isSelected && <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />}
                                      </div>
                                    )}
                                    <span>{val.label}</span>
                                  </div>
                                  {val.priceModifier !== undefined && val.priceModifier !== 0 && (
                                    <span className={`text-[9px] opacity-70 ${isSelected ? 'text-white' : 'text-zinc-400'}`}>
                                      {val.priceModifier > 0 ? `+${val.priceModifier.toLocaleString()}원` : `${val.priceModifier.toLocaleString()}원`}
                                    </span>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            );
          })()}
          
          {pattern === 'FOLDED_BUSINESS_CARD' && <WorkPrecautions />}

          {pattern === 'DESIGN_CARD' && (
            <div className="space-y-8 pt-8 border-t border-zinc-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-sm font-black tracking-tight">명함 정보 입력</h4>
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Business Card Information</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {product.options.filter(opt => 
                  ['이름', '직함', '연락처', '이메일', '주소/SNS', '로고 업로드', '요청사항'].includes(opt.name)
                ).map((option) => (
                  <div key={option.name} className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">{option.name}</label>
                    {option.name === '로고 업로드' ? (
                      <div className="relative group">
                        <input
                          type="file"
                          id="logo-upload"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleOptionChange('로고 업로드', file.name);
                          }}
                        />
                        <label 
                          htmlFor="logo-upload"
                          className="w-full px-6 py-4 rounded-2xl bg-zinc-50 border border-zinc-100 font-bold text-sm outline-none cursor-pointer group-hover:border-emerald-200 transition-all flex items-center justify-between"
                        >
                          <span className={selectedOptions['로고 업로드'] ? 'text-zinc-900' : 'text-zinc-400'}>
                            {selectedOptions['로고 업로드'] || option.placeholder}
                          </span>
                          <FileUp className="w-4 h-4 text-zinc-400 group-hover:text-emerald-500 transition-colors" />
                        </label>
                      </div>
                    ) : (
                      <input
                        type="text"
                        value={selectedOptions[option.name]}
                        onChange={(e) => handleOptionChange(option.name, e.target.value)}
                        placeholder={option.placeholder}
                        className="w-full px-6 py-4 rounded-2xl bg-zinc-50 border border-zinc-100 focus:border-emerald-500 outline-none font-bold text-sm transition-colors"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Summary Box */}
        <div className="pt-8 border-t border-zinc-100">
          <div className="bg-zinc-50 rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-500 font-medium">선택 옵션 요약</span>
              <div className="flex flex-wrap justify-end gap-2">
                {Object.entries(selectedOptions)
                  .filter(([key, val]) => {
                    // 1. Basic filtering (empty or 'none')
                    if (!val || val === '없음' || String(val).trim() === '') return false;

                    // 2. Check if option is visible for this product
                    const option = product.options.find(opt => opt.name === key);
                    if (pattern === 'DESIGN_CARD' && key === '템플릿 카테고리') return false;
                    if (option?.visibleIf) {
                      const parentVal = selectedOptions[option.visibleIf.optionName];
                      if (parentVal !== option.visibleIf.value) return false;
                    }

                    // 3. Parent-Child dependency filtering
                    const dependencies: Record<string, string> = {
                      '코팅 면수': '코팅',
                      '귀돌이 크기': '귀돌이',
                      '귀돌이 면수': '귀돌이',
                      '귀돌이 방향': '귀돌이',
                      '타공 크기': '타공',
                      '타공 설명': '타공',
                      '오시 줄 수': '오시',
                      '오시 설명': '오시',
                      '미싱 줄 수': '미싱',
                      '미싱 설명': '미싱',
                      '접지 방향': '접지',
                      '접지 형태': '접지',
                      '폴리백 사이즈': '폴리백 개별포장',
                    };

                    const parentKey = dependencies[key];
                    if (parentKey) {
                      const parentVal = selectedOptions[parentKey];
                      if (!parentVal || parentVal === '없음') return false;
                      
                      // Special case for 귀돌이 방향
                      if (key === '귀돌이 방향' && selectedOptions['귀돌이 면수'] !== '1면') return false;
                    }

                    return true;
                  })
                  .map(([key, val]) => {
                    let displayVal = val;
                    if (pattern === 'MEMO_PAD' && key === '사이즈' && val === '직접입력') {
                      displayVal = `직접입력 (${customSize.width || 0}x${customSize.height || 0}mm)`;
                    }
                    return (
                      <span key={key} className="px-2 py-1 bg-white rounded-md text-[10px] font-bold text-zinc-400 border border-zinc-100">
                        {displayVal}
                      </span>
                    );
                  })}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-zinc-500">
                <ShoppingCart className="w-4 h-4" />
                <span className="text-xs font-medium">개당 단가</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-zinc-900">{unitPrice.toLocaleString()}원</span>
                {discountRate > 0 && (
                  <span className="block text-[10px] text-emerald-600 font-bold">
                    (수량 할인 {Math.round(discountRate * 100)}% 적용됨)
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-zinc-500">
                <Clock className="w-4 h-4" />
                <span className="text-xs font-medium">예상 수령일</span>
              </div>
              <span className="text-xs font-bold text-zinc-900">{estimatedDeliveryDate}</span>
            </div>
            <div className="pt-4 border-t border-zinc-200/50 flex items-end justify-between">
              <div>
                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mb-1">최종 예상 견적</p>
                <p className="text-3xl font-black text-zinc-900 tracking-tight">
                  {totalPrice.toLocaleString()}<span className="text-lg font-medium ml-1">원</span>
                </p>
              </div>
              <p className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-3 py-1.5 rounded-full">
                VAT 포함
              </p>
            </div>
          </div>
        </div>

        {/* Notes */}
        {product.notes && product.notes.length > 0 && (
          <div className="p-6 rounded-2xl bg-amber-50 border border-amber-100">
            <h4 className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-3">제작 시 주의사항</h4>
            <ul className="space-y-2">
              {product.notes.map((note, i) => (
                <li key={i} className="text-[11px] text-amber-800/80 flex gap-2">
                  <span className="shrink-0">•</span>
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Order Title */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 bg-emerald-500 rounded-full" />
            <label className="text-sm font-black text-zinc-900 uppercase tracking-tight">주문제목</label>
          </div>
          <input 
            type="text" 
            placeholder="제목을 입력해 주세요."
            className="w-full px-6 py-4 rounded-2xl bg-zinc-50 border border-zinc-100 focus:border-emerald-500 outline-none font-bold text-sm transition-colors"
          />
        </div>

        {/* File Upload */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 bg-emerald-500 rounded-full" />
            <label className="text-sm font-black text-zinc-900 uppercase tracking-tight">파일 업로드</label>
          </div>
          <div className="p-8 rounded-2xl border-2 border-dashed border-zinc-200 bg-zinc-50 flex flex-col items-center justify-center gap-4 group hover:border-emerald-500 transition-all cursor-pointer">
            <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-zinc-400 group-hover:text-emerald-500 transition-colors">
              <FileUp className="w-6 h-6" />
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-zinc-900">파일을 드래그하거나 클릭하여 업로드</p>
              <p className="text-[10px] text-zinc-400 mt-1">PDF ONLY (최대 50MB)</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 gap-4 pt-4">
          <button 
            onClick={handleGenerate}
            className="w-full py-5 bg-zinc-900 text-white font-black rounded-2xl flex items-center justify-center gap-3 hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-900/20 active:scale-[0.98]"
          >
            <FileText className="w-5 h-5 text-emerald-400" />
            <span>견적서 발행하기</span>
          </button>
          <div className="grid grid-cols-2 gap-4">
            <button className="py-4 bg-white border-2 border-zinc-900 text-zinc-900 font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-zinc-50 transition-all">
              <ShoppingCart className="w-4 h-4" />
              <span>장바구니</span>
            </button>
            <button className="py-4 bg-emerald-50 text-emerald-700 font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-emerald-100 transition-all border border-emerald-100">
              <HelpCircle className="w-4 h-4" />
              <span>1:1 문의</span>
            </button>
          </div>
          <button className="w-full py-4 bg-zinc-100 text-zinc-600 font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-zinc-200 transition-all">
            <CheckCircle2 className="w-4 h-4" />
            <span>바로구매</span>
          </button>
        </div>
      </div>
    </div>
  );
};
