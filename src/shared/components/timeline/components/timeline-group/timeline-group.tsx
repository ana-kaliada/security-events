import type { ReactNode, ToggleEvent } from 'react';
import styles from './timeline-group.module.css';

type TimelineGroupProps = {
  label: ReactNode;
  itemCount: number;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

export const TimelineGroup = ({
  label,
  itemCount,
  isOpen,
  onOpenChange,
}: TimelineGroupProps) => {
  const handleToggle = (event: ToggleEvent<HTMLDetailsElement>) => {
    const nextOpen = event.currentTarget.open;

    if (nextOpen !== isOpen) {
      onOpenChange(nextOpen);
    }
  };

  return (
    <details className={styles.card} open={isOpen} onToggle={handleToggle}>
      <summary className={styles.summary}>
        <h2 className={styles.label}>{label}</h2>
        <span className={styles.count}>
          {itemCount} {itemCount === 1 ? 'event' : 'events'}
        </span>
      </summary>
    </details>
  );
};
