
interface Props {
  label: string;
  isChecked: boolean;
  setIsChecked :(isChecked:boolean)=>void;
}

const CheckboxOne = ({ label, isChecked, setIsChecked }: Props) => {

  return (
    <div>
      <label
        htmlFor="checkboxLabelOne"
        className="flex cursor-pointer select-none items-center"
      >
        <div className="relative">
          <input
            type="checkbox"
            id="checkboxLabelOne"
            className="sr-only"
            onChange={() => {
              setIsChecked(!isChecked);
            }}
          />
          <div
            className={`mr-2 flex h-5 w-5 items-center justify-center rounded border ${
              isChecked && 'border-primary bg-gray dark:bg-transparent'
            }`}
          >
            <span
              className={`h-2.5 w-2.5 rounded-sm ${isChecked && 'bg-primary'}`}
            ></span>
          </div>
        </div>
        <span className="font-medium">{label}</span>
      </label>
    </div>
  );
};

export default CheckboxOne;
