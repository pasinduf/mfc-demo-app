import { InputHTMLAttributes } from 'react';
import { Option } from '../entries/options';
import Select from 'react-select';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  options: Option[];
  selectedOptions: any;
  onSelectOptions: (items: any) => void;
  disabled?: boolean;
}

export const MultiselectDropdown = ({
  name,
  options,
  selectedOptions,
  onSelectOptions,
  disabled,
}: InputProps) => {
  return (
    <Select
      defaultValue={[]}
      isMulti
      name={name}
      options={options}
      styles={{
        control: (baseStyles, state) => ({
          ...baseStyles,
          borderColor: state.isFocused ? 'grey' : 'border-primary',
        }),
      }}
      classNamePrefix="select"
      value={selectedOptions}
      getOptionLabel={(option) => option.name}
      onChange={onSelectOptions}
      isDisabled={disabled}
    />
  );
};
