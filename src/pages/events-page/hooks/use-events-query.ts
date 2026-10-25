import { useEffect, useState, useSyncExternalStore } from 'react';
import {
  getDatasetRevision,
  getEvents,
  subscribeToDatasetRevision,
} from '../../../worker/client.ts';
import type { EventsRequest, EventsResult } from '../../../worker/protocol.ts';

type EventsQueryState = {
  request: EventsRequest;
  data: EventsResult | null;
  error: Error | null;
};

const toError = (error: unknown) =>
  error instanceof Error ? error : new Error('Failed to load events');

export const useEventsQuery = (request: EventsRequest, enabled: boolean) => {
  const revision = useSyncExternalStore(
    subscribeToDatasetRevision,
    getDatasetRevision,
  );
  const [state, setState] = useState<EventsQueryState | null>(null);

  useEffect(() => {
    if (!enabled) return;

    let isCurrentRequest = true;

    getEvents(request)
      .then((data) => {
        if (!isCurrentRequest) return;
        setState({ request, data, error: null });
      })
      .catch((error: unknown) => {
        if (!isCurrentRequest) return;
        setState({ request, data: null, error: toError(error) });
      });

    return () => {
      isCurrentRequest = false;
    };
  }, [enabled, request, revision]);

  const currentState = state?.request === request ? state : null;

  return {
    data: currentState?.data ?? null,
    error: currentState?.error ?? null,
    isLoading:
      !enabled ||
      !currentState ||
      (currentState.data === null && currentState.error === null),
  };
};
