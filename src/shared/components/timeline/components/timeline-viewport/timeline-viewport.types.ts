import type { VirtualItem } from '@tanstack/react-virtual';
import type { ReactNode, RefObject } from 'react';

export type TimelineViewportProps = {
  items: readonly VirtualItem[];
  measureElement: (element: Element | null) => void;
  totalSize: number;
  viewportRef: RefObject<HTMLDivElement | null>;
  children: (item: VirtualItem) => ReactNode;
};
