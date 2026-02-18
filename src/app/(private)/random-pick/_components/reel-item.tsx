import { Subtitle2 } from '@/components/typography/subtitle2';
import { AlbumImage } from '@/components/ui/album-image';

interface ReelItemProps {
  title: string;
  imageUrl: string | null;
}

export function ReelItem({ title, imageUrl }: ReelItemProps) {
  return (
    <div className="w-[180px] shrink-0">
      <AlbumImage
        title={title}
        src={imageUrl}
        aspectRatio="aspect-4/3"
        className="pointer-events-none h-50 w-full"
      />
      <div className="bg-muted mt-2 rounded-md p-2">
        <Subtitle2 className="truncate">{title}</Subtitle2>
      </div>
    </div>
  );
}
