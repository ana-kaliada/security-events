import type { EventRecord, WorkerRequest, WorkerResponse } from './protocol.ts';
import { generateEvents, TIMELINE_EVENT_COUNT } from './generate-events.ts';
import { getEvents } from './get-events.ts';
import {
  createEventRecord,
  deleteEventRecord,
  updateEventRecord,
} from './mutate-events.ts';

let records: EventRecord[];
let timelineRecords: EventRecord[];
let nextCustomEventNumber = 1;

const post = (message: WorkerResponse) => {
  self.postMessage(message);
};

const nextCustomEventId = () => {
  const id = `evt-custom-${nextCustomEventNumber.toString().padStart(6, '0')}`;

  nextCustomEventNumber += 1;

  return id;
};

try {
  records = generateEvents();

  if (records.length !== 100000) {
    throw new Error('Failed to generate 100 000 records');
  }

  timelineRecords = records.slice(-TIMELINE_EVENT_COUNT);

  if (timelineRecords.length !== TIMELINE_EVENT_COUNT) {
    throw new Error('Failed to prepare timeline events');
  }

  self.addEventListener('message', (event: MessageEvent<WorkerRequest>) => {
    const request = event.data;

    switch (request.type) {
      case 'GET_EVENTS':
        return self.postMessage({
          type: request.type,
          requestId: request.requestId,
          data: getEvents(records, request),
        });
      case 'GET_TIMELINE_EVENTS':
        timelineRecords.sort(
          (first, second) =>
            second.occurredAt - first.occurredAt ||
            first.id.localeCompare(second.id),
        );

        return self.postMessage({
          type: request.type,
          requestId: request.requestId,
          data: timelineRecords,
        });
      case 'CREATE_EVENT':
        return post({
          type: request.type,
          requestId: request.requestId,
          data: createEventRecord(
            records,
            timelineRecords,
            request.event,
            nextCustomEventId(),
          ),
        });
      case 'UPDATE_EVENT':
        return post({
          type: request.type,
          requestId: request.requestId,
          data: updateEventRecord(records, request.id, request.event),
        });
      case 'DELETE_EVENT':
        return post({
          type: request.type,
          requestId: request.requestId,
          data: deleteEventRecord(records, timelineRecords, request.id),
        });
    }
  });

  setTimeout(() => {
    post({ type: 'READY' });
  }, 1500);
} catch (e) {
  const error = e instanceof Error ? e.message : 'Worker initialization failed';
  post({ type: 'ERROR', message: error });
}

export {};
