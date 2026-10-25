import type {
  EventRecord,
  EventsRequest,
  EventsResult,
  Filters,
  Severity,
  Sort,
} from './protocol.ts';

const severityOrder: Record<Severity, number> = {
  info: 0,
  warning: 1,
  trouble: 2,
  critical: 3,
};

const isSameDay = (firstTimestamp: number, secondTimestamp: number): boolean => {
  const firstDate = new Date(firstTimestamp);
  const secondDate = new Date(secondTimestamp);

  return (
    firstDate.getFullYear() === secondDate.getFullYear() &&
    firstDate.getMonth() === secondDate.getMonth() &&
    firstDate.getDate() === secondDate.getDate()
  );
};

const matchesFilters = (event: EventRecord, filters: Filters): boolean => {
  const title = filters.title?.trim().toLowerCase();

  if (title && !event.title.toLowerCase().includes(title)) return false;
  if (filters.severity && filters.severity !== event.severity) return false;
  if (filters.source && filters.source !== event.source) return false;
  if (filters.site && filters.site !== event.site) return false;
  if (
    filters.occurredAt !== undefined &&
    !isSameDay(filters.occurredAt, event.occurredAt)
  ) {
    return false;
  }

  return true;
};

const compareEvents = (
  previous: EventRecord,
  next: EventRecord,
  sort: Sort,
): number => {
  let difference: number;

  if (sort.sortBy === 'occurredAt') {
    difference = previous.occurredAt - next.occurredAt;
  } else if (sort.sortBy === 'severity') {
    difference =
      severityOrder[previous.severity] - severityOrder[next.severity];
  } else {
    difference = previous[sort.sortBy].localeCompare(next[sort.sortBy]);
  }

  const directedDifference = sort.sortType === 'asc' ? difference : -difference;
  if (directedDifference !== 0) return directedDifference;
  return previous.id.localeCompare(next.id);
};

export const getEvents = (
  events: readonly EventRecord[],
  request: EventsRequest,
): EventsResult => {
  const matchingEvents = events.filter((event) =>
    matchesFilters(event, request.filters),
  );

  matchingEvents.sort((previous, next) =>
    compareEvents(previous, next, request.sort),
  );

  const pageSize = Number(request.pageSize);
  const page = Math.max(1, request.page);
  const start = (page - 1) * pageSize;

  return {
    rows: matchingEvents.slice(start, start + pageSize),
    total: matchingEvents.length,
  };
};
