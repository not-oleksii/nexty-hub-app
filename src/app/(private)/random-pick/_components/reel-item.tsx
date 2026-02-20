import { Subtitle } from '@/components/typography/subtitle';
import { AlbumImage } from '@/components/ui/album-image';

interface ReelItemProps {
  title: string;
  imageUrl: string | null;
}

export function ReelItem({ title, imageUrl }: ReelItemProps) {
  return (
    <div className="group bg-card flex w-[180px] shrink-0 flex-col overflow-hidden rounded-xl border shadow-sm transition-all">
      <div className="bg-muted relative overflow-hidden">
        <AlbumImage
          title={title}
          src={imageUrl}
          aspectRatio="aspect-4/3"
          className="pointer-events-none h-40 w-full object-cover transition-transform"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition-opacity" />
      </div>

      <div className="flex h-12 w-full items-center justify-center px-3 py-2">
        <Subtitle
          size="base"
          className="text-foreground truncate text-center font-medium transition-colors"
        >
          {title}
        </Subtitle>
      </div>
    </div>
  );
}
