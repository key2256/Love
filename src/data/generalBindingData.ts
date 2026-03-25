import { BookOpen, BookText, FileText, Zap, Layers, Scissors, Palette } from 'lucide-react';

export const BINDING_TYPES = [
  {
    id: 'perfect',
    name: '무선제본',
    description: '일반 책 / 카탈로그 / 교재용',
    icon: BookOpen,
    pageRange: '50~500p',
    note: '가장 대중적인 제본 방식'
  },
  {
    id: 'saddle',
    name: '중철제본',
    description: '얇은 책자 / 브로셔용',
    icon: BookText,
    pageRange: '8~64p',
    note: '가볍고 펼침성이 좋음'
  },
  {
    id: 'spring',
    name: '트윈링/코일링',
    description: '교재 / 악보 / 자료집용',
    icon: Layers,
    pageRange: '20~300p',
    note: '360도 펼침 가능'
  },
  {
    id: 'sewn',
    name: '사철/누드사철',
    description: '완성도가 중요한 서적용',
    icon: Scissors,
    pageRange: '100~600p',
    note: '최고의 펼침성과 내구성'
  }
];

export const SIZES = [
  { label: 'A4', width: 210, height: 297 },
  { label: 'A5', width: 148, height: 210 },
  { label: 'B5', width: 182, height: 257 },
  { label: '직접입력', width: 0, height: 0 }
];

export const PRINT_OPTIONS = [
  { id: 'color', name: '컬러', icon: Palette },
  { id: 'bw', name: '흑백', icon: FileText }
];

// 가격표 데이터 (예시)
export const PRICE_TABLE = {
  basePrice: 5000,
  bindingModifiers: {
    perfect: 0,
    saddle: -1000,
    spring: 2000,
    sewn: 5000
  },
  colorModifier: 100
};
