import {
  severities,
  type Severity,
  sites,
  type Site,
  sources,
  type Source,
} from '../../worker/protocol.ts';

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
  'north-lobby': 'North lobby',
  'south-lobby': 'South lobby',
  'gate-a': 'Gate A',
  'gate-b': 'Gate B',
  'loading-dock': 'Loading dock',
  'parking-garage-b1': 'Parking garage B1',
  'server-room': 'Server room',
  warehouse: 'Warehouse',
  reception: 'Reception',
  'perimeter-east': 'Perimeter east',
  'perimeter-west': 'Perimeter west',
  roof: 'Roof',
  cafeteria: 'Cafeteria',
  'mail-room': 'Mail room',
  'lab-2': 'Lab 2',
  'stairwell-c': 'Stairwell C',
};

const toOptions = <Value extends string>(
  values: readonly Value[],
  labels: Record<Value, string>,
) => values.map((value) => ({ label: labels[value], value }));

export const severityOptions = toOptions(severities, severityLabels);
export const sourceOptions = toOptions(sources, sourceLabels);
export const siteOptions = toOptions(sites, siteLabels);

export const getSeverityLabel = (severity: Severity) =>
  severityLabels[severity];
export const getSourceLabel = (source: Source) => sourceLabels[source];
export const getSiteLabel = (site: Site) => siteLabels[site];
