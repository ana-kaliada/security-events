import type { ReactNode } from 'react';

export type TimelineRowProps<Item> = {
  item: Item;
  isFirstInGroup: boolean;
  isLastInGroup: boolean;
  renderItem: (item: Item) => ReactNode;
  renderOppositeContent?: (item: Item) => ReactNode;
};
