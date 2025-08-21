import { useCallback, useEffect, useState } from 'react';
import { PencilSquareIcon } from '@heroicons/react/24/solid';
import Breadcrumb from '../../components/Breadcrumb';
import Button from '../../components/button';
import DeleteConfirmationModal from '../../components/DeleteConfirmationModal';
import { toastMessage } from '../../components/toastMessage';
import { DEFAULT_ERROR_MESSAGE } from '../../api/const/message';
import Loader from '../../components/loader';
import { ShowError } from '../../components/ShowError';
import AddUserModal from './component/AddUserModal';
import { getUserList } from '../../api/user/getUserList';
import { User } from '../../entries/user/user';
import { useTablePagination } from '../../components/Pagination/useTablePagination';
import { DEFAULT_PAGE_SIZE } from '../../api/auth/constants';
import { FilterInputs, UserFilterField } from '../../entries/user/filter';
import { createObjectWithoutEmptyValues } from '../../utils/createObjectWithoutEmptyValues';
import { PaginatedResponse } from '../../entries/paginatedResponse';
import { deleteUser } from '../../api/user/deleteUser';
import Pagination from '../../components/Pagination';
import MoerInfo from './component/MoerInfo';
import UserListFilter from './component/Filter';
import { debounceCallback } from '../../utils/debounceCallback';
import { useAuth } from '../../hooks/useAuth';
import { getAccessListWithCategory } from '../../api/auth/access/getAccessListWithCategory';
import { Add_User, Edit_User, Inactive_User } from '../../api/RBAC/userAccess';

const Users = () => {
  const { auth }: any = useAuth();
  const [data, setData] = useState<PaginatedResponse>();
  const [openAdd, setOpenAdd] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const { paging, onChangePage, resetPagingOnChange } = useTablePagination(
    DEFAULT_PAGE_SIZE,
    0,
  );


    const [accessList, setAccessList] = useState<any>([]);
  
    useEffect(() => {
      fetchAccessList();
    }, []);
  

    const fetchAccessList = async () => {
      const result = await getAccessListWithCategory();
      setAccessList(result);
    };

  const [searchText, setSearchText] = useState('');
  const [filter, setFilter] = useState<FilterInputs>({
    [UserFilterField.Status]: 'ACTIVE',
    [UserFilterField.Search]: '',
    [UserFilterField.Role]: '',
  });

  useEffect(() => {
    fetchUsers();
  }, [paging, filter]);

  const fetchUsers = async () => {
    try {
      const filters = createObjectWithoutEmptyValues(filter);

      const params = {
        ...paging,
        ...filters,
      };
      const result = await getUserList(params);
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
      handleFilterChange(UserFilterField.Search, value);
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
      [UserFilterField.Status]: 'ACTIVE',
      [UserFilterField.Search]: '',
      [UserFilterField.Role]: '',
    });
    setSearchText('');
  }, []);

  const onRefresh = () => {
    selectedUser && setSelectedUser(null);
    fetchUsers();
  };

  const onSelectUser = (user: User) => {
    setSelectedUser(user);
    setOpenAdd(true);
  };

  const onClose = () => {
    selectedUser && setSelectedUser(null);
    setOpenAdd(false);
  };

  const allowAdd = ()=>{
    return auth?.access?.includes(Add_User);
  }
      
  const allowEdit = () => {
      return auth?.access?.includes(Edit_User);
  };

  const allowDelete = () => {
    return auth?.access?.includes(Inactive_User);
  };



  const onDelete = async (id: number) => {
    try {
      await deleteUser(id);
      onRefresh();
      toastMessage('User successfully deleted', 'success', 'top-right');
    } catch (error: any) {
      toastMessage(
        (error as any)?.response?.data?.message || DEFAULT_ERROR_MESSAGE,
        'error',
      );
    }
  };

  return (
    <>
      <Breadcrumb pageName="Users" />
      {isLoading && <Loader />}
      {error && <ShowError error={error} />}

      {!error && !isLoading && (
        <>
          <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between mt-6 pb-1">
            <UserListFilter
              filter={filter}
              searchText={searchText}
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
            <div className="max-w-full overflow-x-auto h-auto max-h-115 overflow-y-auto">
              <table className="w-full table-auto">
                <thead className="sticky top-0 z-10 bg-stroke dark:bg-meta-4 text-left">
                  <tr>
                    <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                      Emp No
                    </th>
                    <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                      Name
                    </th>
                    <th className="min-w-[100px] py-4 px-4 font-medium text-black dark:text-white">
                      Role
                    </th>
                    <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                      Phone#
                    </th>
                    <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                      Centers
                    </th>
                    <th className="min-w-[50px]"></th>
                    <th className="py-4 px-4 font-medium text-black dark:text-white"></th>
                  </tr>
                </thead>
                {data && data.items.length > 0 ? (
                  <tbody>
                    {data.items.map((user, index) => {
                      return (
                        <tr key={`branch-${index}`}>
                          <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                            <h5 className="font-medium text-black dark:text-white">
                              {user.empNumber}
                            </h5>
                          </td>
                          <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                            <p className="text-black dark:text-white">
                              {user.firstName} {user.lastName}
                            </p>
                          </td>
                          <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                            <p className="text-black dark:text-white">
                              {user.role?.name}
                            </p>
                          </td>
                          <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                            {user.phoneNumber}
                          </td>
                          <td className="border-b border-[hsl(0,0%,93%)] py-5 px-4 dark:border-strokedark">
                            {user.centers && user.centers.length > 0
                              ? user.centers.map(
                                  (center: any, index: number) => {
                                    return (
                                      <p
                                        key={`center-${index}`}
                                        className="inline-flex rounded-full bg-meta-1 bg-opacity-10 py-1 px-3 m-1 text-sm font-medium"
                                      >
                                        {center.name}
                                      </p>
                                    );
                                  },
                                )
                              : '-'}
                          </td>
                          <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                            <MoerInfo user={user} />
                          </td>
                          {user.isActive &&
                          <td className="py-5 px-4">
                            <div className="flex items-center space-x-3.5">
                              {allowEdit() && (
                                <PencilSquareIcon
                                  className="w-6 cursor-pointer text-primary"
                                  onClick={() => onSelectUser(user)}
                                />
                              )}
                              {allowDelete() && (
                                <DeleteConfirmationModal
                                  title="Delete user"
                                  message="Are you sure want to delete user?"
                                  onSubmit={() => onDelete(user.id)}
                                />
                              )}
                            </div>
                          </td>
                          }
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
            <AddUserModal
              open={openAdd}
              accessList={accessList}
              onClose={onClose}
              onRefresh={onRefresh}
              user={selectedUser}
            />
          )}
        </>
      )}
    </>
  );
};

export default Users;
