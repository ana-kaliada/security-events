import type { PointerEvent, ToggleEvent } from 'react';
import styles from './timeline-group.module.css';
import type { TimelineGroupProps } from './timeline-group.types.ts';

export const TimelineGroup = ({
  label,
  itemCount,
  isOpen,
  onActivate,
  onOpenChange,
}: TimelineGroupProps) => {
  const handleToggle = (event: ToggleEvent<HTMLDetailsElement>) => {
    const nextOpen = event.currentTarget.open;

    if (nextOpen !== isOpen) {
      onOpenChange(nextOpen);
    }
  };

  const handlePointerDown = (event: PointerEvent<HTMLElement>) => {
    event.preventDefault();
    onActivate();
  };

  return (
    <details
      className={styles.card}
      data-focus-target=""
      open={isOpen}
      onToggle={handleToggle}
    >
      <summary
        className={styles.summary}
        tabIndex={-1}
        onPointerDown={handlePointerDown}
      >
        <h2 className={styles.label}>{label}</h2>
        <span className={styles.count}>
          {itemCount} {itemCount === 1 ? 'event' : 'events'}
        </span>
      </summary>
    </details>
  );
};
