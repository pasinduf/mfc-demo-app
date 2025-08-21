import React, { ButtonHTMLAttributes, ReactElement } from 'react';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  inverse?: boolean;
  icon?: ReactElement;
}
const Button: React.FC<ButtonProps> = ({
  text,
  onClick,
  className,
  inverse,
  disabled,
  icon,
  ...props
}) => {
  return (
    <button
      className={twMerge(
        `items-center justify-center rounded-full bg-primary py-1 text-center font-medium  hover:bg-opacity-90 px-10 ${
          inverse
            ? 'bg-gray hover:bg-white-200 border-secondary '
            : 'bg-gradient-to-r from-btn-from to-btn-to hover:from-btn-to hover:to-btn-to '
        } ${disabled && 'pointer-events-none bg-opacity-50'}`,
        className,
      )}
      onClick={onClick}
      {...props}
    >
      <div
        className={
          icon ? 'flex px-2 justify-between text-center' : 'text-center'
        }
      >
        <span
          className={`${
            inverse
              ? disabled
                ? 'text-disabled pointer-events-none bg-opacity-50'
                : 'bg-gradient-to-r font-medium from-btn-from to-btn-to bg-clip-text text-form-input'
              : 'text-white'
          }`}
        >
          {text}
        </span>
        {icon}
      </div>
    </button>
  );
};

export default Button;
