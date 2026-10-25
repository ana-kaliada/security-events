import {
  type Filters,
  severities,
  type Severity,
  sites,
  type Site,
  sources,
  type Source,
} from '../../../../worker/protocol.ts';

export type EventFiltersValue = Omit<Filters, 'title'>;

export type EventFiltersProps = {
  title: string;
  value: EventFiltersValue;
  onTitleChange: (value: string) => void;
  onChange: (value: EventFiltersValue) => void;
};

const severityLabels: Record<Severity, string> = {
  info: 'Info',
  warning: 'Warning',
  trouble: 'Trouble',
  critical: 'Critical',
};

const sourceLabels: Record<Source, string> = {
  door: 'Door',
  camera: 'Camera',
  sensor: 'Sensor',
  panel: 'Panel',
  intercom: 'Intercom',
  power: 'Power',
};

const siteLabels: Record<Site, string> = {
  'North lobby': 'North lobby',
  'South lobby': 'South lobby',
  'Gate A': 'Gate A',
  'Gate B': 'Gate B',
  'Loading dock': 'Loading dock',
  'Parking garage B1': 'Parking garage B1',
  'Server room': 'Server room',
  Warehouse: 'Warehouse',
  Reception: 'Reception',
  'Perimeter east': 'Perimeter east',
  'Perimeter west': 'Perimeter west',
  Roof: 'Roof',
  Cafeteria: 'Cafeteria',
  'Mail room': 'Mail room',
  'Lab 2': 'Lab 2',
  'Stairwell C': 'Stairwell C',
};

const toOptions = <Value extends string>(
  values: readonly Value[],
  labels: Record<Value, string>,
) => values.map((value) => ({ label: labels[value], value }));

export const severityOptions = toOptions(severities, severityLabels);
export const sourceOptions = toOptions(sources, sourceLabels);
export const siteOptions = toOptions(sites, siteLabels);
