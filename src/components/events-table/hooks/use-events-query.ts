import { useEffect, useState, useSyncExternalStore } from 'react';
import {
  getDatasetRevision,
  getEvents,
  subscribeToDatasetRevision,
} from '../../../worker/client/client.ts';
import type { EventsRequest, EventsResult } from '../../../worker/protocol.ts';

type EventsQueryState = {
  requestKey: string;
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
  const requestKey = JSON.stringify(request);
  const [state, setState] = useState<EventsQueryState | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const activeRequest = JSON.parse(requestKey) as EventsRequest;
    let isCurrentRequest = true;

    getEvents(activeRequest)
      .then((data) => {
        if (!isCurrentRequest) return;
        setState({ requestKey, data, error: null });
      })
      .catch((error: unknown) => {
        if (!isCurrentRequest) return;
        setState({ requestKey, data: null, error: toError(error) });
      });

    return () => {
      isCurrentRequest = false;
    };
  }, [enabled, requestKey, revision]);

  const currentState = state?.requestKey === requestKey ? state : null;

  return {
    data: currentState?.data ?? null,
    error: currentState?.error ?? null,
    isLoading:
      !enabled ||
      !currentState ||
      (currentState.data === null && currentState.error === null),
  };
};
