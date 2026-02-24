'use client';

import { ListsTabsLayout } from '@/components/lists-tabs-layout';

import { ListsGrid } from './lists-grid';
import { SavedListsGrid } from './saved-lists-grid';

export function ListsTabs() {
  return (
    <ListsTabsLayout
      myListsContent={<ListsGrid />}
      savedContent={<SavedListsGrid />}
    />
  );
}
