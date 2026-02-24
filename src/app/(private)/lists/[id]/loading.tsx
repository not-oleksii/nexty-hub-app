import { ListDetailsViewSkeleton } from '@/components/common/list/list-details-view';
import { ContentWrapper } from '@/components/layout/content';

export default function ListDetailLoading() {
  return (
    <ContentWrapper>
      <ListDetailsViewSkeleton />
    </ContentWrapper>
  );
}
