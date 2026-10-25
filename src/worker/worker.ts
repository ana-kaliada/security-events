setTimeout(() => {
  self.postMessage({ type: 'READY' });
}, 1500);

export {};
