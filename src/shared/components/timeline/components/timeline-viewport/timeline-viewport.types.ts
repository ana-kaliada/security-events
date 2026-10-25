import type { VirtualItem } from '@tanstack/react-virtual';
import type { KeyboardEvent, ReactNode, RefObject } from 'react';

export type TimelineViewportProps = {
  items: readonly VirtualItem[];
  activeIndex: number;
  announcement: string;
  measureElement: (element: Element | null) => void;
  totalSize: number;
  viewportRef: RefObject<HTMLDivElement | null>;
  onKeyDown: (event: KeyboardEvent<HTMLDivElement>) => void;
  onFocus: () => void;
  children: (item: VirtualItem) => ReactNode;
};
