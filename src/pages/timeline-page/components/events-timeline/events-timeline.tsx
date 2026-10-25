import { useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import { Timeline } from '../../../../shared/components/timeline';
import {
  getTimelineEvents,
  getWorkerStatus,
  subscribeToWorkerStatus,
} from '../../../../worker/client.ts';
import type { EventRecord } from '../../../../worker/protocol.ts';
import { groupEventsByDay } from './group-events-by-day.ts';
import styles from './events-timeline.module.css';

const timeFormatter = new Intl.DateTimeFormat('en', {
  timeStyle: 'short',
});

const getEventKey = (event: EventRecord) => event.id;

const getEventLabel = (event: EventRecord) =>
  `${timeFormatter.format(event.occurredAt)}, ${event.title}, ${event.severity}, ${event.source}, ${event.site}`;

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
      {event.severity} · {event.source} · {event.site}
    </p>
  </div>
);

export const EventsTimeline = () => {
  const workerStatus = useSyncExternalStore(
    subscribeToWorkerStatus,
    getWorkerStatus,
  );
  const [events, setEvents] = useState<EventRecord[] | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>();

  useEffect(() => {
    if (workerStatus !== 'ready') return;

    let isCurrentRequest = true;

    getTimelineEvents()
      .then((result) => {
        if (!isCurrentRequest) return;
        setEvents(result);
      })
      .catch((error: unknown) => {
        if (!isCurrentRequest) return;
        setErrorMessage(
          error instanceof Error
            ? error.message
            : 'Failed to load timeline events',
        );
      });

    return () => {
      isCurrentRequest = false;
    };
  }, [workerStatus]);

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
      isLoading={!workerError && !events && !errorMessage}
      emptyMessage="No timeline events"
      errorMessage={workerError ?? errorMessage}
    />
  );
};
