import { useUrlState } from '../../../shared/hooks/use-url-state.ts';
import { formatLocalDate } from '../../../shared/utils/format-local-date.ts';
import {
  pageSizes,
  severities,
  sites,
  sortBy,
  sources,
  type EventsRequest,
} from '../../../worker/protocol.ts';

const DEFAULT_REQUEST: EventsRequest = {
  page: 1,
  pageSize: '10',
  sort: {
    sortBy: 'occurredAt',
    sortType: 'desc',
  },
  filters: {},
};

const includes = <Values extends readonly string[]>(
  values: Values,
  value: string | null,
): value is Values[number] => {
  return value !== null && values.includes(value);
};

const parsePositiveInteger = (value: string | null, fallback: number) => {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
};

const parseDate = (value: string | null) => {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return undefined;

  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return undefined;
  }

  return date.getTime();
};

const parseRequest = (params: URLSearchParams): EventsRequest => {
  const pageSize = params.get('pageSize');
  const sort = params.get('sort');
  const sortType = params.get('order');
  const severity = params.get('severity');
  const source = params.get('source');
  const site = params.get('site');
  const title = params.get('q')?.trim() || undefined;

  return {
    page: parsePositiveInteger(params.get('page'), DEFAULT_REQUEST.page),
    pageSize: includes(pageSizes, pageSize)
      ? pageSize
      : DEFAULT_REQUEST.pageSize,
    sort:
      sort === 'none'
        ? undefined
        : {
            sortBy: includes(sortBy, sort)
              ? sort
              : DEFAULT_REQUEST.sort!.sortBy,
            sortType:
              sortType === 'asc' || sortType === 'desc'
                ? sortType
                : DEFAULT_REQUEST.sort!.sortType,
          },
    filters: {
      title,
      severity: includes(severities, severity) ? severity : undefined,
      source: includes(sources, source) ? source : undefined,
      site: includes(sites, site) ? site : undefined,
      occurredAt: parseDate(params.get('date')),
    },
  };
};

const serializeRequest = (request: EventsRequest) => {
  const params = new URLSearchParams();

  if (request.page !== DEFAULT_REQUEST.page) {
    params.set('page', String(request.page));
  }
  if (request.pageSize !== DEFAULT_REQUEST.pageSize) {
    params.set('pageSize', request.pageSize);
  }

  if (!request.sort) {
    params.set('sort', 'none');
  } else if (
    request.sort.sortBy !== DEFAULT_REQUEST.sort!.sortBy ||
    request.sort.sortType !== DEFAULT_REQUEST.sort!.sortType
  ) {
    params.set('sort', request.sort.sortBy);
    params.set('order', request.sort.sortType);
  }

  if (request.filters.title) params.set('q', request.filters.title);
  if (request.filters.severity) {
    params.set('severity', request.filters.severity);
  }
  if (request.filters.source) params.set('source', request.filters.source);
  if (request.filters.site) params.set('site', request.filters.site);
  if (request.filters.occurredAt !== undefined) {
    params.set('date', formatLocalDate(request.filters.occurredAt));
  }

  return params;
};

export const useEventsSearchParams = () => {
  const { state: request, updateState: updateRequest } = useUrlState({
    parse: parseRequest,
    serialize: serializeRequest,
  });

  return { request, updateRequest };
};
