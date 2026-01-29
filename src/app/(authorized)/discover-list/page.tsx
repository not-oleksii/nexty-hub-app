import { Box } from '@/components/layout/box';
import { ContentWrapper } from '@/components/layout/content';
import { Header1 } from '@/components/typography/header1';
import { Button } from '@/components/ui/button';

const DUMMY_MOVIES_LISTS = [
  {
    id: 'lorem-1',
    name: 'Party Favors',
  },
  {
    id: 'lorem-2',
    name: 'Last Call',
  },
  {
    id: 'lorem-3',
    name: 'The Last Dance',
  },
];

export default function DiscoverListPage() {
  return (
    <ContentWrapper>
      <Header1>Discover List</Header1>
      <Box className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"></Box>
    </ContentWrapper>
  );
}
