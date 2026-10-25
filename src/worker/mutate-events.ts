import type { EventInput, EventRecord } from './protocol.ts';

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
