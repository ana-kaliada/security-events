import type { EventRecord } from './protocol.ts';
import { generateEvents } from './generate-events.ts';

let records: EventRecord[];

try {
  records = generateEvents();

  if (records.length !== 100000) {
    throw new Error('Failed to generate 100 000 records');
  }

  setTimeout(() => {
    self.postMessage({ type: 'READY' });
  }, 1500);
} catch (e) {
  const error = e instanceof Error ? e.message : 'Worker initialization failed';
  self.postMessage({ type: 'ERROR', message: error });
}

export {};
