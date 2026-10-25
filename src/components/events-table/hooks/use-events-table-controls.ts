import type { TableSort } from '../../../shared/components/table';
import { pageSizes, type SortBy } from '../../../worker/protocol.ts';
import type { EventFiltersValue } from '../../event-filters/event-filters.types.ts';
import { useEventsSearchParams } from './use-events-search-params.ts';

export const useEventsTableControls = () => {
  const { request, updateRequest } = useEventsSearchParams();

  const onSortChange = (sort?: TableSort<SortBy>) => {
    updateRequest((currentRequest) => ({
      ...currentRequest,
      page: 1,
      sort,
    }));
  };

  const onPageChange = (page: number) => {
    updateRequest((currentRequest) => ({ ...currentRequest, page }));
  };

  const onPageSizeChange = (pageSize: string) => {
    const nextPageSize = pageSizes.find((size) => size === pageSize);
    if (!nextPageSize) return;

    updateRequest((currentRequest) => ({
      ...currentRequest,
      page: 1,
      pageSize: nextPageSize,
    }));
  };

  const onFiltersChange = (filters: EventFiltersValue) => {
    updateRequest((currentRequest) => ({
      ...currentRequest,
      page: 1,
      filters: {
        title: currentRequest.filters.title,
        ...filters,
      },
    }));
  };

  const onTitleChange = (title: string) => {
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

  const sort: TableSort<SortBy> | undefined = request.sort;

  return {
    request,
    sort,
    filterValue: {
      severity: request.filters.severity,
      source: request.filters.source,
      site: request.filters.site,
      occurredAt: request.filters.occurredAt,
    },
    onSortChange,
    onPageChange,
    onPageSizeChange,
    onFiltersChange,
    onTitleChange,
  };
};
