import { cn } from '@/lib/utils/common';

import { Body } from '../typography/body';
import { Progress } from '../ui/progress';

interface ItemsProgressProps {
  value: number;
  maxValue: number;
}

export function ItemsProgress({ value, maxValue }: ItemsProgressProps) {
  const progress = maxValue > 0 ? (value / maxValue) * 100 : 0;
  const progressDisplay = Number.isInteger(progress)
    ? String(progress)
    : progress.toFixed(1);
  const isCompleted = progress >= 100;

  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex w-full items-center justify-between">
        <Body variant="muted">
          {value} / {maxValue} items
        </Body>
        <span
          className={cn(
            'font-medium',
            isCompleted ? 'text-primary' : 'text-foreground',
          )}
        >
          {progressDisplay}%
        </span>
      </div>
      <Progress
        value={progress}
        className={cn('h-1.5', isCompleted && '[&>div]:bg-primary')}
      />
    </div>
  );
}
