export default function InputField({
  value, onChange, placeholder, type="text"
}: {
  value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, placeholder: string, type?: string
}) {
  return (
    <input className="small-text py-1.5 sm:py-2 px-2 sm:px-2.5 w-full border-1 border-gray-300 rounded-md box-border bg-gray-50 focus:outline-none"
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  );
}