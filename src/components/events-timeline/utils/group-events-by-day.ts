import type { TimelineGroup } from '../../../shared/components/timeline';
import { formatLocalDate } from '../../../shared/utils/format-local-date.ts';
import type { EventRecord } from '../../../worker/protocol.ts';

const dateFormatter = new Intl.DateTimeFormat('en', {
  dateStyle: 'full',
});

type MutableTimelineGroup = {
  id: string;
  label: string;
  items: EventRecord[];
};

const dayTimestamp = (dayId: string) => {
  const [year, month, day] = dayId.split('-').map(Number);

  return new Date(year, month - 1, day).getTime();
};

const previousDayId = (dayId: string) => {
  const date = new Date(dayTimestamp(dayId));

  date.setDate(date.getDate() - 1);

  return formatLocalDate(date.getTime());
};

const createGroup = (
  dayId: string,
  items: EventRecord[],
): MutableTimelineGroup => ({
  id: dayId,
  label: dateFormatter.format(dayTimestamp(dayId)),
  items,
});

export const groupEventsByDay = (
  events: readonly EventRecord[],
): readonly TimelineGroup<EventRecord>[] => {
  const groups: MutableTimelineGroup[] = [];
  let previousEventDayId: string | undefined;

  events.forEach((event) => {
    const dayId = formatLocalDate(event.occurredAt);
    const currentGroup = groups.at(-1);

    if (currentGroup?.id === dayId) {
      currentGroup.items.push(event);
      return;
    }

    if (previousEventDayId) {
      const missingDayId = previousDayId(previousEventDayId);

      if (previousDayId(missingDayId) === dayId) {
        groups.push(createGroup(missingDayId, []));
      }
    }

    groups.push(createGroup(dayId, [event]));
    previousEventDayId = dayId;
  });

  return groups;
};
