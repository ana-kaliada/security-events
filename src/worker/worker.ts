import type { EventRecord, WorkerRequest, WorkerResponse } from './protocol.ts';
import { generateEvents } from './generate-events.ts';
import { getEvents } from './get-events.ts';

let records: EventRecord[];

const post = (message: WorkerResponse) => {
  self.postMessage(message);
};

try {
  records = generateEvents();

  if (records.length !== 100000) {
    throw new Error('Failed to generate 100 000 records');
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
      default:
        self.postMessage({
          type: 'REJECTED',
          requestId: request.requestId,
          message: `Unsupported command: ${request.type}`,
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
