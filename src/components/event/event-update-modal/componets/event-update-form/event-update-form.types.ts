import type { EventRecord } from '../../../../../worker/protocol.ts';

export type EventFormProps = {
  event: EventRecord | null;
  formId: string;
  onSubmittingChange: (isSubmitting: boolean) => void;
  onSuccess: (message: string) => void;
};
