import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

type UrlStateConfig<State> = {
  parse: (params: URLSearchParams) => State;
  serialize: (state: State) => URLSearchParams;
};

export type UpdateUrlStateOptions = {
  replace?: boolean;
};

export const useUrlState = <State>({
  parse,
  serialize,
}: UrlStateConfig<State>) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.toString();
  const state = useMemo(
    () => parse(new URLSearchParams(search)),
    [parse, search],
  );

  const updateState = useCallback(
    (
      update: (currentState: State) => State,
      options?: UpdateUrlStateOptions,
    ) => {
      setSearchParams(serialize(update(state)), {
        replace: options?.replace,
      });
    },
    [serialize, setSearchParams, state],
  );

  return { state, updateState };
};
