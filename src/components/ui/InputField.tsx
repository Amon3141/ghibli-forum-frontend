export default function InputField ({
  value, onChange, placeholder, type="text"
}: {
  value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, placeholder: string, type?: string
}) {
  return (
    <input className="py-2 px-3 w-full border-1 border-gray-300 rounded-md box-border bg-gray-50 focus:outline-none"
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  );
}