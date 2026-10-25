import { useVirtualizer } from '@tanstack/react-virtual';
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { TimelineGroup } from './components/timeline-group/timeline-group.tsx';
import { TimelineMessage } from './components/timeline-message/timeline-message.tsx';
import { TimelineRow } from './components/timeline-row/timeline-row.tsx';
import { TimelineViewport } from './components/timeline-viewport/timeline-viewport.tsx';
import { createTimelineRows } from './timeline-create-rows.ts';
import {
  findTimelineCursorIndex,
  getTimelineAnnouncement,
  getTimelineNavigation,
  isTimelineKey,
  resolveTimelineCursor,
} from './timeline-navigation.ts';
import type { TimelineCursor, TimelineProps } from './timeline.types.ts';

const GROUP_HEADER_HEIGHT = 64;
const ITEM_HEIGHT = 72;

export const Timeline = <Item,>({
  groups,
  getItemKey,
  getItemLabel,
  renderItem,
  renderOppositeContent,
  isLoading = false,
  emptyMessage = 'No timeline events',
  errorMessage,
}: TimelineProps<Item>) => {
  const viewportRef = useRef<HTMLDivElement>(null);
  const previousExpandedGroupIdRef = useRef<string | null>(null);
  const skipFocusAnnouncementRef = useRef(false);
  const [cursor, setCursor] = useState<TimelineCursor | null>(null);
  const [expandedGroupId, setExpandedGroupId] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState('');
  const resolvedCursor = useMemo(
    () => resolveTimelineCursor(groups, cursor, expandedGroupId),
    [cursor, expandedGroupId, groups],
  );
  const rows = useMemo(
    () => createTimelineRows(groups, getItemKey, expandedGroupId),
    [expandedGroupId, getItemKey, groups],
  );
  const activeIndex = resolvedCursor
    ? findTimelineCursorIndex(rows, resolvedCursor)
    : -1;

  const announce = useCallback(
    (nextCursor: TimelineCursor, nextExpandedGroupId: string | null) => {
      setAnnouncement(
        getTimelineAnnouncement(
          groups,
          nextCursor,
          nextExpandedGroupId,
          getItemLabel,
        ),
      );
    },
    [getItemLabel, groups],
  );

  const handleGroupOpenChange = useCallback(
    (groupId: string, isOpen: boolean) => {
      const nextCursor = { groupId, itemIndex: null };
      const nextExpandedGroupId = isOpen ? groupId : null;

      setExpandedGroupId((current) => {
        if (isOpen) return groupId;

        return current === groupId ? null : current;
      });
      setCursor(nextCursor);

      if (viewportRef.current === document.activeElement) {
        announce(nextCursor, nextExpandedGroupId);
      }
    },
    [announce],
  );

  const handleGroupActivate = useCallback((groupId: string) => {
    skipFocusAnnouncementRef.current = true;
    setCursor({ groupId, itemIndex: null });
    viewportRef.current?.focus();
  }, []);

  const handleViewportFocus = useCallback(() => {
    if (skipFocusAnnouncementRef.current) {
      skipFocusAnnouncementRef.current = false;
      return;
    }

    if (!resolvedCursor) return;

    announce(resolvedCursor, expandedGroupId);
  }, [announce, expandedGroupId, resolvedCursor]);

  const handleViewportKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (!resolvedCursor || !isTimelineKey(event.key)) return;

      event.preventDefault();

      const navigation = getTimelineNavigation(
        groups,
        resolvedCursor,
        expandedGroupId,
        event.key,
      );

      if (!navigation) return;

      setCursor(navigation.cursor);
      setExpandedGroupId(navigation.expandedGroupId);
      announce(navigation.cursor, navigation.expandedGroupId);
    },
    [announce, expandedGroupId, groups, resolvedCursor],
  );

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
    if (activeIndex < 0) return;

    const previousExpandedGroupId = previousExpandedGroupIdRef.current;
    previousExpandedGroupIdRef.current = expandedGroupId;
    const row = rows[activeIndex];
    const openedGroupHeader =
      expandedGroupId !== null &&
      expandedGroupId !== previousExpandedGroupId &&
      row?.type === 'group' &&
      row.group.id === expandedGroupId;

    virtualizer.scrollToIndex(activeIndex, {
      align: openedGroupHeader ? 'start' : 'auto',
    });
  }, [activeIndex, expandedGroupId, rows, virtualizer]);

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
      activeIndex={activeIndex}
      announcement={announcement}
      items={virtualizer.getVirtualItems()}
      measureElement={virtualizer.measureElement}
      totalSize={virtualizer.getTotalSize()}
      viewportRef={viewportRef}
      onFocus={handleViewportFocus}
      onKeyDown={handleViewportKeyDown}
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
              onActivate={() => handleGroupActivate(row.group.id)}
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
