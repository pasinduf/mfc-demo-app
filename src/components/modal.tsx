import { Dialog, Transition } from '@headlessui/react';
import { Fragment, ReactElement } from 'react';

interface Props {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  title: string;
  content: ReactElement;
  size?: 'small' | 'medium' | 'large';
}

export const Modal = ({ isOpen, setIsOpen, title, content, size = 'medium' }: Props) => {
  const onClose = () => setIsOpen(false);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50 mx-2" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center backdrop-blur-sm backdrop-brightness-75">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                className={`w-full ${size === 'small' ? 'max-w-sm' : size === 'medium' ? 'max-w-md' : 'max-w-2xl'} mx-4 transform overflow-hidden rounded-large bg-white p-6 text-left align-middle shadow-xl transition-all`}
              >
                <div
                  className="float-right cursor-pointer -mt-4"
                  onClick={onClose}
                >
                  X
                </div>
                <Dialog.Title className="text-lg font-semibold leading-6 text-gray-900">
                  {title}
                </Dialog.Title>
                <div className="text-base">{content}</div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
