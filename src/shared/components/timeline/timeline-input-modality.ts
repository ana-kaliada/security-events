export type InputModality = 'keyboard' | 'pointer';

let modality: InputModality = 'pointer';

export const getInputModality = () => modality;

export const startInputModalityTracking = () => {
  const onKeyDown = (event: KeyboardEvent) => {
    if (event.metaKey || event.ctrlKey || event.altKey) return;
    modality = 'keyboard';
  };
  const onPointerDown = () => {
    modality = 'pointer';
  };

  window.addEventListener('keydown', onKeyDown, true);
  window.addEventListener('pointerdown', onPointerDown, true);

  return () => {
    window.removeEventListener('keydown', onKeyDown, true);
    window.removeEventListener('pointerdown', onPointerDown, true);
  };
};
