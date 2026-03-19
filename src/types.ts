export interface Product {
  id: string;
  name: string;
  category: string;
  tagline: string;
  description: string;
  image: string;
  minQuantity: number;
  basePrice: number;
  options: {
    name: string;
    type: 'select' | 'radio' | 'number';
    values: { label: string; priceModifier?: number }[];
  }[];
  features: string[];
  leadTime: string;
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
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
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
  { id: 'sticker', name: '스티커', icon: 'StickyNote', description: '소량 제작부터 다양한 재질과 후가공까지 주문할 수 있습니다.' },
  { id: 'paper', name: '지류', icon: 'FileText', description: '감성을 담은 지류 굿즈, 고해상도 인쇄로 선명하게 제작하세요.' },
  { id: 'package', name: '패키지', icon: 'Box', description: '브랜드의 가치를 높이는 맞춤형 패키지 솔루션.' },
  { id: 'goods', name: '굿즈', icon: 'Gift', description: '나만의 캐릭터가 살아나는 투명하고 영롱한 아크릴 아이템.' },
  { id: 'custom', name: '커스텀문의', icon: 'MessageSquare', description: '규격 외 제작이나 대량 주문은 별도로 상담해 드립니다.' },
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
    id: '1',
    name: '자유형 스티커',
    category: 'sticker',
    tagline: '원하는 모양대로 자유롭게 컷팅',
    description: '개성 있는 나만의 디자인을 칼선 그대로 살려 제작합니다. 노트북, 다이어리 어디든 찰떡궁합!',
    image: 'https://picsum.photos/seed/sticker1/600/600',
    minQuantity: 1,
    basePrice: 1500,
    features: ['소량 제작 가능', '방수 선택 가능', '자유 칼선', '개별 커팅'],
    leadTime: '제작 2~3일 소요',
    options: [
      { 
        name: '용지', 
        type: 'select',
        values: [
          { label: '아트지', priceModifier: 0 },
          { label: '유포지(방수)', priceModifier: 500 },
          { label: '투명지', priceModifier: 800 },
          { label: '모조지', priceModifier: 200 }
        ] 
      },
      { 
        name: '코팅', 
        type: 'select',
        values: [
          { label: '무광', priceModifier: 0 },
          { label: '유광', priceModifier: 0 },
          { label: '코팅없음', priceModifier: -100 }
        ] 
      },
      { 
        name: '사이즈', 
        type: 'select',
        values: [
          { label: '50x50mm 이내', priceModifier: 0 },
          { label: '100x100mm 이내', priceModifier: 1000 },
          { label: '직접입력', priceModifier: 2000 }
        ] 
      },
    ],
  },
  {
    id: '2',
    name: '표준 명함',
    category: 'paper',
    tagline: '비즈니스의 첫인상, 깔끔한 정석',
    description: '가장 신뢰감 있는 표준 규격과 고급 용지로 제작하는 명함입니다.',
    image: 'https://picsum.photos/seed/card1/600/600',
    minQuantity: 100,
    basePrice: 5000,
    features: ['고급지 사용', '표준 규격', '양면 인쇄', '빠른 제작'],
    leadTime: '제작 1~2일 소요',
    options: [
      { 
        name: '용지', 
        type: 'select',
        values: [
          { label: '반누보', priceModifier: 0 },
          { label: '랑데뷰', priceModifier: 500 },
          { label: '스노우 화이트', priceModifier: -500 }
        ] 
      },
      { 
        name: '후가공', 
        type: 'select',
        values: [
          { label: '귀도리(라운딩)', priceModifier: 1000 },
          { label: '금박', priceModifier: 3000 },
          { label: '은박', priceModifier: 3000 },
          { label: '없음', priceModifier: 0 }
        ] 
      },
    ],
  },
  {
    id: '3',
    name: '아크릴 키링',
    category: 'goods',
    tagline: '영롱함의 끝판왕, 최애 굿즈',
    description: '투명한 아크릴 속에 내 디자인이 쏙! 견고하고 선명한 인쇄 퀄리티를 보장합니다.',
    image: 'https://picsum.photos/seed/acrylic1/600/600',
    minQuantity: 1,
    basePrice: 3500,
    features: ['1개 제작 가능', '양면 인쇄', '고투명 아크릴', '다양한 부자재'],
    leadTime: '제작 4~5일 소요',
    options: [
      { 
        name: '아크릴', 
        type: 'select',
        values: [
          { label: '투명', priceModifier: 0 },
          { label: '반투명', priceModifier: 500 },
          { label: '글리터', priceModifier: 1000 }
        ] 
      },
      { 
        name: '부자재', 
        type: 'select',
        values: [
          { label: '군번줄(실버)', priceModifier: 0 },
          { label: 'D링(골드)', priceModifier: 500 },
          { label: '자물쇠형', priceModifier: 800 }
        ] 
      },
    ],
  },
  {
    id: '4',
    name: '커스텀 패키지 박스',
    category: 'package',
    tagline: '브랜드의 가치를 완성하는 마지막 조각',
    description: '제품의 크기와 특성에 맞는 맞춤형 박스를 제작합니다. 소량 샘플 제작부터 대량 생산까지 가능합니다.',
    image: 'https://picsum.photos/seed/box1/600/600',
    minQuantity: 50,
    basePrice: 12000,
    features: ['맞춤 사이즈', '다양한 지질', '고급 인쇄', '샘플 제작 가능'],
    leadTime: '제작 7~10일 소요',
    options: [
      { 
        name: '형태', 
        type: 'select',
        values: [
          { label: '단상자', priceModifier: 0 },
          { label: 'G형 박스', priceModifier: 2000 },
          { label: '싸바리 박스', priceModifier: 5000 }
        ] 
      },
      { 
        name: '코팅', 
        type: 'select',
        values: [
          { label: '무광 라미네이팅', priceModifier: 0 },
          { label: '유광 라미네이팅', priceModifier: 0 },
          { label: 'CR 코팅', priceModifier: -500 }
        ] 
      },
    ],
  },
];

export const MAIN_FAQ: FAQItem[] = [
  { question: '1개부터 제작 가능한가요?', answer: '네, 스티커와 아크릴 키링 등 대부분의 굿즈는 1개(또는 1장)부터 소량 제작이 가능합니다.' },
  { question: '디자인 파일이 없어도 주문 가능한가요?', answer: '기본적으로 인쇄용 파일이 필요하지만, 간단한 텍스트나 이미지는 편집 서비스를 통해 도와드릴 수 있습니다. 별도 문의 부탁드립니다.' },
  { question: '화면과 실제 인쇄 색상이 다를 수 있나요?', answer: '모니터(RGB)와 인쇄물(CMYK)의 색상 표현 방식이 달라 미세한 차이가 발생할 수 있습니다. CMYK 모드 작업을 권장합니다.' },
  { question: '제작 기간은 얼마나 걸리나요?', answer: '상품별로 상이하며 보통 영업일 기준 2~5일 정도 소요됩니다. 후가공이 추가될 경우 기간이 늘어날 수 있습니다.' },
];
