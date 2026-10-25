import { useEffect, useState, useSyncExternalStore } from 'react';
import {
  getEvents,
  getWorkerStatus,
  subscribeToWorkerStatus,
} from '../../worker/client.ts';
import type { EventsRequest, EventsResult } from '../../worker/protocol.ts';

const initialRequest: EventsRequest = {
  page: 1,
  pageSize: '10',
  sort: {
    sortBy: 'occurredAt',
    sortType: 'desc',
  },
  filters: {},
};

const EventsPage = () => {
  const workerStatus = useSyncExternalStore(
    subscribeToWorkerStatus,
    getWorkerStatus,
  );
  const [events, setEvents] = useState<EventsResult | null>(null);

  useEffect(() => {
    if (workerStatus !== 'ready') return;

    getEvents(initialRequest).then((result) => {
      setEvents(result);
    });
  }, [workerStatus]);

  return (
    <main>
      <h1>Data Grid Page</h1>
      <p>Request status: {workerStatus}</p>
      {events?.rows.map((row) => (
        <p key={row.id}>Title: {row.title}</p>
      ))}
    </main>
  );
};

export default EventsPage;
