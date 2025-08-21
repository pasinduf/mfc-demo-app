import { Fragment, InputHTMLAttributes, useState } from 'react';
import { Combobox, Transition } from '@headlessui/react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/20/solid';
import { Option } from '../entries/options';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  options: any[];
  value: string | number;
  onChangeSelect: (option: Option) => void;
  getOptionLabel?: (option: Option) => void;
  clearSelected?: boolean;
  hideSearchIcon?: boolean;
}

export const AutoComplete = ({
  options,
  value,
  onChangeSelect,
  getOptionLabel,
  placeholder,
  clearSelected,
  hideSearchIcon,
}: InputProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const items =
    searchTerm === ''
      ? options
      : options.filter(
          (x) => x.name.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0,
        );

  const onSelect = (event: any) => {
    const selected = event ? options.find((x) => x.value === event) : null;
    onChangeSelect(selected);
  };

  return (
    <Combobox
      value={
        options?.length
          ? options?.find(
              (option: Option) =>
                option.value?.toString() === value?.toString(),
            )
          : null
      }
      onChange={onSelect}
    >
      <div className="relative">
        <div className="w-full h-11">
          {!hideSearchIcon && (
            <MagnifyingGlassIcon className="ml-3 h-5 w-5 mt-3 text-input-icon absolute" />
          )}
          <Combobox.Input
            className={`pl-10 w-full appearance-none border-[2px] py-2 px-5 rounded-md border-stroke bg-transparent outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`}
            displayValue={(option: any) => option?.name}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder={placeholder || 'Search'}
          />
          {clearSelected && value != '' && (
            <span
              className="absolute inset-y-0 right-0 flex items-center pr-2"
              onClick={() => onSelect(null)}
            >
              <XMarkIcon
                className="h-5 w-5 text-input-icon cursor-pointer"
                aria-hidden="true"
              />
            </span>
          )}
        </div>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          afterLeave={() => setSearchTerm('')}
        >
          <Combobox.Options className="absolute z-30 w-80 overflow-auto rounded-2xl bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {options.length === 0 && searchTerm !== '' ? (
              <div className="relative select-none py-2 px-4 text-gray-700">
                Nothing found.
              </div>
            ) : (
              items.map((item) => (
                <Combobox.Option
                  key={item?.value}
                  className={({ active }) =>
                    `select-none py-2 mx-2 my-1 pl-2 pr-4 rounded-2xl ${
                      active &&
                      options?.find(
                        (option: Option) =>
                          option.value?.toString() != item.value.toString(),
                      )
                        ? 'bg-option-border'
                        : 'text-gray-900'
                    } ${
                      options?.find(
                        (option: Option) =>
                          option.value?.toString() == item.value.toString(),
                      ) && 'bg-option-border'
                    }`
                  }
                  value={item?.value}
                >
                  {({ active }) => (
                    <span
                      className={`block truncate ${
                        active ? 'font-medium' : 'font-normal'
                      }`}
                    >
                      {getOptionLabel ? getOptionLabel(item) : item?.name}
                    </span>
                  )}
                </Combobox.Option>
              ))
            )}
          </Combobox.Options>
        </Transition>
      </div>
    </Combobox>
  );
};
