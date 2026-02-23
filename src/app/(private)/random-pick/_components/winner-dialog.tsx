'use client';

import { Header } from '@/components/typography/header';
import { Subtitle } from '@/components/typography/subtitle';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { DynamicCover } from '@/components/ui/dynamic-cover';

import { Reel } from './random-reel';

interface WinnerDialogProps {
  open: boolean;
  winner: Reel | null;
  onOpenChange: (open: boolean) => void;
}

export function WinnerDialog({
  open,
  winner,
  onOpenChange,
}: WinnerDialogProps) {
  if (!winner) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-primary/20 overflow-hidden shadow-[0_0_50px_-12px_hsl(var(--primary)/0.3)] sm:max-w-sm">
        <DialogHeader className="flex flex-col items-center">
          <DialogTitle className="animate-in fade-in slide-in-from-top-4 text-2xl font-bold duration-500">
            You picked a winner!
          </DialogTitle>

          <DialogDescription className="sr-only">
            The randomly selected winner is {winner.title}.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-6 overflow-hidden py-6">
          <div className="animate-in zoom-in-50 fill-mode-both relative delay-150 duration-500">
            <div className="bg-primary/40 absolute -inset-2 animate-pulse rounded-xl blur-2xl" />

            <DynamicCover
              title={winner.title}
              src={winner.imageUrl}
              aspectRatio="aspect-album"
              strictHosts
              className="border-primary/50 relative z-10 w-48 rounded-xl border-2 shadow-xl"
            />
          </div>

          <div className="animate-in fade-in slide-in-from-bottom-6 fill-mode-both text-center delay-300 duration-500">
            <Header size="lg" className="text-primary">
              {winner.title}
            </Header>
            {winner.category && (
              <Subtitle className="text-muted-foreground mt-1">
                {winner.category}
              </Subtitle>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
