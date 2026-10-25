let revision = 0;
const listeners = new Set<() => void>();

export const getDatasetRevision = () => revision;

export const subscribeToDatasetRevision = (listener: () => void) => {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
};

export const bumpDatasetRevision = () => {
  revision += 1;
  listeners.forEach((listener) => listener());
};
