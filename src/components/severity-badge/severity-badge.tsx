import { Badge, type BadgeProps } from '@radix-ui/themes';
import { getSeverityLabel } from '../../shared/libs/event-options.ts';
import type { Severity } from '../../worker/protocol.ts';

const severityColors = {
  info: 'blue',
  warning: 'amber',
  trouble: 'orange',
  critical: 'red',
} as const satisfies Record<Severity, BadgeProps['color']>;

type SeverityBadgeProps = {
  severity: Severity;
};

export const SeverityBadge = ({ severity }: SeverityBadgeProps) => (
  <Badge color={severityColors[severity]} variant="soft">
    {getSeverityLabel(severity)}
  </Badge>
);
