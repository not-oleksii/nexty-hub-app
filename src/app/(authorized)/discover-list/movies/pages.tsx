import { ContentWrapper } from '@/components/layout/content';
import { Caption1 } from '@/components/typography/caption1';
import { Header1 } from '@/components/typography/header1';

type DiscoverItem = {
  id: string;
  type: string;
  title: string;
  category?: string | null;
};

async function getMovies(): Promise<DiscoverItem[]> {
  const res = await fetch('//api/discover/movies', { cache: 'no-store' });
  const data = (await res.json()) as { items: DiscoverItem[] };

  return data.items;
}

export default async function DiscoverMoviesPage() {
  const items = await getMovies();

  return (
    <ContentWrapper>
      <Header1>Movies</Header1>
      <Caption1>Movies only</Caption1>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div key={item.id} className="rounded-xl border bg-card p-4">
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
