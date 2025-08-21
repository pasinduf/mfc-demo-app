import React, { useState } from 'react';
import { SearchInput } from '../../../components/SearchInput';
import Button from '../../../components/button';
import { AutoComplete } from '../../../components/autoComplete';
import { Option } from '../../../entries/options';
import {
  FilterInputs,
  MemberFilterField,
} from '../../../entries/member/filter';
import { getCentersByBranch } from '../../../api/center/getCentersByBranch';
import { ChevronDownIcon } from '@heroicons/react/24/solid';


type Props = {
  filter: FilterInputs;
  searchText: string;
  handleFilterChange: (name: string, value: string) => void;
  onSearchInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClearFilter: () => void;
  branches: Option[];
};

const MemberListFilter = ({
  filter,
  searchText,
  handleFilterChange,
  onSearchInputChange,
  onClearFilter,
  branches,
}: Props) => {
  const [centerOptions, setCenterOptions] = useState([]);

   const statusOptions = [
     { value: 1, name: 'ACTIVE' },
     { value: 2, name: 'INACTIVE' },
   ];

   const [selectedStatus, setSelectedStatus] = useState<any>(1);

  const onSelectBranch = async (name: string, value: string) => {
    handleFilterChange(name, value);
    if (+value > 0) {
      const centers = await getCentersByBranch(+value);
      const result = centers.map((center: any) => {
        return {
          value: center.id,
          name: center.name,
        };
      });
      setCenterOptions(result);
    }
  };


  const onSelectStatus = (event: any) => {
    const value = +event.target.value;
    if (value > 0) {
      setSelectedStatus(value);
      handleFilterChange('status', value === 1 ? 'ACTIVE' : 'INACTIVE');
    }
  };

  const onClear = ()=>{
    setSelectedStatus(1);
    onClearFilter();
  }

  return (
    <div className="flex flex-col gap-6 xl:flex-row">
      <div className="w-full xl:w-1/3">
        <SearchInput
          name="searchTerm"
          placeholder="Search..."
          value={searchText}
          onChange={onSearchInputChange}
        />
      </div>

      <div className="w-full xl:w-1/3">
        <AutoComplete
          placeholder="All Branch"
          options={branches}
          value={filter[MemberFilterField.Branch]}
          onChangeSelect={(option) =>
            onSelectBranch(MemberFilterField.Branch, option ? option.value : '')
          }
          clearSelected
        />
      </div>

      <div className="w-full xl:w-1/3">
        <AutoComplete
          placeholder="All Centers"
          options={filter[MemberFilterField.Branch] !== '' ? centerOptions : []}
          value={filter[MemberFilterField.Center]}
          onChangeSelect={(option) =>
            handleFilterChange(
              MemberFilterField.Center,
              option ? option.value : '',
            )
          }
          clearSelected
        />
      </div>

      <div className="relative inline-block">
        <select
          name="status"
          id="status"
          value={selectedStatus}
          onChange={onSelectStatus}
          style={{
            width: '120px',
            height: '41px',
          }}
          className="relative z-20 inline-flex appearance-none  py-1 pl-3 pr-8 border-[2px] rounded-md border-stroke bg-transparent outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
        >
          <option value="">Select Status</option>
          {statusOptions.map((type, index) => {
            return (
              <option key={`center-${index}`} value={type.value}>
                {type.name}
              </option>
            );
          })}
        </select>
        <ChevronDownIcon className="w-5 absolute top-1/2 right-3 z-10 -translate-y-1/2 cursor-pointer" />
      </div>

      <div className="w-full xl:w-1/3 mt-1">
        <Button text="Clear" onClick={onClear} className="bg-bodydark2" />
      </div>
    </div>
  );
};

export default React.memo(MemberListFilter);
