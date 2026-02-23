import { ContentWrapper } from '@/components/layout/content';
import { ListDetailsViewSkeleton } from '@/components/list-details-view';

export default function ListDetailLoading() {
  return (
    <ContentWrapper>
      <ListDetailsViewSkeleton />
    </ContentWrapper>
  );
}
