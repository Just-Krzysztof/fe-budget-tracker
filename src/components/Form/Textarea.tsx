interface TextareaProps {
  textareaName: string;
  placeholder?: string;
  label?: string;
  required?: boolean;
  className?: string;
  error?: string;
  rows?: number;
  cols?: number;
  maxLength?: number;
  minLength?: number;
  readOnly?: boolean;
  disabled?: boolean;
}

export const Textarea = ({
  textareaName,
  placeholder = 'Type here...',
  label = 'Type here...',
  required,
  error,
  rows = 4,
  cols,
  maxLength,
  minLength,
  readOnly,
  disabled,
  ...rest
}: TextareaProps) => {
  return (
    <div className="w-full max-w-xs bg-white rounded-lg font-mono">
      <label className="block text-gray-600 text-sm font-bold mb-2">
        {label}
      </label>
      <textarea
        className="text-sm custom-textarea w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm transition duration-300 ease-in-out transform focus:-translate-y-1 focus:outline-blue-300 hover:shadow-lg hover:border-blue-300 bg-gray-50 resize-none"
        placeholder={placeholder}
        name={textareaName}
        rows={rows}
        cols={cols}
        maxLength={maxLength}
        minLength={minLength}
        readOnly={readOnly}
        disabled={disabled}
        required={required}
        {...rest}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};
