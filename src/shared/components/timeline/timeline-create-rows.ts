import type { Key } from 'react';
import type {
  TimelineGroup,
  TimelineGroupRow,
  TimelineRow,
} from './timeline.types.ts';

export const createTimelineRows = <Item>(
  groups: readonly TimelineGroup<Item>[],
  getItemKey: (item: Item) => Key,
  expandedGroupId: string | null,
): TimelineRow<Item>[] =>
  groups.flatMap((group) => {
    const header: TimelineGroupRow<Item> = {
      type: 'group',
      key: `group:${group.id}`,
      group,
    };

    if (group.id !== expandedGroupId) {
      return [header];
    }

    return [
      header,
      ...group.items.map((item, itemIndex) => ({
        type: 'item' as const,
        key: `item:${String(getItemKey(item))}`,
        item,
        isFirstInGroup: itemIndex === 0,
        isLastInGroup: itemIndex === group.items.length - 1,
      })),
    ];
  });
