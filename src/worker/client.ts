export type WorkerStatus = 'idle' | 'loading' | 'ready' | 'error';
type EventType = 'READY';

let worker: Worker | null = null;
let status: WorkerStatus = 'idle';
const listeners = new Set<() => void>();

const setStatus = (nextStatus: WorkerStatus) => {
  status = nextStatus;
  listeners.forEach((listener) => listener());
};

const handleError = () => {
  worker?.terminate();
  worker = null;
  setStatus('error');
};

export const startWorker = () => {
  if (worker) return;

  setStatus('loading');

  try {
    worker = new Worker(new URL('./worker.ts', import.meta.url), {
      type: 'module',
    });

    worker.onmessage = (event: MessageEvent<{ type: EventType }>) => {
      if (event.data.type === 'READY') setStatus('ready');
    };
    worker.onerror = handleError;
    worker.onmessageerror = handleError;
  } catch {
    worker = null;
    setStatus('error');
  }
};

export const getWorkerStatus = () => status;

export const subscribeToWorkerStatus = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};
