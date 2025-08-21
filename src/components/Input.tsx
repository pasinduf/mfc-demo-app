import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { InputHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  searchIcon?: boolean;
  type?: string;
}

const Input = ({
  name,
  value,
  disabled,
  placeholder,
  searchIcon,
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
    <div className="relative flex items-center">
      {searchIcon && (
        <MagnifyingGlassIcon className="ml-3 h-5 w-5 text-input-icon absolute" />
      )}
      <input
        type={type || 'text'}
        className={twMerge(
          'w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary',
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

export default Input;

