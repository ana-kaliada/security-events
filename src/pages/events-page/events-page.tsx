import { useEffect, useState, useSyncExternalStore } from 'react';
import {
  getEvents,
  getWorkerStatus,
  subscribeToWorkerStatus,
} from '../../worker/client.ts';
import type {
  EventRecord,
  EventsRequest,
  EventsResult,
} from '../../worker/protocol.ts';
import { Table, type TableColumn } from '../../shared/table';

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'medium',
  timeStyle: 'short',
});

const columns: readonly TableColumn<EventRecord>[] = [
  {
    id: 'title',
    label: 'Title',
    renderCell: (event) => event.title,
    rowHeader: true,
  },
  {
    id: 'occurredAt',
    label: 'Occurred at',
    renderCell: (event) => dateFormatter.format(event.occurredAt),
  },
  {
    id: 'severity',
    label: 'Severity',
    renderCell: (event) => event.severity,
  },
  {
    id: 'source',
    label: 'Source',
    renderCell: (event) => event.source,
  },
  {
    id: 'site',
    label: 'Site',
    renderCell: (event) => event.site,
  },
];

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
  const [errorMessage, setErrorMessage] = useState<string>();

  useEffect(() => {
    if (workerStatus !== 'ready') return;

    let isCurrentRequest = true;

    getEvents(initialRequest)
      .then((result) => {
        if (!isCurrentRequest) return;
        setEvents(result);
        setErrorMessage(undefined);
      })
      .catch((error: unknown) => {
        if (!isCurrentRequest) return;
        setErrorMessage(
          error instanceof Error ? error.message : 'Failed to load events',
        );
      });

    return () => {
      isCurrentRequest = false;
    };
  }, [workerStatus]);

  return (
    <main>
      <h1>Security events</h1>
      <Table
        caption="Security events"
        columns={columns}
        data={events?.rows ?? []}
        getRowKey={(event) => event.id}
        isLoading={!events && !errorMessage}
        rowCount={Number(initialRequest.pageSize)}
        emptyMessage="No events found"
        errorMessage={errorMessage}
      />
    </main>
  );
};

export default EventsPage;
