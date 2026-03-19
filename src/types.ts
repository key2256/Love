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
    type: 'select' | 'radio' | 'number' | 'text';
    values?: { label: string; priceModifier?: number }[];
    placeholder?: string;
  }[];
  features: string[];
  leadTime: string;
  warnings?: string[];
  isNew?: boolean;
  recommendation?: string;
  badges?: string[];
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

export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
  entryPhrase: string;
  subCategories: string[];
}

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
    subCategories: ['자유형', '사각', '원형', '타원형', '사각라운드', '조각스티커', '판스티커', '투명스티커', 'UV스티커', 'DTF열전사', '네임스티커', '패키지스티커']
  },
  { 
    id: 'paper', 
    name: '카드/지류', 
    icon: 'FileText', 
    description: '명함, 엽서, 포토카드 등 인쇄 굿즈의 기본',
    entryPhrase: '감성을 담은 지류 굿즈의 완성',
    subCategories: ['일반 명함', '프리미엄 명함', '접지 명함', '디자인 템플릿 명함', '엽서', '포토카드']
  },
  { 
    id: 'goods', 
    name: '아크릴 굿즈', 
    icon: 'Gift', 
    description: '키링과 스탠드 중심의 커스텀 아크릴 굿즈',
    entryPhrase: '영롱하게 빛나는 아크릴 굿즈',
    subCategories: ['아크릴 키링', '유색 아크릴 키링', '글리터 아크릴 키링', '자개 아크릴 키링', '렌티큘러 키링', '아크릴 스탠드']
  },
  { 
    id: 'package', 
    name: '패키지', 
    icon: 'Box', 
    description: '브랜드의 가치를 높여주는 고품질 패키지 제작',
    entryPhrase: '완성도 높은 패키지의 시작',
    subCategories: ['박스', '슬리브', '택', '라벨', '소형박스']
  },
  { 
    id: 'custom', 
    name: '맞춤제작', 
    icon: 'MessageSquare', 
    description: '규격 외 제작, 대량 발주, 조합형 굿즈는 별도 상담으로 진행',
    entryPhrase: '특별한 프로젝트를 위한 맞춤 상담',
    subCategories: ['규격 외 제작', '대량 제작', '조합형 굿즈', '패키지/세트 제작', '별도 상담 제작']
  },
];

export const ORDER_STEPS: OrderStep[] = [
  { number: '01', title: '상품 선택', description: '원하는 상품과 기본 옵션을 확인합니다.' },
  { number: '02', title: '견적 확인', description: '상세 옵션과 수량을 조절하여 실시간 견적을 확인합니다.' },
  { number: '03', title: '견적서 발행', description: '확정된 견적 내용을 문서 형태로 저장하거나 발행합니다.' },
  { number: '04', title: '문의/파일접수', description: '견적 내용을 바탕으로 작업 파일을 접수하고 상담을 진행합니다.' },
  { number: '05', title: '제작 진행', description: '전문가의 검수 후 고품질 인쇄 및 가공이 시작됩니다.' },
  { number: '06', title: '발송', description: '꼼꼼하게 포장하여 안전하게 배송해 드립니다.' },
];

export const PRODUCTS: Product[] = [
  {
    id: 'stk-free',
    name: '자유형 스티커',
    category: 'sticker',
    subCategory: '자유형',
    tagline: '원하는 모양 그대로, 자유롭게 제작하세요.',
    description: '칼선 제약 없이 원하는 형태 그대로 제작 가능한 스티커입니다.',
    image: 'https://picsum.photos/seed/sticker1/800/800',
    minQuantity: 10,
    basePrice: 5000,
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
        values: [
          { label: '유포지', priceModifier: 0 },
          { label: '아트지', priceModifier: -500 },
          { label: '모조지', priceModifier: -300 },
          { label: '투명 PET', priceModifier: 1500 },
        ]
      },
      {
        name: '표면 마감',
        type: 'radio',
        values: [
          { label: '무광', priceModifier: 0 },
          { label: '유광', priceModifier: 0 },
          { label: '홀로그램', priceModifier: 3000 },
        ]
      },
      {
        name: '재단 방식',
        type: 'select',
        values: [
          { label: '반칼', priceModifier: 0 },
          { label: '완칼', priceModifier: 500 },
          { label: '개별재단', priceModifier: 1000 },
          { label: '시트형', priceModifier: 0 },
        ]
      }
    ],
    features: ['자유로운 칼선', '고해상도 인쇄', '강력 접착'],
    leadTime: '3~5 영업일',
    badges: ['재질 4종~', '칼선 커스텀', '소량 제작'],
    warnings: [
      '작은 글자·얇은 선·뾰족한 칼선은 제작 제한 가능',
      '개별재단 상품은 1~2mm 오차 가능',
      '자유형은 칼선 길이에 따라 추가비용 가능'
    ]
  },
  {
    id: 'stk-uv',
    name: 'UV 자유형 스티커',
    category: 'sticker',
    subCategory: 'UV스티커',
    tagline: '매끄러운 표면 어디든, 강력한 UV 인쇄.',
    description: '플라스틱, 유리, 금속 등 매끄러운 표면에 부착하기 적합한 고내구성 스티커입니다.',
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
      {
        name: '화이트 인쇄',
        type: 'radio',
        values: [
          { label: '없음', priceModifier: 0 },
          { label: '있음', priceModifier: 2000 },
        ]
      },
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
    id: 'goods-keyring',
    name: '아크릴 키링',
    category: 'goods',
    subCategory: '아크릴 키링',
    tagline: '투명하고 영롱한 나만의 캐릭터 굿즈.',
    description: '고품질 아크릴에 배면 인쇄 방식으로 제작되어 긁힘에 강하고 선명합니다.',
    image: 'https://picsum.photos/seed/keyring/800/800',
    minQuantity: 1,
    basePrice: 3500,
    options: [
      {
        name: '제품 종류',
        type: 'select',
        values: [
          { label: '투명', priceModifier: 0 },
          { label: '유색', priceModifier: 1000 },
          { label: '글리터', priceModifier: 2000 },
          { label: '자개', priceModifier: 3000 },
          { label: '렌티큘러', priceModifier: 5000 },
        ]
      },
      {
        name: '인쇄 방식',
        type: 'radio',
        values: [
          { label: '단면', priceModifier: 0 },
          { label: '양면', priceModifier: 2000 },
        ]
      },
      {
        name: '제작 방식',
        type: 'radio',
        values: [
          { label: '일반', priceModifier: 0 },
          { label: '라미', priceModifier: 1500 },
        ]
      },
      {
        name: '부자재 선택',
        type: 'select',
        values: [
          { label: '기본 고리', priceModifier: 0 },
          { label: '카라비너', priceModifier: 500 },
          { label: '컬러 와이어링', priceModifier: 800 },
          { label: '구슬줄', priceModifier: 300 },
        ]
      }
    ],
    features: ['고선명 UV 인쇄', '정밀 레이저 커팅', '다양한 부자재'],
    leadTime: '5~7 영업일',
    badges: ['1개부터 제작', '라미 가공', '부자재 선택'],
    warnings: [
      '화이트 인쇄 없으면 이미지가 투명하게 비침',
      '일반 방식은 인쇄면 노출 가능',
      '라미 방식은 내구성 높음',
      '키링 구멍 최소 규격 필요'
    ]
  },
  {
    id: 'paper-postcard',
    name: '엽서',
    category: 'paper',
    subCategory: '엽서',
    tagline: '소중한 마음을 담는 가장 클래식한 방법.',
    description: '다양한 고급 수입지와 후가공으로 제작하는 고품질 엽서입니다.',
    image: 'https://picsum.photos/seed/postcard/800/800',
    minQuantity: 10,
    basePrice: 8000,
    options: [
      {
        name: '사이즈',
        type: 'select',
        values: [
          { label: '100x148mm (기본)', priceModifier: 0 },
          { label: '148x210mm (A5)', priceModifier: 3000 },
          { label: '직접 입력', priceModifier: 0 },
        ]
      },
      {
        name: '용지 선택',
        type: 'select',
        values: [
          { label: '스노우 250g', priceModifier: 0 },
          { label: '랑데뷰 240g', priceModifier: 1500 },
          { label: '아르떼 230g', priceModifier: 1500 },
          { label: '띤또레또 250g', priceModifier: 2500 },
        ]
      },
      {
        name: '인쇄 도수',
        type: 'radio',
        values: [
          { label: '단면 칼라', priceModifier: 0 },
          { label: '양면 칼라', priceModifier: 2000 },
        ]
      }
    ],
    features: ['고급 수입지 사용', '선명한 색상 표현', '다양한 사이즈'],
    leadTime: '3~4 영업일',
    badges: ['수입지 4종~', '양면 인쇄', '파일 업로드'],
    warnings: [
      '어두운 배경색은 재단 시 터짐 현상 발생 가능',
      '수입지는 종이 결에 따라 인쇄 느낌이 다를 수 있음'
    ]
  },
  {
    id: 'bc-standard',
    name: '일반 명함',
    category: 'paper',
    subCategory: '일반 명함',
    tagline: '좋은 퀄리티로 빠르게 제작할 수 있어요.',
    description: '가장 대중적인 90x50 규격은 물론, 원하는 규격으로도 제작이 가능해 명함 이외 다용도로 활용이 가능합니다.',
    image: 'https://picsum.photos/seed/bc-standard/800/800',
    minQuantity: 100,
    basePrice: 7000,
    options: [
      {
        name: '용지',
        type: 'select',
        values: [
          { label: '아트지', priceModifier: 0 },
          { label: '스노우', priceModifier: 0 },
          { label: '얼스팩', priceModifier: 1000 },
          { label: '반누보', priceModifier: 2000 },
        ]
      },
      {
        name: '용지/g수',
        type: 'select',
        values: [
          { label: '250g', priceModifier: 0 },
          { label: '300g', priceModifier: 1000 },
        ]
      },
      {
        name: '인쇄도수',
        type: 'radio',
        values: [
          { label: '단면', priceModifier: 0 },
          { label: '양면', priceModifier: 2000 },
        ]
      },
      {
        name: '규격(mm)',
        type: 'select',
        values: [
          { label: '90x50 (표준)', priceModifier: 0 },
          { label: '85x55 (신용카드형)', priceModifier: 0 },
          { label: '직접입력', priceModifier: 0 },
        ]
      },
      {
        name: '후가공',
        type: 'select',
        values: [
          { label: '없음', priceModifier: 0 },
          { label: '코팅', priceModifier: 1000 },
          { label: '귀돌이', priceModifier: 1500 },
          { label: '타공', priceModifier: 1000 },
          { label: '매직잉크', priceModifier: 5000 },
        ]
      }
    ],
    features: ['1장부터 제작 가능', '다양한 용지 선택', '정밀 재단'],
    leadTime: '1~2 영업일',
    badges: ['재질 4종~', '후가공 선택', '빠른 제작'],
    warnings: [
      '재단 공정상 1~2mm 밀림 현상이 있을 수 있습니다.',
      '모니터 해상도에 따라 실제 제품과 색상 차이가 있을 수 있습니다.',
      '명함 케이스는 기본 제공되지 않습니다.'
    ]
  },
  {
    id: 'bc-premium',
    name: '프리미엄 명함',
    category: 'paper',
    subCategory: '프리미엄 명함',
    tagline: '특별한 가공으로 품격을 더하세요.',
    description: '박, 형압, 엠보싱 등 다양한 후가공을 통해 차별화된 명함을 제작합니다.',
    image: 'https://picsum.photos/seed/bc-premium/800/800',
    minQuantity: 100,
    basePrice: 15700,
    options: [
      {
        name: '가공 종류',
        type: 'select',
        values: [
          { label: '박/형압', priceModifier: 0 },
          { label: '엠보싱<스코딕스>', priceModifier: 11800 },
          { label: '레이저커팅', priceModifier: 13500 },
        ]
      },
      {
        name: '용지',
        type: 'select',
        values: [
          { label: '고급지', priceModifier: 0 },
          { label: '수입지', priceModifier: 2000 },
        ]
      }
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
    category: 'paper',
    subCategory: '접지 명함',
    tagline: '더 많은 정보를 담을 수 있는 접지형.',
    description: '2단, 3단 접지로 명함 이상의 정보를 전달하기에 적합합니다.',
    image: 'https://picsum.photos/seed/bc-folded/800/800',
    minQuantity: 100,
    basePrice: 14700,
    options: [
      {
        name: '접지 방식',
        type: 'radio',
        values: [
          { label: '2단 접지', priceModifier: 0 },
          { label: '3단 접지', priceModifier: 5000 },
        ]
      }
    ],
    features: ['넓은 수납 공간', '다양한 레이아웃', '쿠폰/안내문 활용'],
    leadTime: '3~4 영업일',
    warnings: [
      '접는 선(오시) 부분의 인쇄 터짐이 발생할 수 있습니다.',
      '정확한 데이터 작업이 필요합니다.'
    ]
  },
  {
    id: 'bc-template',
    name: '디자인 템플릿 명함',
    category: 'paper',
    subCategory: '디자인 템플릿 명함',
    tagline: '디자인 고민 없이 빠르게 제작하세요.',
    description: '전문 디자이너가 제작한 다양한 템플릿을 활용해 쉽고 빠르게 명함을 완성할 수 있습니다.',
    image: 'https://picsum.photos/seed/bc-template/800/800',
    minQuantity: 100,
    basePrice: 9900,
    options: [
      {
        name: '템플릿 선택',
        type: 'select',
        values: [
          { label: '심플 비즈니스', priceModifier: 0 },
          { label: '모던 미니멀', priceModifier: 0 },
          { label: '크리에이티브', priceModifier: 2000 },
          { label: '럭셔리 골드', priceModifier: 5000 },
        ]
      },
      {
        name: '용지',
        type: 'select',
        values: [
          { label: '반누보 250g', priceModifier: 0 },
          { label: '랑데뷰 240g', priceModifier: 500 },
          { label: '스타드림 240g', priceModifier: 1500 },
        ]
      }
    ],
    features: ['다양한 디자인 템플릿', '간편한 편집', '고품질 인쇄'],
    leadTime: '1~2 영업일',
    warnings: [
      '템플릿 디자인은 수정이 제한될 수 있습니다.',
      '오타 교정은 직접 확인해 주셔야 합니다.'
    ]
  },
  {
    id: 'paper-photocard',
    name: '포토카드',
    category: 'paper',
    subCategory: '포토카드',
    tagline: '한 손에 쏙 들어오는 나만의 굿즈.',
    description: '아이돌 굿즈, 명함, 쿠폰 등 다용도로 활용 가능한 포토카드입니다.',
    image: 'https://picsum.photos/seed/photocard/800/800',
    minQuantity: 24,
    basePrice: 12000,
    options: [
      {
        name: '코팅 선택',
        type: 'select',
        values: [
          { label: '유광 코팅', priceModifier: 0 },
          { label: '무광 코팅', priceModifier: 0 },
          { label: '홀로그램 코팅', priceModifier: 5000 },
          { label: '별무늬 코팅', priceModifier: 5000 },
        ]
      },
      {
        name: '귀도리(라운드)',
        type: 'radio',
        values: [
          { label: '있음 (기본)', priceModifier: 0 },
          { label: '없음', priceModifier: 0 },
        ]
      }
    ],
    features: ['표준 규격 55x85mm', '양면 칼라 기본', '고급 코팅 마감'],
    leadTime: '4~5 영업일',
    warnings: [
      '코팅 종류에 따라 색감이 다르게 보일 수 있음',
      '재단 공정상 1~2mm 밀림 현상 발생 가능'
    ]
  },
  {
    id: 'pkg-box',
    name: '커스텀 단상자',
    category: 'package',
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
    warnings: [
      '박스 형태에 따라 칼선 제작 비용이 발생할 수 있습니다.',
      '인쇄 터짐 방지를 위해 코팅을 권장합니다.'
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
    id: 'sticker-transparent',
    name: '투명 스티커',
    category: 'sticker',
    subCategory: '투명스티커',
    tagline: '배경이 비치는 투명한 재질로 깔끔한 느낌',
    description: '투명한 PET 재질에 인쇄하여 부착 면의 색상이 비치는 스티커입니다. 화이트 인쇄를 추가하여 선명도를 높일 수 있습니다.',
    image: 'https://picsum.photos/seed/transparent/800/800',
    minQuantity: 10,
    basePrice: 4500,
    options: [
      {
        name: '모양',
        type: 'select',
        values: [{ label: '원형' }, { label: '사각' }, { label: '자유형', priceModifier: 500 }]
      },
      {
        name: '화이트 인쇄',
        type: 'radio',
        values: [{ label: '없음' }, { label: '부분 화이트', priceModifier: 1000 }, { label: '전체 화이트', priceModifier: 1500 }]
      }
    ],
    features: ['방수 기능', '투명 PET 재질', '화이트 인쇄 가능'],
    leadTime: '3-4일',
    badges: ['방수', '투명', '화이트인쇄']
  },
  {
    id: 'sticker-hologram',
    name: '홀로그램 스티커',
    category: 'sticker',
    subCategory: '자유형',
    tagline: '각도에 따라 무지개 빛으로 빛나는 특별함',
    description: '빛의 각도에 따라 다채로운 색상으로 빛나는 홀로그램 원단을 사용하여 시선을 사로잡는 스티커를 제작합니다.',
    image: 'https://picsum.photos/seed/hologram/800/800',
    minQuantity: 10,
    basePrice: 6500,
    options: [
      {
        name: '원단 선택',
        type: 'select',
        values: [{ label: '일반 홀로그램' }, { label: '샌드 홀로그램', priceModifier: 500 }, { label: '스타 홀로그램', priceModifier: 800 }]
      }
    ],
    features: ['무지개빛 반사', '강한 점착력', '커스텀 칼선'],
    leadTime: '4-5일',
    badges: ['홀로그램', '시선강탈', '특수원단']
  },
  {
    id: 'paper-postcard-premium',
    name: '감성 엽서',
    category: 'paper',
    subCategory: '엽서',
    tagline: '두툼한 고급지로 전하는 따뜻한 메시지',
    description: '다양한 질감의 고급 수입지를 사용하여 소장 가치가 높은 엽서를 제작합니다. 전시회 굿즈나 홍보용으로 추천합니다.',
    image: 'https://picsum.photos/seed/postcard/800/800',
    minQuantity: 10,
    basePrice: 8000,
    options: [
      {
        name: '용지 선택',
        type: 'select',
        values: [{ label: '랑데뷰 240g' }, { label: '반누보 250g', priceModifier: 500 }, { label: '띤또레또 300g', priceModifier: 1000 }]
      },
      {
        name: '코팅',
        type: 'radio',
        values: [{ label: '없음' }, { label: '무광 코팅', priceModifier: 300 }, { label: '유광 코팅', priceModifier: 300 }]
      }
    ],
    features: ['고급 수입지', '선명한 색감', '소량 제작 가능'],
    leadTime: '2-3일',
    badges: ['고급지', '색감깡패', '10매부터']
  },
  {
    id: 'paper-photocard-premium',
    name: '양면 포토카드',
    category: 'paper',
    subCategory: '포토카드',
    tagline: '아이돌 굿즈부터 비즈니스 카드까지',
    description: '표준 포토카드 사이즈(55x85mm)로 제작되는 고품질 카드입니다. 귀도리(라운드) 처리가 기본으로 포함됩니다.',
    image: 'https://picsum.photos/seed/photocard/800/800',
    minQuantity: 8,
    basePrice: 5000,
    options: [
      {
        name: '코팅 선택',
        type: 'select',
        values: [{ label: '유광 코팅' }, { label: '무광 코팅' }, { label: '홀로그램 코팅', priceModifier: 1500 }]
      }
    ],
    features: ['라운드 처리 기본', '양면 인쇄', '고급 아트지'],
    leadTime: '3-4일',
    badges: ['굿즈필수', '라운드기본', '양면인쇄']
  },
  {
    id: 'goods-stand',
    name: '아크릴 스탠드',
    category: 'goods',
    subCategory: '아크릴 스탠드',
    tagline: '나만의 캐릭터를 입체적으로 소장하세요',
    description: '고투명 아크릴을 사용하여 캐릭터나 로고를 입체적인 스탠드로 제작합니다. 받침대와 본체 세트로 구성됩니다.',
    image: 'https://picsum.photos/seed/stand/800/800',
    minQuantity: 1,
    basePrice: 12000,
    options: [
      {
        name: '사이즈',
        type: 'select',
        values: [{ label: '50x50mm' }, { label: '80x80mm', priceModifier: 3000 }, { label: '100x100mm', priceModifier: 5000 }]
      }
    ],
    features: ['고투명 아크릴', '정밀 배면 인쇄', '자유형 컷팅'],
    leadTime: '5-7일',
    badges: ['1개제작', '고투명', '입체굿즈']
  },
  {
    id: 'package-label',
    name: '롤 라벨 스티커',
    category: 'package',
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
        values: [{ label: '아트지' }, { label: '유포지(방수)', priceModifier: 5000 }, { label: '은광무지', priceModifier: 8000 }]
      }
    ],
    features: ['대량 제작 최적화', '롤 형태 공급', '다양한 재질'],
    leadTime: '7-10일',
    badges: ['대량특화', '자동부착용', '가성비']
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
    subCategory: '자유형',
    material: '유포지',
    finishing: '무광 코팅',
    image: 'https://picsum.photos/seed/port1/800/1000',
    description: '귀여운 캐릭터 라인을 살린 자유형 스티커입니다. 방수가 되는 유포지에 무광 코팅을 더해 고급스럽습니다.'
  },
  {
    id: 'p2',
    title: '카페 로고 사각형 스티커',
    category: 'sticker',
    subCategory: '사각형',
    material: '아트지',
    finishing: '유광 코팅',
    image: 'https://picsum.photos/seed/port2/800/1000',
    description: '카페 패키지용으로 제작된 사각형 스티커입니다. 유광 코팅으로 색감이 선명하게 표현되었습니다.'
  },
  {
    id: 'p3',
    title: '전시회 작품 엽서 세트',
    category: 'paper',
    subCategory: '엽서',
    material: '랑데뷰 240g',
    finishing: '없음',
    image: 'https://picsum.photos/seed/port3/800/1000',
    description: '작가의 작품을 담은 엽서 세트입니다. 종이 본연의 질감을 살리기 위해 코팅 없이 제작되었습니다.'
  },
  {
    id: 'p4',
    title: '홀로그램 아크릴 키링',
    category: 'goods',
    subCategory: '아크릴 키링',
    material: '홀로그램 아크릴',
    finishing: 'D자 고리',
    image: 'https://picsum.photos/seed/port4/800/1000',
    description: '빛의 각도에 따라 영롱하게 빛나는 홀로그램 아크릴 키링입니다.'
  },
  {
    id: 'p5',
    title: '프리미엄 코스메틱 박스',
    category: 'package',
    subCategory: '박스/슬리브',
    material: '아이보리 350g',
    finishing: '무광 라미네이팅 + 금박',
    image: 'https://picsum.photos/seed/port5/800/1000',
    description: '화장품 패키지용으로 제작된 단상자입니다. 금박 후가공으로 프리미엄한 느낌을 주었습니다.'
  }
];
