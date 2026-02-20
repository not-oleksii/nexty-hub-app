'use client';

import { MouseEvent, useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { CreateListForm } from '@/components/forms/create-list/create-list-form';
import { Caption } from '@/components/typography/caption';
import { Header } from '@/components/typography/header';
import { Button } from '@/components/ui/button';
import { Card, CardHeader } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ROUTES } from '@/constants/routes';
import type { UserListDetail } from '@/server/lib/lists';

type ListFormCardProps = {
  title: string;
  description: string;
  list?: UserListDetail;
};

export function ListFormCard({ title, description, list }: ListFormCardProps) {
  const router = useRouter();
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const leaveCallbackRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!isDirty) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  const requestLeave = useCallback(
    (navigate: () => void) => {
      if (isDirty) {
        leaveCallbackRef.current = navigate;
        setShowLeaveDialog(true);

        return;
      }

      navigate();
    },
    [isDirty],
  );

  const handleConfirmLeave = useCallback(() => {
    leaveCallbackRef.current?.();
    leaveCallbackRef.current = null;
    setShowLeaveDialog(false);
  }, []);

  const handleStay = useCallback(() => {
    leaveCallbackRef.current = null;
    setShowLeaveDialog(false);
  }, []);

  const handleBackClick = useCallback(
    (e: MouseEvent) => {
      e.preventDefault();

      requestLeave(() => {
        router.push(ROUTES.lists.root);
        router.refresh();
      });
    },
    [requestLeave, router],
  );

  return (
    <>
      <Card className="mx-auto w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-1">
              <Header>{title}</Header>
              <Caption size="base">{description}</Caption>
            </div>
            <Link
              href={ROUTES.lists.root}
              onClick={handleBackClick}
              className="border-input bg-background hover:bg-accent hover:text-accent-foreground inline-flex h-9 items-center justify-center rounded-md border px-4 text-sm font-medium shadow-sm"
            >
              Back
            </Link>
          </div>
        </CardHeader>
        <CreateListForm
          list={list}
          onDirtyChange={setIsDirty}
          onCancelClick={() =>
            requestLeave(() => {
              router.push(ROUTES.lists.root);
              router.refresh();
            })
          }
        />
      </Card>

      <Dialog
        open={showLeaveDialog}
        onOpenChange={(open) => {
          if (!open) handleStay();
        }}
      >
        <DialogContent
          showCloseButton={false}
          onPointerDownOutside={handleStay}
          onEscapeKeyDown={handleStay}
        >
          <DialogHeader>
            <DialogTitle>Leave without saving?</DialogTitle>
            <DialogDescription>
              You have unsaved changes. Are you sure you want to leave? Your
              changes will be lost.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleStay}>
              Stay
            </Button>
            <Button variant="destructive" onClick={handleConfirmLeave}>
              Leave without saving
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
