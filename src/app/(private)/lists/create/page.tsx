import { ContentWrapper } from '@/components/layout/content';

import { ListFormCard } from '../_components/list-form-card';

export default function CreateListPage() {
  return (
    <ContentWrapper className="flex flex-col gap-6">
      <ListFormCard
        title="Create List"
        description="Create a new list to organize your discover items"
      />
    </ContentWrapper>
  );
}
