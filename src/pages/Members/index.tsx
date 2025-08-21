import { useCallback, useEffect, useState } from 'react';
import { PencilSquareIcon } from '@heroicons/react/24/solid';
import Breadcrumb from '../../components/Breadcrumb';
import Button from '../../components/button';
import DeleteConfirmationModal from '../../components/DeleteConfirmationModal';
import { toastMessage } from '../../components/toastMessage';
import { DEFAULT_ERROR_MESSAGE } from '../../api/const/message';
import { Member as MemberModel } from '../../entries/member/member';
import Pagination from '../../components/Pagination';
import { PaginatedResponse } from '../../entries/paginatedResponse';
import { DEFAULT_PAGE_SIZE } from '../../api/auth/constants';
import { useTablePagination } from '../../components/Pagination/useTablePagination';
import { debounceCallback } from '../../utils/debounceCallback';
import { createObjectWithoutEmptyValues } from '../../utils/createObjectWithoutEmptyValues';
import Loader from '../../components/loader';
import { FilterInputs, MemberFilterField } from '../../entries/member/filter';
import { getMemberList } from '../../api/member/getMemberList';
import MemberListFilter from './components/Filter';
import AddMemberModal from './components/AddMemberModal';
import MoerInfo from './components/MoerInfo';
import { deleteMember } from '../../api/member/deleteMember';
import { ShowError } from '../../components/ShowError';
import { useAppStore } from '../../hooks/useAppStore';
import { useAuth } from '../../hooks/useAuth';
import { Add_Member, Edit_Member, Inactive_Member } from '../../api/RBAC/userAccess';

const Members = () => {
  const { store }: any = useAppStore();
  const { auth }: any = useAuth();
  const [data, setData] = useState<PaginatedResponse>();
  const [openAdd, setOpenAdd] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const branchOptions = store?.branchFilters;

  const { paging, onChangePage, resetPagingOnChange } = useTablePagination(
    DEFAULT_PAGE_SIZE,
    0,
  );

  const [searchText, setSearchText] = useState('');
  const [filter, setFilter] = useState<FilterInputs>({
    [MemberFilterField.Status]: 'ACTIVE',
    [MemberFilterField.Search]: '',
    [MemberFilterField.Branch]: '',
    [MemberFilterField.Center]: '',
  });

  useEffect(() => {
    fetchMembers();
  }, [paging, filter]);

  const fetchMembers = async () => {
    try {
      const filters = createObjectWithoutEmptyValues(filter);

      const params = {
        ...paging,
        ...filters,
      };
      const result = await getMemberList(params);
      setData(result);
    } catch (error: any) {
      setError(error?.response?.data?.statusCode || 400);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (name: string, value: string) => {
    setFilter((prev) => ({ ...prev, [name]: value }));
    resetPagingOnChange();
  };

  const debouncedInputChange = useCallback(
    debounceCallback((value: string) => {
      handleFilterChange(MemberFilterField.Search, value);
    }, 1000),
    [],
  );

  const onSearchInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setSearchText(value);
      debouncedInputChange(value);
    },
    // eslint-disable-next-line
    [],
  );

  const onClearFilter = useCallback(() => {
    setFilter({
      [MemberFilterField.Status]: 'ACTIVE',
      [MemberFilterField.Search]: '',
      [MemberFilterField.Branch]: '',
      [MemberFilterField.Center]: '',
    });
    setSearchText('');
  }, []);

  const onRefresh = () => {
    selectedMember && setSelectedMember(null);
    fetchMembers();
  };

  const onSelectMember = (member: MemberModel) => {
    setSelectedMember(member);
    setOpenAdd(true);
  };

  const onClose = () => {
    selectedMember && setSelectedMember(null);
    setOpenAdd(false);
  };

  const onDelete = async (id: number) => {
    try {
      await deleteMember(id);
      onRefresh();
      toastMessage('Member successfully deleted', 'success', 'top-right');
    } catch (error: any) {
      toastMessage(
        (error as any)?.response?.data?.message || DEFAULT_ERROR_MESSAGE,
        'error',
      );
    }
  };

    const allowAdd = ()=>{
      return auth?.access?.includes(Add_Member);
    }
        
    const allowEdit = () => {
        return auth?.access?.includes(Edit_Member);
    };

    const allowDelete = () => {
      return auth?.access?.includes(Inactive_Member);
    };
  

  return (
    <>
      <Breadcrumb pageName="Members" />
      {isLoading && <Loader />}
      {error && <ShowError error={error} />}

      {!error && !isLoading && (
        <>
          <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between mt-6 pb-1">
            <MemberListFilter
              branches={branchOptions}
              searchText={searchText}
              filter={filter}
              handleFilterChange={handleFilterChange}
              onSearchInputChange={onSearchInputChange}
              onClearFilter={onClearFilter}
            />

            {allowAdd() && (
              <div className="flex lg:w-full xl:w-auto xl:flex-grow xl:justify-end">
                <Button text="Add" onClick={() => setOpenAdd(true)} />
              </div>
            )}
          </div>

          <div className="mt-2 rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
            <div className="max-w-full overflow-x-auto h-115 overflow-y-auto">
              <table className="w-full table-auto">
                <thead className="sticky top-0 z-10 bg-stroke dark:bg-meta-4 text-left">
                  <tr>
                    <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                      Code
                    </th>
                    <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                      Name
                    </th>
                    <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                      Branch
                    </th>
                    <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                      Center
                    </th>
                    <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                      Phone#
                    </th>
                    <th className="min-w-[50px]"></th>
                    <th className="py-4 px-4 font-medium text-black dark:text-white"></th>
                  </tr>
                </thead>
                {data && data.items.length > 0 ? (
                  <tbody>
                    {data.items.map((member, index) => {
                      return (
                        <tr key={`branch-${index}`}>
                          <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                            <h5 className="font-medium text-black dark:text-white">
                              {member.code}
                            </h5>
                          </td>
                          <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                            <p className="text-black dark:text-white">
                              {member.firstName} {member.lastName}
                            </p>
                          </td>
                          <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                            {member?.center?.branch?.name}
                          </td>
                          <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                            {member?.center?.name}
                          </td>
                          <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                            {member.phoneNumber}
                          </td>
                          <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                            <MoerInfo member={member} />
                          </td>
                          {member.isActive && (
                            <td className="py-5 px-4">
                              <div className="flex items-center space-x-3.5">
                                {allowEdit() && (
                                  <PencilSquareIcon
                                    className="w-6 cursor-pointer text-primary"
                                    onClick={() => onSelectMember(member)}
                                  />
                                )}
                                {allowDelete() &&
                                  <DeleteConfirmationModal
                                    title="Inactive member"
                                    message="Are you sure want to inactive member?"
                                    onSubmit={() => onDelete(member.id)}
                                  />
                                }
                              </div>
                            </td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                ) : (
                  <div className="w-40 py-4">No data available</div>
                )}
              </table>
            </div>
          </div>

          {data && data.items.length > 0 && (
            <div className="py-3 justify-between gap-4 sm:flex">
              <div className="ml-2 font-medium">Total: {data.count}</div>
              <Pagination
                page={paging.pageIndex}
                count={data.count}
                rowsPerPage={paging.pageSize}
                onChangePage={onChangePage}
              />
            </div>
          )}

          {openAdd && (
            <AddMemberModal
              open={openAdd}
              onClose={onClose}
              onRefresh={onRefresh}
              member={selectedMember}
              branches={branchOptions}
            />
          )}
        </>
      )}
    </>
  );
};

export default Members;
