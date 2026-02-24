'use client';

import { ReactNode } from 'react';

import { BookmarkIcon, LibraryIcon } from 'lucide-react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type ListsTabsLayoutProps = {
  myListsContent: ReactNode;
  savedContent: ReactNode;
  disableSaved?: boolean;
  contentClassName?: string;
};

export function ListsTabsLayout({
  myListsContent,
  savedContent,
  disableSaved = false,
  contentClassName = 'mt-6',
}: ListsTabsLayoutProps) {
  return (
    <Tabs defaultValue="my-lists">
      <TabsList>
        <TabsTrigger value="my-lists" className="cursor-pointer gap-1.5">
          <LibraryIcon className="h-3.5 w-3.5" />
          My Lists
        </TabsTrigger>
        <TabsTrigger
          value="saved"
          className="cursor-pointer gap-1.5"
          disabled={disableSaved}
        >
          <BookmarkIcon className="h-3.5 w-3.5" />
          Saved
        </TabsTrigger>
      </TabsList>

      <TabsContent value="my-lists" className={contentClassName}>
        {myListsContent}
      </TabsContent>

      <TabsContent value="saved" className={contentClassName}>
        {savedContent}
      </TabsContent>
    </Tabs>
  );
}
