import type {
  EventRecord,
  EventsRequest,
  EventsResult,
  WorkerCommand,
  WorkerResponse,
} from './protocol.ts';
import { createPendingRequests } from './pending-requests.ts';
import {
  getWorkerStatus,
  setWorkerStatus,
  subscribeToWorkerStatus,
} from './worker-status.ts';

let worker: Worker | null = null;
const pendingRequests = createPendingRequests();

const failWorker = (message: string) => {
  worker?.terminate();
  worker = null;
  pendingRequests.rejectAll(new Error(message));
  setWorkerStatus('error');
};

const handleWorkerMessage = (event: MessageEvent<WorkerResponse>) => {
  const response = event.data;

  switch (response.type) {
    case 'READY':
      setWorkerStatus('ready');
      return;
    case 'ERROR':
      failWorker(response.message);
      return;
    case 'REJECTED':
      pendingRequests.reject(response.requestId, new Error(response.message));
      return;
    case 'GET_EVENTS':
      pendingRequests.resolve(response.requestId, response.data);
      return;
    case 'GET_TIMELINE_EVENTS':
      pendingRequests.resolve(response.requestId, response.data);
      return;
  }
};

const sendRequest = <Result>(command: WorkerCommand): Promise<Result> => {
  const currentWorker = worker;

  if (!currentWorker || getWorkerStatus() !== 'ready') {
    return Promise.reject(new Error('Worker is not ready'));
  }

  const { requestId, promise } = pendingRequests.create<Result>();

  try {
    currentWorker.postMessage({
      requestId,
      ...command,
    });
  } catch (error) {
    pendingRequests.reject(
      requestId,
      error instanceof Error ? error : new Error('Request failed'),
    );
  }

  return promise;
};

export const startWorker = () => {
  if (worker) return;

  setWorkerStatus('loading');

  try {
    worker = new Worker(new URL('./worker.ts', import.meta.url), {
      type: 'module',
    });
    worker.onmessage = handleWorkerMessage;
    worker.onerror = () => failWorker('Worker execution failed');
    worker.onmessageerror = () => failWorker('Worker message is invalid');
  } catch {
    failWorker('Failed to start worker');
  }
};

export const getEvents = (request: EventsRequest): Promise<EventsResult> => {
  return sendRequest<EventsResult>({ type: 'GET_EVENTS', ...request });
};

export const getTimelineEvents = (): Promise<EventRecord[]> => {
  return sendRequest<EventRecord[]>({ type: 'GET_TIMELINE_EVENTS' });
};

export { getWorkerStatus, subscribeToWorkerStatus };
export type { WorkerStatus } from './worker-status.ts';
