export interface Product {
  id: string;
  name: string;
  category: string;
  subCategory: string;
  tagline: string;
  description: string;
  image: string;
  minQuantity: number;
  basePrice: number;
  options: {
    name: string;
    type: 'select' | 'radio' | 'number' | 'text' | 'checkbox';
    values?: { label: string; priceModifier?: number }[];
    placeholder?: string;
    visibleIf?: { optionName: string; value: string };
    description?: string;
  }[];
  features: string[];
  leadTime: string;
  warnings?: string[];
  isNew?: boolean;
  recommendation?: string;
  badges?: string[];
  notes?: string[];
}

export interface CartItem {
  id: string;
  product: Product;
  options: Record<string, string>;
  quantity: number;
  totalPrice: number;
  unitPrice: number;
}

export interface Quotation {
  id: string;
  productId: string;
  productName: string;
  options: Record<string, string>;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  leadTime: string;
  estimatedDeliveryDate: string;
  createdAt: string;
}

export interface ShippingInfo {
  recipientName: string;
  phoneNumber: string;
  address: string;
  detailAddress: string;
  zipCode: string;
  memo?: string;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  shippingInfo: ShippingInfo;
  paymentMethod: 'card' | 'transfer' | 'vbank' | 'paypal' | 'bank_transfer';
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: any;
  updatedAt: any;
}

export interface SubCategoryGroup {
  groupName: string;
  items: (string | SubCategoryGroup)[];
  isLocked?: boolean;
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  images?: string[];
  isVerified?: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
  entryPhrase: string;
  subCategories: (string | SubCategoryGroup)[];
}

export interface Template {
  id: string;
  name: string;
  category: string;
  image: string;
}

export interface BusinessCardPaperMaterial {
  id: string;
  group: '기본 대중형' | '고급 감성형' | '내추럴/친환경형' | '특수지/프리미엄형';
  name: string;
  weight: string;
  recommendationLabel: string;
  features: string;
  recommendedUse: string;
  precautions: string;
}

export const DESIGN_CARD_TEMPLATES: Template[] = [
  { id: 'SB-01', name: '심플 비즈니스 A', category: '심플/비즈니스', image: 'https://picsum.photos/seed/sb01/400/250' },
  { id: 'SB-02', name: '모던 코퍼레이트', category: '심플/비즈니스', image: 'https://picsum.photos/seed/sb02/400/250' },
  { id: 'SB-03', name: '미니멀 라인', category: '심플/비즈니스', image: 'https://picsum.photos/seed/sb03/400/250' },
  { id: 'EB-01', name: '내추럴 무드', category: '감성/브랜드', image: 'https://picsum.photos/seed/eb01/400/250' },
  { id: 'EB-02', name: '소프트 파스텔', category: '감성/브랜드', image: 'https://picsum.photos/seed/eb02/400/250' },
  { id: 'CW-01', name: '아티스트 프로필', category: '크리에이터/작가', image: 'https://picsum.photos/seed/cw01/400/250' },
  { id: 'CW-02', name: '핸드라이팅 스타일', category: '크리에이터/작가', image: 'https://picsum.photos/seed/cw02/400/250' },
  { id: 'CB-01', name: '카페 시그니처', category: '카페/베이커리', image: 'https://picsum.photos/seed/cb01/400/250' },
  { id: 'CB-02', name: '베이커리 감성', category: '카페/베이커리', image: 'https://picsum.photos/seed/cb02/400/250' },
  { id: 'BS-01', name: '뷰티 살롱', category: '뷰티/샵', image: 'https://picsum.photos/seed/bs01/400/250' },
  { id: 'BS-02', name: '코스메틱 라인', category: '뷰티/샵', image: 'https://picsum.photos/seed/bs02/400/250' },
  { id: 'EC-01', name: '스탬프 쿠폰 A', category: '이벤트/쿠폰형', image: 'https://picsum.photos/seed/ec01/400/250' },
  { id: 'EC-02', name: '할인권 스타일', category: '이벤트/쿠폰형', image: 'https://picsum.photos/seed/ec02/400/250' },
];

export const BUSINESS_CARD_METADATA = {
  '일반 명함': {
    tagline: '가장 대중적인 명함, 가성비 최우수.',
    description: '다양한 용지와 규격으로 제작 가능한 표준 명함입니다.'
  },
  '고급지 명함': {
    tagline: '고급 수입지와 후가공으로 완성하는 품격.',
    description: '박, 형압 등 특별한 가공이 더해진 고급지 명함입니다.'
  },
  '접지 명함': {
    tagline: '더 많은 정보를 담을 수 있는 접지형.',
    description: '2단, 3단 접지로 명함 이상의 정보를 전달하기에 적합합니다.'
  },
  '디자인 템플릿 명함': {
    tagline: '전문 디자이너의 템플릿으로 쉽고 빠르게.',
    description: '업종별 템플릿을 선택하고 정보만 입력하면 완성되는 빠른 주문형 명함입니다.'
  }
};

export const BUSINESS_CARD_COMMON_OPTIONS = {
  SIZE: {
    name: '규격(mm)',
    type: 'select' as const,
    values: [
      { label: '90x50 (표준)', priceModifier: 0 },
      { label: '85x55 (신용카드형)', priceModifier: 0 },
    ]
  },
  PRINT_COLOR: {
    name: '인쇄도수',
    type: 'radio' as const,
    values: [
      { label: '단면 칼라', priceModifier: 0 },
      { label: '양면 칼라', priceModifier: 2000 },
    ]
  },
  WHITE_INK: {
    name: '화이트 인쇄',
    type: 'radio' as const,
    values: [
      { label: '없음', priceModifier: 0 },
      { label: '있음', priceModifier: 3000 },
    ]
  },
  COATING: [
    {
      name: '코팅',
      type: 'radio' as const,
      values: [
        { label: '없음', priceModifier: 0 },
        { label: '있음', priceModifier: 1000 },
      ]
    },
    {
      name: '코팅 종류',
      type: 'select' as const,
      values: [
        { label: '무광 코팅', priceModifier: 0 },
        { label: '유광 코팅', priceModifier: 0 },
        { label: '벨벳 코팅', priceModifier: 2000 },
        { label: '샌드 코팅', priceModifier: 2000 },
      ]
    }
  ],
  ROUNDING: [
    {
      name: '귀돌이',
      type: 'radio' as const,
      values: [
        { label: '없음', priceModifier: 0 },
        { label: '있음', priceModifier: 1500 },
      ]
    },
    {
      name: '귀돌이 크기',
      type: 'radio' as const,
      values: [
        { label: '4mm', priceModifier: 0 },
        { label: '6mm', priceModifier: 0 },
      ]
    },
    {
      name: '귀돌이 면수',
      type: 'radio' as const,
      values: [
        { label: '1면', priceModifier: 0 },
        { label: '4면', priceModifier: 1000 },
      ]
    },
    {
      name: '귀돌이 방향',
      type: 'select' as const,
      values: [
        { label: '상단좌', priceModifier: 0 },
        { label: '상단우', priceModifier: 0 },
        { label: '하단좌', priceModifier: 0 },
        { label: '하단우', priceModifier: 0 },
      ]
    }
  ],
  PUNCHING: [
    {
      name: '타공',
      type: 'radio' as const,
      values: [
        { label: '없음', priceModifier: 0 },
        { label: '있음', priceModifier: 1000 },
      ]
    },
    {
      name: '타공 크기',
      type: 'radio' as const,
      values: [
        { label: '4mm', priceModifier: 0 },
        { label: '6mm', priceModifier: 0 },
        { label: '8mm', priceModifier: 0 },
      ]
    },
    {
      name: '타공 설명',
      type: 'text' as const,
      placeholder: '예: 중앙 상단 1개 / 좌측 상단 1개 등'
    }
  ],
  SHAPE_CUTTING: [
    {
      name: '모양커팅',
      type: 'radio' as const,
      values: [
        { label: '없음', priceModifier: 0 },
        { label: '있음', priceModifier: 5000 },
      ]
    },
    {
      name: '모양 선택',
      type: 'radio' as const,
      values: [
        { label: '정사각형', priceModifier: 0 },
        { label: '티켓형', priceModifier: 1000 },
        { label: '원형', priceModifier: 1500 },
        { label: '자유형', priceModifier: 3000 },
      ]
    }
  ],
  CREASING: [
    {
      name: '오시',
      type: 'radio' as const,
      values: [
        { label: '없음', priceModifier: 0 },
        { label: '있음', priceModifier: 1000 },
      ]
    },
    {
      name: '오시 줄 수',
      type: 'radio' as const,
      values: [
        { label: '1줄', priceModifier: 0 },
        { label: '2줄', priceModifier: 500 },
        { label: '3줄', priceModifier: 1000 },
      ]
    },
    {
      name: '오시 설명',
      type: 'text' as const,
      placeholder: '예: 중앙 세로 1줄 / 상단 20mm 지점 가로 1줄 등'
    }
  ],
  PERFORATION: [
    {
      name: '미싱',
      type: 'radio' as const,
      values: [
        { label: '없음', priceModifier: 0 },
        { label: '있음', priceModifier: 1000 },
      ]
    },
    {
      name: '미싱 줄 수',
      type: 'radio' as const,
      values: [
        { label: '1줄', priceModifier: 0 },
        { label: '2줄', priceModifier: 500 },
        { label: '3줄', priceModifier: 1000 },
      ]
    },
    {
      name: '미싱 설명',
      type: 'text' as const,
      placeholder: '예: 중앙 세로 1줄 / 우측 30mm 지점 세로 1줄 등'
    }
  ],
  FOLDING: [
    {
      name: '접지',
      type: 'radio' as const,
      values: [
        { label: '없음', priceModifier: 0 },
        { label: '있음', priceModifier: 1500 },
      ]
    },
    {
      name: '접지 방향',
      type: 'radio' as const,
      values: [
        { label: '가로형', priceModifier: 0 },
        { label: '세로형', priceModifier: 0 },
      ]
    },
    {
      name: '접지 형태',
      type: 'select' as const,
      values: [
        { label: '2단접지', priceModifier: 0 },
        { label: '3단접지', priceModifier: 500 },
        { label: '4단접지', priceModifier: 1000 },
        { label: '대문접지', priceModifier: 1000 },
        { label: '반대문접지', priceModifier: 1000 },
        { label: '4단 병풍접지', priceModifier: 1500 },
        { label: 'N모양 3단접지', priceModifier: 1000 },
      ]
    }
  ],
  PACKAGING: [
    {
      name: '폴리백 개별포장',
      type: 'radio' as const,
      values: [
        { label: '없음', priceModifier: 0 },
        { label: '있음', priceModifier: 500 },
      ]
    }
  ],
  POST_PROCESSING: {
    name: '후가공 옵션',
    type: 'select' as const,
    values: [
      { label: '없음', priceModifier: 0 },
      { label: '금박', priceModifier: 15000 },
      { label: '은박', priceModifier: 15000 },
      { label: '홀로그램박', priceModifier: 18000 },
      { label: '부분 UV 코팅', priceModifier: 12000 },
      { label: '형압', priceModifier: 20000 },
      { label: '엠보싱', priceModifier: 15000 },
    ]
  },
  CASE: {
    name: '명함케이스',
    type: 'select' as const,
    values: [
      { label: '없음', priceModifier: 0 },
      { label: '기본 종이케이스', priceModifier: 0 },
      { label: '플라스틱 케이스', priceModifier: 500 },
      { label: '고급 가죽 케이스', priceModifier: 5000 },
    ]
  }
};

export const getBusinessCardMaterials = (type: 'standard' | 'premium' | 'template') => {
  if (type === 'standard') {
    return BUSINESS_CARD_MATERIALS.filter(m => m.group === '기본 대중형').map(m => ({
      label: `${m.name} ${m.weight}`,
      priceModifier: 0
    }));
  }
  if (type === 'premium') {
    return BUSINESS_CARD_MATERIALS.filter(m => m.group !== '기본 대중형').map(m => ({
      label: `${m.name} ${m.weight}`,
      priceModifier: m.group === '고급 감성형' ? 0 : 1500
    }));
  }
  if (type === 'template') {
    const templateMaterials = ['스노우 250g', '스노우 300g', '아트지 250g', '반누보화이트 250g'];
    return BUSINESS_CARD_MATERIALS.filter(m => templateMaterials.includes(`${m.name} ${m.weight}`)).map(m => {
       const label = `${m.name} ${m.weight}`;
       let priceModifier = 0;
       if (label === '스노우 300g') priceModifier = 500;
       if (label === '반누보화이트 250g') priceModifier = 2000;
       return { label, priceModifier };
    });
  }
  return [];
};

export const BUSINESS_CARD_MATERIALS: BusinessCardPaperMaterial[] = [
  // A. 기본 대중형
  {
    id: 'bc-art-250',
    group: '기본 대중형',
    name: '아트지',
    weight: '250g',
    recommendationLabel: '선명한 인쇄',
    features: '광택이 있고 인쇄 색감이 선명함',
    recommendedUse: '대량 배포용 명함, 쿠폰',
    precautions: '지문이 잘 묻을 수 있으니 코팅을 권장합니다.'
  },
  {
    id: 'bc-art-300',
    group: '기본 대중형',
    name: '아트지',
    weight: '300g',
    recommendationLabel: '두께감 있는 광택',
    features: '두툼하고 광택이 있는 고광택 용지',
    recommendedUse: '고급 홍보용 명함',
    precautions: '접지 시 터짐 현상이 있을 수 있습니다.'
  },
  {
    id: 'bc-snow-250',
    group: '기본 대중형',
    name: '스노우',
    weight: '250g',
    recommendationLabel: '차분한 무광',
    features: '광택이 없는 차분하고 부드러운 느낌',
    recommendedUse: '일반 비즈니스 명함',
    precautions: '인쇄 후 건조 시간이 다소 필요합니다.'
  },
  {
    id: 'bc-snow-300',
    group: '기본 대중형',
    name: '스노우',
    weight: '300g',
    recommendationLabel: '기본 명함 추천',
    features: '두툼하고 매트한 질감의 고급 용지',
    recommendedUse: '전문직 명함, 기업용 명함',
    precautions: '어두운 배경색 인쇄 시 뒷묻음 주의.'
  },
  {
    id: 'bc-offset-220',
    group: '기본 대중형',
    name: '모조지',
    weight: '220g',
    recommendationLabel: '필기감 우수',
    features: '광택이 없고 필기감이 좋은 백색 용지',
    recommendedUse: '도장 쿠폰, 메모용 명함',
    precautions: '잉크 흡수력이 좋아 색상이 다소 차분하게 표현됩니다.'
  },
  {
    id: 'bc-earth-226',
    group: '기본 대중형',
    name: '얼스팩',
    weight: '226g',
    recommendationLabel: '친환경 추천',
    features: '100% 사탕수수 부산물로 만든 친환경지',
    recommendedUse: '친환경 브랜드, 비건 명함',
    precautions: '색상 편차 가능. 표면이 다소 거칠 수 있습니다.'
  },
  // B. 고급 감성형
  {
    id: 'bc-vannu-250',
    group: '고급 감성형',
    name: '반누보화이트',
    weight: '250g',
    recommendationLabel: '고급 명함 추천',
    features: '부드러운 질감과 따뜻한 화이트 톤',
    recommendedUse: '전문가 명함, 브랜드 카드',
    precautions: '수입지 특유의 고급스러운 질감이 특징입니다.'
  },
  {
    id: 'bc-tinto-250',
    group: '고급 감성형',
    name: '띤또레또',
    weight: '250g',
    recommendationLabel: '질감 강조',
    features: '올록볼록한 엠보싱 질감이 특징인 수입지',
    recommendedUse: '작가 명함, 감성 브랜드',
    precautions: '코팅, 스코딕스 비추천. 필기용 또는 시향지 용도로 부적합할 수 있음.'
  },
  {
    id: 'bc-marsh-262',
    group: '고급 감성형',
    name: '매쉬멜로우 White',
    weight: '262g',
    recommendationLabel: '사진표현 우수',
    features: '표면이 매우 매끄럽고 잉크 발색이 뛰어남',
    recommendedUse: '포토 명함, 디자이너 명함',
    precautions: '매우 매끄러운 표면으로 지문 주의.'
  },
  {
    id: 'bc-rend-nat-240',
    group: '고급 감성형',
    name: '랑데뷰내츄럴',
    weight: '240g',
    recommendationLabel: '감성 브랜드용',
    features: '자연스러운 미색과 거친 질감의 조화',
    recommendedUse: '카페 명함, 공방 명함',
    precautions: '종이 본연의 질감이 인쇄물에 반영됩니다.'
  },
  {
    id: 'bc-rend-ultra-240',
    group: '고급 감성형',
    name: '랑데뷰울트라화이트',
    weight: '240g',
    recommendationLabel: '깨끗한 화이트',
    features: '순백색의 깨끗한 느낌과 고급스러운 질감',
    recommendedUse: '미니멀 명함, 웨딩 카드',
    precautions: '백색도가 매우 높아 깔끔한 인상을 줍니다.'
  },
  {
    id: 'bc-mont-240',
    group: '고급 감성형',
    name: '몽블랑화이트',
    weight: '240g',
    recommendationLabel: '세련된 표면감',
    features: '표면이 매끄럽고 백색도가 높은 고급지',
    recommendedUse: '기업 임원 명함, 갤러리 카드',
    precautions: '잉크 건조가 빠르고 발색이 뛰어납니다.'
  },
  {
    id: 'bc-env-216',
    group: '고급 감성형',
    name: '인바이런먼트(크라프트필)',
    weight: '216g',
    recommendationLabel: '친환경 고급지',
    features: '재생지 느낌의 내추럴한 컬러와 질감',
    recommendedUse: '에코 브랜드, 오가닉 명함',
    precautions: '용지 자체의 티끌이 보일 수 있습니다.'
  },
  // C. 내추럴/친환경형
  {
    id: 'bc-kraft-240',
    group: '내추럴/친환경형',
    name: '크라프트보드',
    weight: '240g',
    recommendationLabel: '핸드메이드 감성',
    features: '갈색의 거친 질감이 살아있는 친환경지',
    recommendedUse: '빈티지 명함, 수제 제품 태그',
    precautions: '코팅, 스코딕스 비추천. 어두운 색상 인쇄 권장.'
  },
  {
    id: 'bc-eboard-230',
    group: '내추럴/친환경형',
    name: 'E-보드 Y04',
    weight: '230g',
    recommendationLabel: '재생지 감성',
    features: '자연스러운 미색과 재생지 특유의 질감',
    recommendedUse: '친환경 명함, 소박한 디자인',
    precautions: '색상 편차 가능. 재생지 특유의 티끌이 포함됨.'
  },
  // D. 특수지/프리미엄형
  {
    id: 'bc-gold-sirio-300',
    group: '특수지/프리미엄형',
    name: '골드시리오펄',
    weight: '300g',
    recommendationLabel: '펄 특수지',
    features: '은은한 골드 펄감이 화려한 고급지',
    recommendedUse: 'VIP 명함, 축하 카드',
    precautions: '코팅, 스코딕스 비추천. 펄감으로 인해 인쇄 색상이 다를 수 있음.'
  },
  {
    id: 'bc-majestic-250',
    group: '특수지/프리미엄형',
    name: '마제스틱마블화이트',
    weight: '250g',
    recommendationLabel: '메탈 펄감',
    features: '대리석 같은 은은한 광택과 펄감',
    recommendedUse: '쥬얼리 샵, 웨딩 명함',
    precautions: '코팅, 스코딕스 비추천.'
  }
];

export interface PostcardPaperMaterial {
  id: string;
  group: '기본 대중형' | '고급 감성형' | '친환경/내추럴형' | '컬러/특수지형';
  name: string;
  weight: string;
  recommendationLabel: string;
  features: string;
  recommendedUse: string;
  precautions: string;
}

export const POSTCARD_MATERIALS: PostcardPaperMaterial[] = [
  // 1. 기본 대중형
  {
    id: 'art-250',
    group: '기본 대중형',
    name: '아트지',
    weight: '250g',
    recommendationLabel: '선명한 인쇄',
    features: '광택이 있고 인쇄 색감이 선명함',
    recommendedUse: '홍보용 엽서, 대량 배포용',
    precautions: '지문이 잘 묻을 수 있으니 코팅을 권장합니다.'
  },
  {
    id: 'art-300',
    group: '기본 대중형',
    name: '아트지',
    weight: '300g',
    recommendationLabel: '선명한 인쇄',
    features: '두툼하고 광택이 있는 고광택 용지',
    recommendedUse: '고급 홍보물, 쿠폰 엽서',
    precautions: '접지 시 터짐 현상이 있을 수 있습니다.'
  },
  {
    id: 'snow-250',
    group: '기본 대중형',
    name: '스노우',
    weight: '250g',
    recommendationLabel: '차분한 무광',
    features: '광택이 없는 차분하고 부드러운 느낌',
    recommendedUse: '전시회 엽서, 안내장',
    precautions: '인쇄 후 건조 시간이 다소 필요합니다.'
  },
  {
    id: 'snow-300',
    group: '기본 대중형',
    name: '스노우',
    weight: '300g',
    recommendationLabel: '차분한 무광',
    features: '두툼하고 매트한 질감의 고급 용지',
    recommendedUse: '프리미엄 엽서, 초대장',
    precautions: '어두운 배경색 인쇄 시 뒷묻음 주의.'
  },
  {
    id: 'white-mojo-220',
    group: '기본 대중형',
    name: '백색모조',
    weight: '220g',
    recommendationLabel: '필기감 우수',
    features: '일반 복사용지와 비슷한 질감의 무광 용지',
    recommendedUse: '메모 엽서, 컬러링 엽서',
    precautions: '잉크 흡수율이 높아 색상이 다소 흐리게 보일 수 있습니다. (색상 편차 가능)'
  },
  // 2. 고급 감성형
  {
    id: 'vannu-250',
    group: '고급 감성형',
    name: '반누보화이트',
    weight: '250g',
    recommendationLabel: '고급 엽서 추천',
    features: '부드러운 질감과 따뜻한 화이트 톤',
    recommendedUse: '작가 굿즈, 고급 브랜드 엽서',
    precautions: '수입지 특유의 고급스러운 질감이 특징입니다.'
  },
  {
    id: 'mont-240',
    group: '고급 감성형',
    name: '몽블랑화이트',
    weight: '240g',
    recommendationLabel: '선명한 화이트',
    features: '표면이 매끄럽고 백색도가 높은 고급지',
    recommendedUse: '사진 엽서, 일러스트 엽서',
    precautions: '잉크 건조가 빠르고 발색이 뛰어납니다.'
  },
  {
    id: 'rend-nat-240',
    group: '고급 감성형',
    name: '랑데뷰내츄럴',
    weight: '240g',
    recommendationLabel: '감성 굿즈 추천',
    features: '자연스러운 미색과 거친 질감의 조화',
    recommendedUse: '빈티지 엽서, 감성 일러스트',
    precautions: '종이 본연의 질감이 인쇄물에 반영됩니다.'
  },
  {
    id: 'rend-nat-310',
    group: '고급 감성형',
    name: '랑데뷰내츄럴',
    weight: '310g',
    recommendationLabel: '감성 굿즈 추천',
    features: '매우 두툼하고 묵직한 고급 수입지',
    recommendedUse: 'VIP 초대장, 프리미엄 굿즈',
    precautions: '두께감이 있어 고급스러운 느낌을 줍니다.'
  },
  {
    id: 'rend-ultra-240',
    group: '고급 감성형',
    name: '랑데뷰울트라화이트',
    weight: '240g',
    recommendationLabel: '깨끗한 화이트',
    features: '순백색의 깨끗한 느낌과 고급스러운 질감',
    recommendedUse: '미니멀 디자인, 웨딩 엽서',
    precautions: '백색도가 매우 높아 깔끔한 인상을 줍니다.'
  },
  {
    id: 'marsh-262',
    group: '고급 감성형',
    name: '매쉬멜로우 White',
    weight: '262g',
    recommendationLabel: '사진표현 우수',
    features: '표면이 매우 매끄럽고 잉크 발색이 뛰어남',
    recommendedUse: '고해상도 사진 엽서, 포트폴리오',
    precautions: '매우 매끄러운 표면으로 지문 주의.'
  },
  {
    id: 'arco-300',
    group: '고급 감성형',
    name: '아코팩',
    weight: '300g',
    recommendationLabel: '탄탄한 질감',
    features: '탄성이 좋고 표면이 깨끗한 프리미엄지',
    recommendedUse: '패키지 동봉 엽서, 브랜드 카드',
    precautions: '종이의 탄성이 좋아 잘 휘어지지 않습니다.'
  },
  {
    id: 'tinto-250',
    group: '고급 감성형',
    name: '띤또레또',
    weight: '250g',
    recommendationLabel: '수채화 느낌',
    features: '올록볼록한 엠보싱 질감이 특징인 수입지',
    recommendedUse: '수채화 일러스트, 시향지',
    precautions: '코팅, 스코딕스 비추천. 필기용, 시향지로 부적합할 수 있음.'
  },
  // 3. 친환경/내추럴형
  {
    id: 'env-216',
    group: '친환경/내추럴형',
    name: '인바이런먼트(크라프트필)',
    weight: '216g',
    recommendationLabel: '친환경 감성',
    features: '재생지 느낌의 내추럴한 컬러와 질감',
    recommendedUse: '에코 브랜드, 오가닉 제품 안내',
    precautions: '용지 자체의 티끌이 보일 수 있습니다.'
  },
  {
    id: 'kraft-240',
    group: '친환경/내추럴형',
    name: '크라프트보드',
    weight: '240g',
    recommendationLabel: '핸드메이드 감성',
    features: '갈색의 거친 질감이 살아있는 친환경지',
    recommendedUse: '빈티지 엽서, 수제 제품 태그',
    precautions: '코팅, 스코딕스 비추천. 어두운 색상 인쇄 권장.'
  },
  {
    id: 'eboard-230',
    group: '친환경/내추럴형',
    name: 'E-보드 Y04',
    weight: '230g',
    recommendationLabel: '내추럴 화이트',
    features: '자연스러운 미색과 재생지 특유의 질감',
    recommendedUse: '친환경 엽서, 소박한 디자인',
    precautions: '색상 편차 가능. 재생지 특유의 티끌이 포함됨.'
  },
  {
    id: 'earth-226',
    group: '친환경/내추럴형',
    name: '얼스팩',
    weight: '226g',
    recommendationLabel: '친환경 추천',
    features: '100% 사탕수수 부산물로 만든 친환경지',
    recommendedUse: '비건 브랜드, 제로웨이스트 엽서',
    precautions: '색상 편차 가능. 표면이 다소 거칠 수 있습니다.'
  },
  // 4. 컬러/특수지형
  {
    id: 'gold-sirio-300',
    group: '컬러/특수지형',
    name: '골드시리오펄',
    weight: '300g',
    recommendationLabel: '펄 특수지',
    features: '은은한 골드 펄감이 화려한 고급지',
    recommendedUse: '연말 카드, 축하 엽서',
    precautions: '코팅, 스코딕스 비추천. 펄감으로 인해 인쇄 색상이 다를 수 있음.'
  },
  {
    id: 'majestic-250',
    group: '컬러/특수지형',
    name: '마제스틱마블화이트',
    weight: '250g',
    recommendationLabel: '은은한 펄감',
    features: '대리석 같은 은은한 광택과 펄감',
    recommendedUse: '웨딩 엽서, 쥬얼리 브랜드',
    precautions: '코팅, 스코딕스 비추천.'
  },
  {
    id: 'sirio-blue-290',
    group: '컬러/특수지형',
    name: '시리오칼라 다크블루',
    weight: '290g',
    recommendationLabel: '컬러 특수지',
    features: '깊고 진한 다크블루 컬러의 색지',
    recommendedUse: '고급 패키지 동봉 엽서, 포인트 카드',
    precautions: '화이트 인쇄나 금/은박 후가공을 추천합니다.'
  },
  {
    id: 'sirio-red-290',
    group: '컬러/특수지형',
    name: '시리오칼라 레드',
    weight: '290g',
    recommendationLabel: '컬러 특수지',
    features: '강렬하고 선명한 레드 컬러의 색지',
    recommendedUse: '크리스마스 카드, 이벤트 엽서',
    precautions: '화이트 인쇄나 금/은박 후가공을 추천합니다.'
  },
  {
    id: 'sirio-black-290',
    group: '컬러/특수지형',
    name: '시리오칼라 블랙',
    weight: '290g',
    recommendationLabel: '컬러 특수지',
    features: '깊이 있는 블랙 컬러의 고중량 색지',
    recommendedUse: '블랙 디자인 엽서, VIP 카드',
    precautions: '화이트 인쇄나 금/은박 후가공을 추천합니다.'
  }
];

export const POSTCARD_COMMON_OPTIONS = {
  SIZE: {
    name: '사이즈',
    type: 'select' as const,
    values: [
      { label: '100x148mm (기본)', priceModifier: 0 },
      { label: '148x210mm (A5)', priceModifier: 3000 },
      { label: '105x105mm (정사각형)', priceModifier: 1000 },
      { label: '70x100mm (미니)', priceModifier: -1000 },
      { label: '직접 입력', priceModifier: 0 },
    ]
  },
  PAPER_GROUP: {
    name: '용지 그룹',
    type: 'radio' as const,
    values: [
      { label: '기본 대중형', priceModifier: 0 },
      { label: '고급 감성형', priceModifier: 0 },
      { label: '친환경/내추럴형', priceModifier: 0 },
      { label: '컬러/특수지형', priceModifier: 0 },
    ]
  },
  PAPER_SELECT_BASIC: {
    name: '상세 용지 (기본)',
    type: 'select' as const,
    visibleIf: { optionName: '용지 그룹', value: '기본 대중형' },
    values: POSTCARD_MATERIALS.filter(m => m.group === '기본 대중형').map(m => ({
      label: `${m.name} ${m.weight}`,
      priceModifier: 0
    }))
  },
  PAPER_SELECT_PREMIUM: {
    name: '상세 용지 (고급)',
    type: 'select' as const,
    visibleIf: { optionName: '용지 그룹', value: '고급 감성형' },
    values: POSTCARD_MATERIALS.filter(m => m.group === '고급 감성형').map(m => ({
      label: `${m.name} ${m.weight}`,
      priceModifier: 1500
    }))
  },
  PAPER_SELECT_ECO: {
    name: '상세 용지 (친환경)',
    type: 'select' as const,
    visibleIf: { optionName: '용지 그룹', value: '친환경/내추럴형' },
    values: POSTCARD_MATERIALS.filter(m => m.group === '친환경/내추럴형').map(m => ({
      label: `${m.name} ${m.weight}`,
      priceModifier: 2000
    }))
  },
  PAPER_SELECT_SPECIAL: {
    name: '상세 용지 (특수)',
    type: 'select' as const,
    visibleIf: { optionName: '용지 그룹', value: '컬러/특수지형' },
    values: POSTCARD_MATERIALS.filter(m => m.group === '컬러/특수지형').map(m => ({
      label: `${m.name} ${m.weight}`,
      priceModifier: 2500
    }))
  },
  PRINT_COLOR: {
    name: '인쇄 도수',
    type: 'radio' as const,
    values: [
      { label: '단면 칼라', priceModifier: 0 },
      { label: '양면 칼라', priceModifier: 2000 },
    ]
  },
  WHITE_INK: {
    name: '화이트 인쇄',
    type: 'radio' as const,
    values: [
      { label: '없음', priceModifier: 0 },
      { label: '있음', priceModifier: 3000 },
    ]
  },
  COATING: [
    {
      name: '코팅',
      type: 'radio' as const,
      values: [
        { label: '없음', priceModifier: 0 },
        { label: '무광 코팅', priceModifier: 1000 },
        { label: '유광 코팅', priceModifier: 1000 },
      ]
    },
    {
      name: '코팅 면수',
      type: 'radio' as const,
      values: [
        { label: '단면', priceModifier: 0 },
        { label: '양면', priceModifier: 500 },
      ]
    }
  ],
  ROUNDING: [
    {
      name: '귀돌이',
      type: 'radio' as const,
      values: [
        { label: '없음', priceModifier: 0 },
        { label: '있음', priceModifier: 1500 },
      ]
    },
    {
      name: '귀돌이 크기',
      type: 'radio' as const,
      values: [
        { label: '4mm', priceModifier: 0 },
        { label: '6mm', priceModifier: 0 },
      ]
    },
    {
      name: '귀돌이 면수',
      type: 'radio' as const,
      values: [
        { label: '1면', priceModifier: 0 },
        { label: '4면', priceModifier: 1000 },
      ]
    },
    {
      name: '귀돌이 방향',
      type: 'select' as const,
      values: [
        { label: '상단좌', priceModifier: 0 },
        { label: '상단우', priceModifier: 0 },
        { label: '하단좌', priceModifier: 0 },
        { label: '하단우', priceModifier: 0 },
      ]
    }
  ],
  PUNCHING: [
    {
      name: '타공',
      type: 'radio' as const,
      values: [
        { label: '없음', priceModifier: 0 },
        { label: '있음', priceModifier: 1000 },
      ]
    },
    {
      name: '타공 크기',
      type: 'radio' as const,
      values: [
        { label: '4mm', priceModifier: 0 },
        { label: '6mm', priceModifier: 0 },
        { label: '8mm', priceModifier: 0 },
      ]
    },
    {
      name: '타공 설명',
      type: 'text' as const,
      placeholder: '예: 중앙 상단 1개 / 좌측 상단 1개 등'
    }
  ],
  SHAPE_CUTTING: [
    {
      name: '모양커팅',
      type: 'radio' as const,
      values: [
        { label: '없음', priceModifier: 0 },
        { label: '있음', priceModifier: 5000 },
      ]
    },
    {
      name: '모양 선택',
      type: 'radio' as const,
      values: [
        { label: '정사각형', priceModifier: 0 },
        { label: '티켓형', priceModifier: 1000 },
        { label: '원형', priceModifier: 1500 },
        { label: '자유형', priceModifier: 3000 },
      ]
    }
  ],
  CREASING: [
    {
      name: '오시',
      type: 'radio' as const,
      values: [
        { label: '없음', priceModifier: 0 },
        { label: '있음', priceModifier: 1000 },
      ]
    },
    {
      name: '오시 줄 수',
      type: 'radio' as const,
      values: [
        { label: '1줄', priceModifier: 0 },
        { label: '2줄', priceModifier: 500 },
        { label: '3줄', priceModifier: 1000 },
      ]
    },
    {
      name: '오시 설명',
      type: 'text' as const,
      placeholder: '예: 중앙 세로 1줄 / 상단 20mm 지점 가로 1줄 등'
    }
  ],
  PERFORATION: [
    {
      name: '미싱',
      type: 'radio' as const,
      values: [
        { label: '없음', priceModifier: 0 },
        { label: '있음', priceModifier: 1000 },
      ]
    },
    {
      name: '미싱 줄 수',
      type: 'radio' as const,
      values: [
        { label: '1줄', priceModifier: 0 },
        { label: '2줄', priceModifier: 500 },
        { label: '3줄', priceModifier: 1000 },
      ]
    },
    {
      name: '미싱 설명',
      type: 'text' as const,
      placeholder: '예: 중앙 세로 1줄 / 우측 30mm 지점 세로 1줄 등'
    }
  ],
  FOLDING: [
    {
      name: '접지',
      type: 'radio' as const,
      values: [
        { label: '없음', priceModifier: 0 },
        { label: '있음', priceModifier: 1500 },
      ]
    },
    {
      name: '접지 방향',
      type: 'radio' as const,
      values: [
        { label: '가로형', priceModifier: 0 },
        { label: '세로형', priceModifier: 0 },
      ]
    },
    {
      name: '접지 형태',
      type: 'select' as const,
      values: [
        { label: '2단접지', priceModifier: 0 },
        { label: '3단접지', priceModifier: 500 },
        { label: '4단접지', priceModifier: 1000 },
        { label: '대문접지', priceModifier: 1000 },
        { label: '반대문접지', priceModifier: 1000 },
        { label: '4단 병풍접지', priceModifier: 1500 },
        { label: 'N모양 3단접지', priceModifier: 1000 },
      ]
    }
  ],
  PACKAGING: [
    {
      name: '폴리백 개별포장',
      type: 'radio' as const,
      values: [
        { label: '없음', priceModifier: 0 },
        { label: '있음', priceModifier: 500 },
      ]
    },
    {
      name: '폴리백 사이즈',
      type: 'select' as const,
      values: [
        { label: '60x90', priceModifier: 0 },
        { label: '100x130', priceModifier: 0 },
        { label: '110x160', priceModifier: 0 },
        { label: '130x180', priceModifier: 0 },
        { label: '160x300', priceModifier: 0 },
        { label: '220x300', priceModifier: 0 },
      ]
    }
  ],
  EFFECT: {
    name: '후가공 옵션',
    type: 'select' as const,
    values: [
      { label: '없음', priceModifier: 0 },
      { label: '부분 UV (스코딕스)', priceModifier: 8000 },
      { label: '금박', priceModifier: 15000 },
      { label: '은박', priceModifier: 15000 },
      { label: '형압/압인', priceModifier: 5000 },
    ]
  }
};

export const getPostcardMaterials = (groups: string[]) => {
  return POSTCARD_MATERIALS.filter(m => groups.includes(m.group)).map(m => ({
    label: `${m.name} ${m.weight}`,
    priceModifier: m.group === '기본 대중형' ? 0 : m.group === '고급 감성형' ? 1500 : 2500
  }));
};

export interface PaperMaterial {
  id: string;
  group: '일반/기본 용지' | '방수/합성지' | '투명/PET' | '메탈/광택 특수 재질' | '프리미엄 라벨(GMUND)';
  name: string;
  weight: string;
  shortDescription: string;
  description: string;
  waterproof: boolean;
  tearResistant: boolean;
  transparent: boolean;
  removable: boolean;
  metal: boolean;
  premium: boolean;
  whiteInkRecommended: boolean;
  recommendedUse: string;
  precautions: string;
  image?: string;
}

export const PAPER_MATERIALS: PaperMaterial[] = [
  // 일반/기본 용지
  {
    id: 'art-label',
    group: '일반/기본 용지',
    name: '아트지 라벨',
    weight: '090g',
    shortDescription: '기본형 / 선명한 인쇄',
    description: '백색 용지로 색상 구현력이 뛰어나고 저렴하여 가장 많이 이용되는 일반용지 스티커입니다. 코팅을 하지 않으면 잘 찢어집니다.',
    waterproof: false,
    tearResistant: false,
    transparent: false,
    removable: false,
    metal: false,
    premium: false,
    whiteInkRecommended: false,
    recommendedUse: '일반 홍보용, 박스 부착용, 가격표',
    precautions: '습기에 취약하므로 실내 사용 권장. 코팅 없이 주문 시 칼선 부분 종이 지분 발생 가능.',
    image: 'https://picsum.photos/seed/paper-art/400/300'
  },
  {
    id: 'art-label-strong',
    group: '일반/기본 용지',
    name: '아트지 라벨(초강접)',
    weight: '090g',
    shortDescription: '강력한 접착력의 일반용지',
    description: '백색 용지로 색상 구현력이 뛰어나고 저렴하여 많이 이용되는 일반용지 스티커입니다. 전면 재질은 일반 아트지 라벨과 같지만 접착력이 더 강합니다. 컬러 인쇄 시 색감 표현이 우수하며, 약간 반짝이는 질감이 있습니다.',
    waterproof: false,
    tearResistant: false,
    transparent: false,
    removable: false,
    metal: false,
    premium: false,
    whiteInkRecommended: false,
    recommendedUse: '강한 접착이 필요한 물류용, 박스용, 산업용',
    precautions: '접착력이 매우 강하므로 부착 후 제거가 어려울 수 있습니다.',
    image: 'https://picsum.photos/seed/paper-art-strong/400/300'
  },
  {
    id: 'kraft-label',
    group: '일반/기본 용지',
    name: '크라프트 라벨',
    weight: '057g',
    shortDescription: '자연스럽고 빈티지한 감성',
    description: '일반 라벨과 달리 자연스럽고 품격 있는 분위기를 주는 라벨입니다. 우편물, 상품 안내문, 격식 있는 문서 분류용으로 적합합니다.',
    waterproof: false,
    tearResistant: false,
    transparent: false,
    removable: false,
    metal: false,
    premium: false,
    whiteInkRecommended: false,
    recommendedUse: '핸드메이드 제품, 우편물, 빈티지 패키지',
    precautions: '용지 자체에 색상이 있어 밝은 색상 인쇄 시 색왜곡이 있을 수 있습니다.',
    image: 'https://picsum.photos/seed/paper-kraft/400/300'
  },
  {
    id: 'earthpact-sticker',
    group: '일반/기본 용지',
    name: '얼스팩 스티커',
    weight: '070g',
    shortDescription: '100% 사탕수수 친환경 용지',
    description: '사탕수수 설탕 생산 후 남은 잔여물 100%로 만든 친환경 용지입니다. 생분해가 가능하며 기존 목재 대비 빠르게 생산할 수 있습니다. 다만 용지마다 색상 편차가 있을 수 있습니다.',
    waterproof: false,
    tearResistant: false,
    transparent: false,
    removable: false,
    metal: false,
    premium: false,
    whiteInkRecommended: false,
    recommendedUse: '친환경 브랜드, 유기농 제품, 에코 패키지',
    precautions: '사탕수수 섬유질로 인해 표면이 고르지 않을 수 있으며 색상 편차가 발생할 수 있습니다.',
    image: 'https://picsum.photos/seed/paper-earth/400/300'
  },

  // 방수/합성지 계열
  {
    id: 'yupo-sticker',
    group: '방수/합성지',
    name: '유포 스티커',
    weight: '080g',
    shortDescription: '방수 / 잘 안 찢어짐',
    description: '합성지 재질로 얇고 부드러우며 잘 찢어지지 않고 물에 젖지 않습니다.',
    waterproof: true,
    tearResistant: true,
    transparent: false,
    removable: false,
    metal: false,
    premium: false,
    whiteInkRecommended: false,
    recommendedUse: '냉장/냉동 식품, 욕실 용품, 옥외 홍보물',
    precautions: '가장 대중적인 방수 재질로 습기에 강합니다.',
    image: 'https://picsum.photos/seed/paper-yupo/400/300'
  },
  {
    id: 'yupo-matte-trans-back',
    group: '방수/합성지',
    name: '유포 매트',
    weight: '080g',
    shortDescription: '매트한 질감과 투명한 배경지',
    description: '합성지로 얇고 부드러우며 찢어지지 않고 물에 젖지 않습니다. 매트한 표면 질감이 특징이며, 후지가 투명하여 팬시 스티커 용도로 많이 사용됩니다.',
    waterproof: true,
    tearResistant: true,
    transparent: false,
    removable: false,
    metal: false,
    premium: false,
    whiteInkRecommended: false,
    recommendedUse: '다이어리 꾸미기, 팬시 굿즈, 화장품 라벨',
    precautions: '후지가 투명하여 디자인 확인이 용이합니다.',
    image: 'https://picsum.photos/seed/paper-yupo-matte/400/300'
  },
  {
    id: 'yupo-removable',
    group: '방수/합성지',
    name: '유포 리무버블',
    weight: '100g',
    shortDescription: '자국 없이 깔끔하게 제거',
    description: '합성지로 얇고 부드러우며 찢어지지 않고 물에 젖지 않습니다. 리무버블 점착 가공이 되어 잘 붙고 끈적임 없이 잘 떨어지지만 곡면 부착에는 적합하지 않습니다.',
    waterproof: true,
    tearResistant: true,
    transparent: false,
    removable: true,
    metal: false,
    premium: false,
    whiteInkRecommended: false,
    recommendedUse: '노트북 스티커, 가전제품 안내문, 재사용 용기',
    precautions: '곡면 부착 시 들뜸 현상이 발생할 수 있습니다.',
    image: 'https://picsum.photos/seed/paper-yupo-rem/400/300'
  },
  {
    id: 'synapse-removable',
    group: '방수/합성지',
    name: '시냅스(PET) 리무버블',
    weight: '135g',
    shortDescription: '두껍고 튼튼한 리무버블',
    description: '두꺼운 재질이라 곡면 부착에는 적합하지 않지만, 점착력이 있고 리무버블이라 깨끗하게 잘 떨어집니다.',
    waterproof: true,
    tearResistant: true,
    transparent: false,
    removable: true,
    metal: false,
    premium: false,
    whiteInkRecommended: false,
    recommendedUse: '안내 표지판, 주차 스티커, 대형 장비 라벨',
    precautions: '재질이 두꺼워 평평한 면에 부착하는 것을 권장합니다.',
    image: 'https://picsum.photos/seed/paper-synapse/400/300'
  },

  // 투명/PET 계열
  {
    id: 'trans-pet',
    group: '투명/PET',
    name: '투명 PET',
    weight: '050g',
    shortDescription: '투명 / 화이트인쇄 추천',
    description: '투명 비닐 원단에 인쇄되는 스티커로, 내부가 투명하게 보여 다양한 용도로 활용할 수 있습니다.',
    waterproof: true,
    tearResistant: true,
    transparent: true,
    removable: false,
    metal: false,
    premium: false,
    whiteInkRecommended: true,
    recommendedUse: '유리 용기, 투명 패키지, 윈도우 그래픽',
    precautions: '배경이 투명하므로 진한 색상 부착 시 인쇄 내용이 잘 안 보일 수 있습니다.',
    image: 'https://picsum.photos/seed/paper-trans-pet/400/300'
  },
  {
    id: 'high-trans-pet-back',
    group: '투명/PET',
    name: '고투명 PET 투명후지',
    weight: '050g',
    shortDescription: '유리처럼 맑고 깨끗한 투명도',
    description: 'PET 소재의 고투명 점착 원단으로 물에 젖지 않고 잘 찢어지지 않습니다. 전면과 후지 모두 투명하여 컬러 인쇄와 화이트 인쇄를 함께 진행하기 좋습니다. 다만 인쇄 및 후가공 중 스크래치가 발생할 수 있고, 정전기로 인해 코팅이 어렵습니다.',
    waterproof: true,
    tearResistant: true,
    transparent: true,
    removable: false,
    metal: false,
    premium: false,
    whiteInkRecommended: true,
    recommendedUse: '프리미엄 투명 라벨, 화장품, 향수병',
    precautions: '스크래치에 민감하므로 취급 시 주의가 필요합니다.',
    image: 'https://picsum.photos/seed/paper-high-trans/400/300'
  },
  {
    id: 'high-trans-pet-removable',
    group: '투명/PET',
    name: '고투명 PET 리무버블',
    weight: '050g',
    shortDescription: '깨끗하게 떨어지는 고투명 재질',
    description: 'PET 소재의 고투명 리무버블 점착 원단으로 물에 젖지 않고 잘 찢어지지 않습니다. 컬러와 화이트 인쇄를 함께 활용하기 좋습니다. 다만 스크래치가 발생할 수 있고, 코팅이 어렵고, 마찰에 의해 인쇄가 벗겨질 수 있습니다.',
    waterproof: true,
    tearResistant: true,
    transparent: true,
    removable: true,
    metal: false,
    premium: false,
    whiteInkRecommended: true,
    recommendedUse: '시즌 윈도우 데코, 전자기기 보호 필름, 이벤트 안내',
    precautions: '마찰이 잦은 곳에 부착 시 인쇄가 지워질 수 있습니다.',
    image: 'https://picsum.photos/seed/paper-high-trans-rem/400/300'
  },

  // 메탈/광택 특수 재질
  {
    id: 'silver-matte-pet',
    group: '메탈/광택 특수 재질',
    name: '은무 PET',
    weight: '050g',
    shortDescription: '세련된 무광 은색 메탈',
    description: '은색 무광 메탈 느낌의 재질입니다. 찢어지지 않고 물에 젖지 않으며 내구성이 강해 기계나 전자제품 라벨에 많이 사용됩니다.',
    waterproof: true,
    tearResistant: true,
    transparent: false,
    removable: false,
    metal: true,
    premium: false,
    whiteInkRecommended: true,
    recommendedUse: '전자제품 명판, 배터리 라벨, 산업용 장비',
    precautions: '고급스러운 무광 은색 질감이 특징입니다.',
    image: 'https://picsum.photos/seed/paper-silver-matte/400/300'
  },
  {
    id: 'gold-gloss-pet',
    group: '메탈/광택 특수 재질',
    name: '금광 PET',
    weight: '050g',
    shortDescription: '화려한 골드 메탈 광택',
    description: '금색 광택이 뛰어난 메탈 느낌의 스티커 용지입니다. 화려하고 고급스러운 느낌을 주며, 물에 젖지 않고 찢어지지 않아 내구성과 접착력이 뛰어납니다. 인증라벨, 제품 장식, 식품/화장품 라벨 등에 적합합니다.',
    waterproof: true,
    tearResistant: true,
    transparent: false,
    removable: false,
    metal: true,
    premium: false,
    whiteInkRecommended: true,
    recommendedUse: '인증 라벨, 명품 패키지, 화장품 포인트',
    precautions: '거울 같은 광택이 있어 지문이 잘 묻을 수 있습니다.',
    image: 'https://picsum.photos/seed/paper-gold-gloss/400/300'
  },
  {
    id: 'silver-gloss-pet',
    group: '메탈/광택 특수 재질',
    name: '은광 PET',
    weight: '050g',
    shortDescription: '거울처럼 빛나는 실버 메탈',
    description: '은색 광택이 강한 메탈 느낌의 재질입니다. 거울처럼 빛이 반사되는 특징이 있으며, 물에 젖지 않고 찢어지지 않아 전자제품, 식품/화장품 라벨 등에 많이 사용됩니다.',
    waterproof: true,
    tearResistant: true,
    transparent: false,
    removable: false,
    metal: true,
    premium: false,
    whiteInkRecommended: true,
    recommendedUse: '거울 효과 라벨, 전자기기, 프리미엄 굿즈',
    precautions: '반사율이 매우 높아 디자인 시 고려가 필요합니다.',
    image: 'https://picsum.photos/seed/paper-silver-gloss/400/300'
  },
  {
    id: 'gold-label-paper',
    group: '메탈/광택 특수 재질',
    name: '금 라벨지',
    weight: '080g',
    shortDescription: '고급스러운 금색 포일 질감',
    description: '전면 금색 포일 가공, 후면 노란 후지의 고급스러운 금광 라벨지입니다.',
    waterproof: false,
    tearResistant: false,
    transparent: false,
    removable: false,
    metal: true,
    premium: false,
    whiteInkRecommended: false,
    recommendedUse: '상장, 감사패, 명절 선물 세트',
    precautions: '종이 베이스에 포일 가공된 형태로 물에 젖을 수 있습니다.',
    image: 'https://picsum.photos/seed/paper-gold-label/400/300'
  },
  {
    id: 'silver-label-paper',
    group: '메탈/광택 특수 재질',
    name: '은 라벨지',
    weight: '080g',
    shortDescription: '고급스러운 은색 포일 질감',
    description: '전면 은색 포일 가공, 후면 노란 후지의 고급스러운 은광 라벨지입니다.',
    waterproof: false,
    tearResistant: false,
    transparent: false,
    removable: false,
    metal: true,
    premium: false,
    whiteInkRecommended: false,
    recommendedUse: '고급 문서, 보증서, 상품권 봉인',
    precautions: '종이 베이스에 포일 가공된 형태로 물에 젖을 수 있습니다.',
    image: 'https://picsum.photos/seed/paper-silver-label/400/300'
  },
  {
    id: 'bronze-label-paper',
    group: '메탈/광택 특수 재질',
    name: '동 라벨지',
    weight: '080g',
    shortDescription: '고급스러운 동색 포일 질감',
    description: '전면 동색 포일 가공, 후면 노란 후지의 고급스러운 동광 라벨지입니다.',
    waterproof: false,
    tearResistant: false,
    transparent: false,
    removable: false,
    metal: true,
    premium: false,
    whiteInkRecommended: false,
    recommendedUse: '엔틱 디자인, 수제 맥주, 가죽 제품 라벨',
    precautions: '종이 베이스에 포일 가공된 형태로 물에 젖을 수 있습니다.',
    image: 'https://picsum.photos/seed/paper-bronze-label/400/300'
  },

  // 프리미엄 라벨 / GMUND 계열
  {
    id: 'gmund-white-wood',
    group: '프리미엄 라벨(GMUND)',
    name: '(GMUND) 화이트우드',
    weight: '100g',
    shortDescription: '내추럴한 나뭇결의 고급감',
    description: 'FSC® 환경인증을 받은 고급 라벨 용지입니다. 흰 배경에 나뭇결이 살아 있어 내추럴한 느낌의 라벨로 적합합니다.',
    waterproof: false,
    tearResistant: false,
    transparent: false,
    removable: false,
    metal: false,
    premium: true,
    whiteInkRecommended: false,
    recommendedUse: '와인 라벨, 친환경 코스메틱, 수제 캔들',
    precautions: '나뭇결 엠보가 있어 미세한 텍스트 인쇄 시 주의가 필요합니다.',
    image: 'https://picsum.photos/seed/paper-white-wood/400/300'
  },
  {
    id: 'gmund-cream-silver',
    group: '프리미엄 라벨(GMUND)',
    name: '(GMUND) 크림실버',
    weight: '110g',
    shortDescription: '은은한 크림색의 프리미엄',
    description: '아이보리 크림색 베이스의 고급 라벨 용지로, 인쇄 후 프리미엄 느낌이 잘 살아납니다.',
    waterproof: false,
    tearResistant: false,
    transparent: false,
    removable: false,
    metal: false,
    premium: true,
    whiteInkRecommended: false,
    recommendedUse: '청첩장 스티커, 고급 베이커리, 웨딩 관련 용품',
    precautions: '은은한 펄감이 느껴지는 고급 용지입니다.',
    image: 'https://picsum.photos/seed/paper-cream-silver/400/300'
  },
  {
    id: 'gmund-nuclear-acid',
    group: '프리미엄 라벨(GMUND)',
    name: '(GMUND) 뉴클리어 애시드',
    weight: '110g',
    shortDescription: '개성 넘치는 야광 연두색',
    description: '야광에 가까운 연두색 베이스로, 눈에 잘 띄는 개성 있는 라벨지입니다.',
    waterproof: false,
    tearResistant: false,
    transparent: false,
    removable: false,
    metal: false,
    premium: true,
    whiteInkRecommended: false,
    recommendedUse: '스트릿 브랜드, 힙한 카페, 팝업스토어 굿즈',
    precautions: '용지 색상이 매우 강렬하여 보색 대비 디자인이 효과적입니다.',
    image: 'https://picsum.photos/seed/paper-nuclear/400/300'
  },
  {
    id: 'gmund-bubbling-black',
    group: '프리미엄 라벨(GMUND)',
    name: '(GMUND) 버블링 블랙',
    weight: '110g',
    shortDescription: '반짝임이 더해진 럭셔리 블랙',
    description: '블랙 바탕에 반짝이가 더해진 듯한 고급스러운 블랙 라벨 용지입니다. 일반 종이보다 잘 찢어지지 않습니다.',
    waterproof: false,
    tearResistant: true,
    transparent: false,
    removable: false,
    metal: false,
    premium: true,
    whiteInkRecommended: true,
    recommendedUse: '고급 주류, 블랙 패키지, VIP 기프트',
    precautions: '어두운 배경이므로 화이트 인쇄나 금/은박 후가공을 추천합니다.',
    image: 'https://picsum.photos/seed/paper-bubbling-black/400/300'
  },
  {
    id: 'gmund-black',
    group: '프리미엄 라벨(GMUND)',
    name: '(GMUND) 블랙',
    weight: '100g',
    shortDescription: '패브릭 질감의 깊은 블랙',
    description: '패브릭 느낌이 살아 있는 고급 블랙 라벨 용지입니다. 일반 종이보다 잘 찢어지지 않습니다.',
    waterproof: false,
    tearResistant: true,
    transparent: false,
    removable: false,
    metal: false,
    premium: true,
    whiteInkRecommended: true,
    recommendedUse: '의류 라벨, 가죽 제품, 미니멀 디자인',
    precautions: '패브릭 질감이 있어 인쇄 면이 고르지 않을 수 있습니다.',
    image: 'https://picsum.photos/seed/paper-gmund-black/400/300'
  },
  {
    id: 'gmund-pastel-heart-attack',
    group: '프리미엄 라벨(GMUND)',
    name: '(GMUND) 파스텔 하트 어택',
    weight: '110g',
    shortDescription: '톡톡 튀는 형광 핑크',
    description: '형광 핑크에 가까운 베이스 컬러로, 톡톡 튀고 눈에 띄는 라벨지입니다.',
    waterproof: false,
    tearResistant: false,
    transparent: false,
    removable: false,
    metal: false,
    premium: true,
    whiteInkRecommended: false,
    recommendedUse: '키치한 굿즈, 디저트 샵, 이벤트 포인트',
    precautions: '형광색 용지로 인쇄 색상이 용지 색상과 섞일 수 있습니다.',
    image: 'https://picsum.photos/seed/paper-heart-attack/400/300'
  },
  {
    id: 'gmund-value',
    group: '프리미엄 라벨(GMUND)',
    name: '(GMUND) 밸류',
    weight: '110g',
    shortDescription: '골드 펄의 패브릭 감성',
    description: '골드 펄 베이스로 금가루를 머금은 듯한 패브릭 원단 느낌의 라벨입니다. 진한 컬러 인쇄 시 더 잘 어울립니다.',
    waterproof: false,
    tearResistant: false,
    transparent: false,
    removable: false,
    metal: true,
    premium: true,
    whiteInkRecommended: false,
    recommendedUse: '고급 코스메틱, 쥬얼리 패키지, 명품 라벨',
    precautions: '골드 펄감이 강해 화려한 느낌을 줍니다.',
    image: 'https://picsum.photos/seed/paper-value/400/300'
  },
  {
    id: 'gmund-white-leather',
    group: '프리미엄 라벨(GMUND)',
    name: '(GMUND) 화이트 레더',
    weight: '100g',
    shortDescription: '가죽 질감의 유니크한 화이트',
    description: '흰 바탕에 레더 질감이 살아 있어 고급스러운 라벨 표현이 가능합니다.',
    waterproof: false,
    tearResistant: false,
    transparent: false,
    removable: false,
    metal: false,
    premium: true,
    whiteInkRecommended: false,
    recommendedUse: '가죽 공방, 수제화 브랜드, 고급 가구 라벨',
    precautions: '가죽 엠보싱 효과로 독특한 촉감을 제공합니다.',
    image: 'https://picsum.photos/seed/paper-white-leather/400/300'
  },
  {
    id: 'gmund-white-sparkling',
    group: '프리미엄 라벨(GMUND)',
    name: '(GMUND) 화이트 스파클링',
    weight: '110g',
    shortDescription: '블루 펄이 가미된 화이트',
    description: '아이보리 크림색 베이스에 반짝이는 블루 느낌이 더해져, 인쇄 후 패브릭 라벨처럼 고급스럽게 표현됩니다.',
    waterproof: false,
    tearResistant: false,
    transparent: false,
    removable: false,
    metal: false,
    premium: true,
    whiteInkRecommended: false,
    recommendedUse: '코스메틱, 향수, 프리미엄 패키지',
    precautions: '각도에 따라 은은한 블루 펄이 반짝입니다.',
    image: 'https://picsum.photos/seed/paper-sparkling/400/300'
  },
  {
    id: 'hologram-sticker-paper',
    group: '메탈/광택 특수 재질',
    name: '홀로그램 스티커',
    weight: '050g',
    shortDescription: '무지개빛 반짝임',
    description: '빛의 각도에 따라 무지개빛으로 반짝이는 홀로그램 원단입니다.',
    waterproof: true,
    tearResistant: true,
    transparent: false,
    removable: false,
    metal: true,
    premium: false,
    whiteInkRecommended: true,
    recommendedUse: '굿즈, 캐릭터 스티커, 포인트 라벨',
    precautions: '패턴에 따라 인쇄 색감이 달라질 수 있습니다.',
    image: 'https://picsum.photos/seed/paper-hologram/400/300'
  },
  {
    id: 'cold-yupo-sticker',
    group: '방수/합성지',
    name: '냉동 유포지',
    weight: '080g',
    shortDescription: '냉동 환경 최적화',
    description: '강력한 저온 점착제를 사용하여 냉동 식품 패키지에 적합한 유포지입니다.',
    waterproof: true,
    tearResistant: true,
    transparent: false,
    removable: false,
    metal: false,
    premium: false,
    whiteInkRecommended: false,
    recommendedUse: '냉동 식품, 냉장 보관 용기',
    precautions: '부착 시 표면의 물기를 제거해 주세요.',
    image: 'https://picsum.photos/seed/paper-cold-yupo/400/300'
  }
];

export interface FAQItem {
  question: string;
  answer: string;
}

export interface OrderStep {
  number: string;
  title: string;
  description: string;
}

export const CATEGORIES: Category[] = [
  { 
    id: 'sticker', 
    name: '스티커', 
    icon: 'StickyNote', 
    description: '원하는 모양과 재질로 소량부터 제작할 수 있는 맞춤 스티커',
    entryPhrase: '나만의 개성을 담은 스티커 제작',
    subCategories: [
      {
        groupName: '자유형 스티커',
        items: ['자유형 스티커', '투명 자유형 스티커', '투명 배면 스티커', '홀로그램 스티커', '다양한 모양 스티커']
      },
      {
        groupName: '규격형 스티커',
        items: ['사각형 스티커', '원형 스티커', '타원형 스티커', '정사각형 스티커']
      },
      {
        groupName: '용도형 스티커',
        items: ['옥외용 스티커', '냉장·냉동 스티커', '카드 스티커', '자석 스티커', '스크래치 스티커', '롤 스티커', '리무버블 스티커']
      },
      {
        groupName: '프리미엄 재질',
        items: ['금광 PET', '은광 PET', '은무 PET', '그문드 라벨', '금 라벨지', '은 라벨지', '동 라벨지']
      },
      {
        groupName: '조각 스티커',
        items: ['조각 스티커']
      },
      {
        groupName: 'UV 스티커',
        items: ['UV 스티커']
      }
    ]
  },
  { 
    id: 'card-paper', 
    name: '카드 · 지류', 
    icon: 'FileText', 
    description: '명함, 엽서, 포토카드 등 인쇄 굿즈의 기본',
    entryPhrase: '감성을 담은 지류 굿즈의 완성',
    subCategories: [
      {
        groupName: '명함',
        items: ['일반 명함', '고급지 명함', '접지 명함', '디자인 템플릿 명함'],
        isLocked: true
      },
      {
        groupName: '엽서',
        items: ['일반 엽서', '특가 엽서', '모양 엽서', '고급지 엽서', '후가공 엽서'],
        isLocked: true
      },
      {
        groupName: '포토카드',
        items: ['기본 포토카드', '홀로그램 포토카드', '라운드 포토카드', '특전 포토']
      }
    ]
  },
  { 
    id: 'memo-note', 
    name: '메모지 · 노트', 
    icon: 'BookOpen', 
    description: '떡메모지와 다양한 제본 방식의 노트 제작',
    entryPhrase: '기록의 즐거움을 더하는 메모지와 노트',
    subCategories: [
      {
        groupName: '떡메모지',
        items: ['일반 떡메모지']
      },
      {
        groupName: '노트',
        items: ['스프링 노트', '레더 노트', '중철 노트', '하드커버 노트']
      },
      {
        groupName: '드로잉북',
        items: ['전문가용 드로잉북', '학생용 드로잉북', '세로형 종합장']
      }
    ]
  },
  { 
    id: 'binding-booklet', 
    name: '제본•책자', 
    icon: 'Book', 
    description: '소량 책자부터 대량 출판물까지 완벽한 제본',
    entryPhrase: '당신의 이야기를 한 권의 책으로',
    subCategories: [
      {
        groupName: '일반 제본 책자',
        items: ['무선제본 책자', '스프링제본 책자', '트윈링제본 책자', '중철제본 책자', '실제본 책자']
      },
      {
        groupName: '알뜰책자',
        items: ['알뜰 무선제본 책자', '알뜰 스프링제본 책자', '알뜰 트윈링제본 책자']
      },
      {
        groupName: '용도별 주문',
        items: ['공부자료 제본', '학습자료 제본', '수업교안 제본', '문제집 제본', '단행본/소책자 제작', '기관/학교 제출용 제본']
      }
    ]
  },
  { 
    id: 'poster-promo', 
    name: '포스터 · 홍보물', 
    icon: 'Image', 
    description: '시선을 사로잡는 포스터와 다양한 홍보 인쇄물',
    entryPhrase: '메시지를 전달하는 가장 강력한 시각 매체',
    subCategories: [
      {
        groupName: '포스터',
        items: ['일반 포스터', '대형 포스터', '패브릭 포스터', '디자인 포스터']
      },
      {
        groupName: '홍보물',
        items: ['리플렛', '전단지', '티켓', '홀더']
      }
    ]
  },
  { 
    id: 'package-supply', 
    name: '패키지 · 부자재', 
    icon: 'Package', 
    description: '브랜드의 가치를 높이는 패키지와 다양한 부자재',
    entryPhrase: '브랜드의 완성, 고품격 패키지',
    subCategories: [
      {
        groupName: '패키지',
        items: ['쇼핑백', '봉투', '포장지', '박스']
      },
      {
        groupName: '부자재',
        items: ['택(Tag)', '헤더택', '띠지', '라벨']
      }
    ]
  },
  { 
    id: 'custom', 
    name: '맞춤제작', 
    icon: 'Settings', 
    description: '규격 외 상품이나 대량 제작 상담',
    entryPhrase: '상상하는 모든 것, 완두프린트와 함께',
    subCategories: [
      {
        groupName: '상담 제작',
        items: ['별도 상담 제작', '대량 제작 문의', '샘플 제작']
      }
    ]
  },
  { 
    id: 'poster', 
    name: '포스터', 
    icon: 'Image', 
    description: '공간을 채우는 선명한 포스터 제작',
    entryPhrase: '공간의 분위기를 바꾸는 포스터',
    subCategories: [
      {
        groupName: '일반 포스터',
        items: ['일반 포스터']
      }
    ]
  }
];

export const ORDER_STEPS: OrderStep[] = [
  { number: '01', title: '상품 선택', description: '원하는 상품과 기본 옵션을 확인합니다.' },
  { number: '02', title: '견적 확인', description: '상세 옵션과 수량을 조절하여 실시간 견적을 확인합니다.' },
  { number: '03', title: '견적서 발행', description: '확정된 견적 내용을 문서 형태로 저장하거나 발행합니다.' },
  { number: '04', title: '문의/파일접수', description: '견적 내용을 바탕으로 작업 파일을 접수하고 상담을 진행합니다.' },
  { number: '05', title: '제작 진행', description: '전문가의 검수 후 고품질 인쇄 및 가공이 시작됩니다.' },
  { number: '06', title: '발송', description: '꼼꼼하게 포장하여 안전하게 배송해 드립니다.' },
];

export interface SubCategoryMetadata {
  description: string;
  tagline: string;
}

export const SUBCATEGORY_METADATA: Record<string, SubCategoryMetadata> = {
  '사각형 스티커': {
    tagline: '가장 대중적인 사각형, 깔끔한 재단.',
    description: '정해진 사각 규격으로 제작하는 가성비 좋은 스티커입니다. 홍보용, 박스 부착용으로 가장 많이 사용됩니다.'
  },
  '원형 스티커': {
    tagline: '부드러운 원형, 패키지 봉인에 최적.',
    description: '패키지 마감이나 로고 강조에 적합한 원형 스티커입니다. 정교한 원형 칼선으로 깔끔한 마감을 제공합니다.'
  },
  '타원형 스티커': {
    tagline: '유연한 타원형, 부드러운 디자인.',
    description: '가로 또는 세로로 긴 타원형 스티커입니다. 로고나 텍스트를 부드럽게 감싸는 디자인에 효과적입니다.'
  },
  '정사각형 스티커': {
    tagline: '안정적인 정사각형, 균형 잡힌 디자인.',
    description: '가로세로 비율이 동일한 정사각형 스티커입니다. 로고나 아이콘을 강조하기에 좋습니다.'
  },
  '자유형 스티커': {
    tagline: '원하는 모양 그대로, 자유로운 칼선.',
    description: '캐릭터나 로고 외곽선을 따라 자유롭게 컷팅되는 스티커입니다. 개성 있는 굿즈 제작에 필수적입니다.'
  },
  '투명 자유형 스티커': {
    tagline: '배경이 비치는 투명한 자유형 스티커.',
    description: '투명 PET 재질을 사용하여 배경이 비치는 독특한 느낌의 자유형 스티커입니다.'
  },
  '투명 배면 스티커': {
    tagline: '유리 안쪽에서 부착하는 투명 스티커.',
    description: '투명 재질의 뒷면에 인쇄하여 유리창 안쪽에서 부착 시 밖에서 정방향으로 보이게 제작합니다.'
  },
  '홀로그램 스티커': {
    tagline: '빛의 각도에 따라 무지갯빛으로 빛나는 특별함.',
    description: '홀로그램 원단을 사용하여 신비롭고 화려한 효과를 주는 스티커입니다.'
  },
  '다양한 모양 스티커': {
    tagline: '한 장에 여러 디자인을 담는 실속형.',
    description: '하나의 시트 안에 여러 가지 모양과 크기의 칼선을 자유롭게 배치할 수 있습니다.'
  },
  '옥외용 스티커': {
    tagline: '비바람과 햇빛에도 끄떡없는 강력한 내구성.',
    description: '내후성이 강한 소재와 잉크를 사용하여 외부 노출이 잦은 차량이나 시설물에 적합합니다.'
  },
  '냉장·냉동 스티커': {
    tagline: '저온 환경에서도 떨어지지 않는 강력한 접착.',
    description: '습기와 저온에 강한 특수 점착제를 사용하여 냉장/냉동 식품 패키지에 최적화되었습니다.'
  },
  '카드 스티커': {
    tagline: '나만의 카드를 만드는 가장 쉬운 방법.',
    description: '신용카드나 교통카드 규격에 딱 맞는 사이즈로 제작되는 굿즈용 스티커입니다.'
  },
  '자석 스티커': {
    tagline: '뗐다 붙였다 자유로운 자석형 홍보물.',
    description: '고무 자석판에 인쇄된 스티커를 합지하여 현관문이나 차량 등에 부착 가능합니다.'
  },
  '스크래치 스티커': {
    tagline: '긁는 재미가 있는 이벤트 및 프로모션 필수템.',
    description: '복권처럼 동전으로 긁으면 내용이 나타나는 이벤트용 특수 스티커입니다.'
  },
  '롤 스티커': {
    tagline: '대량 부착 작업에 효율적인 롤 형태.',
    description: '자동 라벨러 작업이나 대량 포장 작업 시 편리하게 사용할 수 있는 롤 타입 스티커입니다.'
  },
  '리무버블 스티커': {
    tagline: '흔적 없이 깔끔하게 떼어지는 스티커.',
    description: '노트북, 캐리어, 다이어리 등 부착 후 떼어낼 때 끈적임이 남지 않는 리무버블 재질입니다.'
  },
  '금광 PET': {
    tagline: '거울처럼 빛나는 화려한 골드 메탈.',
    description: '금색 광택이 뛰어난 PET 재질로 고급스러운 인증 라벨이나 장식에 적합합니다.'
  },
  '은광 PET': {
    tagline: '세련된 실버 메탈의 강렬한 반사광.',
    description: '은색 광택이 강한 메탈 느낌의 재질로 전자기기나 프리미엄 제품에 많이 사용됩니다.'
  },
  '은무 PET': {
    tagline: '차분하고 고급스러운 무광 은색 메탈.',
    description: '은색 무광 메탈 재질로 내구성이 강해 산업용 장비나 전자제품 명판에 최적입니다.'
  },
  '그문드 라벨': {
    tagline: '독보적인 질감의 프리미엄 친환경 라벨.',
    description: '독일 그문드사의 고급 용지를 사용한 프리미엄 라벨로 와인, 코스메틱 등에 추천합니다.'
  },
  '금 라벨지': {
    tagline: '전통적인 고급스러움, 금색 포일 라벨.',
    description: '종이 베이스에 금색 포일 가공을 더해 상장이나 명절 선물 세트에 품격을 더합니다.'
  },
  '은 라벨지': {
    tagline: '깔끔하고 정갈한 은색 포일 라벨.',
    description: '종이 베이스에 은색 포일 가공을 더해 보증서나 상품권 봉인 등에 적합합니다.'
  },
  '동 라벨지': {
    tagline: '엔틱하고 빈티지한 브론즈 메탈 느낌.',
    description: '동색 포일 가공으로 수제 맥주나 가죽 제품 등 엔틱한 디자인에 잘 어울립니다.'
  },
  '조각 스티커': {
    tagline: '하나씩 낱개로, 배포용 최적.',
    description: '한 장씩 낱개로 재단되어 배포나 판매용으로 적합한 스티커입니다. 배경지까지 함께 재단되어 깔끔합니다.'
  },
  'UV 스티커': {
    tagline: '매끄러운 표면 어디든, 입체감 있는 UV 인쇄.',
    description: '플라스틱, 유리, 금속 등 다양한 표면에 부착 가능한 고내구성 UV 전사 스티커입니다.'
  },
  '디자인 템플릿 명함': BUSINESS_CARD_METADATA['디자인 템플릿 명함'],
  '일반 명함': BUSINESS_CARD_METADATA['일반 명함'],
  '고급지 명함': BUSINESS_CARD_METADATA['고급지 명함'],
  '접지 명함': BUSINESS_CARD_METADATA['접지 명함'],
  '일반 엽서': {
    tagline: '소중한 마음을 담는 클래식 엽서.',
    description: '표준 규격 및 다양한 사이즈로 제작 가능한 고품질 엽서입니다.'
  },
  '특가 엽서': {
    tagline: '가장 합리적인 선택, 빠른 주문.',
    description: '선택지를 줄여 가격을 낮춘 가성비 중심의 빠른 제작 엽서입니다.'
  },
  '모양 엽서': {
    tagline: '평범함을 거부하는 특별한 디자인.',
    description: '라운드, 티켓형, 자유형 칼선 등 독특한 모양의 엽서입니다.'
  },
  '고급지 엽서': {
    tagline: '종이 본연의 질감이 전하는 깊은 감동.',
    description: '엄선된 수입지와 프리미엄 용지로 제작하는 품격 있는 엽서입니다.'
  },
  '후가공 엽서': {
    tagline: '빛나는 디테일로 완성하는 프리미엄.',
    description: '박, 형압, 스코딕스 등 화려한 효과를 더한 특별한 엽서입니다.'
  },
  '기본 포토카드': {
    tagline: '한 손에 쏙, 나만의 굿즈.',
    description: '아이돌 굿즈나 명함 대용으로 인기 있는 포토카드입니다.'
  },
  '일반 떡메모지': {
    tagline: '한 장씩 떼어 쓰는 편리한 메모지.',
    description: '다양한 디자인으로 제작 가능한 표준 떡메모지입니다.'
  },
  '스프링 노트': {
    tagline: '필기가 편한 스프링 제본 노트.',
    description: '튼튼한 스프링으로 마감되어 펼침이 좋은 노트입니다.'
  },
  '중철제본': {
    tagline: '가볍고 실용적인 중철 제본 책자.',
    description: '카탈로그나 팜플렛 제작에 적합한 제본 방식입니다.'
  },
  '일반 포스터': {
    tagline: '공간을 채우는 선명한 포스터.',
    description: '다양한 사이즈로 제작 가능한 표준 포스터입니다.'
  },
  '쇼핑백': {
    tagline: '브랜드의 가치를 담는 쇼핑백.',
    description: '튼튼하고 고급스러운 맞춤형 종이 쇼핑백입니다.'
  },
  '봉투': {
    tagline: '첫인상을 결정하는 고급스러운 봉투.',
    description: '다양한 컬러와 재질로 제작하는 고품질 봉투입니다.'
  },
  '박스': {
    tagline: '브랜드의 가치를 담는 완벽한 패키지.',
    description: '상품의 가치를 높여주는 맞춤형 박스 제작 서비스입니다.'
  },
  '별도 상담 제작': {
    tagline: '상상하는 모든 것, 맞춤 상담 제작.',
    description: '규격 외 상품이나 복합 공정이 필요한 상품을 위한 전문가 상담 서비스입니다.'
  },
  '전문가용 드로잉북': {
    tagline: '전문가를 위한 고품질 드로잉북.',
    description: '300g의 두꺼운 드로잉 용지를 사용하여 수채화, 소묘 등 다양한 작업에 적합합니다.'
  },
  '학생용 드로잉북': {
    tagline: '튼튼한 하드커버로 보호하는 학생용 드로잉북.',
    description: '2mm 보드 하드커버로 내구성이 뛰어나며, 휴대가 간편한 드로잉북입니다.'
  },
  '세로형 종합장': {
    tagline: '다용도로 활용 가능한 세로형 종합장.',
    description: '드로잉과 필기를 동시에 할 수 있는 실용적인 종합장입니다.'
  }
};

export const STICKER_COMMON_OPTIONS = {
  WHITE_INK: {
    name: '화이트 인쇄',
    type: 'radio' as const,
    values: [
      { label: '없음', priceModifier: 0 },
      { label: '있음', priceModifier: 2000 },
    ]
  },
  CUTTING_METHOD: {
    name: '재단 방식',
    type: 'radio' as const,
    values: [
      { label: '반칼 (시트형)', priceModifier: 0 },
      { label: '완칼 (개별조각)', priceModifier: 1000 },
    ]
  },
  COATING: [
    {
      name: '코팅',
      type: 'radio' as const,
      values: [
        { label: '없음', priceModifier: 0 },
        { label: '무광 코팅', priceModifier: 0 },
        { label: '유광 코팅', priceModifier: 0 },
        { label: '무광 벨벳 코팅', priceModifier: 5000 },
        { label: '샌드 코팅', priceModifier: 3000 },
      ]
    }
  ],
  ROUNDING: [
    {
      name: '귀돌이',
      type: 'radio' as const,
      values: [
        { label: '없음', priceModifier: 0 },
        { label: '있음', priceModifier: 5000 },
      ]
    },
    {
      name: '귀돌이 크기',
      type: 'radio' as const,
      values: [
        { label: '4mm', priceModifier: 0 },
        { label: '6mm', priceModifier: 0 },
      ]
    },
    {
      name: '귀돌이 면수',
      type: 'radio' as const,
      values: [
        { label: '1면', priceModifier: 0 },
        { label: '4면', priceModifier: 1000 },
      ]
    },
    {
      name: '귀돌이 방향',
      type: 'select' as const,
      values: [
        { label: '상단좌', priceModifier: 0 },
        { label: '상단우', priceModifier: 0 },
        { label: '하단좌', priceModifier: 0 },
        { label: '하단우', priceModifier: 0 },
      ]
    }
  ],
  PACKAGING: [
    {
      name: '폴리백 개별포장',
      type: 'radio' as const,
      values: [
        { label: '없음', priceModifier: 0 },
        { label: '있음', priceModifier: 500 },
      ]
    }
  ],
  PUNCHING: [
    {
      name: '타공',
      type: 'radio' as const,
      values: [
        { label: '없음', priceModifier: 0 },
        { label: '있음', priceModifier: 1000 },
      ]
    },
    {
      name: '타공 크기',
      type: 'radio' as const,
      values: [
        { label: '4mm', priceModifier: 0 },
        { label: '6mm', priceModifier: 0 },
        { label: '8mm', priceModifier: 0 },
      ]
    },
    {
      name: '타공 설명',
      type: 'text' as const,
      placeholder: '예: 중앙 상단 1개 / 좌측 상단 1개 등'
    }
  ],
  SHAPE_CUTTING: [
    {
      name: '모양커팅',
      type: 'radio' as const,
      values: [
        { label: '없음', priceModifier: 0 },
        { label: '있음', priceModifier: 5000 },
      ]
    }
  ],
  CREASING: [
    {
      name: '오시',
      type: 'radio' as const,
      values: [
        { label: '없음', priceModifier: 0 },
        { label: '있음', priceModifier: 1000 },
      ]
    },
    {
      name: '오시 줄 수',
      type: 'radio' as const,
      values: [
        { label: '1줄', priceModifier: 0 },
        { label: '2줄', priceModifier: 500 },
        { label: '3줄', priceModifier: 1000 },
      ]
    },
    {
      name: '오시 설명',
      type: 'text' as const,
      placeholder: '예: 중앙 세로 1줄 / 상단 20mm 지점 가로 1줄 등'
    }
  ],
  PERFORATION: [
    {
      name: '미싱',
      type: 'radio' as const,
      values: [
        { label: '없음', priceModifier: 0 },
        { label: '있음', priceModifier: 1000 },
      ]
    },
    {
      name: '미싱 줄 수',
      type: 'radio' as const,
      values: [
        { label: '1줄', priceModifier: 0 },
        { label: '2줄', priceModifier: 500 },
        { label: '3줄', priceModifier: 1000 },
      ]
    },
    {
      name: '미싱 설명',
      type: 'text' as const,
      placeholder: '예: 중앙 세로 1줄 / 우측 30mm 지점 세로 1줄 등'
    }
  ],
  FOLDING: [
    {
      name: '접지',
      type: 'radio' as const,
      values: [
        { label: '없음', priceModifier: 0 },
        { label: '있음', priceModifier: 1500 },
      ]
    },
    {
      name: '접지 방향',
      type: 'radio' as const,
      values: [
        { label: '가로형', priceModifier: 0 },
        { label: '세로형', priceModifier: 0 },
      ]
    },
    {
      name: '접지 형태',
      type: 'select' as const,
      values: [
        { label: '2단접지', priceModifier: 0 },
        { label: '3단접지', priceModifier: 500 },
        { label: '4단접지', priceModifier: 1000 },
        { label: '대문접지', priceModifier: 1000 },
        { label: '반대문접지', priceModifier: 1000 },
        { label: '4단 병풍접지', priceModifier: 1500 },
        { label: 'N모양 3단접지', priceModifier: 1000 },
      ]
    }
  ],
  POST_PROCESSING: {
    name: '후가공 옵션',
    type: 'select' as const,
    values: [
      { label: '없음', priceModifier: 0 },
      { label: '금박', priceModifier: 15000 },
      { label: '은박', priceModifier: 15000 },
      { label: '홀로그램박', priceModifier: 18000 },
      { label: '부분 UV 코팅', priceModifier: 12000 },
      { label: '형압', priceModifier: 20000 },
      { label: '엠보싱', priceModifier: 15000 },
    ]
  },
  CASE: {
    name: '명함케이스',
    type: 'select' as const,
    values: [
      { label: '없음', priceModifier: 0 },
      { label: '기본 종이케이스', priceModifier: 0 },
      { label: '플라스틱 케이스', priceModifier: 500 },
      { label: '고급 가죽 케이스', priceModifier: 5000 },
    ]
  }
};

/**
 * 스티커 종류별 재질 리스트 반환
 */
export const getStickerMaterials = (type: 'standard' | 'free' | 'transparent' | 'premium' | 'special' | 'outdoor' | 'removable' | 'magnetic' | 'metal' | 'gmund') => {
  switch (type) {
    case 'standard':
      return PAPER_MATERIALS.filter(m => !m.premium && !m.transparent && !m.metal && !m.removable && !m.name.includes('냉동'));
    case 'free':
      return PAPER_MATERIALS.filter(m => !m.premium && !m.metal && !m.transparent && !m.removable && !m.name.includes('냉동'));
    case 'transparent':
      return PAPER_MATERIALS.filter(m => m.transparent);
    case 'premium':
      return PAPER_MATERIALS.filter(m => m.premium);
    case 'special':
      return PAPER_MATERIALS.filter(m => m.metal || m.name.includes('홀로그램') || m.name.includes('냉동'));
    case 'metal':
      return PAPER_MATERIALS.filter(m => m.metal);
    case 'gmund':
      return PAPER_MATERIALS.filter(m => m.group === '프리미엄 라벨(GMUND)');
    case 'outdoor':
      return PAPER_MATERIALS.filter(m => m.waterproof && m.tearResistant);
    case 'removable':
      return PAPER_MATERIALS.filter(m => m.removable);
    case 'magnetic':
      return PAPER_MATERIALS.filter(m => m.id === 'art-label' || m.id === 'yupo-sticker');
    default:
      return PAPER_MATERIALS;
  }
};

export const PRODUCTS: Product[] = [
  {
    id: 'stk-rect',
    name: '사각형 스티커',
    category: 'sticker',
    subCategory: '사각형 스티커',
    ...SUBCATEGORY_METADATA['사각형 스티커'],
    image: 'https://picsum.photos/seed/sticker-rect/800/800',
    minQuantity: 100,
    basePrice: 3000,
    options: [
      {
        name: '작업 사이즈',
        type: 'select',
        values: [
          { label: '50x50mm 이내', priceModifier: 0 },
          { label: '70x70mm 이내', priceModifier: 2000 },
          { label: '100x100mm 이내', priceModifier: 5000 },
          { label: '직접 입력', priceModifier: 0 },
        ]
      },
      {
        name: '재질 선택',
        type: 'select',
        values: getStickerMaterials('standard').map(m => ({
          label: `${m.name} ${m.weight}`,
          priceModifier: m.group === '일반/기본 용지' ? 0 : 1500
        }))
      },
      STICKER_COMMON_OPTIONS.WHITE_INK,
      STICKER_COMMON_OPTIONS.CUTTING_METHOD,
      ...STICKER_COMMON_OPTIONS.COATING,
      ...STICKER_COMMON_OPTIONS.ROUNDING,
      ...STICKER_COMMON_OPTIONS.PUNCHING,
      ...STICKER_COMMON_OPTIONS.SHAPE_CUTTING,
      ...STICKER_COMMON_OPTIONS.CREASING,
      ...STICKER_COMMON_OPTIONS.PERFORATION,
      ...STICKER_COMMON_OPTIONS.FOLDING,
      ...STICKER_COMMON_OPTIONS.PACKAGING,
      STICKER_COMMON_OPTIONS.POST_PROCESSING,
      {
        name: '넘버링',
        type: 'radio',
        values: [
          { label: '없음', priceModifier: 0 },
          { label: '있음', priceModifier: 2000 },
        ]
      },
      {
        name: '스코딕스',
        type: 'radio',
        values: [
          { label: '없음', priceModifier: 0 },
          { label: '있음', priceModifier: 3000 },
        ]
      },
      {
        name: '포장 옵션',
        type: 'radio',
        values: [
          { label: '기본 포장', priceModifier: 0 },
          { label: '폴리백 개별 포장', priceModifier: 500 },
        ]
      }
    ],
    features: ['시트형 제작', '반칼 스티커 가공', '가성비 최우수'],
    leadTime: '2~3 영업일',
    badges: ['시트형', '반칼 스티커', '대량 제작 유리'],
    warnings: [
      '재단 공정상 1~2mm 밀림 현상이 있을 수 있습니다.',
      '모니터 해상도에 따라 실제 제품과 색상 차이가 있을 수 있습니다.'
    ]
  },
  {
    id: 'stk-circle',
    name: '원형 스티커',
    category: 'sticker',
    subCategory: '원형 스티커',
    ...SUBCATEGORY_METADATA['원형 스티커'],
    image: 'https://picsum.photos/seed/sticker-circle/800/800',
    minQuantity: 100,
    basePrice: 3500,
    options: [
      {
        name: '지름 선택',
        type: 'select',
        values: [
          { label: '30mm', priceModifier: 0 },
          { label: '50mm', priceModifier: 500 },
          { label: '70mm', priceModifier: 1500 },
          { label: '직접 입력', priceModifier: 0 },
        ]
      },
      {
        name: '재질 선택',
        type: 'select',
        values: getStickerMaterials('standard').map(m => ({
          label: `${m.name} ${m.weight}`,
          priceModifier: m.group === '일반/기본 용지' ? 0 : 1500
        }))
      },
      STICKER_COMMON_OPTIONS.WHITE_INK,
      STICKER_COMMON_OPTIONS.CUTTING_METHOD,
      ...STICKER_COMMON_OPTIONS.COATING,
      ...STICKER_COMMON_OPTIONS.ROUNDING,
      ...STICKER_COMMON_OPTIONS.PUNCHING,
      ...STICKER_COMMON_OPTIONS.SHAPE_CUTTING,
      ...STICKER_COMMON_OPTIONS.CREASING,
      ...STICKER_COMMON_OPTIONS.PERFORATION,
      ...STICKER_COMMON_OPTIONS.FOLDING,
      ...STICKER_COMMON_OPTIONS.PACKAGING,
      STICKER_COMMON_OPTIONS.POST_PROCESSING
    ],
    features: ['시트형 제작', '반칼 스티커 가공', '정교한 원형 칼선'],
    leadTime: '2~3 영업일',
    badges: ['시트형', '반칼 스티커', '패키지 봉인용'],
    warnings: [
      '원형 중심에서 미세하게 밀림이 발생할 수 있습니다.'
    ]
  },
  {
    id: 'stk-oval',
    name: '타원형 스티커',
    category: 'sticker',
    subCategory: '타원형 스티커',
    ...SUBCATEGORY_METADATA['타원형 스티커'],
    image: 'https://picsum.photos/seed/sticker-oval/800/800',
    minQuantity: 100,
    basePrice: 3800,
    options: [
      {
        name: '작업 사이즈',
        type: 'select',
        values: [
          { label: '50x30mm 이내', priceModifier: 0 },
          { label: '80x50mm 이내', priceModifier: 2000 },
          { label: '직접 입력', priceModifier: 0 },
        ]
      },
      {
        name: '재질 선택',
        type: 'select',
        values: getStickerMaterials('standard').map(m => ({
          label: `${m.name} ${m.weight}`,
          priceModifier: m.group === '일반/기본 용지' ? 0 : 1500
        }))
      },
      STICKER_COMMON_OPTIONS.WHITE_INK,
      STICKER_COMMON_OPTIONS.CUTTING_METHOD,
      ...STICKER_COMMON_OPTIONS.COATING,
      ...STICKER_COMMON_OPTIONS.ROUNDING,
      ...STICKER_COMMON_OPTIONS.PUNCHING,
      ...STICKER_COMMON_OPTIONS.SHAPE_CUTTING,
      ...STICKER_COMMON_OPTIONS.CREASING,
      ...STICKER_COMMON_OPTIONS.PERFORATION,
      ...STICKER_COMMON_OPTIONS.FOLDING,
      ...STICKER_COMMON_OPTIONS.PACKAGING,
      STICKER_COMMON_OPTIONS.POST_PROCESSING
    ],
    features: ['시트형 제작', '반칼 스티커 가공', '세련된 타원 칼선'],
    leadTime: '2~3 영업일',
    badges: ['시트형', '반칼 스티커', '디자인 포인트'],
    warnings: [
      '타원형은 방향에 따라 재단 오차가 더 눈에 띌 수 있습니다.'
    ]
  },
  {
    id: 'stk-round-rect',
    name: '정사각형 스티커',
    category: 'sticker',
    subCategory: '정사각형 스티커',
    ...SUBCATEGORY_METADATA['정사각형 스티커'],
    image: 'https://picsum.photos/seed/sticker-round-rect/800/800',
    minQuantity: 100,
    basePrice: 3500,
    options: [
      {
        name: '작업 사이즈',
        type: 'select',
        values: [
          { label: '50x50mm', priceModifier: 0 },
          { label: '70x70mm', priceModifier: 1000 },
          { label: '직접 입력', priceModifier: 0 },
        ]
      },
      {
        name: '재질 선택',
        type: 'select',
        values: getStickerMaterials('standard').map(m => ({
          label: `${m.name} ${m.weight}`,
          priceModifier: m.group === '일반/기본 용지' ? 0 : 1500
        }))
      },
      STICKER_COMMON_OPTIONS.WHITE_INK,
      STICKER_COMMON_OPTIONS.CUTTING_METHOD,
      ...STICKER_COMMON_OPTIONS.COATING,
      ...STICKER_COMMON_OPTIONS.ROUNDING,
      ...STICKER_COMMON_OPTIONS.PUNCHING,
      ...STICKER_COMMON_OPTIONS.SHAPE_CUTTING,
      ...STICKER_COMMON_OPTIONS.CREASING,
      ...STICKER_COMMON_OPTIONS.PERFORATION,
      ...STICKER_COMMON_OPTIONS.FOLDING,
      ...STICKER_COMMON_OPTIONS.PACKAGING,
      STICKER_COMMON_OPTIONS.POST_PROCESSING
    ],
    features: ['시트형 제작', '반칼 스티커 가공', '안정적인 정사각형'],
    leadTime: '2~3 영업일',
    badges: ['시트형', '반칼 스티커', '정사각형'],
    warnings: [
      '재단 공정상 1~2mm 밀림 현상이 있을 수 있습니다.'
    ]
  },
  {
    id: 'stk-various',
    name: '다양한 모양 스티커',
    category: 'sticker',
    subCategory: '다양한 모양 스티커',
    ...SUBCATEGORY_METADATA['다양한 모양 스티커'],
    image: 'https://picsum.photos/seed/sticker-various/800/800',
    minQuantity: 100,
    basePrice: 4500,
    options: [
      {
        name: '시트 사이즈',
        type: 'select',
        values: [
          { label: 'A6 (105x148mm)', priceModifier: 0 },
          { label: 'A5 (148x210mm)', priceModifier: 5000 },
          { label: 'A4 (210x297mm)', priceModifier: 12000 },
        ]
      },
      {
        name: '재질 선택',
        type: 'select',
        values: getStickerMaterials('free').map(m => ({
          label: `${m.name} ${m.weight}`,
          priceModifier: m.group === '일반/기본 용지' ? 0 : 1500
        }))
      },
      STICKER_COMMON_OPTIONS.WHITE_INK,
      STICKER_COMMON_OPTIONS.CUTTING_METHOD,
      ...STICKER_COMMON_OPTIONS.COATING,
      ...STICKER_COMMON_OPTIONS.ROUNDING,
      ...STICKER_COMMON_OPTIONS.PUNCHING,
      ...STICKER_COMMON_OPTIONS.SHAPE_CUTTING,
      ...STICKER_COMMON_OPTIONS.CREASING,
      ...STICKER_COMMON_OPTIONS.PERFORATION,
      ...STICKER_COMMON_OPTIONS.FOLDING,
      ...STICKER_COMMON_OPTIONS.PACKAGING,
      STICKER_COMMON_OPTIONS.POST_PROCESSING,
      {
        name: '넘버링',
        type: 'radio',
        values: [
          { label: '없음', priceModifier: 0 },
          { label: '있음', priceModifier: 2000 },
        ]
      },
      {
        name: '스코딕스',
        type: 'radio',
        values: [
          { label: '없음', priceModifier: 0 },
          { label: '있음', priceModifier: 3000 },
        ]
      },
      {
        name: '포장 옵션',
        type: 'radio',
        values: [
          { label: '기본 포장', priceModifier: 0 },
          { label: '폴리백 개별 포장', priceModifier: 500 },
        ]
      }
    ],
    features: ['시트형 제작', '반칼 스티커 가공', '멀티 칼선 구성'],
    leadTime: '3~4 영업일',
    badges: ['시트형', '반칼 스티커', '팬시 스티커'],
    warnings: [
      '칼선 간격은 최소 2mm 이상 유지해야 합니다.'
    ]
  },
  {
    id: 'stk-free-normal',
    name: '자유형 스티커',
    category: 'sticker',
    subCategory: '자유형 스티커',
    ...SUBCATEGORY_METADATA['자유형 스티커'],
    image: 'https://picsum.photos/seed/sticker-free-normal/800/800',
    minQuantity: 10,
    basePrice: 5000,
    options: [
      {
        name: '재질 선택',
        type: 'select',
        values: getStickerMaterials('free').map(m => ({
          label: `${m.name} ${m.weight}`,
          priceModifier: m.group === '일반/기본 용지' ? 0 : 1500
        }))
      },
      STICKER_COMMON_OPTIONS.WHITE_INK,
      STICKER_COMMON_OPTIONS.CUTTING_METHOD,
      ...STICKER_COMMON_OPTIONS.COATING,
      ...STICKER_COMMON_OPTIONS.ROUNDING,
      ...STICKER_COMMON_OPTIONS.PUNCHING,
      ...STICKER_COMMON_OPTIONS.SHAPE_CUTTING,
      ...STICKER_COMMON_OPTIONS.CREASING,
      ...STICKER_COMMON_OPTIONS.PERFORATION,
      ...STICKER_COMMON_OPTIONS.FOLDING,
      ...STICKER_COMMON_OPTIONS.PACKAGING,
      STICKER_COMMON_OPTIONS.POST_PROCESSING
    ],
    features: ['자유로운 칼선', '고해상도 인쇄', '강력 접착'],
    leadTime: '3~5 영업일',
    badges: ['자유형', '일반 재질', '가성비'],
    warnings: ['칼선 간격 2mm 이상 권장']
  },
  {
    id: 'stk-free-trans-normal',
    name: '투명 자유형 스티커',
    category: 'sticker',
    subCategory: '투명 자유형 스티커',
    ...SUBCATEGORY_METADATA['투명 자유형 스티커'],
    image: 'https://picsum.photos/seed/sticker-free-trans-normal/800/800',
    minQuantity: 10,
    basePrice: 7000,
    options: [
      {
        name: '재질 선택',
        type: 'select',
        values: getStickerMaterials('transparent').map(m => ({
          label: `${m.name} ${m.weight}`,
          priceModifier: 0
        }))
      },
      STICKER_COMMON_OPTIONS.WHITE_INK,
      STICKER_COMMON_OPTIONS.CUTTING_METHOD,
      ...STICKER_COMMON_OPTIONS.COATING,
      ...STICKER_COMMON_OPTIONS.ROUNDING,
      ...STICKER_COMMON_OPTIONS.PUNCHING,
      ...STICKER_COMMON_OPTIONS.SHAPE_CUTTING,
      ...STICKER_COMMON_OPTIONS.CREASING,
      ...STICKER_COMMON_OPTIONS.PERFORATION,
      ...STICKER_COMMON_OPTIONS.FOLDING,
      ...STICKER_COMMON_OPTIONS.PACKAGING,
      STICKER_COMMON_OPTIONS.POST_PROCESSING
    ],
    features: ['투명 재질', '자유로운 칼선', '방수 기능'],
    leadTime: '4~6 영업일',
    badges: ['자유형', '투명', '방수'],
    warnings: ['백색 인쇄 시 별도 작업 필요']
  },
  {
    id: 'stk-free-trans-back',
    name: '투명 배면 스티커',
    category: 'sticker',
    subCategory: '투명 배면 스티커',
    ...SUBCATEGORY_METADATA['투명 배면 스티커'],
    image: 'https://picsum.photos/seed/sticker-free-trans-back/800/800',
    minQuantity: 10,
    basePrice: 8000,
    options: [
      {
        name: '재질 선택',
        type: 'select',
        values: getStickerMaterials('transparent').map(m => ({
          label: `${m.name} ${m.weight}`,
          priceModifier: 0
        }))
      },
      STICKER_COMMON_OPTIONS.WHITE_INK,
      STICKER_COMMON_OPTIONS.CUTTING_METHOD,
      ...STICKER_COMMON_OPTIONS.COATING,
      ...STICKER_COMMON_OPTIONS.ROUNDING,
      ...STICKER_COMMON_OPTIONS.PUNCHING,
      ...STICKER_COMMON_OPTIONS.SHAPE_CUTTING,
      ...STICKER_COMMON_OPTIONS.CREASING,
      ...STICKER_COMMON_OPTIONS.PERFORATION,
      ...STICKER_COMMON_OPTIONS.FOLDING,
      ...STICKER_COMMON_OPTIONS.PACKAGING,
      STICKER_COMMON_OPTIONS.POST_PROCESSING
    ],
    features: ['고투명 재질', '투명 후지', '자유로운 칼선'],
    leadTime: '5~7 영업일',
    badges: ['자유형', '고투명', '투명후지'],
    warnings: ['스크래치에 주의해 주세요.']
  },
  {
    id: 'stk-free-hologram',
    name: '홀로그램 스티커',
    category: 'sticker',
    subCategory: '홀로그램 스티커',
    ...SUBCATEGORY_METADATA['홀로그램 스티커'],
    image: 'https://picsum.photos/seed/sticker-free-holo/800/800',
    minQuantity: 10,
    basePrice: 8500,
    options: [
      {
        name: '홀로그램 패턴',
        type: 'select',
        values: [
          { label: '샌드 패턴', priceModifier: 0 },
          { label: '스타 패턴', priceModifier: 0 },
          { label: '레인보우 패턴', priceModifier: 0 },
        ]
      },
      {
        name: '재질 선택',
        type: 'select',
        values: getStickerMaterials('special').filter(m => m.name.includes('홀로그램')).map(m => ({
          label: `${m.name} ${m.weight}`,
          priceModifier: 0
        }))
      },
      STICKER_COMMON_OPTIONS.CUTTING_METHOD,
      ...STICKER_COMMON_OPTIONS.COATING,
      ...STICKER_COMMON_OPTIONS.ROUNDING,
      ...STICKER_COMMON_OPTIONS.PUNCHING,
      ...STICKER_COMMON_OPTIONS.SHAPE_CUTTING,
      ...STICKER_COMMON_OPTIONS.CREASING,
      ...STICKER_COMMON_OPTIONS.PERFORATION,
      ...STICKER_COMMON_OPTIONS.FOLDING,
      ...STICKER_COMMON_OPTIONS.PACKAGING,
      STICKER_COMMON_OPTIONS.POST_PROCESSING
    ],
    features: ['홀로그램 효과', '자유로운 칼선', '강력 접착'],
    leadTime: '5~7 영업일',
    badges: ['자유형', '홀로그램', '스페셜'],
    warnings: ['패턴에 따라 인쇄 색감이 달라질 수 있습니다.']
  },
  {
    id: 'stk-piece',
    name: '조각 스티커',
    category: 'sticker',
    subCategory: '조각 스티커',
    ...SUBCATEGORY_METADATA['조각 스티커'],
    image: 'https://picsum.photos/seed/sticker-piece/800/800',
    minQuantity: 50,
    basePrice: 8000,
    options: [
      {
        name: '작업 사이즈',
        type: 'select',
        values: [
          { label: '50x50mm 이내', priceModifier: 0 },
          { label: '70x70mm 이내', priceModifier: 2000 },
          { label: '100x100mm 이내', priceModifier: 5000 },
          { label: '직접 입력', priceModifier: 0 },
        ]
      },
      {
        name: '재질 선택',
        type: 'select',
        values: PAPER_MATERIALS.filter(m => !m.premium && !m.transparent && !m.removable && !m.name.includes('냉동')).map(m => ({
          label: `${m.name} ${m.weight}`,
          priceModifier: m.group === '일반/기본 용지' ? 0 : 1500
        }))
      },
      STICKER_COMMON_OPTIONS.WHITE_INK,
      {
        name: '재단 방식',
        type: 'radio',
        values: [
          { label: '완칼 (개별조각)', priceModifier: 0 },
          { label: '반칼 (시트형)', priceModifier: 500 },
        ]
      },
      ...STICKER_COMMON_OPTIONS.COATING,
      ...STICKER_COMMON_OPTIONS.ROUNDING,
      ...STICKER_COMMON_OPTIONS.PUNCHING,
      ...STICKER_COMMON_OPTIONS.SHAPE_CUTTING,
      ...STICKER_COMMON_OPTIONS.CREASING,
      ...STICKER_COMMON_OPTIONS.PERFORATION,
      ...STICKER_COMMON_OPTIONS.FOLDING,
      ...STICKER_COMMON_OPTIONS.PACKAGING,
      STICKER_COMMON_OPTIONS.POST_PROCESSING
    ],
    features: ['개별 재단', '고해상도 인쇄', '강력 접착'],
    leadTime: '3~5 영업일',
    badges: ['개별 재단', '소량 제작', '다양한 재질'],
    warnings: [
      '작은 글자·얇은 선은 제작 제한 가능',
      '개별재단 상품은 1~2mm 오차 가능',
      '복잡한 칼선은 제작이 어려울 수 있음'
    ]
  },
  {
    id: 'stk-roll',
    name: '롤 스티커',
    category: 'sticker',
    subCategory: '롤 스티커',
    ...SUBCATEGORY_METADATA['롤 스티커'],
    image: 'https://picsum.photos/seed/sticker-roll/800/800',
    minQuantity: 1000,
    basePrice: 45000,
    options: [
      {
        name: '재질 선택',
        type: 'select',
        values: getStickerMaterials('standard').map(m => ({
          label: `${m.name} ${m.weight}`,
          priceModifier: 0
        }))
      },
      {
        name: '롤 방향',
        type: 'select',
        values: [
          { label: '정방향 (머리부터)', priceModifier: 0 },
          { label: '역방향 (발부터)', priceModifier: 0 },
          { label: '가로 방향', priceModifier: 0 },
        ]
      },
      {
        name: '지관 사이즈',
        type: 'radio',
        values: [
          { label: '40mm', priceModifier: 0 },
          { label: '75mm', priceModifier: 0 },
        ]
      },
      {
        name: '재단 방식',
        type: 'radio',
        values: [
          { label: '롤 재단', priceModifier: 0 },
        ]
      },
      ...STICKER_COMMON_OPTIONS.COATING,
      ...STICKER_COMMON_OPTIONS.ROUNDING,
      ...STICKER_COMMON_OPTIONS.PUNCHING,
      ...STICKER_COMMON_OPTIONS.SHAPE_CUTTING,
      ...STICKER_COMMON_OPTIONS.CREASING,
      ...STICKER_COMMON_OPTIONS.PERFORATION,
      ...STICKER_COMMON_OPTIONS.FOLDING,
      ...STICKER_COMMON_OPTIONS.PACKAGING,
      STICKER_COMMON_OPTIONS.POST_PROCESSING
    ],
    features: ['자동 라벨러 호환', '대량 제작 최적화', '다양한 재질'],
    leadTime: '7~10 영업일',
    badges: ['대량 제작', '롤 형태', '자동화용'],
    warnings: [
      '최소 수량 1,000매부터 제작 가능합니다.',
      '라벨러 사양에 맞는 롤 방향 확인이 필수입니다.'
    ]
  },
  {
    id: 'stk-outdoor',
    name: '옥외용 스티커',
    category: 'sticker',
    subCategory: '옥외용 스티커',
    ...SUBCATEGORY_METADATA['옥외용 스티커'],
    image: 'https://picsum.photos/seed/sticker-outdoor/800/800',
    minQuantity: 1,
    basePrice: 12000,
    options: [
      {
        name: '재질 선택',
        type: 'select',
        values: getStickerMaterials('outdoor').map(m => ({
          label: `${m.name} ${m.weight}`,
          priceModifier: 0
        }))
      },
      STICKER_COMMON_OPTIONS.WHITE_INK,
      STICKER_COMMON_OPTIONS.CUTTING_METHOD,
      ...STICKER_COMMON_OPTIONS.COATING,
      ...STICKER_COMMON_OPTIONS.ROUNDING,
      ...STICKER_COMMON_OPTIONS.PUNCHING,
      ...STICKER_COMMON_OPTIONS.SHAPE_CUTTING,
      ...STICKER_COMMON_OPTIONS.CREASING,
      ...STICKER_COMMON_OPTIONS.PERFORATION,
      ...STICKER_COMMON_OPTIONS.FOLDING,
      ...STICKER_COMMON_OPTIONS.PACKAGING,
      STICKER_COMMON_OPTIONS.POST_PROCESSING
    ],
    features: ['자외선 차단', '완벽 방수', '강력 접착'],
    leadTime: '4~5 영업일',
    badges: ['옥외 전용', 'UV 코팅', '고내구성'],
    warnings: [
      '부착 면의 이물질을 깨끗이 닦은 후 부착해 주세요.',
      '굴곡이 심한 면은 전문가용 랩핑지를 추천합니다.'
    ]
  },
  {
    id: 'stk-magnetic',
    name: '자석 스티커',
    category: 'sticker',
    subCategory: '자석 스티커',
    ...SUBCATEGORY_METADATA['자석 스티커'],
    image: 'https://picsum.photos/seed/sticker-mag/800/800',
    minQuantity: 10,
    basePrice: 15000,
    options: [
      {
        name: '재질 선택',
        type: 'select',
        values: getStickerMaterials('magnetic').map(m => ({
          label: `${m.name} ${m.weight}`,
          priceModifier: 0
        }))
      },
      {
        name: '자석 두께',
        type: 'radio',
        values: [
          { label: '0.5T (일반)', priceModifier: 0 },
          { label: '0.8T (강력)', priceModifier: 3000 },
        ]
      },
      {
        name: '재단 방식',
        type: 'radio',
        values: [
          { label: '사각형 재단', priceModifier: 0 },
          { label: '모양 재단 (도송)', priceModifier: 5000 },
        ]
      },
      ...STICKER_COMMON_OPTIONS.COATING,
      ...STICKER_COMMON_OPTIONS.ROUNDING,
      ...STICKER_COMMON_OPTIONS.PUNCHING,
      ...STICKER_COMMON_OPTIONS.SHAPE_CUTTING,
      ...STICKER_COMMON_OPTIONS.CREASING,
      ...STICKER_COMMON_OPTIONS.PERFORATION,
      ...STICKER_COMMON_OPTIONS.FOLDING,
      ...STICKER_COMMON_OPTIONS.PACKAGING,
      STICKER_COMMON_OPTIONS.POST_PROCESSING
    ],
    features: ['자유로운 탈부착', '반복 사용 가능', '강력한 자력'],
    leadTime: '5~6 영업일',
    badges: ['차량 광고', '반복 사용', '자석형'],
    warnings: [
      '고속 주행 차량은 0.8T 두께를 권장합니다.',
      '장기간 부착 시 가끔 떼어내어 습기를 제거해 주세요.'
    ]
  },
  {
    id: 'stk-removable',
    name: '리무버블 스티커',
    category: 'sticker',
    subCategory: '리무버블 스티커',
    ...SUBCATEGORY_METADATA['리무버블 스티커'],
    image: 'https://picsum.photos/seed/removable/800/800',
    minQuantity: 10,
    basePrice: 5500,
    options: [
      {
        name: '재질 선택',
        type: 'select',
        values: getStickerMaterials('removable').map(m => ({
          label: `${m.name} ${m.weight}`,
          priceModifier: 0
        }))
      },
      STICKER_COMMON_OPTIONS.WHITE_INK,
      STICKER_COMMON_OPTIONS.CUTTING_METHOD,
      ...STICKER_COMMON_OPTIONS.COATING,
      ...STICKER_COMMON_OPTIONS.ROUNDING,
      ...STICKER_COMMON_OPTIONS.PUNCHING,
      ...STICKER_COMMON_OPTIONS.SHAPE_CUTTING,
      ...STICKER_COMMON_OPTIONS.CREASING,
      ...STICKER_COMMON_OPTIONS.PERFORATION,
      ...STICKER_COMMON_OPTIONS.FOLDING,
      ...STICKER_COMMON_OPTIONS.PACKAGING,
      STICKER_COMMON_OPTIONS.POST_PROCESSING
    ],
    features: ['끈적임 없음', '재부착 가능', '방수 기능'],
    leadTime: '3~4 영업일',
    badges: ['리무버블', '노트북용', '깔끔제거'],
    warnings: ['장기간 부착 시 표면 상태에 따라 흔적이 남을 수 있습니다.']
  },
  {
    id: 'stk-cold',
    name: '냉장·냉동 스티커',
    category: 'sticker',
    subCategory: '냉장·냉동 스티커',
    ...SUBCATEGORY_METADATA['냉장·냉동 스티커'],
    image: 'https://picsum.photos/seed/coldstk/800/800',
    minQuantity: 100,
    basePrice: 12000,
    options: [
      {
        name: '재질 선택',
        type: 'select',
        values: getStickerMaterials('special').filter(m => m.name.includes('냉동')).map(m => ({
          label: `${m.name} ${m.weight}`,
          priceModifier: 0
        }))
      },
      STICKER_COMMON_OPTIONS.WHITE_INK,
      STICKER_COMMON_OPTIONS.CUTTING_METHOD,
      ...STICKER_COMMON_OPTIONS.COATING,
      ...STICKER_COMMON_OPTIONS.ROUNDING,
      ...STICKER_COMMON_OPTIONS.PUNCHING,
      ...STICKER_COMMON_OPTIONS.SHAPE_CUTTING,
      ...STICKER_COMMON_OPTIONS.CREASING,
      ...STICKER_COMMON_OPTIONS.PERFORATION,
      ...STICKER_COMMON_OPTIONS.FOLDING,
      ...STICKER_COMMON_OPTIONS.PACKAGING,
      STICKER_COMMON_OPTIONS.POST_PROCESSING
    ],
    features: ['저온 접착력', '습기 강함', '식품 패키지용'],
    leadTime: '4~5 영업일',
    badges: ['냉동용', '강력접착', '식품용'],
    warnings: ['부착 시 표면의 성에나 물기를 제거한 후 부착해야 효과가 좋습니다.']
  },
  {
    id: 'stk-card',
    name: '카드 스티커',
    category: 'sticker',
    subCategory: '카드 스티커',
    ...SUBCATEGORY_METADATA['카드 스티커'],
    image: 'https://picsum.photos/seed/cardstk/800/800',
    minQuantity: 10,
    basePrice: 4000,
    options: [
      {
        name: '재질 선택',
        type: 'select',
        values: PAPER_MATERIALS.filter(m => m.name.includes('유포') || m.name.includes('PET') || m.name.includes('아트지')).map(m => ({
          label: `${m.name} ${m.weight}`,
          priceModifier: 0
        }))
      },
      ...STICKER_COMMON_OPTIONS.COATING,
      STICKER_COMMON_OPTIONS.CUTTING_METHOD,
      ...STICKER_COMMON_OPTIONS.ROUNDING,
      ...STICKER_COMMON_OPTIONS.PUNCHING,
      ...STICKER_COMMON_OPTIONS.SHAPE_CUTTING,
      ...STICKER_COMMON_OPTIONS.CREASING,
      ...STICKER_COMMON_OPTIONS.PERFORATION,
      ...STICKER_COMMON_OPTIONS.FOLDING,
      ...STICKER_COMMON_OPTIONS.PACKAGING,
      STICKER_COMMON_OPTIONS.POST_PROCESSING
    ],
    features: ['카드 표준 규격', '얇은 두께', '고해상도 인쇄'],
    leadTime: '3~4 영업일',
    badges: ['카드용', 'DIY', '굿즈'],
    warnings: ['IC칩 부위를 가리지 않도록 주의해서 부착해 주세요.']
  },
  {
    id: 'stk-scratch',
    name: '스크래치 스티커',
    category: 'sticker',
    subCategory: '스크래치 스티커',
    ...SUBCATEGORY_METADATA['스크래치 스티커'],
    image: 'https://picsum.photos/seed/sticker-scratch/800/800',
    minQuantity: 100,
    basePrice: 25000,
    options: [
      {
        name: '재질 선택',
        type: 'select',
        values: getStickerMaterials('standard').map(m => ({
          label: `${m.name} ${m.weight}`,
          priceModifier: 0
        }))
      },
      {
        name: '스크래치 모양',
        type: 'select',
        values: [
          { label: '원형 (20mm)', priceModifier: 0 },
          { label: '사각형 (40x15mm)', priceModifier: 0 },
          { label: '자유형 (별도문의)', priceModifier: 10000 },
        ]
      },
      {
        name: '스크래치 색상',
        type: 'radio',
        values: [
          { label: '은색 (기본)', priceModifier: 0 },
          { label: '금색', priceModifier: 2000 },
        ]
      },
      STICKER_COMMON_OPTIONS.CUTTING_METHOD,
      ...STICKER_COMMON_OPTIONS.COATING,
      ...STICKER_COMMON_OPTIONS.ROUNDING,
      ...STICKER_COMMON_OPTIONS.PUNCHING,
      ...STICKER_COMMON_OPTIONS.SHAPE_CUTTING,
      ...STICKER_COMMON_OPTIONS.CREASING,
      ...STICKER_COMMON_OPTIONS.PERFORATION,
      ...STICKER_COMMON_OPTIONS.FOLDING,
      ...STICKER_COMMON_OPTIONS.PACKAGING,
      STICKER_COMMON_OPTIONS.POST_PROCESSING
    ],
    features: ['이벤트 최적화', '내용 보안', '간편한 부착'],
    leadTime: '6~8 영업일',
    badges: ['이벤트용', '프로모션', '스크래치'],
    warnings: [
      '스크래치 패드 아래 인쇄 내용은 미리 작업되어야 합니다.',
      '너무 세게 긁으면 하단 인쇄가 손상될 수 있습니다.'
    ]
  },
  {
    id: 'stk-uv',
    name: 'UV 스티커',
    category: 'sticker',
    subCategory: 'UV 스티커',
    ...SUBCATEGORY_METADATA['UV 스티커'],
    image: 'https://picsum.photos/seed/uvstk/800/800',
    minQuantity: 50,
    basePrice: 15000,
    options: [
      {
        name: '사이즈',
        type: 'select',
        values: [
          { label: '30x30mm 이내', priceModifier: 0 },
          { label: '50x50mm 이내', priceModifier: 5000 },
        ]
      },
      STICKER_COMMON_OPTIONS.WHITE_INK,
      ...STICKER_COMMON_OPTIONS.COATING,
      ...STICKER_COMMON_OPTIONS.PUNCHING,
      ...STICKER_COMMON_OPTIONS.SHAPE_CUTTING,
      ...STICKER_COMMON_OPTIONS.CREASING,
      ...STICKER_COMMON_OPTIONS.PERFORATION,
      ...STICKER_COMMON_OPTIONS.FOLDING,
      ...STICKER_COMMON_OPTIONS.PACKAGING,
      STICKER_COMMON_OPTIONS.POST_PROCESSING,
      {
        name: '사용 목적',
        type: 'select',
        values: [
          { label: '유리', priceModifier: 0 },
          { label: '플라스틱', priceModifier: 0 },
          { label: '아크릴', priceModifier: 0 },
          { label: '금속', priceModifier: 0 },
        ]
      }
    ],
    features: ['강력한 부착력', '생활 방수', '입체감 있는 인쇄'],
    leadTime: '5~7 영업일',
    badges: ['방수 스티커', '고내구성', '화이트 인쇄'],
    warnings: [
      '섬유류 부착 불가',
      '작은 글씨·얇은 선은 표현 제한',
      '오돌토돌한 표면, 오일 코팅 표면은 부착 비추천'
    ]
  },
  {
    id: 'memo-standard',
    name: '일반 떡메모지',
    category: 'memo-note',
    subCategory: '일반 떡메모지',
    tagline: '한 장씩 떼어 쓰는 편리한 메모지.',
    description: '다양한 디자인으로 제작 가능한 표준 떡메모지입니다. 사무용, 선물용으로 인기가 높습니다.',
    image: 'https://picsum.photos/seed/memo/800/800',
    minQuantity: 1,
    basePrice: 15000,
    options: [
      {
        name: '사이즈',
        type: 'select',
        values: [
          { label: '90 x 90 mm', priceModifier: 0 },
          { label: '90 x 60 mm', priceModifier: 0 },
          { label: '40 x 90 mm', priceModifier: 0 },
          { label: '직접입력', priceModifier: 0 },
        ]
      },
      {
        name: '두께',
        type: 'radio',
        values: [
          { label: '얇음 · 80매', priceModifier: 0 },
          { label: '보통 · 160매', priceModifier: 2000 },
          { label: '두꺼움 · 240매', priceModifier: 4000 },
        ]
      },
      {
        name: '용지',
        type: 'select',
        values: [
          { label: '모조지 70g', priceModifier: 0 },
        ]
      }
    ],
    features: ['부드러운 상단 풀바름', '백색 모조지 70g', '단면 풀컬러 인쇄'],
    leadTime: '3~5일',
    badges: ['사무용', '가성비', '선물용'],
    recommendation: '가장 많이 쓰이는 사이즈는 "90x90mm"입니다. 메모하기 적당하며 휴대성도 좋습니다.',
    warnings: [
      '한 장씩 떼어 쓰는 떡제본 방식으로, 실제 제본 부위는 인쇄가 되지 않습니다.',
      '모조지 특성상 잉크 흡수율이 높아 색상이 다소 차분하게 나올 수 있습니다.'
    ],
    notes: [
      '상단 떡제본(풀바름) 위치를 고려하여 디자인하세요.',
      '기본 100매 1권 단위로 제작됩니다.'
    ]
  },
  {
    id: 'note-spring',
    name: '스프링 노트',
    category: 'memo-note',
    subCategory: '스프링 노트',
    tagline: '필기가 편한 스프링 제본 노트.',
    description: '튼튼한 스프링으로 마감되어 펼침이 좋은 노트입니다. 학원, 기업 홍보용으로 좋습니다.',
    image: 'https://picsum.photos/seed/note/800/800',
    minQuantity: 1,
    basePrice: 5000,
    options: [
      {
        name: '규격',
        type: 'select',
        values: [
          { label: 'A5 (148x210)', priceModifier: 0 },
          { label: 'B5 (182x257)', priceModifier: 2000 },
          { label: 'A4 (210x297)', priceModifier: 4000 },
        ]
      },
      {
        name: '표지 구성',
        type: 'radio',
        values: [
          { label: '단단한 하드커버', priceModifier: 2000 },
          { label: '유연한 소프트커버', priceModifier: 0 },
        ]
      },
      {
        name: '표지 코팅',
        type: 'radio',
        values: [
          { label: '무광코팅', priceModifier: 0 },
          { label: '유광코팅', priceModifier: 0 },
        ]
      },
      {
        name: '내지 종류',
        type: 'radio',
        values: [
          { label: '무지', priceModifier: 0 },
          { label: '줄(라인)', priceModifier: 0 },
          { label: '모눈(그리드)', priceModifier: 500 },
        ]
      },
      {
        name: '내지 색상',
        type: 'radio',
        values: [
          { label: '백색', priceModifier: 0 },
          { label: '미색', priceModifier: 0 },
        ]
      },
      {
        name: '내지 장수',
        type: 'select',
        values: [
          { label: '40매', priceModifier: 0 },
          { label: '60매', priceModifier: 1500 },
          { label: '80매', priceModifier: 3000 },
          { label: '100매', priceModifier: 4500 },
        ]
      },
      {
        name: '스프링 방향',
        type: 'radio',
        values: [
          { label: '좌철 (옆으로 넘김)', priceModifier: 0 },
          { label: '상철 (위로 넘김)', priceModifier: 0 },
        ]
      },
      {
        name: '스프링 색상',
        type: 'radio',
        values: [
          { label: '실버', priceModifier: 0 },
          { label: '화이트', priceModifier: 0 },
          { label: '블랙', priceModifier: 0 },
        ]
      }
    ],
    features: ['트윈 와이어 스프링', '단단한 표지', '내지 모조지 80g'],
    leadTime: '5~7 영업일',
    badges: ['홍보용', '튼튼함', '필기최적'],
    recommendation: '학습용이나 업무용으로는 "B5" 사이즈를, 휴대용으로는 "A5" 사이즈를 추천합니다.',
    warnings: [
      '스프링 타공 부위에 중요한 디자인이나 텍스트가 걸리지 않도록 주의하세요.',
      '표지 디자인 시 제본 여백을 충분히 고려해야 합니다.'
    ],
    notes: [
      '내지는 기본 백색 모조지 80g 기준입니다.',
      '대량 주문 시 별도 견적 문의 바랍니다.'
    ]
  },
  {
    id: 'note-leather',
    name: '레더 노트',
    category: 'memo-note',
    subCategory: '레더 노트',
    tagline: '고급스러운 가죽 질감의 프리미엄 노트.',
    description: '부드러운 인조가죽 커버로 제작되어 품격 있는 기록을 선사합니다. 선물용으로 탁월합니다.',
    image: 'https://picsum.photos/seed/leather-note/800/800',
    minQuantity: 1,
    basePrice: 12000,
    options: [
      {
        name: '규격',
        type: 'select',
        values: [
          { label: 'A5 (148x210)', priceModifier: 0 },
          { label: 'B5 (182x257)', priceModifier: 3000 },
        ]
      },
      {
        name: '커버 스타일',
        type: 'radio',
        values: [
          { label: '클래식 블랙', priceModifier: 0 },
          { label: '빈티지 브라운', priceModifier: 0 },
          { label: '네이비 블루', priceModifier: 0 },
          { label: '포레스트 그린', priceModifier: 0 },
        ]
      },
      {
        name: '커버 인쇄',
        type: 'radio',
        values: [
          { label: '인쇄 없음', priceModifier: 0 },
          { label: '불박(음각) 인쇄', priceModifier: 3000 },
          { label: '박(금/은) 인쇄', priceModifier: 4000 },
        ]
      },
      {
        name: '엣지 마감',
        type: 'radio',
        values: [
          { label: '기본 마감', priceModifier: 0 },
          { label: '금박 엣지', priceModifier: 2000 },
          { label: '은박 엣지', priceModifier: 2000 },
        ]
      },
      {
        name: '내지 종류',
        type: 'radio',
        values: [
          { label: '무지', priceModifier: 0 },
          { label: '줄(라인)', priceModifier: 0 },
          { label: '도트', priceModifier: 500 },
        ]
      },
      {
        name: '내지 색상',
        type: 'radio',
        values: [
          { label: '백색', priceModifier: 0 },
          { label: '미색', priceModifier: 0 },
        ]
      },
      {
        name: '내지 장수',
        type: 'select',
        values: [
          { label: '80매', priceModifier: 0 },
          { label: '100매', priceModifier: 2000 },
          { label: '120매', priceModifier: 4000 },
        ]
      }
    ],
    features: ['프리미엄 인조가죽', '실제본 방식', '고급 미색 모조지'],
    leadTime: '7~10 영업일',
    badges: ['프리미엄', '선물용', '고급형'],
    recommendation: '중요한 미팅이나 일기장용으로 "A5" 사이즈를 추천합니다.',
    warnings: [
      '가죽 재질 특성상 미세한 결 차이가 있을 수 있습니다.',
      '불박 인쇄 시 너무 얇은 선은 표현이 어려울 수 있습니다.'
    ],
    notes: [
      '내지는 기본 미색 모조지 80g 기준입니다.',
      '개별 박스 포장 옵션은 별도 문의 바랍니다.'
    ]
  },
  {
    id: 'note-saddle',
    name: '중철 노트',
    category: 'memo-note',
    subCategory: '중철 노트',
    tagline: '가볍고 슬림한 중철 제본 노트.',
    description: '가운데 철심으로 고정되는 방식으로 얇고 가벼워 휴대하기 좋습니다. 브랜드북이나 간단한 필기용으로 추천합니다.',
    image: 'https://picsum.photos/seed/saddle-note/800/800',
    minQuantity: 1,
    basePrice: 3000,
    options: [
      {
        name: '규격',
        type: 'select',
        values: [
          { label: 'A5 (148x210)', priceModifier: 0 },
          { label: 'B5 (182x257)', priceModifier: 1000 },
          { label: 'A4 (210x297)', priceModifier: 2000 },
        ]
      },
      {
        name: '표지 구성',
        type: 'radio',
        values: [
          { label: '기본 표지', priceModifier: 0 },
          { label: '두꺼운 표지', priceModifier: 500 },
        ]
      },
      {
        name: '표지 코팅',
        type: 'radio',
        values: [
          { label: '무광코팅', priceModifier: 0 },
          { label: '유광코팅', priceModifier: 0 },
        ]
      },
      {
        name: '내지 종류',
        type: 'radio',
        values: [
          { label: '무지', priceModifier: 0 },
          { label: '줄(라인)', priceModifier: 0 },
          { label: '모눈(그리드)', priceModifier: 200 },
          { label: '도트', priceModifier: 200 },
        ]
      },
      {
        name: '내지 색상',
        type: 'radio',
        values: [
          { label: '백색', priceModifier: 0 },
          { label: '미색', priceModifier: 0 },
        ]
      },
      {
        name: '페이지 수',
        type: 'select',
        values: [
          { label: '8p', priceModifier: 0 },
          { label: '16p', priceModifier: 1000 },
          { label: '24p', priceModifier: 2000 },
          { label: '32p', priceModifier: 3000 },
        ]
      }
    ],
    features: ['중철 제본', '완전 펼침 가능', '슬림한 디자인'],
    leadTime: '3~5 영업일',
    badges: ['가벼움', '실용적', '소책자형'],
    notes: [
      '페이지 수는 4의 배수 기준으로 제작됩니다.',
      '내지는 기본 모조지 80g 기준입니다.'
    ]
  },
  {
    id: 'drawing-pro',
    name: '전문가용 드로잉북',
    category: 'memo-note',
    subCategory: '전문가용 드로잉북',
    ...SUBCATEGORY_METADATA['전문가용 드로잉북'],
    image: 'https://picsum.photos/seed/drawing-pro/800/800',
    minQuantity: 1,
    basePrice: 8000,
    options: [
      {
        name: '규격',
        type: 'select',
        values: [
          { label: 'B6 (128x182)', priceModifier: 0 },
          { label: 'A5 (148x210)', priceModifier: 1000 },
          { label: 'A4 (210x297)', priceModifier: 3000 },
          { label: 'A3 (297x420)', priceModifier: 7000 },
        ]
      },
      {
        name: '제본 방향',
        type: 'radio',
        values: [
          { label: '세로형', priceModifier: 0 },
          { label: '가로형', priceModifier: 0 },
        ]
      },
      {
        name: '커버 종류',
        type: 'radio',
        values: [
          { label: '소프트커버', priceModifier: 0 },
        ]
      },
      {
        name: '용지',
        type: 'radio',
        values: [
          { label: '드로잉용지 300g', priceModifier: 0 },
        ]
      },
      {
        name: '스프링 색상',
        type: 'radio',
        values: [
          { label: '검정', priceModifier: 0 },
          { label: '하양', priceModifier: 0 },
        ]
      }
    ],
    features: ['소프트커버', '드로잉용지 300g', '트윈 와이어 스프링'],
    leadTime: '5~7 영업일',
    badges: ['전문가용', '고평량', '드로잉 전용'],
    warnings: [
      '코팅이 없는 표지이므로 오염에 주의해 주세요.',
      '스프링 타공 부위에 중요한 디자인이 걸리지 않도록 주의하세요.'
    ]
  },
  {
    id: 'drawing-student',
    name: '학생용 드로잉북',
    category: 'memo-note',
    subCategory: '학생용 드로잉북',
    ...SUBCATEGORY_METADATA['학생용 드로잉북'],
    image: 'https://picsum.photos/seed/drawing-student/800/800',
    minQuantity: 1,
    basePrice: 12000,
    options: [
      {
        name: '규격',
        type: 'select',
        values: [
          { label: 'B6 (128x182)', priceModifier: 0 },
          { label: 'A5 (148x210)', priceModifier: 1500 },
          { label: 'A4 (210x297)', priceModifier: 4000 },
        ]
      },
      {
        name: '제본 방향',
        type: 'radio',
        values: [
          { label: '세로형', priceModifier: 0 },
          { label: '가로형', priceModifier: 0 },
        ]
      },
      {
        name: '커버 종류',
        type: 'radio',
        values: [
          { label: '하드커버 (2mm 보드)', priceModifier: 0 },
        ]
      },
      {
        name: '표지 코팅',
        type: 'radio',
        values: [
          { label: '무광코팅', priceModifier: 0 },
          { label: '유광코팅', priceModifier: 0 },
        ]
      },
      {
        name: '용지',
        type: 'radio',
        values: [
          { label: '드로잉용지 300g', priceModifier: 0 },
        ]
      },
      {
        name: '스프링 색상',
        type: 'radio',
        values: [
          { label: '검정', priceModifier: 0 },
          { label: '하양', priceModifier: 0 },
        ]
      }
    ],
    features: ['하드커버 (2mm)', '드로잉용지 300g', '내구성 우수'],
    leadTime: '7~10 영업일',
    badges: ['학생용', '하드커버', '튼튼함'],
    warnings: [
      '하드커버 특성상 제작 기간이 다소 소요될 수 있습니다.',
      '모서리 충격에 주의해 주세요.'
    ]
  },
  {
    id: 'drawing-general',
    name: '세로형 종합장',
    category: 'memo-note',
    subCategory: '세로형 종합장',
    ...SUBCATEGORY_METADATA['세로형 종합장'],
    image: 'https://picsum.photos/seed/drawing-general/800/800',
    minQuantity: 1,
    basePrice: 4000,
    options: [
      {
        name: '규격',
        type: 'select',
        values: [
          { label: 'B5 (182x257)', priceModifier: 0 },
          { label: 'A4 (210x297)', priceModifier: 1500 },
        ]
      },
      {
        name: '제본 방향',
        type: 'radio',
        values: [
          { label: '세로형 (상철)', priceModifier: 0 },
        ]
      },
      {
        name: '커버 종류',
        type: 'radio',
        values: [
          { label: '소프트커버', priceModifier: 0 },
        ]
      },
      {
        name: '용지',
        type: 'radio',
        values: [
          { label: '백색 모조 80g', priceModifier: 0 },
        ]
      },
      {
        name: '스프링 색상',
        type: 'radio',
        values: [
          { label: '검정', priceModifier: 0 },
          { label: '하양', priceModifier: 0 },
        ]
      }
    ],
    features: ['소프트커버', '세로형 상철', '다양한 내지 선택'],
    leadTime: '3~5 영업일',
    badges: ['종합장', '실용적', '학교용'],
    warnings: [
      '세로형 제본으로 상단에 스프링이 위치합니다.'
    ]
  },
  {
    id: 'binding-saddle',
    name: '중철제본 책자',
    category: 'binding-booklet',
    subCategory: '중철제본 책자',
    tagline: '가볍고 실용적인 중철 제본 책자.',
    description: '카탈로그나 팜플렛 제작에 적합한 제본 방식입니다. 페이지 수가 적은 책자에 최적입니다.',
    image: 'https://picsum.photos/seed/booklet/800/800',
    minQuantity: 10,
    basePrice: 35000,
    options: [
      {
        name: '규격',
        type: 'select',
        values: [
          { label: 'A4 (210x297mm)', priceModifier: 0 },
          { label: 'A5 (148x210mm)', priceModifier: -1000 },
          { label: 'B5 (182x257mm)', priceModifier: -500 },
        ]
      },
      {
        name: '인쇄 색상',
        type: 'radio',
        values: [
          { label: '컬러', priceModifier: 0 },
          { label: '흑백', priceModifier: -5000 },
        ]
      },
      {
        name: '표지 인쇄',
        type: 'radio',
        values: [
          { label: '컬러', priceModifier: 0 },
          { label: '흑백', priceModifier: -2000 },
        ]
      },
      {
        name: '내지 인쇄',
        type: 'radio',
        values: [
          { label: '컬러', priceModifier: 0 },
          { label: '흑백', priceModifier: -3000 },
        ]
      },
      {
        name: '표지 용지',
        type: 'select',
        values: [
          { label: '스노우 250g', priceModifier: 0 },
          { label: '스노우 300g', priceModifier: 1000 },
          { label: '아트지 250g', priceModifier: 0 },
        ]
      },
      {
        name: '내지 용지',
        type: 'select',
        values: [
          { label: '모조 80g', priceModifier: 0 },
          { label: '모조 100g', priceModifier: 1000 },
          { label: '백상지 100g', priceModifier: 1000 },
        ]
      },
      {
        name: '페이지 수',
        type: 'select',
        values: [
          { label: '8p', priceModifier: 0 },
          { label: '16p', priceModifier: 5000 },
          { label: '24p', priceModifier: 10000 },
          { label: '32p', priceModifier: 15000 },
        ]
      },
      {
        name: '제본 방향',
        type: 'radio',
        values: [
          { label: '세로형', priceModifier: 0 },
          { label: '가로형', priceModifier: 2000 },
        ]
      },
      {
        name: '표지 코팅',
        type: 'radio',
        values: [
          { label: '무광코팅', priceModifier: 1000 },
          { label: '유광코팅', priceModifier: 1000 },
          { label: '코팅 없음', priceModifier: 0 },
        ]
      }
    ],
    features: ['중철제본', '가운데 철심으로 묶는 방식', '얇은 학습자료에 적합'],
    leadTime: '3~5 영업일',
    badges: ['카탈로그', '실용적', '빠른제작'],
    warnings: [
      '중철 제본은 반드시 4의 배수 페이지로 구성되어야 합니다.',
    ],
    notes: [
      '중철제본 / 가운데 철심으로 묶는 방식 / 얇은 학습자료에 적합'
    ]
  },
  {
    id: 'poster-standard',
    name: '일반 포스터',
    category: 'poster-promo',
    subCategory: '일반 포스터',
    tagline: '공간을 채우는 선명한 포스터.',
    description: '다양한 사이즈로 제작 가능한 표준 포스터입니다. 이벤트 홍보나 인테리어용으로 좋습니다.',
    image: 'https://picsum.photos/seed/poster/800/800',
    minQuantity: 1,
    basePrice: 12000,
    options: [
      {
        name: '사이즈',
        type: 'select',
        values: [
          { label: 'A3 (297x420)', priceModifier: 0 },
          { label: 'A2 (420x594)', priceModifier: 5000 },
          { label: 'A1 (594x841)', priceModifier: 15000 },
        ]
      },
      {
        name: '용지 종류',
        type: 'select',
        values: [
          { label: '아트지 150g', priceModifier: 0 },
          { label: '스노우지 150g', priceModifier: 1000 },
          { label: '랑데뷰 190g', priceModifier: 3000 },
        ]
      },
      {
        name: '코팅',
        type: 'radio',
        values: [
          { label: '코팅 없음', priceModifier: 0 },
          { label: '무광 코팅', priceModifier: 2000 },
          { label: '유광 코팅', priceModifier: 2000 },
        ]
      }
    ],
    features: ['고해상도 인쇄', '다양한 용지 선택', '소량 제작 가능'],
    leadTime: '2~3 영업일',
    badges: ['이벤트용', '고화질', '소량가능'],
    recommendation: '가장 표준적인 홍보용 포스터는 "A2" 사이즈입니다. 시인성이 좋고 게시하기 편리합니다.',
    warnings: [
      '대형 출력 특성상 해상도가 낮은 이미지는 깨져 보일 수 있습니다.',
      '말아서 배송되므로 수령 후 평평하게 펴서 보관해 주세요.'
    ],
    notes: [
      '실외 게시용은 유포지나 합성지 재질을 추천드립니다.',
      '대량 인쇄(옵셋)는 별도 문의 바랍니다.'
    ]
  },
  {
    id: 'stk-postcard-standard',
    name: '일반 엽서',
    category: 'card-paper',
    subCategory: '일반 엽서',
    ...SUBCATEGORY_METADATA['일반 엽서'],
    image: 'https://picsum.photos/seed/postcard-standard/800/800',
    minQuantity: 10,
    basePrice: 8000,
    options: [
      POSTCARD_COMMON_OPTIONS.SIZE,
      {
        ...POSTCARD_COMMON_OPTIONS.PAPER_GROUP,
        values: [
          { label: '기본 대중형', priceModifier: 0 }
        ]
      },
      POSTCARD_COMMON_OPTIONS.PAPER_SELECT_BASIC,
      POSTCARD_COMMON_OPTIONS.PRINT_COLOR,
      POSTCARD_COMMON_OPTIONS.WHITE_INK,
      ...POSTCARD_COMMON_OPTIONS.COATING,
      ...POSTCARD_COMMON_OPTIONS.ROUNDING,
      ...POSTCARD_COMMON_OPTIONS.PUNCHING,
      ...POSTCARD_COMMON_OPTIONS.SHAPE_CUTTING,
      ...POSTCARD_COMMON_OPTIONS.CREASING,
      ...POSTCARD_COMMON_OPTIONS.PERFORATION,
      ...POSTCARD_COMMON_OPTIONS.FOLDING,
      ...POSTCARD_COMMON_OPTIONS.PACKAGING,
      {
        name: '제작 수량',
        type: 'select',
        values: [
          { label: '10매', priceModifier: 0 },
          { label: '50매', priceModifier: 5000 },
          { label: '100매', priceModifier: 12000 },
          { label: '200매', priceModifier: 22000 },
          { label: '500매', priceModifier: 50000 },
        ]
      }
    ],
    features: ['표준/미니 사이즈 통합', '아트지/스노우지 기본', '가장 대중적인 선택'],
    leadTime: '2~3 영업일',
    badges: ['베스트', '가성비', '빠른제작']
  },
  {
    id: 'stk-postcard-special',
    name: '특가 엽서',
    category: 'card-paper',
    subCategory: '특가 엽서',
    ...SUBCATEGORY_METADATA['특가 엽서'],
    image: 'https://picsum.photos/seed/postcard-special/800/800',
    minQuantity: 500,
    basePrice: 35000,
    options: [
      {
        name: '규격',
        type: 'radio',
        values: [{ label: '100x148mm (고정)', priceModifier: 0 }]
      },
      {
        name: '용지 선택',
        type: 'radio',
        values: [
          { label: '아트지 250g', priceModifier: 0 },
          { label: '스노우 250g', priceModifier: 0 },
        ]
      },
      POSTCARD_COMMON_OPTIONS.PRINT_COLOR,
      POSTCARD_COMMON_OPTIONS.WHITE_INK,
      ...POSTCARD_COMMON_OPTIONS.COATING,
      ...POSTCARD_COMMON_OPTIONS.ROUNDING,
      ...POSTCARD_COMMON_OPTIONS.PUNCHING,
      ...POSTCARD_COMMON_OPTIONS.SHAPE_CUTTING,
      ...POSTCARD_COMMON_OPTIONS.CREASING,
      ...POSTCARD_COMMON_OPTIONS.PERFORATION,
      ...POSTCARD_COMMON_OPTIONS.FOLDING,
      ...POSTCARD_COMMON_OPTIONS.PACKAGING,
      {
        name: '제작 수량',
        type: 'select',
        values: [
          { label: '500매', priceModifier: 0 },
          { label: '1000매', priceModifier: 25000 },
          { label: '2000매', priceModifier: 65000 },
        ]
      }
    ],
    features: ['대량 제작 특가', '복잡한 옵션 제거', '가장 경제적인 홍보물'],
    leadTime: '3~4 영업일',
    badges: ['특가', '대량권장', '빠른주문']
  },
  {
    id: 'stk-postcard-shape',
    name: '모양 엽서',
    category: 'card-paper',
    subCategory: '모양 엽서',
    ...SUBCATEGORY_METADATA['모양 엽서'],
    image: 'https://picsum.photos/seed/postcard-shape/800/800',
    minQuantity: 50,
    basePrice: 15000,
    options: [
      ...POSTCARD_COMMON_OPTIONS.SHAPE_CUTTING,
      {
        name: '사이즈',
        type: 'select',
        values: [
          { label: '소 (90x140mm 이내)', priceModifier: 0 },
          { label: '중 (120x170mm 이내)', priceModifier: 2000 },
          { label: '대 (148x210mm 이내)', priceModifier: 4000 },
          { label: '직접 입력', priceModifier: 0 },
        ]
      },
      {
        ...POSTCARD_COMMON_OPTIONS.PAPER_GROUP,
        values: [
          { label: '기본 대중형', priceModifier: 0 },
          { label: '고급 감성형', priceModifier: 0 },
          { label: '친환경/내추럴형', priceModifier: 0 },
        ]
      },
      POSTCARD_COMMON_OPTIONS.PAPER_SELECT_BASIC,
      POSTCARD_COMMON_OPTIONS.PAPER_SELECT_PREMIUM,
      POSTCARD_COMMON_OPTIONS.PAPER_SELECT_ECO,
      POSTCARD_COMMON_OPTIONS.PRINT_COLOR,
      POSTCARD_COMMON_OPTIONS.WHITE_INK,
      ...POSTCARD_COMMON_OPTIONS.SHAPE_CUTTING,
      ...POSTCARD_COMMON_OPTIONS.COATING,
      ...POSTCARD_COMMON_OPTIONS.ROUNDING,
      ...POSTCARD_COMMON_OPTIONS.PUNCHING,
      ...POSTCARD_COMMON_OPTIONS.CREASING,
      ...POSTCARD_COMMON_OPTIONS.PERFORATION,
      ...POSTCARD_COMMON_OPTIONS.FOLDING,
      ...POSTCARD_COMMON_OPTIONS.PACKAGING,
      {
        name: '제작 수량',
        type: 'select',
        values: [
          { label: '10매', priceModifier: 0 },
          { label: '50매', priceModifier: 8000 },
          { label: '100매', priceModifier: 18000 },
        ]
      }
    ],
    features: ['독특한 실루엣', '브랜드 개성 강조', '정밀 도송 가공'],
    leadTime: '5~7 영업일',
    badges: ['모양제작', '디자인', '유니크']
  },
  {
    id: 'stk-postcard-premium',
    name: '고급지 엽서',
    category: 'card-paper',
    subCategory: '고급지 엽서',
    ...SUBCATEGORY_METADATA['고급지 엽서'],
    image: 'https://picsum.photos/seed/postcard-premium/800/800',
    minQuantity: 10,
    basePrice: 12000,
    options: [
      POSTCARD_COMMON_OPTIONS.SIZE,
      {
        ...POSTCARD_COMMON_OPTIONS.PAPER_GROUP,
        values: [
          { label: '기본 대중형', priceModifier: 0 },
          { label: '고급 감성형', priceModifier: 0 },
          { label: '친환경/내추럴형', priceModifier: 0 },
          { label: '컬러/특수지형', priceModifier: 0 },
        ]
      },
      POSTCARD_COMMON_OPTIONS.PAPER_SELECT_BASIC,
      POSTCARD_COMMON_OPTIONS.PAPER_SELECT_PREMIUM,
      POSTCARD_COMMON_OPTIONS.PAPER_SELECT_ECO,
      POSTCARD_COMMON_OPTIONS.PAPER_SELECT_SPECIAL,
      POSTCARD_COMMON_OPTIONS.PRINT_COLOR,
      POSTCARD_COMMON_OPTIONS.WHITE_INK,
      ...POSTCARD_COMMON_OPTIONS.ROUNDING,
      ...POSTCARD_COMMON_OPTIONS.PUNCHING,
      ...POSTCARD_COMMON_OPTIONS.SHAPE_CUTTING,
      ...POSTCARD_COMMON_OPTIONS.CREASING,
      ...POSTCARD_COMMON_OPTIONS.PERFORATION,
      ...POSTCARD_COMMON_OPTIONS.FOLDING,
      ...POSTCARD_COMMON_OPTIONS.PACKAGING,
      {
        name: '제작 수량',
        type: 'select',
        values: [
          { label: '10매', priceModifier: 0 },
          { label: '50매', priceModifier: 12000 },
          { label: '100매', priceModifier: 25000 },
        ]
      }
    ],
    features: ['프리미엄 수입지', '풍부한 질감 표현', '작가/브랜드 굿즈 최적'],
    leadTime: '4~5 영업일',
    badges: ['고급지', '수입지', '감성']
  },
  {
    id: 'stk-postcard-effect',
    name: '후가공 엽서',
    category: 'card-paper',
    subCategory: '후가공 엽서',
    ...SUBCATEGORY_METADATA['후가공 엽서'],
    image: 'https://picsum.photos/seed/postcard-effect/800/800',
    minQuantity: 100,
    basePrice: 25000,
    options: [
      POSTCARD_COMMON_OPTIONS.EFFECT,
      POSTCARD_COMMON_OPTIONS.SIZE,
      {
        ...POSTCARD_COMMON_OPTIONS.PAPER_GROUP,
        values: [
          { label: '기본 대중형', priceModifier: 0 },
          { label: '고급 감성형', priceModifier: 0 },
        ]
      },
      POSTCARD_COMMON_OPTIONS.PAPER_SELECT_BASIC,
      POSTCARD_COMMON_OPTIONS.PAPER_SELECT_PREMIUM,
      POSTCARD_COMMON_OPTIONS.PRINT_COLOR,
      POSTCARD_COMMON_OPTIONS.WHITE_INK,
      ...POSTCARD_COMMON_OPTIONS.COATING,
      ...POSTCARD_COMMON_OPTIONS.ROUNDING,
      ...POSTCARD_COMMON_OPTIONS.PUNCHING,
      ...POSTCARD_COMMON_OPTIONS.SHAPE_CUTTING,
      ...POSTCARD_COMMON_OPTIONS.CREASING,
      ...POSTCARD_COMMON_OPTIONS.PERFORATION,
      ...POSTCARD_COMMON_OPTIONS.FOLDING,
      ...POSTCARD_COMMON_OPTIONS.PACKAGING,
      {
        name: '제작 수량',
        type: 'select',
        values: [
          { label: '100매', priceModifier: 0 },
          { label: '200매', priceModifier: 35000 },
          { label: '500매', priceModifier: 85000 },
        ]
      }
    ],
    features: ['화려한 시각 효과', '입체적인 질감', 'VIP용 초대장 추천'],
    leadTime: '6~8 영업일',
    badges: ['후가공', '프리미엄', '화려함'],
    warnings: [
      '후가공 위치는 재단선에서 3mm 이상 떨어져야 합니다.',
      '너무 얇은 선이나 작은 글씨는 박 가공이 뭉칠 수 있습니다.',
      '스코딕스는 배경색이 진할수록 효과가 돋보입니다.'
    ]
  },
  {
    id: 'bc-standard',
    name: '일반 명함',
    category: 'card-paper',
    subCategory: '일반 명함',
    ...BUSINESS_CARD_METADATA['일반 명함'],
    image: 'https://picsum.photos/seed/bc-standard/800/800',
    minQuantity: 100,
    basePrice: 7000,
    options: [
      BUSINESS_CARD_COMMON_OPTIONS.SIZE,
      {
        name: '용지 선택',
        type: 'select',
        values: getBusinessCardMaterials('standard')
      },
      BUSINESS_CARD_COMMON_OPTIONS.PRINT_COLOR,
      BUSINESS_CARD_COMMON_OPTIONS.WHITE_INK,
      ...BUSINESS_CARD_COMMON_OPTIONS.COATING,
      ...BUSINESS_CARD_COMMON_OPTIONS.ROUNDING,
      ...BUSINESS_CARD_COMMON_OPTIONS.PUNCHING,
      ...BUSINESS_CARD_COMMON_OPTIONS.SHAPE_CUTTING,
      ...BUSINESS_CARD_COMMON_OPTIONS.CREASING,
      ...BUSINESS_CARD_COMMON_OPTIONS.PERFORATION,
      ...BUSINESS_CARD_COMMON_OPTIONS.FOLDING,
      ...BUSINESS_CARD_COMMON_OPTIONS.PACKAGING,
      BUSINESS_CARD_COMMON_OPTIONS.POST_PROCESSING,
      BUSINESS_CARD_COMMON_OPTIONS.CASE
    ],
    features: ['1장부터 제작 가능', '다양한 용지 선택', '정밀 재단'],
    leadTime: '1~2 영업일',
    badges: ['재질 4종~', '후가공 선택', '빠른 제작'],
    recommendation: '가장 대중적인 명함 제작에는 "스노우 250g"에 "무광 코팅" 옵션을 추천합니다. 차분하고 신뢰감 있는 인상을 줍니다.',
    warnings: [
      '재단 공정상 1~2mm 밀림 현상이 있을 수 있습니다.',
      '모니터 해상도에 따라 실제 제품과 색상 차이가 있을 수 있습니다.',
      '명함 케이스는 기본 제공되지 않습니다.'
    ],
    notes: [
      '작업 사이즈는 92x52mm, 재단 사이즈는 90x50mm입니다.',
      '중요한 텍스트는 재단선 안쪽으로 3mm 이상 여유를 두세요.'
    ]
  },
  {
    id: 'bc-premium',
    name: '고급지 명함',
    category: 'card-paper',
    subCategory: '고급지 명함',
    ...BUSINESS_CARD_METADATA['고급지 명함'],
    image: 'https://picsum.photos/seed/bc-premium/800/800',
    minQuantity: 100,
    basePrice: 15700,
    options: [
      BUSINESS_CARD_COMMON_OPTIONS.SIZE,
      {
        name: '용지 선택',
        type: 'select',
        values: getBusinessCardMaterials('premium')
      },
      BUSINESS_CARD_COMMON_OPTIONS.PRINT_COLOR,
      BUSINESS_CARD_COMMON_OPTIONS.WHITE_INK,
      ...BUSINESS_CARD_COMMON_OPTIONS.COATING,
      ...BUSINESS_CARD_COMMON_OPTIONS.ROUNDING,
      ...BUSINESS_CARD_COMMON_OPTIONS.PUNCHING,
      ...BUSINESS_CARD_COMMON_OPTIONS.SHAPE_CUTTING,
      ...BUSINESS_CARD_COMMON_OPTIONS.CREASING,
      ...BUSINESS_CARD_COMMON_OPTIONS.PERFORATION,
      ...BUSINESS_CARD_COMMON_OPTIONS.PACKAGING,
      BUSINESS_CARD_COMMON_OPTIONS.POST_PROCESSING,
      BUSINESS_CARD_COMMON_OPTIONS.CASE
    ],
    features: ['고급 후가공', '프리미엄 용지', '독특한 질감'],
    leadTime: '4~5 영업일',
    warnings: [
      '후가공 공정상 제작 기간이 추가될 수 있습니다.',
      '세밀한 문양은 표현이 제한될 수 있습니다.'
    ]
  },
  {
    id: 'bc-folded',
    name: '접지 명함',
    category: 'card-paper',
    subCategory: '접지 명함',
    ...BUSINESS_CARD_METADATA['접지 명함'],
    image: 'https://picsum.photos/seed/bc-folded/800/800',
    minQuantity: 100,
    basePrice: 14700,
    options: [
      BUSINESS_CARD_COMMON_OPTIONS.SIZE,
      {
        name: '용지',
        type: 'select',
        values: [
          ...BUSINESS_CARD_MATERIALS.filter(m => ['기본 대중형', '고급 감성형'].includes(m.group)).map(m => ({
            label: `${m.name} ${m.weight}`,
            priceModifier: m.group === '고급 감성형' ? 2000 : 0
          }))
        ]
      },
      {
        name: '접지 형태',
        type: 'radio',
        values: [
          { label: '2단 명함', priceModifier: 0 },
          { label: '3단 명함', priceModifier: 5000 },
        ]
      },
      BUSINESS_CARD_COMMON_OPTIONS.PRINT_COLOR,
      BUSINESS_CARD_COMMON_OPTIONS.WHITE_INK,
      ...BUSINESS_CARD_COMMON_OPTIONS.COATING,
      ...BUSINESS_CARD_COMMON_OPTIONS.ROUNDING,
      ...BUSINESS_CARD_COMMON_OPTIONS.PUNCHING,
      ...BUSINESS_CARD_COMMON_OPTIONS.SHAPE_CUTTING,
      ...BUSINESS_CARD_COMMON_OPTIONS.FOLDING.filter(opt => opt.name !== '접지 형태'),
      ...BUSINESS_CARD_COMMON_OPTIONS.CREASING,
      ...BUSINESS_CARD_COMMON_OPTIONS.PERFORATION,
      ...BUSINESS_CARD_COMMON_OPTIONS.PACKAGING,
      BUSINESS_CARD_COMMON_OPTIONS.POST_PROCESSING,
      BUSINESS_CARD_COMMON_OPTIONS.CASE
    ],
    features: ['넓은 수납 공간', '다양한 레이아웃', '쿠폰/안내문 활용'],
    leadTime: '3~4 영업일',
    warnings: [
      '접는 선(오시) 부분의 인쇄 터짐이 발생할 수 있습니다.',
      '정확한 데이터 작업이 필요합니다.',
      '기본 코팅 없이 제작되고 필요 시 후가공으로 코팅 선택',
      '오시는 템플릿 위치대로 후가공',
      '접지되어 배송되지 않음'
    ],
    recommendation: '도장 쿠폰용 선택 시 모조지 / 크라프트보드 / 인바이런먼트 크라프트 추천. 도장 후 빠르게 건조되고 번짐이 적음.'
  },
  {
    /**
     * [ISOLATED PRODUCT: bc-template]
     * 이 품목은 전용 구조로 고정되어 있습니다.
     * 공통 옵션 시스템이나 리팩토링의 영향을 받지 않도록 보호 처리되었습니다.
     */
    id: 'bc-template',
    name: '디자인 템플릿 명함',
    category: 'card-paper',
    subCategory: '디자인 템플릿 명함',
    ...BUSINESS_CARD_METADATA['디자인 템플릿 명함'],
    image: 'https://picsum.photos/seed/bc-design/800/800',
    minQuantity: 100,
    basePrice: 12000,
    options: [
      BUSINESS_CARD_COMMON_OPTIONS.SIZE,
      {
        name: '용지',
        type: 'select',
        values: getBusinessCardMaterials('template')
      },
      BUSINESS_CARD_COMMON_OPTIONS.PRINT_COLOR,
      ...BUSINESS_CARD_COMMON_OPTIONS.COATING,
      ...BUSINESS_CARD_COMMON_OPTIONS.ROUNDING,
      ...BUSINESS_CARD_COMMON_OPTIONS.PUNCHING,
      BUSINESS_CARD_COMMON_OPTIONS.CASE,
      {
        name: '이름',
        type: 'text',
        placeholder: '홍길동'
      },
      {
        name: '직함',
        type: 'text',
        placeholder: '대표이사 / 팀장'
      },
      {
        name: '연락처',
        type: 'text',
        placeholder: '010-0000-0000'
      },
      {
        name: '이메일',
        type: 'text',
        placeholder: 'example@email.com'
      },
      {
        name: '주소/SNS',
        type: 'text',
        placeholder: '서울시 강남구... / @instagram'
      },
      {
        name: '로고 업로드',
        type: 'text',
        placeholder: '로고 파일이 있다면 업로드해주세요.'
      },
      {
        name: '요청사항',
        type: 'text',
        placeholder: '추가로 전달하실 내용을 입력해주세요.'
      }
    ],
    features: ['다양한 디자인 템플릿', '간편한 정보 입력', '빠른 제작 및 배송'],
    leadTime: '1~2 영업일',
    warnings: [
      '입력하신 정보대로 시안이 제작되니 오타를 꼭 확인해주세요.',
      '로고 파일은 고해상도(AI, PDF, 고화질 JPG)를 권장합니다.',
      '모니터 색상과 실제 인쇄 색상은 차이가 있을 수 있습니다.'
    ]
  },
  {
    id: 'paper-photocard',
    name: '포토카드',
    category: 'card-paper',
    subCategory: '기본 포토카드',
    tagline: '한 손에 쏙 들어오는 나만의 굿즈.',
    description: '아이돌 굿즈, 명함, 쿠폰 등 다용도로 활용 가능한 포토카드입니다.',
    image: 'https://picsum.photos/seed/photocard/800/800',
    minQuantity: 24,
    basePrice: 12000,
    options: [
      {
        name: '코팅',
        type: 'select',
        values: [
          { label: '유광 코팅', priceModifier: 0 },
          { label: '무광 코팅', priceModifier: 0 },
          { label: '홀로그램 코팅', priceModifier: 5000 },
          { label: '별무늬 코팅', priceModifier: 5000 },
        ]
      },
      {
        name: '귀돌이',
        type: 'radio',
        values: [
          { label: '있음 (기본)', priceModifier: 0 },
          { label: '없음', priceModifier: 0 },
        ]
      }
    ],
    features: ['표준 규격 55x85mm', '양면 칼라 기본', '고급 코팅 마감'],
    leadTime: '4~5 영업일',
    recommendation: '아이돌 굿즈용 포토카드라면 "유광 코팅"을 추천합니다. 색감이 더욱 선명하고 화려하게 표현됩니다.',
    warnings: [
      '코팅에 따라 색감이 다르게 보일 수 있음',
      '재단 공정상 1~2mm 밀림 현상 발생 가능'
    ],
    notes: [
      '귀도리(라운드) 처리는 기본 사양에 포함되어 있습니다.',
      '홀로그램 코팅 선택 시 인쇄 색상이 다소 어두워 보일 수 있습니다.'
    ]
  },
  {
    id: 'pkg-bag',
    name: '종이 쇼핑백',
    category: 'package-supply',
    subCategory: '쇼핑백',
    tagline: '브랜드의 품격을 완성하는 쇼핑백.',
    description: '다양한 사이즈와 끈 선택으로 브랜드 아이덴티티를 살릴 수 있는 종이 쇼핑백입니다.',
    image: 'https://picsum.photos/seed/shoppingbag/800/800',
    minQuantity: 100,
    basePrice: 85000,
    options: [
      {
        name: '사이즈',
        type: 'select',
        values: [
          { label: '소형 (220x120x280)', priceModifier: 0 },
          { label: '중형 (320x110x420)', priceModifier: 20000 },
        ]
      }
    ],
    features: ['고강도 용지', '내구성 있는 끈', '브랜드 홍보 효과'],
    leadTime: '10~14 영업일',
    badges: ['브랜드 패키지', '대량 제작', '맞춤 사이즈'],
    warnings: ['제작 공정상 수량 오차가 3~5% 발생할 수 있습니다.']
  },
  {
    id: 'pkg-envelope',
    name: '컬러 봉투',
    category: 'package-supply',
    subCategory: '봉투',
    tagline: '첫인상을 결정하는 고급스러운 봉투.',
    description: '청첩장, 초대장, 상품권 등을 담기에 적합한 다양한 컬러와 재질의 봉투입니다.',
    image: 'https://picsum.photos/seed/envelope/800/800',
    minQuantity: 100,
    basePrice: 12000,
    options: [
      {
        name: '사이즈',
        type: 'select',
        values: [
          { label: '일반형 (175x85)', priceModifier: 0 },
          { label: '대형 (220x110)', priceModifier: 3000 },
        ]
      }
    ],
    features: ['다양한 컬러', '고급 수입지', '정밀 가공'],
    leadTime: '4~5 영업일',
    badges: ['초대장용', '고급지', '다양한컬러'],
    warnings: ['봉투 뚜껑 부분의 가공 방식에 따라 견적이 달라질 수 있습니다.']
  },
  {
    id: 'pkg-wrapping',
    name: '포장지',
    category: 'package-supply',
    subCategory: '포장지',
    tagline: '정성을 더하는 아름다운 포장.',
    description: '선물이나 상품을 정성스럽게 감싸는 맞춤 인쇄 포장지입니다.',
    image: 'https://picsum.photos/seed/wrapping/800/800',
    minQuantity: 100,
    basePrice: 35000,
    options: [
      {
        name: '용지 선택',
        type: 'select',
        values: [
          { label: '모조지 80g', priceModifier: 0 },
          { label: '아트지 100g', priceModifier: 5000 },
        ]
      }
    ],
    features: ['전면 패턴 인쇄', '부드러운 질감', '선물 포장 최적화'],
    leadTime: '5~7 영업일',
    badges: ['패턴 인쇄', '선물용', '대량 제작'],
    warnings: ['얇은 용지 특성상 뒷비침이 있을 수 있습니다.']
  },
  {
    id: 'pkg-box',
    name: '커스텀 단상자',
    category: 'package-supply',
    subCategory: '박스',
    tagline: '브랜드의 가치를 담는 가장 완벽한 그릇.',
    description: '화장품, 의약품, 소형 전자기기 등 다양한 용도로 활용 가능한 단상자입니다.',
    image: 'https://picsum.photos/seed/box/800/800',
    minQuantity: 100,
    basePrice: 45000,
    options: [
      {
        name: '용지 선택',
        type: 'select',
        values: [
          { label: '아이보리 350g', priceModifier: 0 },
          { label: '로얄아이보리 350g', priceModifier: 5000 },
          { label: 'CCP 350g', priceModifier: 7000 },
        ]
      },
      {
        name: '코팅 방식',
        type: 'radio',
        values: [
          { label: '무광 라미네이팅', priceModifier: 0 },
          { label: '유광 라미네이팅', priceModifier: 0 },
        ]
      }
    ],
    features: ['고강도 용지 사용', '정밀 도송 가공', '다양한 후가공'],
    leadTime: '7~10 영업일',
    badges: ['재질 선택 가능', '후가공 가능', '대량 제작 문의'],
    recommendation: '고급스러운 패키징을 원하신다면 "로얄아이보리 350g"에 "무광 라미네이팅"을 추천합니다.',
    warnings: [
      '박스 형태에 따라 칼선 제작 비용이 발생할 수 있습니다.',
      '인쇄 터짐 방지를 위해 코팅을 권장합니다.'
    ],
    notes: [
      '박스 전개도(칼선) 데이터가 반드시 필요합니다.',
      '샘플 제작 후 본 제작 진행을 권장드립니다.'
    ]
  },
  {
    id: 'custom-special',
    name: '별도 상담 제작',
    category: 'custom',
    subCategory: '별도 상담 제작',
    tagline: '상상하는 모든 굿즈, 완두프린트와 상의하세요.',
    description: '규격 외 상품이나 대량 제작, 복합적인 공정이 필요한 상품은 전문가와 상담을 통해 제작됩니다.',
    image: 'https://picsum.photos/seed/custom/800/800',
    minQuantity: 1,
    basePrice: 0,
    options: [
      {
        name: '문의 내용',
        type: 'text',
        placeholder: '제작하고 싶은 상품과 수량을 적어주세요.'
      }
    ],
    features: ['1:1 전담 상담', '맞춤 견적 제안', '샘플 제작 가능'],
    leadTime: '상담 후 결정',
    warnings: [
      '상담 내용에 따라 견적이 변동될 수 있습니다.',
      '복합 공정의 경우 제작 기간이 길어질 수 있습니다.'
    ]
  },
  {
    id: 'sticker-gold-pet',
    name: '금광 PET',
    category: 'sticker',
    subCategory: '금광 PET',
    ...SUBCATEGORY_METADATA['금광 PET'],
    image: 'https://picsum.photos/seed/goldpet/800/800',
    minQuantity: 10,
    basePrice: 7500,
    options: [
      {
        name: '재질 선택',
        type: 'select',
        values: getStickerMaterials('metal').filter(m => m.name === '금광 PET').map(m => ({
          label: `${m.name} ${m.weight}`,
          priceModifier: 0
        }))
      },
      STICKER_COMMON_OPTIONS.CUTTING_METHOD,
      ...STICKER_COMMON_OPTIONS.COATING,
      STICKER_COMMON_OPTIONS.POST_PROCESSING
    ],
    features: ['금색 광택', '내구성 우수', '방수 기능'],
    leadTime: '4-5일',
    badges: ['금광', '프리미엄', '방수']
  },
  {
    id: 'sticker-silver-pet',
    name: '은광 PET',
    category: 'sticker',
    subCategory: '은광 PET',
    ...SUBCATEGORY_METADATA['은광 PET'],
    image: 'https://picsum.photos/seed/silverpet/800/800',
    minQuantity: 10,
    basePrice: 7000,
    options: [
      {
        name: '재질 선택',
        type: 'select',
        values: getStickerMaterials('metal').filter(m => m.name === '은광 PET').map(m => ({
          label: `${m.name} ${m.weight}`,
          priceModifier: 0
        }))
      },
      STICKER_COMMON_OPTIONS.CUTTING_METHOD,
      ...STICKER_COMMON_OPTIONS.COATING,
      STICKER_COMMON_OPTIONS.POST_PROCESSING
    ],
    features: ['은색 광택', '메탈릭 질감', '방수 기능'],
    leadTime: '4-5일',
    badges: ['은광', '메탈릭', '방수']
  },
  {
    id: 'sticker-silver-matte-pet',
    name: '은무 PET',
    category: 'sticker',
    subCategory: '은무 PET',
    ...SUBCATEGORY_METADATA['은무 PET'],
    image: 'https://picsum.photos/seed/mattesilver/800/800',
    minQuantity: 10,
    basePrice: 7000,
    options: [
      {
        name: '재질 선택',
        type: 'select',
        values: getStickerMaterials('metal').filter(m => m.name === '은무 PET').map(m => ({
          label: `${m.name} ${m.weight}`,
          priceModifier: 0
        }))
      },
      STICKER_COMMON_OPTIONS.CUTTING_METHOD,
      ...STICKER_COMMON_OPTIONS.COATING,
      STICKER_COMMON_OPTIONS.POST_PROCESSING
    ],
    features: ['무광 은색', '내열성/내구성', '방수 기능'],
    leadTime: '4-5일',
    badges: ['은무', '내구성', '방수']
  },
  {
    id: 'sticker-gmund',
    name: '그문드 라벨',
    category: 'sticker',
    subCategory: '그문드 라벨',
    ...SUBCATEGORY_METADATA['그문드 라벨'],
    image: 'https://picsum.photos/seed/gmund/800/800',
    minQuantity: 10,
    basePrice: 9500,
    options: [
      {
        name: '재질 선택',
        type: 'select',
        values: getStickerMaterials('gmund').map(m => ({
          label: `${m.name} ${m.weight}`,
          priceModifier: m.name === '(GMUND) 화이트우드' ? 0 : 1000
        }))
      },
      STICKER_COMMON_OPTIONS.CUTTING_METHOD,
      ...STICKER_COMMON_OPTIONS.COATING,
      STICKER_COMMON_OPTIONS.POST_PROCESSING
    ],
    features: ['명품 수입지', '독보적 질감', '친환경 인증'],
    leadTime: '5-7일',
    badges: ['그문드', '명품지', '감성']
  },
  {
    id: 'sticker-gold-label',
    name: '금 라벨지',
    category: 'sticker',
    subCategory: '금 라벨지',
    ...SUBCATEGORY_METADATA['금 라벨지'],
    image: 'https://picsum.photos/seed/goldlabel/800/800',
    minQuantity: 10,
    basePrice: 6000,
    options: [
      {
        name: '재질 선택',
        type: 'select',
        values: getStickerMaterials('metal').filter(m => m.name === '금 라벨지').map(m => ({
          label: `${m.name} ${m.weight}`,
          priceModifier: 0
        }))
      },
      STICKER_COMMON_OPTIONS.CUTTING_METHOD,
      ...STICKER_COMMON_OPTIONS.COATING,
      STICKER_COMMON_OPTIONS.POST_PROCESSING
    ],
    features: ['은은한 금색', '종이 질감', '가성비 고급'],
    leadTime: '3-4일',
    badges: ['금라벨', '클래식', '종이재질']
  },
  {
    id: 'sticker-silver-label',
    name: '은 라벨지',
    category: 'sticker',
    subCategory: '은 라벨지',
    ...SUBCATEGORY_METADATA['은 라벨지'],
    image: 'https://picsum.photos/seed/silverlabel/800/800',
    minQuantity: 10,
    basePrice: 6000,
    options: [
      {
        name: '재질 선택',
        type: 'select',
        values: getStickerMaterials('metal').filter(m => m.name === '은 라벨지').map(m => ({
          label: `${m.name} ${m.weight}`,
          priceModifier: 0
        }))
      },
      STICKER_COMMON_OPTIONS.CUTTING_METHOD,
      ...STICKER_COMMON_OPTIONS.COATING,
      STICKER_COMMON_OPTIONS.POST_PROCESSING
    ],
    features: ['은은한 은색', '종이 질감', '깔끔한 마감'],
    leadTime: '3-4일',
    badges: ['은라벨', '모던', '종이재질']
  },
  {
    id: 'sticker-bronze-label',
    name: '동 라벨지',
    category: 'sticker',
    subCategory: '동 라벨지',
    ...SUBCATEGORY_METADATA['동 라벨지'],
    image: 'https://picsum.photos/seed/bronzelabel/800/800',
    minQuantity: 10,
    basePrice: 6000,
    options: [
      {
        name: '재질 선택',
        type: 'select',
        values: getStickerMaterials('metal').filter(m => m.name === '동 라벨지').map(m => ({
          label: `${m.name} ${m.weight}`,
          priceModifier: 0
        }))
      },
      STICKER_COMMON_OPTIONS.CUTTING_METHOD,
      ...STICKER_COMMON_OPTIONS.COATING,
      STICKER_COMMON_OPTIONS.POST_PROCESSING
    ],
    features: ['빈티지 브론즈', '종이 질감', '유니크 색상'],
    leadTime: '3-4일',
    badges: ['동라벨', '빈티지', '유니크']
  },
  {
    id: 'package-label',
    name: '롤 라벨 스티커',
    category: 'package-supply',
    subCategory: '라벨',
    tagline: '대량 부착에 용이한 롤 형태의 라벨',
    description: '제품 패키징에 효율적인 롤 형태의 라벨 스티커입니다. 자동 부착기 사용이 가능하도록 제작됩니다.',
    image: 'https://picsum.photos/seed/label/800/800',
    minQuantity: 1000,
    basePrice: 45000,
    options: [
      {
        name: '재질',
        type: 'select',
        values: [{ label: '아트지 라벨' }, { label: '유포 스티커', priceModifier: 5000 }, { label: '은광 PET', priceModifier: 8000 }]
      }
    ],
    features: ['대량 제작 최적화', '롤 형태 공급', '다양한 재질'],
    leadTime: '7-10일',
    badges: ['대량특화', '자동부착용', '가성비']
  },
  {
    id: 'binding-wireless',
    name: '무선제본 책자',
    category: 'binding-booklet',
    subCategory: '무선제본 책자',
    tagline: '가장 일반적인 책 제본 방식.',
    description: '강력한 접착제로 고정하는 방식으로 두꺼운 책자 제작에 적합합니다. 소설, 문제집, 보고서 등에 추천합니다.',
    image: 'https://picsum.photos/seed/wireless/800/800',
    minQuantity: 1,
    basePrice: 45000,
    options: [
      {
        name: '규격',
        type: 'select',
        values: [
          { label: 'A4 (210x297mm)', priceModifier: 0 },
          { label: 'A5 (148x210mm)', priceModifier: -1000 },
          { label: 'B5 (182x257mm)', priceModifier: -500 },
        ]
      },
      {
        name: '인쇄 색상',
        type: 'radio',
        values: [
          { label: '컬러', priceModifier: 0 },
          { label: '흑백', priceModifier: -5000 },
        ]
      },
      {
        name: '표지 인쇄',
        type: 'radio',
        values: [
          { label: '컬러', priceModifier: 0 },
          { label: '흑백', priceModifier: -2000 },
        ]
      },
      {
        name: '내지 인쇄',
        type: 'radio',
        values: [
          { label: '컬러', priceModifier: 0 },
          { label: '흑백', priceModifier: -3000 },
        ]
      },
      {
        name: '표지 용지',
        type: 'select',
        values: [
          { label: '스노우 250g', priceModifier: 0 },
          { label: '스노우 300g', priceModifier: 1000 },
          { label: '아트지 250g', priceModifier: 0 },
        ]
      },
      {
        name: '내지 용지',
        type: 'select',
        values: [
          { label: '모조 80g', priceModifier: 0 },
          { label: '모조 100g', priceModifier: 1000 },
          { label: '백상지 100g', priceModifier: 1000 },
        ]
      },
      {
        name: '페이지 수',
        type: 'select',
        values: [
          { label: '40p', priceModifier: 0 },
          { label: '60p', priceModifier: 5000 },
          { label: '80p', priceModifier: 10000 },
          { label: '100p', priceModifier: 15000 },
          { label: '120p', priceModifier: 20000 },
        ]
      },
      {
        name: '표지 코팅',
        type: 'radio',
        values: [
          { label: '무광코팅', priceModifier: 1000 },
          { label: '유광코팅', priceModifier: 1000 },
          { label: '코팅 없음', priceModifier: 0 },
        ]
      },
      {
        name: '제본 방향',
        type: 'radio',
        values: [
          { label: '세로형', priceModifier: 0 },
          { label: '가로형', priceModifier: 2000 },
        ]
      }
    ],
    features: ['무선제본', '옆면 풀제본', '두꺼운 자료집에 적합'],
    leadTime: '5~7 영업일',
    badges: ['책제작', '표준제본', '고품질'],
    warnings: [
      '책등(세나카) 두께를 고려하여 표지 디자인을 해야 합니다.'
    ],
    notes: [
      '무선제본 / 옆면 풀제본 / 두꺼운 자료집에 적합'
    ]
  },
  {
    id: 'promo-leaflet',
    name: '리플렛',
    category: 'poster-promo',
    subCategory: '리플렛',
    tagline: '정보를 한눈에, 세련된 홍보물.',
    description: '접지 가공을 통해 정보를 효율적으로 전달하는 홍보물입니다. 기업 소개, 전시 안내 등에 많이 사용됩니다.',
    image: 'https://picsum.photos/seed/leaflet/800/800',
    minQuantity: 10,
    basePrice: 25000,
    options: [
      {
        name: '접지 방식',
        type: 'radio',
        values: [
          { label: '2단 접지', priceModifier: 0 },
          { label: '3단 접지', priceModifier: 5000 },
          { label: '대문 접지', priceModifier: 8000 },
          { label: 'N단 접지', priceModifier: 10000 },
        ]
      },
      {
        name: '규격 (펼침 기준)',
        type: 'select',
        values: [
          { label: 'A4 (210x297)', priceModifier: 0 },
          { label: 'A3 (297x420)', priceModifier: 15000 },
        ]
      },
      {
        name: '용지 선택',
        type: 'select',
        values: [
          { label: '아트지 150g', priceModifier: 0 },
          { label: '스노우 150g', priceModifier: 0 },
          { label: '랑데뷰 160g', priceModifier: 5000 },
        ]
      }
    ],
    features: ['정밀 오시/접지 가공', '양면 풀컬러 인쇄', '다양한 접지 형태'],
    leadTime: '3~5 영업일',
    badges: ['홍보용', '접지가공', '베스트'],
    warnings: [
      '접히는 부분의 인쇄 터짐 방지를 위해 코팅을 권장합니다.',
      '접지 방향과 순서를 명확히 기재해 주세요.'
    ]
  },
  {
    id: 'pkg-tag',
    name: '의류/상품 택(Tag)',
    category: 'package-supply',
    subCategory: '택(Tag)',
    tagline: '브랜드의 가치를 완성하는 작은 디테일.',
    description: '의류나 잡화에 부착하여 브랜드 정보와 가격 등을 표시하는 택입니다.',
    image: 'https://picsum.photos/seed/tag/800/800',
    minQuantity: 100,
    basePrice: 15000,
    options: [
      {
        name: '사이즈',
        type: 'select',
        values: [
          { label: '40x80mm', priceModifier: 0 },
          { label: '50x90mm', priceModifier: 0 },
          { label: '60x60mm', priceModifier: 0 },
          { label: '직접입력', priceModifier: 0 },
        ]
      },
      {
        name: '용지 선택',
        type: 'select',
        values: [
          { label: '스노우 250g', priceModifier: 0 },
          { label: '아트지 250g', priceModifier: 0 },
          { label: '크라프트 250g', priceModifier: 2000 },
          { label: '랑데뷰 240g', priceModifier: 3000 },
        ]
      },
      {
        name: '타공 유무',
        type: 'radio',
        values: [
          { label: '있음 (3mm)', priceModifier: 0 },
          { label: '없음', priceModifier: 0 },
        ]
      }
    ],
    features: ['정밀 타공 포함', '고급 용지 사용', '소량 제작 가능'],
    leadTime: '3~5 영업일',
    badges: ['의류용', '브랜딩', '필수템'],
    notes: [
      '끈은 포함되어 있지 않으며 별도 구매 또는 준비하셔야 합니다.',
      '양면 인쇄가 기본입니다.'
    ]
  },
  {
    id: 'binding-spring',
    name: '스프링제본 책자',
    category: 'binding-booklet',
    subCategory: '스프링제본 책자',
    tagline: '필기하기 편한 스프링 제본.',
    description: '자주 펼쳐보는 자료나 문제집, 교안 등에 적합한 제본 방식입니다.',
    image: 'https://picsum.photos/seed/spring/800/800',
    minQuantity: 1,
    basePrice: 40000,
    options: [
      { name: '규격 안내', type: 'text', description: 'A4(210x297mm) 고정입니다.' },
      { name: '인쇄 색상', type: 'radio', values: [{ label: '컬러', priceModifier: 0 }, { label: '흑백', priceModifier: -5000 }] },
      { name: '표지 인쇄', type: 'radio', values: [{ label: '컬러', priceModifier: 0 }, { label: '흑백', priceModifier: -2000 }] },
      { name: '내지 인쇄', type: 'radio', values: [{ label: '컬러', priceModifier: 0 }, { label: '흑백', priceModifier: -3000 }] },
      { name: '표지 용지', type: 'select', values: [{ label: '스노우 250g', priceModifier: 0 }, { label: '스노우 300g', priceModifier: 1000 }, { label: '아트지 250g', priceModifier: 0 }] },
      { name: '내지 용지', type: 'select', values: [{ label: '모조 80g', priceModifier: 0 }, { label: '모조 100g', priceModifier: 1000 }, { label: '백상지 100g', priceModifier: 1000 }] },
      { name: '페이지 수', type: 'select', values: [{ label: '40p', priceModifier: 0 }, { label: '60p', priceModifier: 5000 }, { label: '80p', priceModifier: 10000 }, { label: '100p', priceModifier: 15000 }] },
      { name: '제본 방향', type: 'radio', values: [{ label: '세로형', priceModifier: 0 }, { label: '가로형', priceModifier: 2000 }] },
      { name: '스프링 색상', type: 'radio', values: [{ label: '검정', priceModifier: 0 }, { label: '하양', priceModifier: 0 }] },
      { name: '표지 코팅', type: 'radio', values: [{ label: '무광코팅', priceModifier: 1000 }, { label: '유광코팅', priceModifier: 1000 }, { label: '코팅 없음', priceModifier: 0 }] }
    ],
    features: ['잘 펼쳐짐', '필기 용이', '학습자료 최적'],
    leadTime: '3~5 영업일',
    badges: ['학습용', '필기최적', '베스트']
  },
  {
    id: 'binding-twinring',
    name: '트윈링제본 책자',
    category: 'binding-booklet',
    subCategory: '트윈링제본 책자',
    tagline: '튼튼하고 깔끔한 트윈링 제본.',
    description: '스프링보다 더 튼튼하고 고급스러운 느낌의 제본 방식입니다.',
    image: 'https://picsum.photos/seed/twinring/800/800',
    minQuantity: 1,
    basePrice: 42000,
    options: [
      { name: '규격 안내', type: 'text', description: 'A4(210x297mm) 고정입니다.' },
      { name: '인쇄 색상', type: 'radio', values: [{ label: '컬러', priceModifier: 0 }, { label: '흑백', priceModifier: -5000 }] },
      { name: '표지 인쇄', type: 'radio', values: [{ label: '컬러', priceModifier: 0 }, { label: '흑백', priceModifier: -2000 }] },
      { name: '내지 인쇄', type: 'radio', values: [{ label: '컬러', priceModifier: 0 }, { label: '흑백', priceModifier: -3000 }] },
      { name: '표지 용지', type: 'select', values: [{ label: '스노우 250g', priceModifier: 0 }, { label: '스노우 300g', priceModifier: 1000 }, { label: '아트지 250g', priceModifier: 0 }] },
      { name: '내지 용지', type: 'select', values: [{ label: '모조 80g', priceModifier: 0 }, { label: '모조 100g', priceModifier: 1000 }, { label: '백상지 100g', priceModifier: 1000 }] },
      { name: '페이지 수', type: 'select', values: [{ label: '40p', priceModifier: 0 }, { label: '60p', priceModifier: 5000 }, { label: '80p', priceModifier: 10000 }, { label: '100p', priceModifier: 15000 }] },
      { name: '제본 방향', type: 'radio', values: [{ label: '세로형', priceModifier: 0 }, { label: '가로형', priceModifier: 2000 }] },
      { name: '트윈링 색상', type: 'radio', values: [{ label: '검정', priceModifier: 0 }, { label: '하양', priceModifier: 0 }] },
      { name: '표지 코팅', type: 'radio', values: [{ label: '무광코팅', priceModifier: 1000 }, { label: '유광코팅', priceModifier: 1000 }, { label: '코팅 없음', priceModifier: 0 }] }
    ],
    features: ['튼튼함', '고급스러움', '깔끔함'],
    leadTime: '3~5 영업일',
    badges: ['고급형', '튼튼함', '깔끔함']
  },
  {
    id: 'binding-sewn',
    name: '실제본 책자',
    category: 'binding-booklet',
    subCategory: '실제본 책자',
    tagline: '감성적이고 정성스러운 실제본.',
    description: '실로 직접 꿰매어 제작하는 방식으로 고급스럽고 감성적인 느낌을 줍니다.',
    image: 'https://picsum.photos/seed/sewn/800/800',
    minQuantity: 1,
    basePrice: 50000,
    options: [
      { name: '규격 안내', type: 'text', description: 'A4(210x297mm) 고정입니다.' },
      { name: '인쇄 색상', type: 'radio', values: [{ label: '컬러', priceModifier: 0 }, { label: '흑백', priceModifier: -5000 }] },
      { name: '표지 인쇄', type: 'radio', values: [{ label: '컬러', priceModifier: 0 }, { label: '흑백', priceModifier: -2000 }] },
      { name: '내지 인쇄', type: 'radio', values: [{ label: '컬러', priceModifier: 0 }, { label: '흑백', priceModifier: -3000 }] },
      { name: '표지 용지', type: 'select', values: [{ label: '스노우 250g', priceModifier: 0 }, { label: '스노우 300g', priceModifier: 1000 }, { label: '아트지 250g', priceModifier: 0 }] },
      { name: '내지 용지', type: 'select', values: [{ label: '모조 80g', priceModifier: 0 }, { label: '모조 100g', priceModifier: 1000 }, { label: '백상지 100g', priceModifier: 1000 }] },
      { name: '페이지 수', type: 'select', values: [{ label: '40p', priceModifier: 0 }, { label: '60p', priceModifier: 5000 }, { label: '80p', priceModifier: 10000 }, { label: '100p', priceModifier: 15000 }] },
      { name: '제본 방향', type: 'radio', values: [{ label: '세로형', priceModifier: 0 }, { label: '가로형', priceModifier: 2000 }] },
      { name: '표지 코팅', type: 'radio', values: [{ label: '무광코팅', priceModifier: 1000 }, { label: '유광코팅', priceModifier: 1000 }, { label: '코팅 없음', priceModifier: 0 }] }
    ],
    features: ['고급스러움', '감성적', '정성스러움'],
    leadTime: '5~7 영업일',
    badges: ['고급형', '감성', '정성']
  },
  {
    id: 'binding-wireless-budget',
    name: '알뜰 무선제본 책자',
    category: 'binding-booklet',
    subCategory: '알뜰 무선제본 책자',
    tagline: '빠르게 제작하는 경제형 책자.',
    description: '기본 사양 위주로 빠르게 제작하는 경제형 책자입니다.',
    image: 'https://picsum.photos/seed/wireless-budget/800/800',
    minQuantity: 10,
    basePrice: 30000,
    options: [
      { name: '인쇄 색상', type: 'radio', values: [{ label: '컬러', priceModifier: 0 }, { label: '흑백', priceModifier: -5000 }] },
      { name: '표지 인쇄', type: 'radio', values: [{ label: '컬러', priceModifier: 0 }, { label: '흑백', priceModifier: -2000 }] },
      { name: '내지 인쇄', type: 'radio', values: [{ label: '컬러', priceModifier: 0 }, { label: '흑백', priceModifier: -3000 }] },
      { name: '표지 용지', type: 'radio', values: [{ label: '스노우 250g', priceModifier: 0 }] },
      { name: '내지 용지', type: 'radio', values: [{ label: '모조 80g', priceModifier: 0 }] },
      { name: '페이지 수', type: 'radio', values: [{ label: '40p', priceModifier: 0 }, { label: '60p', priceModifier: 5000 }, { label: '80p', priceModifier: 10000 }] },
      { name: '표지 코팅', type: 'radio', values: [{ label: '무광코팅', priceModifier: 1000 }, { label: '코팅 없음', priceModifier: 0 }] },
      { name: '제본 방향', type: 'radio', values: [{ label: '세로형', priceModifier: 0 }, { label: '가로형', priceModifier: 2000 }] }
    ],
    features: ['경제적', '빠른제작', '기본사양'],
    leadTime: '2~3 영업일',
    badges: ['알뜰형', '보고서용', '가성비']
  },
  {
    id: 'binding-spring-budget',
    name: '알뜰 스프링제본 책자',
    category: 'binding-booklet',
    subCategory: '알뜰 스프링제본 책자',
    tagline: '필기와 펼침에 편한 경제형 제본.',
    description: '교안, 프린트 묶음, 문제집형 자료에 적합한 경제형 제본입니다.',
    image: 'https://picsum.photos/seed/spring-budget/800/800',
    minQuantity: 10,
    basePrice: 35000,
    options: [
      { name: '인쇄 색상', type: 'radio', values: [{ label: '컬러', priceModifier: 0 }, { label: '흑백', priceModifier: -5000 }] },
      { name: '표지 인쇄', type: 'radio', values: [{ label: '컬러', priceModifier: 0 }, { label: '흑백', priceModifier: -2000 }] },
      { name: '내지 인쇄', type: 'radio', values: [{ label: '컬러', priceModifier: 0 }, { label: '흑백', priceModifier: -3000 }] },
      { name: '표지 용지', type: 'radio', values: [{ label: '스노우 250g', priceModifier: 0 }] },
      { name: '내지 용지', type: 'radio', values: [{ label: '모조 80g', priceModifier: 0 }] },
      { name: '페이지 수', type: 'radio', values: [{ label: '40p', priceModifier: 0 }, { label: '60p', priceModifier: 5000 }, { label: '80p', priceModifier: 10000 }] },
      { name: '제본 방향', type: 'radio', values: [{ label: '세로형', priceModifier: 0 }, { label: '가로형', priceModifier: 2000 }] },
      { name: '스프링 색상', type: 'radio', values: [{ label: '검정', priceModifier: 0 }, { label: '하양', priceModifier: 0 }] },
      { name: '표지 코팅', type: 'radio', values: [{ label: '무광코팅', priceModifier: 1000 }, { label: '코팅 없음', priceModifier: 0 }] }
    ],
    features: ['경제적', '필기편함', '학습용'],
    leadTime: '2~3 영업일',
    badges: ['알뜰형', '학습용', '가성비']
  },
  {
    id: 'binding-twinring-budget',
    name: '알뜰 트윈링제본 책자',
    category: 'binding-booklet',
    subCategory: '알뜰 트윈링제본 책자',
    tagline: '깔끔하고 튼튼한 경제형 제본.',
    description: '자료집, 제출용 프린트, 간단한 설명집에 적합한 경제형 제본입니다.',
    image: 'https://picsum.photos/seed/twinring-budget/800/800',
    minQuantity: 10,
    basePrice: 37000,
    options: [
      { name: '인쇄 색상', type: 'radio', values: [{ label: '컬러', priceModifier: 0 }, { label: '흑백', priceModifier: -5000 }] },
      { name: '표지 인쇄', type: 'radio', values: [{ label: '컬러', priceModifier: 0 }, { label: '흑백', priceModifier: -2000 }] },
      { name: '내지 인쇄', type: 'radio', values: [{ label: '컬러', priceModifier: 0 }, { label: '흑백', priceModifier: -3000 }] },
      { name: '표지 용지', type: 'radio', values: [{ label: '스노우 250g', priceModifier: 0 }] },
      { name: '내지 용지', type: 'radio', values: [{ label: '모조 80g', priceModifier: 0 }] },
      { name: '페이지 수', type: 'radio', values: [{ label: '40p', priceModifier: 0 }, { label: '60p', priceModifier: 5000 }, { label: '80p', priceModifier: 10000 }] },
      { name: '제본 방향', type: 'radio', values: [{ label: '세로형', priceModifier: 0 }, { label: '가로형', priceModifier: 2000 }] },
      { name: '트윈링 색상', type: 'radio', values: [{ label: '검정', priceModifier: 0 }, { label: '하양', priceModifier: 0 }] },
      { name: '표지 코팅', type: 'radio', values: [{ label: '무광코팅', priceModifier: 1000 }, { label: '코팅 없음', priceModifier: 0 }] }
    ],
    features: ['경제적', '튼튼함', '깔끔함'],
    leadTime: '2~3 영업일',
    badges: ['알뜰형', '제출용', '가성비']
  },
  {
    id: 'usage-study',
    name: '공부자료 제본',
    category: 'binding-booklet',
    subCategory: '공부자료 제본',
    tagline: '공부할 때 자주 보는 자료를 위한 맞춤 제본',
    description: '시험 대비 요약본, 개인 정리노트, 프린트 묶음 등 공부 자료를 깔끔하게 제본해 드립니다.',
    image: 'https://picsum.photos/seed/study/400/400',
    minQuantity: 1,
    basePrice: 5000,
    options: [],
    features: ['소량 제작 가능', '다양한 제본 방식'],
    leadTime: '1-2일'
  },
  {
    id: 'usage-learning',
    name: '학습자료 제본',
    category: 'binding-booklet',
    subCategory: '학습자료 제본',
    tagline: '체계적인 학습을 위한 자료집 제작',
    description: '학원, 과외, 자습용 자료를 체계적으로 정리하여 제본해 드립니다.',
    image: 'https://picsum.photos/seed/learning/400/400',
    minQuantity: 1,
    basePrice: 5000,
    options: [],
    features: ['체계적 정리', '다양한 분량'],
    leadTime: '1-2일'
  },
  {
    id: 'usage-teaching',
    name: '수업교안 제본',
    category: 'binding-booklet',
    subCategory: '수업교안 제본',
    tagline: '강의의 전달력을 높이는 수업 교안',
    description: '강의용 프린트, 수업 자료, 설명용 교안을 깔끔하게 제본해 드립니다.',
    image: 'https://picsum.photos/seed/teaching/400/400',
    minQuantity: 1,
    basePrice: 5000,
    options: [],
    features: ['가독성 향상', '깔끔한 정리'],
    leadTime: '1-2일'
  },
  {
    id: 'usage-workbook',
    name: '문제집 제본',
    category: 'binding-booklet',
    subCategory: '문제집 제본',
    tagline: '반복 학습을 위한 실용적인 문제집',
    description: '문제풀이 자료, 오답노트, 연습문제 모음을 실용적으로 제본해 드립니다.',
    image: 'https://picsum.photos/seed/workbook/400/400',
    minQuantity: 1,
    basePrice: 5000,
    options: [],
    features: ['반복 학습 적합', '실용적'],
    leadTime: '1-2일'
  },
  {
    id: 'usage-book',
    name: '단행본/소책자 제작',
    category: 'binding-booklet',
    subCategory: '단행본/소책자 제작',
    tagline: '나만의 책을 만드는 소책자 제작',
    description: '개인 출판물, 브랜드북, 소책자, 작품집을 완성도 높게 제작해 드립니다.',
    image: 'https://picsum.photos/seed/book/400/400',
    minQuantity: 1,
    basePrice: 5000,
    options: [],
    features: ['완성도 높은 제작', '다양한 용도'],
    leadTime: '1-2일'
  },
  {
    id: 'usage-submission',
    name: '기관/학교 제출용 제본',
    category: 'binding-booklet',
    subCategory: '기관/학교 제출용 제본',
    tagline: '정돈된 인상의 제출용 제본',
    description: '보고서, 발표자료, 제출용 문서를 단정하고 안정적인 형태로 제본해 드립니다.',
    image: 'https://picsum.photos/seed/submission/400/400',
    minQuantity: 1,
    basePrice: 5000,
    options: [],
    features: ['단정한 마감', '안정적인 형태'],
    leadTime: '1-2일'
  }
];

export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  subCategory: string;
  material: string;
  finishing: string;
  image: string;
  description: string;
}

export const PORTFOLIO_ITEMS: PortfolioItem[] = [
  {
    id: 'p1',
    title: '캐릭터 브랜드 자유형 스티커',
    category: 'sticker',
    subCategory: '자유형 스티커',
    material: '유포 스티커',
    finishing: '무광 코팅',
    image: 'https://picsum.photos/seed/port1/800/1000',
    description: '귀여운 캐릭터 라인을 살린 자유형 스티커입니다. 방수가 되는 유포 스티커에 무광 코팅을 더해 고급스럽습니다.'
  },
  {
    id: 'p2',
    title: '카페 로고 사각형 스티커',
    category: 'sticker',
    subCategory: '사각형 스티커',
    material: '아트지 라벨',
    finishing: '유광 코팅',
    image: 'https://picsum.photos/seed/port2/800/1000',
    description: '카페 패키지용으로 제작된 사각형 스티커입니다. 유광 코팅으로 색감이 선명하게 표현되었습니다.'
  },
  {
    id: 'p3',
    title: '전시회 작품 엽서 세트',
    category: 'card-paper',
    subCategory: '일반 엽서',
    material: '랑데뷰 240g',
    finishing: '없음',
    image: 'https://picsum.photos/seed/port3/800/1000',
    description: '작가의 작품을 담은 엽서 세트입니다. 종이 본연의 질감을 살리기 위해 코팅 없이 제작되었습니다.'
  },
  {
    id: 'p5',
    title: '프리미엄 코스메틱 박스',
    category: 'package-supply',
    subCategory: '박스',
    material: '아이보리 350g',
    finishing: '무광 라미네이팅 + 금박',
    image: 'https://picsum.photos/seed/port5/800/1000',
    description: '화장품 패키지용으로 제작된 단상자입니다. 금박 후가공으로 프리미엄한 느낌을 주었습니다.'
  }
];
