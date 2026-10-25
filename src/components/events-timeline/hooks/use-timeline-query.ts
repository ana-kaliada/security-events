import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import {
  getDatasetRevision,
  getTimelineEvents,
  subscribeToDatasetRevision,
} from '../../../worker/client/client.ts';
import type { EventRecord } from '../../../worker/protocol.ts';

const toError = (error: unknown) =>
  error instanceof Error ? error : new Error('Failed to load timeline events');

export const useTimelineQuery = (enabled: boolean) => {
  const revision = useSyncExternalStore(
    subscribeToDatasetRevision,
    getDatasetRevision,
  );
  const [events, setEvents] = useState<EventRecord[] | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const loadedEventsRef = useRef<EventRecord[] | null>(null);

  useEffect(() => {
    if (!enabled) return;

    let isCurrentRequest = true;

    getTimelineEvents()
      .then((data) => {
        if (!isCurrentRequest) return;
        loadedEventsRef.current = data;
        setEvents(data);
        setError(null);
      })
      .catch((caught: unknown) => {
        if (!isCurrentRequest || loadedEventsRef.current) return;
        setError(toError(caught));
      });

    return () => {
      isCurrentRequest = false;
    };
  }, [enabled, revision]);

  return {
    data: events,
    error,
    isLoading: !enabled || (events === null && error === null),
  };
};
