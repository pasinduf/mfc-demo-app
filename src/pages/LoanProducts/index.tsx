import { useCallback, useEffect, useState } from 'react';
import { PencilSquareIcon } from '@heroicons/react/24/solid';
import Breadcrumb from '../../components/Breadcrumb';
import Button from '../../components/button';
import DeleteConfirmationModal from '../../components/DeleteConfirmationModal';
import { toastMessage } from '../../components/toastMessage';
import { DEFAULT_ERROR_MESSAGE } from '../../api/const/message';
import { LoanProduct } from '../../entries/loan-product/loanProduct';
import AddLoanProductModal from './components/AddLoanProductModal';
import Pagination from '../../components/Pagination';
import { PaginatedResponse } from '../../entries/paginatedResponse';
import { DEFAULT_PAGE_SIZE } from '../../api/auth/constants';
import { useTablePagination } from '../../components/Pagination/useTablePagination';
import { debounceCallback } from '../../utils/debounceCallback';
import { createObjectWithoutEmptyValues } from '../../utils/createObjectWithoutEmptyValues';
import LoanProductsFilter from './components/Filter';
import Loader from '../../components/loader';
import {
  FilterInputs,
  LoanProductFilterField,
} from '../../entries/loan-product/filter';
import { getProductList } from '../../api/loan-product/getProductList';
import { deleteProduct } from '../../api/loan-product/deleteProduct';
import { ShowError } from '../../components/ShowError';
import { useAuth } from '../../hooks/useAuth';
import { ADMIN } from '../../api/RBAC/userRoles';
import { Add_Loan_Product, Edit_Loan_Product } from '../../api/RBAC/userAccess';

const LoanProducts = () => {
  const { auth }: any = useAuth();
  const [data, setData] = useState<PaginatedResponse>();
  const [openAdd, setOpenAdd] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const { paging, onChangePage, resetPagingOnChange } = useTablePagination(
    DEFAULT_PAGE_SIZE,
    0,
  );

  const [searchText, setSearchText] = useState('');
  const [filter, setFilter] = useState<FilterInputs>({
    [LoanProductFilterField.Code]: '',
  });

  useEffect(() => {
    fetchLoanProducts();
  }, [paging, filter]);

  const fetchLoanProducts = async () => {
    try {
      const filters = createObjectWithoutEmptyValues(filter);

      const params = {
        ...paging,
        ...filters,
      };
      const result = await getProductList(params);
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
      handleFilterChange(LoanProductFilterField.Code, value);
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
      [LoanProductFilterField.Code]: '',
    });
    setSearchText('');
  }, []);

  const onRefresh = () => {
    selectedProduct && setSelectedProduct(null);
    fetchLoanProducts();
  };

  const onSelectProduct = (product: LoanProduct) => {
    setSelectedProduct(product);
    setOpenAdd(true);
  };

  const onClose = () => {
    selectedProduct && setSelectedProduct(null);
    setOpenAdd(false);
  };

  const onDelete = async (id: number) => {
    try {
      await deleteProduct(id);
      onRefresh();
      toastMessage('Product successfully deleted', 'success', 'top-right');
    } catch (error: any) {
      toastMessage(
        (error as any)?.response?.data?.message || DEFAULT_ERROR_MESSAGE,
        'error',
      );
    }
  };

  const allowAdd = ()=>{
    return auth?.access?.includes(Add_Loan_Product);
  }
      
  const allowEdit = () => {
      return auth?.access?.includes(Edit_Loan_Product);
  };

  return (
    <>
      <Breadcrumb pageName="Loan Products" />
      {isLoading && <Loader />}
      {error && <ShowError error={error} />}

      {!error && !isLoading && (
        <>
          <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between mt-6 pb-1">
            <LoanProductsFilter
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
                      Interest Rate(%)
                    </th>
                    <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                      Repayment Term
                    </th>
                    <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                      Document Charge(%)
                    </th>
                    <th className="py-4 px-4 font-medium text-black dark:text-white"></th>
                  </tr>
                </thead>
                {data && data.items.length > 0 ? (
                  <tbody>
                    {data.items.map((product, index) => {
                      return (
                        <tr key={`branch-${index}`}>
                          <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                            <h5 className="font-medium text-black dark:text-white">
                              {product.code}
                            </h5>
                          </td>
                          <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                            <p className="text-black dark:text-white">
                              {product.interestRate}%
                            </p>
                          </td>
                          <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                            {product.repaymentTerm}
                          </td>
                          <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                            {product.documentCharge}%
                          </td>
                          {allowEdit() && (
                            <td className="py-5 px-4">
                              <div className="flex items-center space-x-3.5">
                                <PencilSquareIcon
                                  className="w-6 cursor-pointer text-primary"
                                  onClick={() => onSelectProduct(product)}
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
            <AddLoanProductModal
              open={openAdd}
              onClose={onClose}
              onRefresh={onRefresh}
              product={selectedProduct}
            />
          )}
        </>
      )}
    </>
  );
};

export default LoanProducts;
