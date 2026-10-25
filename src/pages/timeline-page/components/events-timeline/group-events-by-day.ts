import type { TimelineGroup } from '../../../../shared/components/timeline';
import { formatLocalDate } from '../../../../shared/utils/format-local-date.ts';
import type { EventRecord } from '../../../../worker/protocol.ts';

const dateFormatter = new Intl.DateTimeFormat('en', {
  dateStyle: 'full',
});

type MutableTimelineGroup = {
  id: string;
  label: string;
  items: EventRecord[];
};

export const groupEventsByDay = (
  events: readonly EventRecord[],
): readonly TimelineGroup<EventRecord>[] => {
  const groups: MutableTimelineGroup[] = [];

  events.forEach((event) => {
    const dayId = formatLocalDate(event.occurredAt);
    const currentGroup = groups.at(-1);

    if (currentGroup?.id === dayId) {
      currentGroup.items.push(event);
      return;
    }

    groups.push({
      id: dayId,
      label: dateFormatter.format(event.occurredAt),
      items: [event],
    });
  });

  return groups;
};
