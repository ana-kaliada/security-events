import type { EventRecord, WorkerRequest, WorkerResponse } from '../protocol.ts';
import {
  createEventId,
  EVENT_COUNT,
  generateEvents,
  TIMELINE_EVENT_COUNT,
} from './generate-events.ts';
import { getEvents } from './get-events.ts';
import { createEventRecord, updateEventRecord } from './mutate-events.ts';

let records: EventRecord[];
let timelineRecords: EventRecord[];

const post = (message: WorkerResponse) => {
  self.postMessage(message);
};

try {
  records = generateEvents();

  if (records.length !== EVENT_COUNT) {
    throw new Error(`Failed to generate ${EVENT_COUNT} records`);
  }

  timelineRecords = records.slice(-TIMELINE_EVENT_COUNT);

  self.addEventListener('message', (event: MessageEvent<WorkerRequest>) => {
    const request = event.data;

    try {
      switch (request.type) {
        case 'GET_EVENTS':
          return post({
            type: request.type,
            requestId: request.requestId,
            data: getEvents(records, request),
          });
        case 'GET_TIMELINE_EVENTS':
          timelineRecords.sort(
            (first, second) => second.occurredAt - first.occurredAt,
          );

          return post({
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
              createEventId(),
            ),
          });
        case 'UPDATE_EVENT':
          return post({
            type: request.type,
            requestId: request.requestId,
            data: updateEventRecord(records, request.id, request.event),
          });
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Request failed';

      post({
        type: 'ERROR',
        requestId: request.requestId,
        message,
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
