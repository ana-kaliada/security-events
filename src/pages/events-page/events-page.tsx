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
  SortBy,
} from '../../worker/protocol.ts';
import { pageSizes } from '../../worker/protocol.ts';
import { Pagination } from '../../shared/pagination';
import { Table, type TableColumn, type TableSort } from '../../shared/table';
import { formatDateTime } from '../../utils/format-date-time.ts';
import {
  EventFilters,
  type EventFiltersValue,
} from './components/event-filters/event-filters.tsx';

const columns: readonly TableColumn<EventRecord, SortBy>[] = [
  {
    id: 'title',
    label: 'Title',
    renderCell: (event) => event.title,
    rowHeader: true,
    sortable: true,
  },
  {
    id: 'occurredAt',
    label: 'Occurred at',
    renderCell: (event) => formatDateTime(event.occurredAt),
    sortable: true,
  },
  {
    id: 'severity',
    label: 'Severity',
    renderCell: (event) => event.severity,
    sortable: true,
  },
  {
    id: 'source',
    label: 'Source',
    renderCell: (event) => event.source,
    sortable: true,
  },
  {
    id: 'site',
    label: 'Site',
    renderCell: (event) => event.site,
    sortable: true,
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

const pageSizeOptions = pageSizes.map(Number);

const EventsPage = () => {
  const workerStatus = useSyncExternalStore(
    subscribeToWorkerStatus,
    getWorkerStatus,
  );
  const [events, setEvents] = useState<EventsResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>();
  const [request, setRequest] = useState<EventsRequest>(initialRequest);
  const [titleSearch, setTitleSearch] = useState(
    initialRequest.filters.title ?? '',
  );

  useEffect(() => {
    if (workerStatus !== 'ready') return;

    let isCurrentRequest = true;

    getEvents(request)
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
  }, [request, workerStatus]);

  useEffect(() => {
    const title = titleSearch.trim() || undefined;
    if (title === request.filters.title) return;

    const timeoutId = window.setTimeout(() => {
      setEvents(null);
      setErrorMessage(undefined);
      setRequest((currentRequest) => ({
        ...currentRequest,
        page: 1,
        filters: {
          ...currentRequest.filters,
          title,
        },
      }));
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [request.filters.title, titleSearch]);

  const handleSortChange = (sort?: TableSort<SortBy>) => {
    setEvents(null);
    setErrorMessage(undefined);
    setRequest((currentRequest) => ({
      ...currentRequest,
      page: 1,
      sort: sort
        ? {
            sortBy: sort.columnId,
            sortType: sort.direction,
          }
        : undefined,
    }));
  };

  const handlePageChange = (page: number) => {
    setEvents(null);
    setErrorMessage(undefined);
    setRequest((currentRequest) => ({ ...currentRequest, page }));
  };

  const handlePageSizeChange = (pageSize: number) => {
    const nextPageSize = pageSizes.find((size) => Number(size) === pageSize);
    if (!nextPageSize) return;

    setEvents(null);
    setErrorMessage(undefined);
    setRequest((currentRequest) => ({
      ...currentRequest,
      page: 1,
      pageSize: nextPageSize,
    }));
  };

  const handleFiltersChange = (filters: EventFiltersValue) => {
    setEvents(null);
    setErrorMessage(undefined);
    setRequest((currentRequest) => ({
      ...currentRequest,
      page: 1,
      filters: {
        title: currentRequest.filters.title,
        ...filters,
      },
    }));
  };

  return (
    <main>
      <h1>Security events</h1>
      <EventFilters
        title={titleSearch}
        value={{
          severity: request.filters.severity,
          source: request.filters.source,
          site: request.filters.site,
          occurredAt: request.filters.occurredAt,
        }}
        onTitleChange={setTitleSearch}
        onChange={handleFiltersChange}
      />
      <Table
        caption="Security events"
        columns={columns}
        data={events?.rows ?? []}
        getRowKey={(event) => event.id}
        isLoading={!events && !errorMessage}
        rowCount={Number(request.pageSize)}
        emptyMessage="No events found"
        errorMessage={errorMessage}
        sort={
          request.sort
            ? {
                columnId: request.sort.sortBy,
                direction: request.sort.sortType,
              }
            : undefined
        }
        onSortChange={handleSortChange}
      />
      {events && events.total > 0 && (
        <Pagination
          page={request.page}
          pageSize={Number(request.pageSize)}
          pageSizeOptions={pageSizeOptions}
          total={events.total}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      )}
    </main>
  );
};

export default EventsPage;
