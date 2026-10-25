import { Button, Dialog, type ButtonProps } from '@radix-ui/themes';
import { useId, useState, type ReactNode } from 'react';
import type { EventRecord } from '../../worker/protocol.ts';
import { EventUpdateForm } from './componets/event-update-form/event-update-form.tsx';
import styles from './event-update-modal.module.css';

type EventFormDialogProps = {
  event?: EventRecord | null;
  children: ReactNode;
  buttonProps?: Omit<ButtonProps, 'type' | 'onClick'>;
};

export const EventUpdateModal = ({
  event = null,
  children,
  buttonProps,
}: EventFormDialogProps) => {
  const formId = useId();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  return (
    <div className={styles.root}>
      <Dialog.Root
        open={open}
        onOpenChange={(nextOpen) => {
          if (nextOpen) setStatusMessage('');
          setOpen(nextOpen);
        }}
      >
        <Dialog.Trigger>
          <Button type="button" {...buttonProps}>
            {children}
          </Button>
        </Dialog.Trigger>
        <Dialog.Content className={styles.content}>
          <Dialog.Title as="h2">
            {event ? 'Edit event' : 'New event'}
          </Dialog.Title>
          <Dialog.Description>Title and date are required.</Dialog.Description>
          <EventUpdateForm
            event={event}
            formId={formId}
            onSubmittingChange={setIsSubmitting}
            onSuccess={(message) => {
              setOpen(false);
              setStatusMessage(message);
            }}
          />
          <div className={styles.actions}>
            <Dialog.Close>
              <Button type="button" variant="soft" disabled={isSubmitting}>
                Cancel
              </Button>
            </Dialog.Close>
            <Button type="submit" form={formId} disabled={isSubmitting}>
              Save
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Root>
      <p
        className={statusMessage ? styles.status : styles.visuallyHidden}
        role="status"
      >
        {statusMessage}
      </p>
    </div>
  );
};
