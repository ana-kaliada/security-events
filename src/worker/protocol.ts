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
  'north-lobby',
  'south-lobby',
  'gate-a',
  'gate-b',
  'loading-dock',
  'parking-garage-b1',
  'server-room',
  'warehouse',
  'reception',
  'perimeter-east',
  'perimeter-west',
  'roof',
  'cafeteria',
  'mail-room',
  'lab-2',
  'stairwell-c',
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

export type EventInput = {
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

export type WorkerCommand =
  | ({ type: 'GET_EVENTS' } & EventsRequest)
  | { type: 'GET_TIMELINE_EVENTS' }
  | { type: 'CREATE_EVENT'; event: EventInput }
  | { type: 'UPDATE_EVENT'; id: string; event: EventInput };

export type WorkerRequest = WorkerCommand & { requestId: number };

export type WorkerResponse =
  | { type: 'READY' }
  | { type: 'ERROR'; message: string; requestId?: number }
  | { type: 'GET_EVENTS'; requestId: number; data: EventsResult }
  | {
      type: 'GET_TIMELINE_EVENTS';
      requestId: number;
      data: EventRecord[];
    }
  | { type: 'CREATE_EVENT'; requestId: number; data: EventRecord }
  | { type: 'UPDATE_EVENT'; requestId: number; data: EventRecord };
