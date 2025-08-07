import Link from "next/link";

export enum ItemCardColor {
  Amber = "amber",
  Orange = "orange",
}

interface ProfileItemCardProps {
  title: string;
  item: string;
  itemUrl?: string
  itemCardColor: ItemCardColor;
}

export default function ProfileItemCard(props: ProfileItemCardProps) {
  const getItemCardColor = (itemCardColor: ItemCardColor) => {
    switch (itemCardColor) {
      case ItemCardColor.Amber:
        return "bg-amber-50/80";
      case ItemCardColor.Orange:
        return "bg-orange-50/80";
      default:
        return "bg-stone-50/80";
    }
  }
  return (
    <div className={`flex flex-col ${getItemCardColor(props.itemCardColor)} border border-stone-200/60 rounded-lg gap-0.5 shadow-xs px-2 pb-1.5 min-w-[80px] sm:min-w-[100px]`}>
      <div className="flex items-center pt-1">
        <div className="text-stone-500 text-[0.5rem] sm:text-[0.6rem] font-bold whitespace-nowrap">{props.title}</div>
      </div>
      <div>
        <div className="text-stone-700 small-text font-medium">
          {props.itemUrl ? (
            <Link href={props.itemUrl}>{props.item}</Link>
          ) : (
            <span>{props.item}</span>
          )}
        </div>
      </div>
    </div>
  );
}