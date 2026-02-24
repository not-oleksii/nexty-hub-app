'use client';

import { BookmarkIcon, LibraryIcon } from 'lucide-react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { ListsGrid } from './lists-grid';
import { SavedListsGrid } from './saved-lists-grid';

export function ListsTabs() {
  return (
    <Tabs defaultValue="my-lists">
      <TabsList>
        <TabsTrigger value="my-lists" className="cursor-pointer gap-1.5">
          <LibraryIcon className="h-3.5 w-3.5" />
          My Lists
        </TabsTrigger>
        <TabsTrigger value="saved" className="cursor-pointer gap-1.5">
          <BookmarkIcon className="h-3.5 w-3.5" />
          Saved
        </TabsTrigger>
      </TabsList>

      <TabsContent value="my-lists" className="mt-6">
        <ListsGrid />
      </TabsContent>

      <TabsContent value="saved" className="mt-6">
        <SavedListsGrid />
      </TabsContent>
    </Tabs>
  );
}
