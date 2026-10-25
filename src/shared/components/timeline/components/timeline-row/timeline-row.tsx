import styles from './timeline-row.module.css';
import type { TimelineRowProps } from './timeline-row.types.ts';

export const TimelineRow = <Item,>({
  item,
  isFirstInGroup,
  isLastInGroup,
  renderItem,
  renderOppositeContent,
}: TimelineRowProps<Item>) => {
  return (
    <article
      className={`${styles.item} ${
        renderOppositeContent ? '' : styles.itemWithoutOpposite
      } ${isFirstInGroup ? styles.itemFirst : ''} ${
        isLastInGroup ? styles.itemLast : ''
      }`}
    >
      {renderOppositeContent && (
        <div className={styles.oppositeContent}>
          {renderOppositeContent(item)}
        </div>
      )}
      <span className={styles.separator}>
        <span className={styles.marker} />
      </span>
      <div className={styles.itemContent} data-focus-target="">
        {renderItem(item)}
      </div>
    </article>
  );
};
