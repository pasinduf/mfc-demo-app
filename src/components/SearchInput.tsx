import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { InputHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export const SearchInput = ({
  name,
  value,
  disabled,
  placeholder,
  type,
  onChange,
  className,
  onBlur,
  ...props
}: InputProps) => {
  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    onBlur && onBlur(event);
  };

  return (
    <div className="relative">
      <div className="absolute top-1/2 left-0 -translate-y-1/2">
        <MagnifyingGlassIcon className="h-5 ml-2" />
      </div>
      <input
        type="text"
        className={twMerge(
          'w-full py-2 px-5 pr-4 pl-9 rounded-md border-[2px] border-stroke bg-transparent outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary',
          className,
        )}
        name={name}
        onChange={onChange}
        onBlur={handleFocus}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        {...props}
      />
    </div>
  );
};
