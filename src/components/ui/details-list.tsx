import { Body } from '../typography/body';
import { Label } from '../typography/label';
import { Subtitle2 } from '../typography/subtitle2';

type DetailsRowProps = {
  label: string;
  value: string;
};

type DetailsListProps = {
  items: DetailsRowProps[];
};

export function DetailsRow({ label, value }: DetailsRowProps) {
  return (
    <div className="flex items-start gap-2">
      <Subtitle2 className="w-36 text-left">{label}</Subtitle2>
      <Body className="w-full text-left">{value}</Body>
    </div>
  );
}

export function DetailsList({ items }: DetailsListProps) {
  return (
    <div className="flex flex-col gap-2">
      {items.map((item) => (
        <DetailsRow key={item.label} label={item.label} value={item.value} />
      ))}
    </div>
  );
}
