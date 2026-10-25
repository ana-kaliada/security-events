import type { TableColumn } from '../../shared/components/table';
import {
  getSiteLabel,
  getSourceLabel,
} from '../../shared/libs/event-options.ts';
import { formatDateTime } from '../../shared/utils/format-date-time.ts';
import type { EventRecord, SortBy } from '../../worker/protocol.ts';
import { SeverityBadge } from '../severity-badge/severity-badge.tsx';

export const columns: readonly TableColumn<EventRecord, SortBy>[] = [
  {
    id: 'title',
    label: 'Title',
    renderCell: (event) => event.title,
    rowHeader: true,
    sortable: true,
  },
  {
    id: 'occurredAt',
    label: 'Occurred at',
    renderCell: (event) => formatDateTime(event.occurredAt),
    sortable: true,
  },
  {
    id: 'severity',
    label: 'Severity',
    renderCell: (event) => <SeverityBadge severity={event.severity} />,
    sortable: true,
  },
  {
    id: 'source',
    label: 'Source',
    renderCell: (event) => getSourceLabel(event.source),
    sortable: true,
  },
  {
    id: 'site',
    label: 'Site',
    renderCell: (event) => getSiteLabel(event.site),
    sortable: true,
  },
];
