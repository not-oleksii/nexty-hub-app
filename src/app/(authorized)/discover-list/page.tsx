import { ContentWrapper } from '@/components/layout/content';
import { Caption1 } from '@/components/typography/caption1';
import { Header1 } from '@/components/typography/header1';

type DiscoverItem = {
  id: string;
  type: string;
  title: string;
  category?: string | null;
  imageUrl?: string | null;
};

async function getDiscoverItems(): Promise<DiscoverItem[]> {
  const res = await fetch('//api/discover', { cache: 'no-store' });
  const data = (await res.json()) as { items: DiscoverItem[] };

  return data.items;
}

export default async function DiscoverListPage() {
  const items = await getDiscoverItems();

  return (
    <ContentWrapper>
      <Header1>Discover</Header1>
      <Caption1>All items (movies, series, games, books, ...)</Caption1>

      <div className="mt-4">
        <a
          className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
          href="/discover-list/add"
        >
          Add item
        </a>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div key={item.id} className="rounded-xl border bg-card p-4">
            <div className="text-xs text-muted-foreground">{item.type}</div>
            <div className="mt-1 font-medium">{item.title}</div>
            {item.category ? (
              <div className="mt-1 text-xs text-muted-foreground">{item.category}</div>
            ) : null}
          </div>
        ))}
      </div>
    </ContentWrapper>
  );
}
