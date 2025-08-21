import { twMerge } from 'tailwind-merge';

export const AVAILABLE_STATUSES = {
  success: 'success',
  error: 'error',
  warning: 'warning',
  default: 'default',
};

type Props = {
  type: keyof typeof AVAILABLE_STATUSES;
  text?: string;
  className?: string;
};

export const Badge = ({ type, text, className }: Props) => {
  return (
    <span
      className={twMerge(
        `px-3 py-1.5 rounded-full font-semibold ${
          type === AVAILABLE_STATUSES.success
            ? 'bg-success text-white'
            : type === AVAILABLE_STATUSES.error
            ? 'bg-danger text-white'
            : type === AVAILABLE_STATUSES.warning
            ? 'bg-warning text-white'
            : 'bg-primary text-white'
        }`,
        className,
      )}
    >
      {text}
    </span>
  );
};
