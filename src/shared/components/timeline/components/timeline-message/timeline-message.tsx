import styles from './timeline-message.module.css';
import type { TimelineMessageProps } from './timeline-message.types.ts';

export const TimelineMessage = ({
  isLoading = false,
  emptyMessage = 'No timeline events',
  errorMessage,
}: TimelineMessageProps) => {
  const type = errorMessage ? 'error' : isLoading ? 'loading' : 'empty';
  const message =
    errorMessage ?? (isLoading ? 'Loading timeline' : emptyMessage);
  const statusMessage =
    type === 'error'
      ? `Timeline failed to load: ${errorMessage}`
      : type === 'loading'
        ? 'Timeline is loading'
        : emptyMessage;

  return (
    <>
      <span className={styles.visuallyHidden} role="status">
        {statusMessage}
      </span>
      <p
        className={`${styles.message} ${type === 'error' ? styles.error : ''}`}
        role={type === 'error' ? 'alert' : undefined}
      >
        {message}
      </p>
    </>
  );
};
