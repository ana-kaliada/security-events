import { useVirtualizer } from '@tanstack/react-virtual';
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { TimelineGroup } from './components/timeline-group/timeline-group.tsx';
import { TimelineMessage } from './components/timeline-message/timeline-message.tsx';
import { TimelineRow } from './components/timeline-row/timeline-row.tsx';
import { TimelineViewport } from './components/timeline-viewport/timeline-viewport.tsx';
import { createTimelineRows } from './timeline-create-rows.ts';
import type { TimelineProps } from './timeline.types.ts';

const GROUP_HEADER_HEIGHT = 64;
const ITEM_HEIGHT = 72;

export const Timeline = <Item,>({
  groups,
  getItemKey,
  renderItem,
  renderOppositeContent,
  isLoading = false,
  emptyMessage = 'No timeline events',
  errorMessage,
}: TimelineProps<Item>) => {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [expandedGroupId, setExpandedGroupId] = useState<string | null>(null);
  const rows = useMemo(
    () => createTimelineRows(groups, getItemKey, expandedGroupId),
    [expandedGroupId, getItemKey, groups],
  );

  const handleGroupOpenChange = useCallback((groupId: string, isOpen: boolean) => {
    setExpandedGroupId((current) => {
      if (isOpen) {
        return groupId;
      }

      return current === groupId ? null : current;
    });
  }, []);

  // TanStack Virtual intentionally exposes mutable measurement methods.
  // eslint-disable-next-line react-hooks/incompatible-library
  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => viewportRef.current,
    estimateSize: (index) =>
      rows[index]?.type === 'group' ? GROUP_HEADER_HEIGHT : ITEM_HEIGHT,
    getItemKey: (index) => rows[index]?.key ?? index,
    overscan: 8,
  });

  useLayoutEffect(() => {
    if (!expandedGroupId) return;

    const index = rows.findIndex(
      (row) => row.type === 'group' && row.group.id === expandedGroupId,
    );

    if (index >= 0) {
      virtualizer.scrollToIndex(index, { align: 'start' });
    }
  }, [expandedGroupId, rows, virtualizer]);

  if (isLoading || errorMessage || groups.length === 0) {
    return (
      <TimelineMessage
        isLoading={isLoading}
        emptyMessage={emptyMessage}
        errorMessage={errorMessage}
      />
    );
  }

  return (
    <TimelineViewport
      items={virtualizer.getVirtualItems()}
      measureElement={virtualizer.measureElement}
      totalSize={virtualizer.getTotalSize()}
      viewportRef={viewportRef}
    >
      {(virtualRow) => {
        const row = rows[virtualRow.index];

        if (!row) {
          return null;
        }

        if (row.type === 'group') {
          return (
            <TimelineGroup
              isOpen={row.group.id === expandedGroupId}
              itemCount={row.group.items.length}
              label={row.group.label}
              onOpenChange={(nextOpen) =>
                handleGroupOpenChange(row.group.id, nextOpen)
              }
            />
          );
        }

        return (
          <TimelineRow
            isFirstInGroup={row.isFirstInGroup}
            isLastInGroup={row.isLastInGroup}
            item={row.item}
            renderItem={renderItem}
            renderOppositeContent={renderOppositeContent}
          />
        );
      }}
    </TimelineViewport>
  );
};
