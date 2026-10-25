import { useMemo, useSyncExternalStore } from 'react';
import { EventUpdateModal } from '../../../../components/event/event-update-modal/event-update-modal.tsx';
import {
  getWorkerStatus,
  subscribeToWorkerStatus,
} from '../../../../worker/client/client.ts';
import {
  pageSizes,
  type EventsRequest,
  type SortBy,
} from '../../../../worker/protocol.ts';
import { Pagination } from '../../../../shared/components/pagination';
import { Table, type TableSort } from '../../../../shared/components/table';
import { useDebouncedValue } from '../../../../shared/hooks/use-debounced-value';
import { EventFilters } from '../event-filters/event-filters.tsx';
import type { EventFiltersValue } from '../event-filters/event-filters.types.ts';
import { useEventsQuery } from '../../hooks/use-events-query.ts';
import { useEventsSearchParams } from '../../hooks/use-events-search-params.ts';
import { columns, pageSizeOptions } from './events-table.config.ts';

const SEARCH_DEBOUNCE_MS = 300;

export const EventsTable = () => {
  const { request, updateRequest } = useEventsSearchParams();
  const workerStatus = useSyncExternalStore(
    subscribeToWorkerStatus,
    getWorkerStatus,
  );
  const isWorkerReady = workerStatus === 'ready';
  const debouncedTitle = useDebouncedValue(
    request.filters.title,
    SEARCH_DEBOUNCE_MS,
  );
  const requestSortBy = request.sort?.sortBy;
  const requestSortType = request.sort?.sortType;
  const queryRequest = useMemo<EventsRequest>(
    () => ({
      page: request.page,
      pageSize: request.pageSize,
      sort:
        requestSortBy && requestSortType
          ? {
              sortBy: requestSortBy,
              sortType: requestSortType,
            }
          : undefined,
      filters: {
        title: debouncedTitle,
        severity: request.filters.severity,
        source: request.filters.source,
        site: request.filters.site,
        occurredAt: request.filters.occurredAt,
      },
    }),
    [
      debouncedTitle,
      request.filters.occurredAt,
      request.filters.severity,
      request.filters.site,
      request.filters.source,
      request.page,
      request.pageSize,
      requestSortBy,
      requestSortType,
    ],
  );
  const { data, error, isLoading } = useEventsQuery(
    queryRequest,
    isWorkerReady,
  );

  const handleSortChange = (sort?: TableSort<SortBy>) => {
    updateRequest((currentRequest) => ({
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
    updateRequest((currentRequest) => ({ ...currentRequest, page }));
  };

  const handlePageSizeChange = (pageSize: number) => {
    const nextPageSize = pageSizes.find((size) => Number(size) === pageSize);
    if (!nextPageSize) return;

    updateRequest((currentRequest) => ({
      ...currentRequest,
      page: 1,
      pageSize: nextPageSize,
    }));
  };

  const handleFiltersChange = (filters: EventFiltersValue) => {
    updateRequest((currentRequest) => ({
      ...currentRequest,
      page: 1,
      filters: {
        title: currentRequest.filters.title,
        ...filters,
      },
    }));
  };

  const handleTitleChange = (title: string) => {
    updateRequest(
      (currentRequest) => ({
        ...currentRequest,
        page: 1,
        filters: {
          ...currentRequest.filters,
          title: title || undefined,
        },
      }),
      { replace: true },
    );
  };

  return (
    <>
      <EventFilters
        title={request.filters.title ?? ''}
        value={{
          severity: request.filters.severity,
          source: request.filters.source,
          site: request.filters.site,
          occurredAt: request.filters.occurredAt,
        }}
        onTitleChange={handleTitleChange}
        onChange={handleFiltersChange}
      />
      <Table
        caption="Security events"
        columns={columns}
        data={data?.rows ?? []}
        getRowKey={(event) => event.id}
        isLoading={isLoading}
        rowCount={Number(request.pageSize)}
        emptyMessage="No events found"
        errorMessage={error?.message}
        sort={
          request.sort
            ? {
                columnId: request.sort.sortBy,
                direction: request.sort.sortType,
              }
            : undefined
        }
        onSortChange={handleSortChange}
        renderRowActions={(event) => (
          <EventUpdateModal
            event={event}
            buttonProps={{
              size: '1',
              variant: 'soft',
              'aria-label': `Edit ${event.title}`,
            }}
          >
            Edit
          </EventUpdateModal>
        )}
      />
      {data && data.total > 0 && (
        <Pagination
          page={request.page}
          pageSize={Number(request.pageSize)}
          pageSizeOptions={pageSizeOptions}
          total={data.total}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      )}
    </>
  );
};
