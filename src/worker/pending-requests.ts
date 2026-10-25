type PendingRequest = {
  resolve: (result: unknown) => void;
  reject: (error: Error) => void;
};

export const createPendingRequests = () => {
  let nextRequestId = 0;
  const requests = new Map<number, PendingRequest>();

  const take = (requestId: number) => {
    const request = requests.get(requestId);
    requests.delete(requestId);
    return request;
  };

  return {
    create<Result>() {
      const requestId = ++nextRequestId;
      let resolve!: (result: Result) => void;
      let reject!: (error: Error) => void;

      const promise = new Promise<Result>((resolvePromise, rejectPromise) => {
        resolve = resolvePromise;
        reject = rejectPromise;
      });

      requests.set(requestId, {
        resolve: (result) => resolve(result as Result),
        reject,
      });
      return { requestId, promise };
    },

    resolve(requestId: number, result: unknown) {
      take(requestId)?.resolve(result);
    },

    reject(requestId: number, error: Error) {
      take(requestId)?.reject(error);
    },

    rejectAll(error: Error) {
      requests.forEach(({ reject }) => reject(error));
      requests.clear();
    },
  };
};
