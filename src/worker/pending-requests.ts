type PendingRequest<Result> = {
  resolve: (result: Result) => void;
  reject: (error: Error) => void;
};

export const createPendingRequests = <Result>() => {
  let nextRequestId = 0;
  const requests = new Map<number, PendingRequest<Result>>();

  const take = (requestId: number) => {
    const request = requests.get(requestId);
    requests.delete(requestId);
    return request;
  };

  return {
    create() {
      const requestId = ++nextRequestId;
      let resolve!: (result: Result) => void;
      let reject!: (error: Error) => void;

      const promise = new Promise<Result>((resolvePromise, rejectPromise) => {
        resolve = resolvePromise;
        reject = rejectPromise;
      });

      requests.set(requestId, { resolve, reject });
      return { requestId, promise };
    },

    resolve(requestId: number, result: Result) {
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
