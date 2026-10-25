import styles from './timeline-viewport.module.css';
import type { TimelineViewportProps } from './timeline-viewport.types.ts';

export const TimelineViewport = ({
  items,
  activeIndex,
  announcement,
  measureElement,
  totalSize,
  keyboardFocus,
  viewportRef,
  onKeyDown,
  onFocus,
  onBlur,
  onPointerDown,
  children,
}: TimelineViewportProps) => {
  return (
    <div
      aria-label="Event timeline"
      className={styles.viewport}
      data-keyboard-focus={keyboardFocus ? 'true' : undefined}
      ref={viewportRef}
      tabIndex={0}
      onBlur={onBlur}
      onFocus={onFocus}
      onKeyDown={onKeyDown}
      onPointerDown={onPointerDown}
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
