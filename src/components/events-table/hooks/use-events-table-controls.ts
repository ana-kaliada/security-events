import type { TableSort } from '../../../shared/components/table';
import {
  pageSizes,
  type Filters,
  type SortBy,
} from '../../../worker/protocol.ts';
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

  const onFiltersChange = (
    filters: Filters,
    options?: { replace?: boolean },
  ) => {
    updateRequest(
      (currentRequest) => ({
        ...currentRequest,
        page: 1,
        filters,
      }),
      options,
    );
  };

  const sort: TableSort<SortBy> | undefined = request.sort;

  return {
    request,
    sort,
    onSortChange,
    onPageChange,
    onPageSizeChange,
    onFiltersChange,
  };
};
