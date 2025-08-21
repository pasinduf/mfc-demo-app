import React from 'react';
import {
  CenterFilterField,
  FilterInputs,
} from '../../../entries/center/filter';
import { SearchInput } from '../../../components/SearchInput';
import Button from '../../../components/button';
import { AutoComplete } from '../../../components/autoComplete';
import { Option } from '../../../entries/options';

type Props = {
  filter: FilterInputs;
  searchText: string;
  handleFilterChange: (name: string, value: string) => void;
  onSearchInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClearFilter: () => void;
  collectionDays: any[];
  branches: Option[];
};

const CenterListFilter = ({
  filter,
  searchText,
  handleFilterChange,
  onSearchInputChange,
  onClearFilter,
  branches,
  collectionDays,
}: Props) => {
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
          value={filter[CenterFilterField.Branch]}
          onChangeSelect={(option) =>
            handleFilterChange(
              CenterFilterField.Branch,
              option ? option.value : '',
            )
          }
          clearSelected
        />
      </div>

      <div className="w-full xl:w-1/3">
        <AutoComplete
          placeholder="All Days"
          options={collectionDays}
          value={filter[CenterFilterField.CollectionDay]}
          onChangeSelect={(option) =>
            handleFilterChange(
              CenterFilterField.CollectionDay,
              option ? option.value : '',
            )
          }
          clearSelected
        />
      </div>
      <div className="w-full xl:w-1/3 mt-1">
        <Button text="Clear" onClick={onClearFilter} className="bg-bodydark2" />
      </div>
    </div>
  );
};

export default React.memo(CenterListFilter);
