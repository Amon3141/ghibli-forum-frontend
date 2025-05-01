export default function GeneralButton({
  onClick: clickHandler, children, ...rest
}: {
  onClick?: () => void, children: React.ReactNode, [key: string]: any
}) {
  return (
    <button className="
      py-1.5 px-4 box-sizing border-box rounded-md
      bg-gray-50 hover:bg-primary
      border-1 border-gray-300
    "
      {...rest}
      onClick={clickHandler}
    >{children}</button>
  );
}