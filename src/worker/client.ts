import type {
  EventInput,
  EventRecord,
  EventsRequest,
  EventsResult,
  WorkerCommand,
  WorkerResponse,
} from './protocol.ts';
import { bumpDatasetRevision } from './dataset-revision.ts';
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
    case 'GET_TIMELINE_EVENTS':
    case 'CREATE_EVENT':
    case 'UPDATE_EVENT':
    case 'DELETE_EVENT':
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

const changeDataset = async <Result>(command: WorkerCommand) => {
  const result = await sendRequest<Result>(command);

  bumpDatasetRevision();

  return result;
};

export const createEvent = (event: EventInput) => {
  return changeDataset<EventRecord>({ type: 'CREATE_EVENT', event });
};

export const updateEvent = (id: string, event: EventInput) => {
  return changeDataset<EventRecord>({ type: 'UPDATE_EVENT', id, event });
};

export const deleteEvent = (id: string) => {
  return changeDataset<{ id: string }>({ type: 'DELETE_EVENT', id });
};

export {
  getDatasetRevision,
  subscribeToDatasetRevision,
} from './dataset-revision.ts';
export { getWorkerStatus, subscribeToWorkerStatus };
export type { WorkerStatus } from './worker-status.ts';
