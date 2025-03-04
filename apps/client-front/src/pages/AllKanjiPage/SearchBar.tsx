import SearchIcon from "@/assets/icons/search.svg?react";

interface Props {
  value: string;
  onChange?: (v: string) => void;
}
export default function SearchBar({ onChange, value }: Props) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(event.target.value);
  };

  return (
    <div className="flex items-center space-x-2 rounded-[10px] bg-black/10 p-2">
      <SearchIcon className="stroke-rolling-stone size-[20px]" />

      <input
        className="w-full outline-none"
        type="text"
        placeholder="Search..."
        onChange={handleChange}
        value={value}
        spellCheck="false"
        autoComplete="off"
        autoCorrect="off"
      />
    </div>
  );
}
