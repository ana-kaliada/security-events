import styles from './timeline-viewport.module.css';
import type { TimelineViewportProps } from './timeline-viewport.types.ts';

export const TimelineViewport = ({
  items,
  activeIndex,
  announcement,
  measureElement,
  totalSize,
  viewportRef,
  onKeyDown,
  onFocus,
  children,
}: TimelineViewportProps) => {
  return (
    <div
      aria-label="Event timeline"
      className={styles.viewport}
      ref={viewportRef}
      tabIndex={0}
      onFocus={onFocus}
      onKeyDown={onKeyDown}
    >
      <span className={styles.visuallyHidden} role="status">
        {announcement}
      </span>
      <div className={styles.content} style={{ height: totalSize }}>
        {items.map((item) => (
          <div
            className={styles.row}
            data-active={item.index === activeIndex ? 'true' : undefined}
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
