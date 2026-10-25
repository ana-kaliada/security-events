import type { TableColumn } from '../../../../shared/components/table';
import {
  type EventRecord,
  pageSizes,
  type SortBy,
} from '../../../../worker/protocol.ts';
import { formatDateTime } from '../../../../shared/utils/format-date-time.ts';

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
    renderCell: (event) => event.severity,
    sortable: true,
  },
  {
    id: 'source',
    label: 'Source',
    renderCell: (event) => event.source,
    sortable: true,
  },
  {
    id: 'site',
    label: 'Site',
    renderCell: (event) => event.site,
    sortable: true,
  },
];

export const pageSizeOptions = pageSizes.map(Number);
