import { IconType } from "react-icons";

interface AnalyticsIconProps {
  icon: IconType;
  analyticsNumber?: number;
  color: "primary" | "rose";
  size?: "normal" | "small";
}

export default function AnalyticsIcon({
  icon: Icon, analyticsNumber, color, size = "normal"
}: AnalyticsIconProps) {
  let buttonColorStyle: string;
  switch (color) {
    case 'primary':
      buttonColorStyle = 'bg-primary/50 border-primary';
      break;
    case 'rose':
      buttonColorStyle = 'bg-rose-100 border-rose-200';
      break;
  }

  let buttonSizeStyle: string;
  let numberStyle: string;
  switch (size) {
    case 'normal':
      buttonSizeStyle = 'gap-1';
      numberStyle = 'text-sm sm:text-base';
      break;
    case 'small':
      buttonSizeStyle = 'gap-[3px]';
      numberStyle = 'text-[11px] sm:text-sm';
  }

  return (
    <div className={`flex items-center px-2 py-1 border-1 rounded-full flex-shrink-0 ${buttonColorStyle} ${buttonSizeStyle}`}>
      <Icon className="text-textcolor text-sm sm:text-base"/>
      <span className={numberStyle}>{analyticsNumber ?? 0}</span>
    </div>
  );
}
