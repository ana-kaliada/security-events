import {
  sites,
  type EventRecord,
  type Severity,
  type Source,
} from './protocol.ts';

const DATASET = {
  archiveCount: 90000,
  timelineCount: 10000,
  archiveDays: 135,
  timelineDays: 45,
  businessDay: {
    startHour: 7,
    endHour: 19,
  },
  anchorDate: [2026, 9, 23] as const,
} as const;

export const TIMELINE_EVENT_COUNT = DATASET.timelineCount;

const SCENARIOS = [
  { weight: 18, source: 'door', severity: 'info', title: 'Access granted' },
  { weight: 9, source: 'door', severity: 'info', title: 'Door closed' },
  { weight: 6, source: 'door', severity: 'warning', title: 'Access denied' },
  { weight: 4, source: 'door', severity: 'warning', title: 'Door held open' },
  {
    weight: 2,
    source: 'door',
    severity: 'warning',
    title: 'Anti-passback violation',
  },
  { weight: 1, source: 'door', severity: 'critical', title: 'Door forced' },
  { weight: 21, source: 'camera', severity: 'info', title: 'Motion detected' },
  {
    weight: 3,
    source: 'camera',
    severity: 'trouble',
    title: 'Camera offline',
  },
  { weight: 1, source: 'camera', severity: 'trouble', title: 'Video loss' },
  { weight: 2, source: 'sensor', severity: 'warning', title: 'Contact open' },
  { weight: 2, source: 'sensor', severity: 'warning', title: 'PIR triggered' },
  {
    weight: 1,
    source: 'sensor',
    severity: 'critical',
    title: 'Intrusion detected',
  },
  {
    weight: 1,
    source: 'sensor',
    severity: 'critical',
    title: 'Glass break',
  },
  { weight: 9, source: 'sensor', severity: 'info', title: 'Contact restored' },
  { weight: 2, source: 'panel', severity: 'trouble', title: 'Panel offline' },
  {
    weight: 1,
    source: 'panel',
    severity: 'trouble',
    title: 'Communication lost',
  },
  { weight: 4, source: 'panel', severity: 'info', title: 'Area armed' },
  { weight: 2, source: 'panel', severity: 'info', title: 'Area disarmed' },
  { weight: 1, source: 'panel', severity: 'info', title: 'Panel online' },
  {
    weight: 2,
    source: 'intercom',
    severity: 'warning',
    title: 'Call unanswered',
  },
  {
    weight: 1,
    source: 'intercom',
    severity: 'info',
    title: 'Call answered',
  },
  {
    weight: 1,
    source: 'intercom',
    severity: 'info',
    title: 'Door released from intercom',
  },
  { weight: 1, source: 'power', severity: 'critical', title: 'Mains lost' },
  { weight: 1, source: 'power', severity: 'trouble', title: 'Battery low' },
  { weight: 3, source: 'power', severity: 'info', title: 'Mains restored' },
  { weight: 1, source: 'power', severity: 'info', title: 'Battery restored' },
] as const satisfies readonly {
  weight: number;
  source: Source;
  severity: Severity;
  title: string;
}[];

type Scenario = Omit<(typeof SCENARIOS)[number], 'weight'>;

const SCENARIO_POOL: readonly Scenario[] = SCENARIOS.flatMap(
  ({ weight, ...scenario }) => Array.from({ length: weight }, () => scenario),
);

if (SCENARIO_POOL.length !== 100) {
  throw new Error('Scenario weights must add up to 100');
}

const EVENT_COUNT = DATASET.archiveCount + DATASET.timelineCount;
const MINUTES_IN_DAY = 24 * 60;
const BUSINESS_MINUTES =
  (DATASET.businessDay.endHour - DATASET.businessDay.startHour) * 60;
const OFF_HOURS_MINUTES = MINUTES_IN_DAY - BUSINESS_MINUTES;

const deterministicNumber = (index: number, salt = 0): number => {
  return Math.imul((index + salt) ^ 0x5bd1e995, 0x9e3779b1) >>> 0;
};

const getMinuteOfDay = (seed: number): number => {
  if (seed % 100 < 70) {
    return (
      DATASET.businessDay.startHour * 60 + ((seed >>> 8) % BUSINESS_MINUTES)
    );
  }

  const offset = (seed >>> 8) % OFF_HOURS_MINUTES;
  const morningMinutes = DATASET.businessDay.startHour * 60;

  return offset < morningMinutes
    ? offset
    : DATASET.businessDay.endHour * 60 + offset - morningMinutes;
};

const getOccurredAt = (index: number): number => {
  const isTimelineEvent = index >= DATASET.archiveCount;
  const span = isTimelineEvent ? DATASET.timelineDays : DATASET.archiveDays;
  const maxDaysAgo = isTimelineEvent
    ? DATASET.timelineDays - 1
    : DATASET.timelineDays + DATASET.archiveDays - 1;
  const daysAgo = maxDaysAgo - (deterministicNumber(index, 4_000_003) % span);
  const minutes = getMinuteOfDay(deterministicNumber(index, 2_000_003));
  const date = new Date(...DATASET.anchorDate);

  date.setDate(date.getDate() - daysAgo);
  date.setHours(Math.floor(minutes / 60), minutes % 60, 0, 0);

  return date.getTime();
};

const generateEvent = (index: number): EventRecord => {
  const scenario = SCENARIO_POOL[deterministicNumber(index) % 100];
  const site = sites[deterministicNumber(index, 1_000_003) % sites.length];
  const code = (deterministicNumber(index, 3_000_003) % 36 ** 4)
    .toString(36)
    .padStart(4, '0');

  return {
    id: `evt-${index.toString().padStart(6, '0')}`,
    title: `${scenario.title} · ${code}`,
    occurredAt: getOccurredAt(index),
    severity: scenario.severity,
    source: scenario.source,
    site,
  };
};

export const generateEvents = (): EventRecord[] => {
  return Array.from({ length: EVENT_COUNT }, (_, index) =>
    generateEvent(index),
  );
};
