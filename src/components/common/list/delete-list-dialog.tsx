'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Trash2Icon } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';
import { ROUTES } from '@/constants/routes';
import { getErrorMessage } from '@/lib/utils/common';
import { listsKeys, listsMutations } from '@/server/api/queries/lists.queries';

type DeleteListDialogProps = {
  listId: string;
  listName: string;
};

export function DeleteListDialog({ listId, listName }: DeleteListDialogProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    ...listsMutations.delete(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: listsKeys.all });
      toast.success('List deleted successfully');

      setOpen(false);
      router.push(ROUTES.lists.root);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate(listId);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <Trash2Icon className="mr-1.5 h-4 w-4" />
          Delete List
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete &ldquo;{listName}&rdquo;?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your list
            and remove it for all users who have saved it.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="ghost"
            onClick={() => setOpen(false)}
            disabled={deleteMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? (
              <Spinner />
            ) : (
              <Trash2Icon className="mr-1.5 h-4 w-4" />
            )}
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
