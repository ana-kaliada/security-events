import Router from './router/router.tsx';
import { BrowserRouter } from 'react-router-dom';
import { StrictMode, useEffect, useSyncExternalStore } from 'react';
import {
  getWorkerStatus,
  startWorker,
  subscribeToWorkerStatus,
} from '../worker/client.ts';

function App() {
  const workerStatus = useSyncExternalStore(
    subscribeToWorkerStatus,
    getWorkerStatus,
  );

  useEffect(() => {
    startWorker();
  }, []);

  return (
    <StrictMode>
      <BrowserRouter>
        <p>Worker status: {workerStatus}</p>
        <Router />
      </BrowserRouter>
    </StrictMode>
  );
}

export default App;
