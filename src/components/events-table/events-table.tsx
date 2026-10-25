import { useEffect } from 'react';
import { EventUpdateModal } from '../event-update-modal/event-update-modal.tsx';
import { pageSizes } from '../../worker/protocol.ts';
import { Table } from '../../shared/components/table';
import { useDebouncedValue } from '../../shared/hooks/use-debounced-value.ts';
import { useWorkerStatus } from '../../shared/hooks/use-worker-status.ts';
import { EventFilters } from '../event-filters/event-filters.tsx';
import { useEventsQuery } from './hooks/use-events-query.ts';
import { useEventsTableControls } from './hooks/use-events-table-controls.ts';
import { columns } from './events-table.config.tsx';

const SEARCH_DEBOUNCE_MS = 300;

export const EventsTable = () => {
  const {
    request,
    sort,
    filterValue,
    onSortChange,
    onPageChange,
    onPageSizeChange,
    onFiltersChange,
    onTitleChange,
  } = useEventsTableControls();
  const { isReady: isWorkerReady } = useWorkerStatus();
  const debouncedTitle = useDebouncedValue(
    request.filters.title,
    SEARCH_DEBOUNCE_MS,
  );
  const { data, error, isLoading } = useEventsQuery(
    {
      ...request,
      filters: {
        ...request.filters,
        title: debouncedTitle,
      },
    },
    isWorkerReady,
  );

  useEffect(() => {
    if (!data || data.total === 0) return;

    const totalPages = Math.ceil(data.total / Number(request.pageSize));
    if (request.page > totalPages) onPageChange(totalPages);
  }, [data, onPageChange, request.page, request.pageSize]);

  return (
    <>
      <EventFilters
        title={request.filters.title ?? ''}
        value={filterValue}
        onTitleChange={onTitleChange}
        onChange={onFiltersChange}
      />
      <Table
        caption="Security events"
        columns={columns}
        data={data?.rows ?? []}
        getRowKey={(event) => event.id}
        isLoading={isLoading}
        emptyMessage="No events found"
        errorMessage={error?.message}
        sort={sort}
        onSortChange={onSortChange}
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
        pagination={{
          page: request.page,
          pageSize: request.pageSize,
          pageSizeOptions: pageSizes,
          total: data?.total ?? 0,
          onPageChange,
          onPageSizeChange,
        }}
      />
    </>
  );
};
