import * as yup from 'yup';
import { formatLocalDate } from '../../../../shared/utils/format-local-date.ts';
import {
  severities,
  sites,
  sources,
  type Severity,
  type Site,
  type Source,
} from '../../../../worker/protocol.ts';

export type EventFormValues = {
  title: string;
  occurredAt: string;
  severity: Severity;
  source: Source;
  site: Site;
};

export const toOccurredAt = (date: string) => {
  const now = new Date();
  const [year = 0, month = 1, day = 1] = date.split('-').map(Number);

  return new Date(
    year,
    month - 1,
    day,
    now.getHours(),
    now.getMinutes(),
    now.getSeconds(),
    now.getMilliseconds(),
  ).getTime();
};

export const createEventFormValues = (
  event?: {
    title: string;
    occurredAt: number;
    severity: Severity;
    source: Source;
    site: Site;
  } | null,
): EventFormValues => ({
  title: event?.title ?? '',
  occurredAt: event ? formatLocalDate(event.occurredAt) : '',
  severity: event?.severity ?? severities[0],
  source: event?.source ?? sources[0],
  site: event?.site ?? sites[0],
});

export const eventUpdateFormSchema: yup.ObjectSchema<EventFormValues> =
  yup.object({
    title: yup.string().trim().required('Title is required'),
    occurredAt: yup
      .string()
      .required('Date is required')
      .test('date', 'Date is invalid', (value) =>
        Number.isFinite(new Date(value).getTime()),
      ),
    severity: yup.string<Severity>().oneOf(severities).required(),
    source: yup.string<Source>().oneOf(sources).required(),
    site: yup.string<Site>().oneOf(sites).required(),
  });
