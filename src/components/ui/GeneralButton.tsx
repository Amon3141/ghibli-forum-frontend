interface GeneralButtonProps {
  children: React.ReactNode,
  color?: 'default' | 'primary' | 'delete'
  onClick?: () => void,
  className?: string,
  [key: string]: any
}

export default function GeneralButton({
  onClick: clickHandler, children, className = "", color = 'default', ...rest
}: GeneralButtonProps) {
  let buttonStyle: string;
  switch (color) {
    case 'default':
      buttonStyle = 'bg-gray-50 border-gray-200 hover:bg-gray-100';
      break;
    case 'primary':
      buttonStyle = 'bg-gray-50 border-gray-200 hover:bg-primary hover:border-primary';
      break;
    case 'delete':
      buttonStyle = 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100 hover:border-red-300';
      break;
  }

  return (
    <button className={`
      small-text
      py-1.5 sm:py-1.5 px-3 sm:px-3.5 box-border rounded
      border-1 hover:cursor-pointer
      transition-all duration-200
      ${buttonStyle}
      ${className}
    `}
      {...rest}
      onClick={clickHandler}
    >{children}</button>
  );
}

