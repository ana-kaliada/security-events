import type { EventInput, EventRecord } from './protocol.ts';

const removeEvent = (events: EventRecord[], id: string) => {
  const remaining = events.filter((event) => event.id !== id);

  events.length = 0;
  remaining.forEach((event) => events.push(event));
};

export const createEventRecord = (
  records: EventRecord[],
  timelineRecords: EventRecord[],
  event: EventInput,
  id: string,
) => {
  const record: EventRecord = { id, ...event };

  records.push(record);
  timelineRecords.push(record);

  return record;
};

export const updateEventRecord = (
  records: EventRecord[],
  id: string,
  event: EventInput,
) => {
  const currentIndex = records.findIndex((item) => item.id === id);
  const record = records[currentIndex];

  Object.assign(record, event);

  return record;
};

export const deleteEventRecord = (
  records: EventRecord[],
  timelineRecords: EventRecord[],
  id: string,
) => {
  removeEvent(records, id);
  removeEvent(timelineRecords, id);

  return { id };
};
