export type WorkerStatus = 'idle' | 'loading' | 'ready' | 'error';

let status: WorkerStatus = 'idle';
const listeners = new Set<() => void>();

export const setWorkerStatus = (nextStatus: WorkerStatus) => {
  status = nextStatus;
  listeners.forEach((listener) => listener());
};

export const getWorkerStatus = () => status;

export const subscribeToWorkerStatus = (listener: () => void) => {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
};
