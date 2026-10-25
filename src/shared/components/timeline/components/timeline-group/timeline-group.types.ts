import type { ReactNode } from 'react';

export type TimelineGroupProps = {
  label: ReactNode;
  itemCount: number;
  isOpen: boolean;
  onActivate: () => void;
  onOpenChange: (isOpen: boolean) => void;
};
