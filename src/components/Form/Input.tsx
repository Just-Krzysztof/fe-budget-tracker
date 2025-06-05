interface InputProps {
  inputName: string;
  inputType: 'text' | 'number' | 'email' | 'password';
  placeholder?: string;
  label?: string;
  required?: boolean;
  className?: string;
}

export const Input = ({
  inputName,
  inputType,
  placeholder = 'Type here...',
  label = 'Type here...',
  required,
  ...rest
}: InputProps) => {
  return (
    <div className="w-full max-w-xs bg-white rounded-lg font-mono">
      <label className="block text-gray-600 text-sm font-bold mb-2">
        {label}
      </label>
      <input
        className="text-sm custom-input w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm transition duration-300 ease-in-out transform focus:-translate-y-1 focus:outline-blue-300 hover:shadow-lg hover:border-blue-300 bg-gray-50"
        placeholder={placeholder}
        type={inputType}
        name={inputName}
        required={required}
        {...rest}
      />
    </div>
  );
};
