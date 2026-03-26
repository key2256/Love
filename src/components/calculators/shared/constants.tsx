import React from 'react';
import { 
  Shapes, 
  Layers, 
  Scissors, 
  Droplets, 
  Paintbrush, 
  FileUp, 
  ShoppingCart, 
  Package 
} from 'lucide-react';

export const FOLDING_DIRECTION_ICONS: Record<string, React.ReactNode> = {
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
  ),
  '세로형 (상철)': (
    <svg viewBox="0 0 40 40" className="w-8 h-8 stroke-current fill-none" strokeWidth="1.5">
      <rect x="10" y="10" width="20" height="20" rx="1" />
      <line x1="10" y1="14" x2="30" y2="14" strokeDasharray="2 2" />
      <circle cx="15" cy="12" r="1" fill="currentColor" />
      <circle cx="20" cy="12" r="1" fill="currentColor" />
      <circle cx="25" cy="12" r="1" fill="currentColor" />
    </svg>
  )
};

export const FOLDING_TYPE_ICONS: Record<string, React.ReactNode> = {
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

export const SHAPE_ICONS: Record<string, React.ReactNode> = {
  '정사각형': (
    <svg viewBox="0 0 40 40" className="w-8 h-8 stroke-current fill-none" strokeWidth="1.5">
      <rect x="10" y="10" width="20" height="20" />
    </svg>
  ),
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

export const MEMO_SIZE_ICONS: Record<string, React.ReactNode> = {
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

export const NOTE_SIZE_ICONS: Record<string, React.ReactNode> = {
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

export const NOTE_INNER_ICONS: Record<string, React.ReactNode> = {
  '무지': (
    <svg viewBox="0 0 40 40" className="w-8 h-8 stroke-current fill-none" strokeWidth="2">
      <rect x="10" y="10" width="20" height="20" />
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

export const NOTE_GROUPS = {
  '외부 구성': ['규격', '표지 구성', '커버 스타일'],
  '후가공 선택': ['표지 코팅', '커버 인쇄', '엣지 마감'],
  '내부 구성': ['내지 종류', '내지 색상', '내지 장수', '페이지 수'],
  '제본/마감': ['스프링 방향', '스프링 색상', '제본 안내']
};

export const DRAWING_SIZE_ICONS: Record<string, React.ReactNode> = {
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

export const DRAWING_COVER_ICONS: Record<string, React.ReactNode> = {
  '소프트커버': (
    <svg viewBox="0 0 40 40" className="w-8 h-8 stroke-current fill-none" strokeWidth="1.5">
      <path d="M10 10 Q10 8 12 8 L28 8 Q30 8 30 10 L30 30 Q30 32 28 32 L12 32 Q10 32 10 30 Z" />
      <path d="M14 8 L14 32" />
    </svg>
  ),
  '하드커버 (2mm 보드)': (
    <svg viewBox="0 0 40 40" className="w-8 h-8 stroke-current fill-none" strokeWidth="2.5">
      <rect x="10" y="8" width="20" height="24" rx="1" />
      <line x1="14" y1="8" x2="14" y2="32" />
    </svg>
  )
};

export const DRAWING_PAPER_ICONS: Record<string, React.ReactNode> = {
  '백색 모조 80g': (
    <svg viewBox="0 0 40 40" className="w-8 h-8 fill-current opacity-40">
      <rect x="10" y="18" width="20" height="4" rx="0.5" />
    </svg>
  ),
  '드로잉용지 300g': (
    <svg viewBox="0 0 40 40" className="w-8 h-8 fill-current">
      <rect x="10" y="15" width="20" height="10" rx="1" />
      <rect x="10" y="15" width="20" height="2" className="opacity-30" />
    </svg>
  )
};

export const DRAWING_GROUPS = {
  '기본 구성': ['규격', '제본 방향', '커버 종류'],
  '용지 및 마감': ['용지', '표지 코팅', '스프링 색상'],
  '주문 정보': ['수량 및 주문 정보']
};

export const getNoteGroup = (optionName: string) => {
  if (NOTE_GROUPS['외부 구성'].includes(optionName)) return '외부 구성';
  if (NOTE_GROUPS['후가공 선택'].includes(optionName)) return '후가공 선택';
  if (NOTE_GROUPS['내부 구성'].includes(optionName)) return '내부 구성';
  if (NOTE_GROUPS['제본/마감'].includes(optionName)) return '제본/마감';
  return null;
};

export const PRODUCT_CONFIG: Record<string, {
  defaultGroup: string;
  groups: string[];
  allowedMaterials?: string[];
  allowedPostProcessing?: string[];
}> = {
  // Postcards
  'stk-postcard-standard': {
    defaultGroup: '기본 대중형',
    groups: ['기본 대중형'],
    allowedPostProcessing: ['코팅', '귀돌이', '타공', '오시', '미싱', '폴리백 개별포장'],
  },
  'stk-postcard-special': {
    defaultGroup: '기본 대중형',
    groups: ['기본 대중형'],
    allowedMaterials: ['아트지 250g', '스노우 250g'],
    allowedPostProcessing: ['인쇄 도수', '코팅', '귀돌이', '타공', '폴리백 개별포장'],
  },
  'stk-postcard-shape': {
    defaultGroup: '기본 대중형',
    groups: ['기본 대중형', '고급 감성형', '친환경/내추럴형'],
    allowedPostProcessing: ['인쇄 도수', '모양커팅', '코팅', '귀돌이', '타공', '오시', '미싱', '접지', '폴리백 개별포장'],
  },
  'stk-postcard-premium': {
    defaultGroup: '고급 감성형',
    groups: ['고급 감성형', '친환경/내추럴형', '컬러/특수지형'],
    allowedPostProcessing: ['인쇄 도수', '귀돌이', '타공', '오시', '미싱', '접지', '폴리백 개별포장'],
  },
  'stk-postcard-effect': {
    defaultGroup: '기본 대중형',
    groups: ['기본 대중형', '고급 감성형'],
    allowedPostProcessing: ['인쇄 도수', '모양커팅', '코팅', '귀돌이', '타공', '오시', '미싱', '접지', '폴리백 개별포장', '후가공 옵션'],
  },
  // Stickers
  'stk-rect': {
    defaultGroup: '일반/기본 용지',
    groups: ['일반/기본 용지', '방수/합성지', '투명/PET', '메탈/광택 특수 재질', '프리미엄 라벨(GMUND)'],
    allowedPostProcessing: ['모양커팅', '코팅', '귀돌이', '타공', '오시', '미싱', '접지', '폴리백 개별포장', '화이트 인쇄', '후가공 옵션'],
  },
  'stk-circle': {
    defaultGroup: '일반/기본 용지',
    groups: ['일반/기본 용지', '방수/합성지', '투명/PET', '메탈/광택 특수 재질', '프리미엄 라벨(GMUND)'],
    allowedPostProcessing: ['모양커팅', '코팅', '귀돌이', '타공', '오시', '미싱', '접지', '폴리백 개별포장', '화이트 인쇄', '후가공 옵션'],
  },
  'stk-oval': {
    defaultGroup: '일반/기본 용지',
    groups: ['일반/기본 용지', '방수/합성지', '투명/PET', '메탈/광택 특수 재질', '프리미엄 라벨(GMUND)'],
    allowedPostProcessing: ['모양커팅', '코팅', '귀돌이', '타공', '오시', '미싱', '접지', '폴리백 개별포장', '화이트 인쇄', '후가공 옵션'],
  },
  'stk-round-rect': {
    defaultGroup: '일반/기본 용지',
    groups: ['일반/기본 용지', '방수/합성지', '투명/PET', '메탈/광택 특수 재질', '프리미엄 라벨(GMUND)'],
    allowedPostProcessing: ['모양커팅', '코팅', '귀돌이', '타공', '오시', '미싱', '접지', '폴리백 개별포장', '화이트 인쇄', '후가공 옵션'],
  },
  'stk-various': {
    defaultGroup: '일반/기본 용지',
    groups: ['일반/기본 용지', '방수/합성지', '투명/PET', '메탈/광택 특수 재질', '프리미엄 라벨(GMUND)'],
    allowedPostProcessing: ['모양커팅', '코팅', '귀돌이', '타공', '오시', '미싱', '접지', '폴리백 개별포장', '화이트 인쇄', '후가공 옵션'],
  },
  'stk-free-normal': {
    defaultGroup: '일반/기본 용지',
    groups: ['일반/기본 용지', '방수/합성지', '투명/PET', '메탈/광택 특수 재질', '프리미엄 라벨(GMUND)'],
    allowedPostProcessing: ['모양커팅', '코팅', '귀돌이', '타공', '오시', '미싱', '접지', '폴리백 개별포장', '화이트 인쇄', '후가공 옵션'],
  },
  'stk-uv': {
    defaultGroup: 'UV 전사 스티커',
    groups: ['UV 전사 스티커'],
    allowedPostProcessing: ['화이트 인쇄', '코팅', '폴리백 개별포장', '후가공 옵션'],
  },
  // Business Cards
  'bc-standard': {
    defaultGroup: '기본 대중형',
    groups: ['기본 대중형'],
    allowedPostProcessing: ['코팅', '귀돌이', '타공', '오시', '미싱', '접지', '폴리백 개별포장', '후가공 옵션', '명함케이스'],
  },
  'bc-premium': {
    defaultGroup: '고급 감성형',
    groups: ['고급 감성형', '내추럴/친환경형', '특수지/프리미엄형'],
    allowedPostProcessing: ['귀돌이', '타공', '오시', '미싱', '폴리백 개별포장', '후가공 옵션', '명함케이스'],
  },
  'bc-template': {
    defaultGroup: '기본 대중형',
    groups: ['기본 대중형'],
    allowedPostProcessing: ['코팅', '귀돌이', '타공', '명함케이스'],
  },
  'bc-folded': {
    defaultGroup: '기본 대중형',
    groups: ['기본 대중형', '고급 감성형'],
    allowedPostProcessing: ['코팅', '귀돌이', '타공', '오시', '미싱', '접지', '폴리백 개별포장', '후가공 옵션', '명함케이스'],
  }
};
