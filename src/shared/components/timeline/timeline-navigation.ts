import type {
  TimelineCursor,
  TimelineGroup,
  TimelineNavigation,
  TimelineRow,
} from './timeline.types.ts';

const timelineKeys = new Set([
  'ArrowLeft',
  'ArrowRight',
  'ArrowUp',
  'ArrowDown',
  'Enter',
  ' ',
]);

export const isTimelineKey = (key: string) => timelineKeys.has(key);

const getGroupLabel = <Item>(group: TimelineGroup<Item>) =>
  typeof group.label === 'string' ? group.label : group.id;

const getEventCountLabel = (count: number) =>
  `${count} ${count === 1 ? 'event' : 'events'}`;

export const getTimelineNavigation = <Item>(
  groups: readonly TimelineGroup<Item>[],
  cursor: TimelineCursor,
  expandedGroupId: string | null,
  key: string,
): TimelineNavigation | null => {
  const groupIndex = groups.findIndex((group) => group.id === cursor.groupId);
  const group = groups[groupIndex];

  if (!group) return null;

  if (key === 'ArrowLeft' || key === 'ArrowRight') {
    const nextGroup = groups[groupIndex + (key === 'ArrowLeft' ? -1 : 1)];

    if (!nextGroup) return null;

    return {
      cursor: { groupId: nextGroup.id, itemIndex: null },
      expandedGroupId: nextGroup.id,
    };
  }

  if (key === 'ArrowDown') {
    if (group.items.length === 0) return null;

    const nextItemIndex = cursor.itemIndex === null ? 0 : cursor.itemIndex + 1;

    if (nextItemIndex >= group.items.length) return null;

    return {
      cursor: { groupId: group.id, itemIndex: nextItemIndex },
      expandedGroupId: group.id,
    };
  }

  if (key === 'ArrowUp') {
    if (cursor.itemIndex === null || cursor.itemIndex === 0) {
      if (cursor.itemIndex === null) return null;

      return {
        cursor: { groupId: group.id, itemIndex: null },
        expandedGroupId,
      };
    }

    return {
      cursor: { groupId: group.id, itemIndex: cursor.itemIndex - 1 },
      expandedGroupId,
    };
  }

  if (key === 'Enter' || key === ' ') {
    return {
      cursor: { groupId: group.id, itemIndex: null },
      expandedGroupId: expandedGroupId === group.id ? null : group.id,
    };
  }

  return null;
};

export const getTimelineAnnouncement = <Item>(
  groups: readonly TimelineGroup<Item>[],
  cursor: TimelineCursor,
  expandedGroupId: string | null,
  getItemLabel: (item: Item) => string,
) => {
  const group = groups.find((item) => item.id === cursor.groupId);

  if (!group) return '';

  const label = getGroupLabel(group);
  const countLabel = getEventCountLabel(group.items.length);
  const isExpanded = expandedGroupId === group.id;

  if (cursor.itemIndex === null) {
    return `${label}, ${countLabel}, ${isExpanded ? 'expanded' : 'collapsed'}`;
  }

  const item = group.items[cursor.itemIndex];

  if (!item) return `${label}, ${countLabel}`;

  return `${label}, event ${cursor.itemIndex + 1} of ${group.items.length}, ${getItemLabel(item)}`;
};

export const findTimelineCursorIndex = <Item>(
  rows: readonly TimelineRow<Item>[],
  cursor: TimelineCursor,
) => {
  const headerIndex = rows.findIndex(
    (row) => row.type === 'group' && row.group.id === cursor.groupId,
  );

  if (headerIndex < 0 || cursor.itemIndex === null) return headerIndex;

  return headerIndex + 1 + cursor.itemIndex;
};

export const resolveTimelineCursor = <Item>(
  groups: readonly TimelineGroup<Item>[],
  cursor: TimelineCursor | null,
  expandedGroupId: string | null,
): TimelineCursor | null => {
  const fallback = groups[0];

  if (!fallback) return null;

  const selected =
    cursor && groups.some((group) => group.id === cursor.groupId)
      ? cursor
      : { groupId: fallback.id, itemIndex: null };

  if (selected.itemIndex === null || expandedGroupId !== selected.groupId) {
    return { groupId: selected.groupId, itemIndex: null };
  }

  const group = groups.find((item) => item.id === selected.groupId);

  if (!group || selected.itemIndex >= group.items.length) {
    return { groupId: selected.groupId, itemIndex: null };
  }

  return selected;
};
