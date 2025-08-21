import React, { useState } from 'react';
import Button from '../../../components/button';
import { AutoComplete } from '../../../components/autoComplete';
import { Option } from '../../../entries/options';
import { getCentersByBranch } from '../../../api/center/getCentersByBranch';
import { FilterInputs, LoanFilterField } from '../../../entries/loan/filter';
import { getMembersByCenter } from '../../../api/member/getMembersByCenter';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { SearchInput } from '../../../components/SearchInput';

type Props = {
  filter: FilterInputs;
  searchText:string;
  handleFilterChange: (name: string, value: string) => void;
  onSearchInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClearFilter: () => void;
  branches: Option[];
  products: Option[];
};

const LoanListFilter = ({
  filter,
  searchText,
  handleFilterChange,
  onSearchInputChange,
  onClearFilter,
  branches,
  products,
}: Props) => {
  const [centerOptions, setCenterOptions] = useState([]);
  const [memberOptions, setMemberOptions] = useState([]);

  const statuses = [
    { value: 'PendingApproval', name: 'Pending Approval' },
    { value: 'PendingDocumentCharge', name: 'Pending Document Charge' },
    { value: 'InProgress', name: 'InProgress' },
    { value: 'Completed', name: 'Completed' },
    { value: 'Closed', name: 'Closed' },
  ];

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

  const onSelectCenter = async (name: string, value: string) => {
    handleFilterChange(name, value);
    if (+value > 0) {
      const members = await getMembersByCenter(value);
      const result = members.map((member: any) => {
        return {
          value: member.id,
          name: `${member.code}-${member.firstName}`,
        };
      });
      setMemberOptions(result);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {/* First Row */}

     <div className="w-full xl:w-1/3">
        <SearchInput
          name="searchTerm"
          placeholder="Search..."
          value={searchText}
          onChange={onSearchInputChange}
        />
      </div>

      <div className="w-full lg:w-1/2 xl:w-1/4 mr-4">
        <AutoComplete
          placeholder="All Branch"
          options={branches}
          value={filter[LoanFilterField.Branch] || ''}
          onChangeSelect={(option) =>
            onSelectBranch(LoanFilterField.Branch, option ? option.value : '')
          }
          clearSelected
          className="mb-2"
        />
      </div>
      <div className="w-full lg:w-1/2 xl:w-1/4 mr-4">
        <AutoComplete
          placeholder="All Centers"
          options={filter[LoanFilterField.Branch] !== '' ? centerOptions : []}
          value={filter[LoanFilterField.Center]}
          onChangeSelect={(option) =>
            onSelectCenter(LoanFilterField.Center, option ? option.value : '')
          }
          clearSelected
          className="mb-2"
        />
      </div>
      <div className="w-full lg:w-1/2 xl:w-1/4 mr-4">
        <AutoComplete
          placeholder="All Members"
          options={filter[LoanFilterField.Center] !== '' ? memberOptions : []}
          value={filter[LoanFilterField.Member]}
          onChangeSelect={(option) =>
            handleFilterChange(
              LoanFilterField.Member,
              option ? option.value : '',
            )
          }
          clearSelected
          className="mb-2"
        />
      </div>
      <div className="mr-4">
        <div className="relative inline-block">
          <select
            name="products"
            id="products"
            value={filter[LoanFilterField.Product]}
            onChange={(event) => {
              const value = event.target.value;
              handleFilterChange(LoanFilterField.Product, value ? value : '');
            }}
            style={{
              width: '220px',
              height: '41px',
            }}
            className="relative inline-flex appearance-none bg-transparent py-1 pl-3 pr-8 border-[2px] rounded-md border-stroke outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          >
            <option value="">Select Product</option>
            {products.map((type, index) => {
              return (
                <option key={`product-opt-${index}`} value={type.value}>
                  {type.name}
                </option>
              );
            })}
          </select>
          <ChevronDownIcon className="w-5 absolute top-1/2 right-3 z-10 -translate-y-1/2 cursor-pointer" />
        </div>
      </div>

      <div className="mr-4">
        <div className="relative inline-block">
          <select
            name="status"
            id="status"
            value={filter[LoanFilterField.Status]}
            onChange={(event) => {
              const value = event.target.value;
              handleFilterChange(LoanFilterField.Status, value ? value : '');
            }}
            style={{
              width: '220px',
              height: '41px',
            }}
            className="relative z-20 inline-flex appearance-none bg-transparent py-1 pl-3 pr-8 border-[2px] rounded-md border-stroke outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          >
            <option value="">Select Status</option>
            {statuses.map((type, index) => {
              return (
                <option key={`status-opt-${index}`} value={type.value}>
                  {type.name}
                </option>
              );
            })}
          </select>
          <ChevronDownIcon className="w-5 absolute top-1/2 right-3 z-10 -translate-y-1/2 cursor-pointer" />
        </div>
      </div>

        <div className="mr-4">
          <div className="relative inline-block mt-2">
            <Button text="Clear" onClick={onClearFilter} className="bg-bodydark2" />
          </div>
        </div>
    </div>
  );
};

export default React.memo(LoanListFilter);
