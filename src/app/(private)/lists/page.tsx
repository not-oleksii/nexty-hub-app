import { CreateListCard } from './_components/create-list-card';
import { ListsGrid } from './_components/lists-grid';

export default function ListsPage() {
  return (
    <div className="flex flex-col gap-4">
      <CreateListCard />
      <ListsGrid />
    </div>
  );
}
