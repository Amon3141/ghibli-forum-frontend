export default function GeneralButton({
  onClick: clickHandler, children, className = "", ...rest
}: {
  onClick?: () => void, children: React.ReactNode, className?: string, [key: string]: any
}) {
  return (
    <button className={`
      py-1.5 px-4 box-border rounded-md
      bg-gray-50 border-1 border-gray-200
      hover:bg-primary hover:border-bg-primary hover:cursor-pointer
      transition-all duration-200
      ${className}
    `}
      {...rest}
      onClick={clickHandler}
    >{children}</button>
  );
}