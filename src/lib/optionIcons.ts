import { 
  Palette, Circle, Book, BookMarked, Notebook, FileText, 
  RectangleVertical, RectangleHorizontal, // 규격용
  ArrowDownToLine, ArrowRightToLine, // 제본 방향용
  Shield, BookOpen, Droplets, Sparkles, ArrowLeft, ArrowUp,
  Type, Stamp, Square, Minus, Sun
} from 'lucide-react';

export const getIconForOption = (optionName: string, optionValue: string) => {
  // 1. 컬러/흑백 개선
  if (optionName.includes('색상') || optionName.includes('인쇄')) {
    if (optionValue === '컬러') return Palette;
    if (optionValue === '흑백') return Circle;
  }
  
  // 2. 제본 방식
  if (optionName.includes('제본')) {
    if (optionValue.includes('무선')) return Book;
    if (optionValue.includes('중철')) return BookMarked;
    if (optionValue.includes('트윈링') || optionValue.includes('스프링')) return Notebook;
    if (optionValue.includes('실제본')) return FileText;
  }

  // 3. 규격 (사이즈)
  if (optionName === '규격') {
    if (optionValue.includes('가로')) return RectangleHorizontal;
    return RectangleVertical;
  }

  // 4. 제본 방향
  if (optionName === '제본 방향') {
    if (optionValue === '세로형') return ArrowDownToLine;
    if (optionValue === '가로형') return ArrowRightToLine;
  }

  // 5. 표지 구성 (노트용)
  if (optionName === '표지 구성') {
    if (optionValue.includes('하드커버') || optionValue.includes('두꺼운')) return Shield;
    if (optionValue.includes('소프트커버') || optionValue.includes('기본')) return BookOpen;
  }

  // 6. 표지 코팅
  if (optionName === '표지 코팅') {
    if (optionValue.includes('무광')) return Minus;
    if (optionValue.includes('유광')) return Sparkles;
  }

  // 7. 스프링 방향
  if (optionName === '스프링 방향') {
    if (optionValue.includes('좌철')) return ArrowLeft;
    if (optionValue.includes('상철')) return ArrowUp;
  }

  // 8. 커버 인쇄 (레더노트용)
  if (optionName === '커버 인쇄') {
    if (optionValue.includes('불박')) return Stamp;
    if (optionValue.includes('박')) return Sparkles;
    if (optionValue.includes('없음')) return Minus;
    return Type;
  }

  // 9. 엣지 마감
  if (optionName === '엣지 마감') {
    if (optionValue.includes('박')) return Sparkles;
    return Square;
  }
  
  return null;
};
