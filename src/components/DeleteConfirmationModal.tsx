import { useState } from 'react';
import { Modal } from './modal';
import Button from './button';
import { TrashIcon } from '@heroicons/react/24/solid';

interface Props {
  title: string;
  message: string;
  onSubmit: () => void;
  disabled?: boolean;
}

export const DeleteConfirmationModal = ({
  title,
  message,
  onSubmit,
  disabled = false,
}: Props) => {
  const [open, setOpen] = useState<boolean>(false);

  const onConfirm = () => {
    setOpen(false);
    onSubmit();
  };

  return (
    <>
      <button>
        <TrashIcon
          className={`w-6 cursor-pointer text-danger ${
            disabled && 'pointer-events-none opacity-40'
          }`}
          onClick={() => setOpen(true)}
        />
      </button>
      <Modal
        isOpen={open}
        setIsOpen={setOpen}
        title={title}
        content={
          <div>
            <div className="flex flex-col gap-5.5 p-4 mt-3">
              <div>{message}</div>
              <div className="flex gap-3 mt-6 justify-end text-right">
                <Button text="Yes" onClick={onConfirm} className="bg-danger" />
                <Button text="No" inverse onClick={() => setOpen(false)} />
              </div>
            </div>
          </div>
        }
      />
    </>
  );
};

export default DeleteConfirmationModal;
