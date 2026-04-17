import type { InputProps } from "./types";

const Input = ({
  name,
  value,
  placeholder,
  label,
  handleInputChange,
}: InputProps) => {
  return (
    <>
      <label className="font-bold text-gray-400"> {label} </label>
      <input
        value={value}
        name={name}
        onChange={handleInputChange}
        className="w-full  px-4 py-2 rounded-lg border border-gray-300 bg-white/80 focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
        placeholder={placeholder}
      />
    </>
  );
};

export default Input;
