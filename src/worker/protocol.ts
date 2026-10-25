export const severities = ['info', 'warning', 'trouble', 'critical'] as const;
export type Severity = (typeof severities)[number];

export const sources = [
  'door',
  'camera',
  'sensor',
  'panel',
  'intercom',
  'power',
] as const;
export type Source = (typeof sources)[number];

export const sites = [
  'North lobby',
  'South lobby',
  'Gate A',
  'Gate B',
  'Loading dock',
  'Parking garage B1',
  'Server room',
  'Warehouse',
  'Reception',
  'Perimeter east',
  'Perimeter west',
  'Roof',
  'Cafeteria',
  'Mail room',
  'Lab 2',
  'Stairwell C',
] as const;
export type Site = (typeof sites)[number];

export type EventRecord = {
  id: string;
  title: string;
  occurredAt: number;
  severity: Severity;
  source: Source;
  site: Site;
};

export const pageSizes = ['10', '25', '50', '100'] as const;
export type PageSize = (typeof pageSizes)[number];

export const sortBy = [
  'title',
  'occurredAt',
  'severity',
  'source',
  'site',
] as const;
export type SortBy = (typeof sortBy)[number];

export type Sort = {
  sortBy: SortBy;
  sortType: 'asc' | 'desc';
};

export type Filters = {
  title?: string;
  severity?: Severity;
  source?: Source;
  site?: Site;
  occurredAt?: number;
};

export type EventsRequest = {
  page: number;
  pageSize: PageSize;
  sort?: Sort;
  filters: Filters;
};

export type EventsResult = {
  rows: EventRecord[];
  total: number;
};

export type WorkerCommand = { type: 'GET_EVENTS' } & EventsRequest;

export type WorkerRequest = WorkerCommand & { requestId: number };

export type WorkerResponse =
  | { type: 'READY' }
  | { type: 'ERROR'; message: string }
  | { type: 'REJECTED'; requestId: number; message: string }
  | { type: 'GET_EVENTS'; requestId: number; data: EventsResult };
