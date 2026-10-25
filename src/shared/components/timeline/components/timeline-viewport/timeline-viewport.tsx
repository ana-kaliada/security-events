import styles from './timeline-viewport.module.css';
import type { TimelineViewportProps } from './timeline-viewport.types.ts';

export const TimelineViewport = ({
  items,
  measureElement,
  totalSize,
  viewportRef,
  children,
}: TimelineViewportProps) => {
  return (
    <div className={styles.viewport} ref={viewportRef}>
      <div className={styles.content} style={{ height: totalSize }}>
        {items.map((item) => (
          <div
            className={styles.row}
            data-index={item.index}
            key={item.key}
            ref={measureElement}
            style={{
              transform: `translateY(${item.start}px)`,
            }}
          >
            {children(item)}
          </div>
        ))}
      </div>
    </div>
  );
};
