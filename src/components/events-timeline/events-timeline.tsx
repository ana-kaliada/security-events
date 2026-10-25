import { useMemo } from 'react';
import { Timeline } from '../../shared/components/timeline';
import {
  getSeverityLabel,
  getSiteLabel,
  getSourceLabel,
} from '../../shared/libs/event-options.ts';
import { useWorkerStatus } from '../../shared/hooks/use-worker-status.ts';
import type { EventRecord } from '../../worker/protocol.ts';
import { SeverityBadge } from '../severity-badge/severity-badge.tsx';
import { groupEventsByDay } from './utils/group-events-by-day.ts';
import { useTimelineQuery } from './hooks/use-timeline-query.ts';
import styles from './events-timeline.module.css';

const timeFormatter = new Intl.DateTimeFormat('en', {
  timeStyle: 'short',
});

const getEventKey = (event: EventRecord) => event.id;

const getEventLabel = (event: EventRecord) =>
  `${timeFormatter.format(event.occurredAt)}, ${event.title}, ${getSeverityLabel(event.severity)}, ${getSourceLabel(event.source)}, ${getSiteLabel(event.site)}`;

const renderEventTime = (event: EventRecord) => (
  <time
    className={styles.time}
    dateTime={new Date(event.occurredAt).toISOString()}
  >
    {timeFormatter.format(event.occurredAt)}
  </time>
);

const renderEvent = (event: EventRecord) => (
  <div className={styles.event}>
    <p className={styles.title}>{event.title}</p>
    <p className={styles.metadata}>
      <SeverityBadge severity={event.severity} />
      <span className={styles.details}>
        {getSourceLabel(event.source)} · {getSiteLabel(event.site)}
      </span>
    </p>
  </div>
);

export const EventsTimeline = () => {
  const { status: workerStatus, isReady: isWorkerReady } = useWorkerStatus();
  const { data: events, error, isLoading } = useTimelineQuery(isWorkerReady);
  const groups = useMemo(() => groupEventsByDay(events ?? []), [events]);
  const workerError =
    workerStatus === 'error' ? 'Worker failed to initialize' : undefined;

  return (
    <Timeline
      groups={groups}
      getItemKey={getEventKey}
      getItemLabel={getEventLabel}
      renderItem={renderEvent}
      renderOppositeContent={renderEventTime}
      isLoading={!workerError && isLoading}
      emptyMessage="No timeline events"
      errorMessage={workerError ?? error?.message}
    />
  );
};
