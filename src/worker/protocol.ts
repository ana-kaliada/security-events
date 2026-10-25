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
