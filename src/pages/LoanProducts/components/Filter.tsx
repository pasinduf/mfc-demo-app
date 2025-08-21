import React, { useState } from 'react';
import Button from '../../../components/button';
import { SearchInput } from '../../../components/SearchInput';
import { FilterInputs } from '../../../entries/loan-product/filter';

type Props = {
  filter: FilterInputs;
  searchText: string;
  handleFilterChange: (name: string, value: string) => void;
  onSearchInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClearFilter: () => void;
};

const LoanProductsFilter = ({
  filter,
  handleFilterChange,
  onClearFilter,
  searchText,
  onSearchInputChange,
}: Props) => {
  return (
    <div className="flex flex-col gap-6 xl:flex-row w-1/2">
      <div className="w-full">
        <SearchInput
          name="code"
          placeholder="Search code..."
          value={searchText}
          onChange={onSearchInputChange}
        />
      </div>

      <div className="w-full xl:w-1/3 mt-1">
        <Button text="Clear" onClick={onClearFilter} className="bg-bodydark2" />
      </div>
    </div>
  );
};

export default React.memo(LoanProductsFilter);
