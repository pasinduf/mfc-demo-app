import { useCallback, useEffect, useState } from 'react';
import { PencilSquareIcon } from '@heroicons/react/24/solid';
import Breadcrumb from '../../components/Breadcrumb';
import Button from '../../components/button';
import DeleteConfirmationModal from '../../components/DeleteConfirmationModal';
import { toastMessage } from '../../components/toastMessage';
import { DEFAULT_ERROR_MESSAGE } from '../../api/const/message';
import { Center as CenterModel } from '../../entries/center/center';
import { getCenterList } from '../../api/center/getCenterList';
import AddCenterModal from './component/AddCenterModal';
import { deleteCenter } from '../../api/center/deleteCenter';
import { dayOfWeek } from '../../utils/dayOfWeek';
import Pagination from '../../components/Pagination';
import { PaginatedResponse } from '../../entries/paginatedResponse';
import { DEFAULT_PAGE_SIZE } from '../../api/auth/constants';
import { useTablePagination } from '../../components/Pagination/useTablePagination';
import { CenterFilterField, FilterInputs } from '../../entries/center/filter';
import { debounceCallback } from '../../utils/debounceCallback';
import { createObjectWithoutEmptyValues } from '../../utils/createObjectWithoutEmptyValues';
import CenterListFilter from './component/Filter';
import Loader from '../../components/loader';
import { ShowError } from '../../components/ShowError';
import { useAppStore } from '../../hooks/useAppStore';
import { useAuth } from '../../hooks/useAuth';
import { ADMIN } from '../../api/RBAC/userRoles';
import { getFilterCenters } from '../../api/filters/getFilterCenters';
import { Add_Center, Edit_Center } from '../../api/RBAC/userAccess';

const Centers = () => {
  const { auth }: any = useAuth();
  const { store, setStore }: any = useAppStore();
  const [data, setData] = useState<PaginatedResponse>();
  const [openAdd, setOpenAdd] = useState(false);
  const [selectedCenter, setSelectedCenter] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const branchOptions = store?.branchFilters;

  const { paging, onChangePage, resetPagingOnChange } = useTablePagination(
    DEFAULT_PAGE_SIZE,
    0,
  );

  const collectionDays = [
    { value: 1, name: 'Monday' },
    { value: 2, name: 'Tuesday' },
    { value: 3, name: 'Wednesday' },
    { value: 4, name: 'Thursday' },
    { value: 5, name: 'Friday' },
    { value: 6, name: 'Saturday' },
    { value: 7, name: 'Sunday' },
  ];

  const [searchText, setSearchText] = useState('');
  const [filter, setFilter] = useState<FilterInputs>({
    [CenterFilterField.Search]: '',
    [CenterFilterField.Branch]: '',
    [CenterFilterField.CollectionDay]: '',
  });


  useEffect(() => {
    fetchCenters();
  }, [paging, filter]);


  const fetchCenters = async () => {
    try {
      const filters = createObjectWithoutEmptyValues(filter);

      const params = {
        ...paging,
        ...filters,
      };
      const result = await getCenterList(params);
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
      handleFilterChange(CenterFilterField.Search, value);
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
      [CenterFilterField.Search]: '',
      [CenterFilterField.Branch]: '',
      [CenterFilterField.CollectionDay]: '',
    });
    setSearchText('');
  }, []);

  const onRefresh = () => {
    selectedCenter && setSelectedCenter(null);
    fetchCenters();
  };

  const onSelectCenter = (center: CenterModel) => {
    setSelectedCenter(center);
    setOpenAdd(true);
  };

  const onClose = () => {
    selectedCenter && setSelectedCenter(null);
    setOpenAdd(false);
  };

  const onDelete = async (id: number) => {
    try {
      await deleteCenter(id);
      onRefresh();

      const centerFilters = await getFilterCenters();
      setStore({
        ...store,
        centerFilters,
      });

      
      toastMessage('Center successfully deleted', 'success', 'top-right');
    } catch (error: any) {
      toastMessage(
        (error as any)?.response?.data?.message || DEFAULT_ERROR_MESSAGE,
        'error',
      );
    }
  };

  
  const allowAdd = ()=>{
        return auth?.access?.includes(Add_Center);
  }
    
  const allowEdit = () => {
      return auth?.access?.includes(Edit_Center);
  };

  return (
    <>
      <Breadcrumb pageName="Centers" />
      {isLoading && <Loader />}
      {error && <ShowError error={error} />}

      {!error && !isLoading && (
        <>
          <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between mt-6 pb-1">
            <CenterListFilter
              branches={branchOptions}
              collectionDays={collectionDays}
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
            <div className="max-w-full overflow-x-auto h-auto max-h-115 overflow-y-auto">
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
                      Collection Day
                    </th>
                    <th className="py-4 px-4 font-medium text-black dark:text-white"></th>
                  </tr>
                </thead>
                {data && data.items.length > 0 ? (
                  <tbody>
                    {data.items.map((center, index) => {
                      return (
                        <tr key={`branch-${index}`}>
                          <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                            <h5 className="font-medium text-black dark:text-white">
                              {center.code}
                            </h5>
                          </td>
                          <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                            <p className="text-black dark:text-white">
                              {center.name}
                            </p>
                          </td>
                          <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                            {center?.branch?.code}-{center?.branch?.name}
                          </td>
                          <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                            {dayOfWeek(center?.collectionWeekDay)}
                          </td>
                          {allowEdit() && (
                            <td className="py-5 px-4 ">
                              <div className="flex items-center space-x-3.5">
                                <PencilSquareIcon
                                  className="w-6 cursor-pointer text-primary"
                                  onClick={() => onSelectCenter(center)}
                                />
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
            <AddCenterModal
              open={openAdd}
              onClose={onClose}
              onRefresh={onRefresh}
              center={selectedCenter}
              collectionDays={collectionDays}
              branches={branchOptions}
            />
          )}
        </>
      )}
    </>
  );
};

export default Centers;
