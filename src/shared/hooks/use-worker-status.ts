import { useSyncExternalStore } from 'react';
import {
  getWorkerStatus,
  subscribeToWorkerStatus,
} from '../../worker/client/client.ts';

export const useWorkerStatus = () => {
  const status = useSyncExternalStore(subscribeToWorkerStatus, getWorkerStatus);

  return {
    status,
    isReady: status === 'ready',
  };
};
