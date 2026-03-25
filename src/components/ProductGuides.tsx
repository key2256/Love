import React from 'react';
import { 
  FileText, 
  Layers, 
  Sparkles, 
  CheckCircle2, 
  Info, 
  AlertTriangle,
  Maximize2,
  Minimize2,
  ChevronRight,
  Zap,
  Droplets,
  Scissors
} from 'lucide-react';
import { motion } from 'motion/react';

interface GuideSectionProps {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  badge?: string;
}

const GuideSection: React.FC<GuideSectionProps> = ({ title, icon: Icon, children, badge }) => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
          <Icon size={20} />
        </div>
        <h3 className="text-xl font-black text-zinc-900 tracking-tight">{title}</h3>
      </div>
      {badge && (
        <span className="px-3 py-1 bg-zinc-900 text-white text-[10px] font-black rounded-full uppercase tracking-widest">
          {badge}
        </span>
      )}
    </div>
    <div className="bg-zinc-50 rounded-[32px] p-8 border border-zinc-100">
      {children}
    </div>
  </div>
);

const POST_PROCESSING_EFFECTS = [
  {
    id: 'uv',
    name: '부분 UV 코팅',
    description: '특정 부분에만 투명한 광택을 입혀 입체감과 포인트를 주는 효과입니다.',
    image: 'https://picsum.photos/seed/uv-effect/600/400',
    features: ['강조 효과', '고급스러운 광택', '내구성 향상']
  },
  {
    id: 'foil',
    name: '박 가공 (금박/은박)',
    description: '금속 박을 열과 압력으로 입혀 화려하고 고급스러운 느낌을 줍니다.',
    image: 'https://picsum.photos/seed/foil-effect/600/400',
    features: ['화려함', '브랜드 가치 상승', '다양한 컬러']
  },
  {
    id: 'emboss',
    name: '형압 (엠보싱)',
    description: '종이를 위로 솟아오르게 하거나 아래로 들어가게 하여 촉각적 입체감을 줍니다.',
    image: 'https://picsum.photos/seed/emboss-effect/600/400',
    features: ['촉각적 재미', '클래식한 무드', '우아한 마감']
  },
  {
    id: 'scit',
    name: '스코딕스 (디지털 박/에폭시)',
    description: '디지털 방식으로 박과 에폭시를 동시에 적용하여 화려한 입체감을 구현합니다.',
    image: 'https://picsum.photos/seed/scodix-effect/600/400',
    features: ['정교한 표현', '강력한 입체감', '다양한 텍스처']
  }
];

export const ProductGuides: React.FC<{ category: string; subCategory: string }> = ({ category, subCategory }) => {
  const isSticker = category === 'sticker';
  
  return (
    <div className="space-y-24 py-24 border-t border-zinc-100">
      {/* File Preparation Guide */}
      <GuideSection title="파일 작업 가이드" icon={FileText} badge="MUST READ">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <h4 className="font-bold text-zinc-900 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              공통 작업 규칙
            </h4>
            <ul className="space-y-4">
              {[
                { title: '색상 모드', desc: '반드시 CMYK 모드로 작업해 주세요. (RGB 작업 시 색상 차이 발생)' },
                { title: '해상도', desc: '실제 사이즈 기준 300dpi 이상의 고해상도 이미지를 권장합니다.' },
                { title: '폰트 아웃라인', desc: '모든 서체는 반드시 곡선화(Create Outlines) 처리를 해주세요.' },
                { title: '여분 작업', desc: '재단 오차를 대비해 사방 2mm의 작업 여분을 포함해 주세요.' }
              ].map((item, i) => (
                <li key={i} className="flex gap-3">
                  <div className="shrink-0 w-5 h-5 rounded-full bg-white flex items-center justify-center shadow-sm border border-zinc-100">
                    <CheckCircle2 size={12} className="text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-zinc-900 mb-0.5">{item.title}</p>
                    <p className="text-xs text-zinc-500 leading-relaxed">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="space-y-6">
            <h4 className="font-bold text-zinc-900 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              {isSticker ? '스티커 전용 가이드' : '제품별 특이사항'}
            </h4>
            <div className="p-6 bg-white rounded-2xl border border-zinc-100 shadow-sm">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
                  <AlertTriangle size={20} />
                </div>
                <p className="text-xs text-amber-900 font-medium leading-relaxed">
                  {isSticker 
                    ? '칼선(Die-cut) 데이터는 반드시 별도의 레이어나 별색(M100)으로 구분하여 작업해 주세요. 복잡한 모양의 경우 칼선 간격이 최소 2mm 이상 유지되어야 합니다.'
                    : '후가공(박, 형압 등)이 들어가는 부분은 반드시 K100 벡터 데이터로 별도 레이어에 작업해 주세요.'}
                </p>
              </div>
              <button className="w-full py-3 rounded-xl bg-zinc-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all">
                가이드 템플릿 다운로드
              </button>
            </div>
          </div>
        </div>
      </GuideSection>

      {/* Post-Processing Visual Examples */}
      <div className="space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                <Sparkles size={20} />
              </div>
              <h3 className="text-3xl font-black text-zinc-900 tracking-tight">후가공 효과 미리보기</h3>
            </div>
            <p className="text-zinc-500 font-medium ml-13">전문적인 마감으로 제품의 완성도를 높여보세요.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {POST_PROCESSING_EFFECTS.map((effect) => (
            <motion.div 
              key={effect.id}
              whileHover={{ y: -10 }}
              className="group bg-white rounded-[32px] overflow-hidden border border-zinc-100 shadow-sm hover:shadow-2xl transition-all duration-500"
            >
              <div className="aspect-[4/3] overflow-hidden relative">
                <img 
                  src={effect.image} 
                  alt={effect.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Maximize2 className="text-white w-8 h-8" />
                </div>
              </div>
              <div className="p-6 space-y-4">
                <h4 className="font-black text-lg text-zinc-900">{effect.name}</h4>
                <p className="text-xs text-zinc-500 leading-relaxed line-clamp-2">
                  {effect.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {effect.features.map(f => (
                    <span key={f} className="px-2 py-1 bg-zinc-50 rounded-lg text-[10px] font-bold text-zinc-400 border border-zinc-100">
                      #{f}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Material & Use Case Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <GuideSection title="재질 특성 안내" icon={Layers}>
          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-zinc-100">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                <Droplets size={24} />
              </div>
              <div>
                <h4 className="text-sm font-black text-zinc-900">방수 및 내구성</h4>
                <p className="text-xs text-zinc-500">유포지, 투명지 등 합성수지 재질은 습기에 강하고 잘 찢어지지 않습니다.</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-zinc-100">
              <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
                <Zap size={24} />
              </div>
              <div>
                <h4 className="text-sm font-black text-zinc-900">인쇄 선명도</h4>
                <p className="text-xs text-zinc-500">아트지, 스노우지 등 코팅 용지는 색상 재현력이 뛰어나 사진 인쇄에 적합합니다.</p>
              </div>
            </div>
          </div>
        </GuideSection>

        <GuideSection title="추천 활용 사례" icon={Zap}>
          <div className="grid grid-cols-2 gap-4">
            {[
              { title: '브랜드 패키지', desc: '로고 스티커, 박스 봉인용' },
              { title: '홍보 및 이벤트', desc: '배포용 굿즈, 행사 안내' },
              { title: '개인 소장용', desc: '다이어리 꾸미기, 네임 스티커' },
              { title: '산업 및 물류', desc: '제품 라벨, 바코드 스티커' }
            ].map((item, i) => (
              <div key={i} className="p-5 bg-white rounded-2xl border border-zinc-100 hover:border-emerald-200 transition-colors group">
                <h4 className="text-sm font-black text-zinc-900 mb-1 group-hover:text-emerald-600 transition-colors">{item.title}</h4>
                <p className="text-[11px] text-zinc-400 font-medium">{item.desc}</p>
              </div>
            ))}
          </div>
        </GuideSection>
      </div>
    </div>
  );
};
