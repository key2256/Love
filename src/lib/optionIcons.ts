import { 
  Palette, Circle, Book, BookMarked, Notebook, FileText, 
  RectangleVertical, RectangleHorizontal, // 규격용
  ArrowDownToLine, ArrowRightToLine // 제본 방향용
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
  
  return null;
};
