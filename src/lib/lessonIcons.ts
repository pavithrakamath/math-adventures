import type { LucideIcon } from 'lucide-react';
import {
  Calculator,
  DivideCircle,
  Baseline,
  Percent,
  Scaling,
  GitCompareArrows,
  Shapes,
  ScanLine,
  Play,
  Presentation,
  Gem,
  Square,
  Construction,
  FlipHorizontal,
  Binary,
  PenTool,
  Puzzle,
  Ruler,
} from 'lucide-react';

const icons: Record<string, LucideIcon> = {
  'equations': Calculator,
  'fractions': DivideCircle,
  'decimals': Baseline,
  'percentages': Percent,
  'ratios': Scaling,
  'unit-conversions': GitCompareArrows,
  'patterns-mathematics': Shapes,
  'lines-and-angles': ScanLine,
  'playing-with-numbers': Play,
  'data-handling': Presentation,
  'prime-and-composite-numbers': Gem,
  'mensuration': Ruler,
  'playing-with-constructions': Construction,
  'symmetry': FlipHorizontal,
  'the-other-side-of-zero': Binary,
  'basic-geometrical-ideas': PenTool,
  'understanding-elementary-shapes': Puzzle,
  'prime-time': Gem,
  'number-play': Play,
  'integers': Binary,
  'perimeter-area': Ruler,
  'patterns-in-mathematics': Shapes,
  'lines-angles': ScanLine,
  'data-handling': Presentation,
  'fractions': DivideCircle,
  'symmetry': FlipHorizontal,
};

export function getIconForLesson(lessonId: string): LucideIcon {
  return icons[lessonId] || Calculator;
}
