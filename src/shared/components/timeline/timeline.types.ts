import type { Key, ReactNode } from 'react';

export type TimelineGroup<Item> = {
  id: string;
  label: ReactNode;
  items: readonly Item[];
};

export type TimelineProps<Item> = {
  groups: readonly TimelineGroup<Item>[];
  getItemKey: (item: Item) => Key;
  renderItem: (item: Item) => ReactNode;
  renderOppositeContent?: (item: Item) => ReactNode;
  isLoading?: boolean;
  emptyMessage?: string;
  errorMessage?: string;
};

export type TimelineGroupRow<Item> = {
  type: 'group';
  key: string;
  group: TimelineGroup<Item>;
};

export type TimelineItemRow<Item> = {
  type: 'item';
  key: string;
  item: Item;
  isFirstInGroup: boolean;
  isLastInGroup: boolean;
};

export type TimelineRow<Item> = TimelineGroupRow<Item> | TimelineItemRow<Item>;
