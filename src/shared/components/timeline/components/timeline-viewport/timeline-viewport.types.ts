import type { VirtualItem } from '@tanstack/react-virtual';
import type { KeyboardEvent, PointerEvent, ReactNode, RefObject } from 'react';

export type TimelineViewportProps = {
  items: readonly VirtualItem[];
  activeIndex: number;
  announcement: string;
  measureElement: (element: Element | null) => void;
  totalSize: number;
  keyboardFocus: boolean;
  viewportRef: RefObject<HTMLDivElement | null>;
  onKeyDown: (event: KeyboardEvent<HTMLDivElement>) => void;
  onFocus: () => void;
  onBlur: () => void;
  onPointerDown: (event: PointerEvent<HTMLDivElement>) => void;
  children: (item: VirtualItem) => ReactNode;
};
