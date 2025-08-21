import { useCallback, useEffect, useState } from 'react';
import { PaperAirplaneIcon, PencilSquareIcon,ExclamationTriangleIcon } from '@heroicons/react/24/solid';
import Breadcrumb from '../../components/Breadcrumb';
import Button from '../../components/button';
import DeleteConfirmationModal from '../../components/DeleteConfirmationModal';
import Pagination from '../../components/Pagination';
import { PaginatedResponse } from '../../entries/paginatedResponse';
import {
  DEFAULT_PAGE_SIZE,
  Loan_STATUS_OPTIONS,
} from '../../api/auth/constants';
import { useTablePagination } from '../../components/Pagination/useTablePagination';
import { createObjectWithoutEmptyValues } from '../../utils/createObjectWithoutEmptyValues';
import Loader from '../../components/loader';
import LoanListFilter from './components/Filter';
import AddLoanModal from './components/AddLoanModal';
import { FilterInputs, LoanFilterField } from '../../entries/loan/filter';
import { getLoanList } from '../../api/loan/getLoanList';
import { Badge } from '../../components/Badge';
import { getStatusType } from '../../utils/getStatusType';
import { getProductList } from '../../api/loan-product/getProductList';
import { deleteLoan } from '../../api/loan/deleteLoan';
import { toastMessage } from '../../components/toastMessage';
import { DEFAULT_ERROR_MESSAGE } from '../../api/const/message';
import ApproveLoanModal from './components/ApproveModal';
import { useNavigate } from 'react-router-dom';
import { getLoanDetails } from '../../api/loan/getLoanDetails';
import { Loan } from '../../entries/loan/loan';
import { ShowError } from '../../components/ShowError';
import { useAppStore } from '../../hooks/useAppStore';
import { useAuth } from '../../hooks/useAuth';
import ReleaseLoanModal from './components/ReleaseModal';
import { Add_Loan, Delete_Loan, Edit_Loan, Loan_Level_1_Approval, Loan_Level_2_Approval } from '../../api/RBAC/userAccess';
import Tooltip from '../../components/Tooltip';
import { debounceCallback } from '../../utils/debounceCallback';

const Loans = () => {
  const { auth }: any = useAuth();
  const { store }: any = useAppStore();
  const navigate = useNavigate();
  const [data, setData] = useState<PaginatedResponse>();
  const [openAdd, setOpenAdd] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [productOptions, setProductOptions] = useState<any>([]);
  const [openApprove, setOpenApprove] = useState(false);
  const [openRelease, setOpenRelease] = useState(false);
  const [error, setError] = useState<any>(null);

  const branchOptions = store?.branchFilters;

  const { paging, onChangePage, resetPagingOnChange } = useTablePagination(
    DEFAULT_PAGE_SIZE,
    0,
  );

  const [searchText, setSearchText] = useState('');

  const [filter, setFilter] = useState<FilterInputs>({
    [LoanFilterField.Center]: '',
    [LoanFilterField.Member]: '',
    [LoanFilterField.Product]: '',
    [LoanFilterField.Status]: '',
    [LoanFilterField.Search]: '',
    [LoanFilterField.FromDate]: '',
    [LoanFilterField.ToDate]: '',
  });

  useEffect(() => {
    fetchLoans();
  }, [paging, filter]);

  const fetchLoans = async () => {
    try {
      const filters = createObjectWithoutEmptyValues(filter);

      const params = {
        ...paging,
        ...filters,
      };
      const result = await getLoanList(params);
      setData(result);
    } catch (error: any) {
      setError(error?.response?.data?.statusCode || 400);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProductOptions();
  }, []);

  const fetchProductOptions = async () => {
    const args = {
      pageSize: 0,
      pageIndex: 0,
    };
    const result = await getProductList(args);
    const options :any = [];
    result.items.map((item)=>{
      options.push({
        name: item.code,
        value: item.id,
        interestRate: item.interestRate,
        repaymentTerm: item.repaymentTerm,
        documentCharge: item.documentCharge,
      });
    })
    setProductOptions(options);
  };

  const handleFilterChange = (name: string, value: string) => {
    setFilter((prev) => ({ ...prev, [name]: value }));
    resetPagingOnChange();
  };

  const debouncedInputChange = useCallback(
      debounceCallback((value: string) => {
        handleFilterChange(LoanFilterField.Search, value);
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
      [LoanFilterField.Center]: '',
      [LoanFilterField.Member]: '',
      [LoanFilterField.Product]: '',
      [LoanFilterField.Status]: '',
      [LoanFilterField.Search]: '',
      [LoanFilterField.FromDate]: '',
      [LoanFilterField.ToDate]: '',
    });
    setSearchText('');
  }, []);

  const onRefresh = () => {
    selectedLoan && setSelectedLoan(null);
    fetchLoans();
  };

  const onSelectLoan = async (id: number) => {
    const result = await getLoanDetails(id);
    setSelectedLoan(result);
    setOpenAdd(true);
  };

  const onCloseAdd = () => {
    selectedLoan && setSelectedLoan(null);
    setOpenAdd(false);
  };

  const onFirstApproveLoan = async (loan: Loan) => {
    setSelectedLoan(loan);
    setOpenApprove(true);
  };

  const onCloseApprove = () => {
    selectedLoan && setSelectedLoan(null);
    setOpenApprove(false);
  };


   const onReleaseLoan = async (loan: Loan) => {
     setSelectedLoan(loan);
     setOpenRelease(true);
   };


   const onCloseRelease = () => {
     selectedLoan && setSelectedLoan(null);
     setOpenRelease(false);
   };

  const onDelete = async (id: number) => {
    try {
      await deleteLoan(id);
      onRefresh();
      toastMessage('Loan successfully closed', 'success', 'top-right');
    } catch (error: any) {
      toastMessage(
        (error as any)?.response?.data?.message || DEFAULT_ERROR_MESSAGE,
        'error',
      );
    }
  };
 
    const allowAdd = ()=>{
      return auth?.access?.includes(Add_Loan);
    }
        
    const allowEdit = () => {
        return auth?.access?.includes(Edit_Loan);
    };

    const allowDelete = () => {
      return auth?.access?.includes(Delete_Loan);
    };


    const allowFirstApproval = () => {
      return auth?.access?.includes(Loan_Level_1_Approval);
    };

    const allowSecondApproval = () => {
      return auth?.access?.includes(Loan_Level_2_Approval);
    };


  const getFullName = (name: string) => {
    return name.length > 25 ? `${name.substring(0, 25)}...` : name;
  };

  const onLoanDetails = (id: number) => navigate(`/loan/${id}`);

  return (
    <>
      <Breadcrumb pageName="Loans" />
      {isLoading && <Loader />}
      {error && <ShowError error={error} />}
      {!error && !isLoading && (
        <>
          <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between mt-6 pb-1">
            <LoanListFilter
              branches={branchOptions}
              products={productOptions}
              filter={filter}
              searchText={searchText}
              handleFilterChange={handleFilterChange}
              onSearchInputChange={onSearchInputChange}
              onClearFilter={onClearFilter}
            />
            {allowAdd() && (
              <div className="flex lg:w-full xl:w-auto xl:flex-grow xl:justify-end xl:mt-14">
                <Button text="Add" onClick={() => setOpenAdd(true)} />
              </div>
            )}
          </div>

          <div className="mt-2 rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
            <div className="max-w-full overflow-x-auto h-auto max-h-115 overflow-y-auto">
              <table>
                <thead className="sticky top-0 bg-graydark z-10">
                  <tr className="text-left">
                    <th className="min-w-[120px] py-4 px-4 font-medium text-white dark:text-white xl:pl-11">
                      #
                    </th>
                    <th className="min-w-[160px] py-4 px-4 font-medium text-white dark:text-white xl:pl-11">
                      Branch
                    </th>
                    <th className="min-w-[160px] py-4 px-4 font-medium text-white dark:text-white xl:pl-11">
                      Center
                    </th>
                    <th className="min-w-[200px] py-4 px-4 font-medium text-white dark:text-white">
                      Member
                    </th>
                    <th className="min-w-[100px] py-4 px-4 font-medium text-white dark:text-white">
                      Product
                    </th>
                    <th className="min-w-[100px] py-4 px-4 font-medium text-white dark:text-white">
                      Amount
                    </th>
                    <th className="min-w-[100px] py-4 px-4 font-medium text-white dark:text-white">
                      Payment Term
                    </th>
                    <th className="min-w-[100px] py-4 px-4 font-medium text-white dark:text-white">
                      Balance
                    </th>
                    <th className="min-w-[100px] py-4 px-4 font-medium text-white dark:text-white">
                      Created Date
                    </th>
                    <th className="min-w-[50px] py-4 px-4 font-medium text-white dark:text-white">
                      Status
                    </th>

                    <th className="py-4 px-4 font-medium text-white dark:text-white"></th>
                  </tr>
                </thead>
                {data && data.items.length > 0 ? (
                  <tbody>
                    {data.items.map((loan, index) => {
                      return (
                        <tr
                          key={`loan-${index}`}
                          className="cursor-pointer hover:bg-stroke"
                        >
                          <td
                            className="border-b border-[#eee] py-5 px-4 dark:border-strokedark"
                            onClick={() => onLoanDetails(loan.id)}
                          >
                            {loan.code}
                          </td>
                          <td
                            className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11"
                            onClick={() => onLoanDetails(loan.id)}
                          >
                            <h5 className="font-medium text-black dark:text-white">
                              {loan.branch}
                            </h5>
                          </td>
                          <td
                            className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11"
                            onClick={() => onLoanDetails(loan.id)}
                          >
                            <h5 className="font-medium text-black dark:text-white">
                              {loan.centerName}
                            </h5>
                          </td>
                          <td
                            className="border-b border-[#eee] py-5 px-4 dark:border-strokedark"
                            onClick={() => onLoanDetails(loan.id)}
                          >
                            <p className="text-black dark:text-white">
                              {getFullName(loan.memberName)}
                            </p>
                          </td>
                          <td
                            className="border-b border-[#eee] py-5 px-4 dark:border-strokedark"
                            onClick={() => onLoanDetails(loan.id)}
                          >
                            {loan.product}
                          </td>
                          <td
                            className="border-b border-[#eee] py-5 px-4 dark:border-strokedark"
                            onClick={() => onLoanDetails(loan.id)}
                          >
                            {loan.amount}
                          </td>
                          <td
                            className="border-b border-[#eee] py-5 px-4 dark:border-strokedark"
                            onClick={() => onLoanDetails(loan.id)}
                          >
                            {loan.repaymentTerm}
                          </td>
                          <td
                            className="border-b border-[#eee] py-5 px-4 dark:border-strokedark"
                            onClick={() => onLoanDetails(loan.id)}
                          >
                            {loan.balance}
                          </td>
                          <td
                            className="border-b border-[#eee] py-5 px-4 dark:border-strokedark"
                            onClick={() => onLoanDetails(loan.id)}
                          >
                            {loan.enteredDate
                              ? new Date(loan.enteredDate).toLocaleDateString()
                              : 'N/A'}
                          </td>
                          <td
                            className="border-b border-[#eee] py-5 px-4 dark:border-strokedark"
                          >
                            <div className="flex items-center space-x-3.5">
                              {loan.status ===
                              Loan_STATUS_OPTIONS.PendingDocumentCharge ? (
                                <Tooltip
                                  message={`Loan approved by ${loan.approvedBy
                                    ?.name} on ${new Date(
                                    loan.approvedDate,
                                  ).toLocaleDateString()}`}
                                >
                                  <Badge
                                    text={loan.status}
                                    type={getStatusType(loan.status)}
                                  />
                                </Tooltip>
                              ) : (
                                <Badge
                                  text={loan.status}
                                  type={getStatusType(loan.status)}
                                />
                              )}

                              {allowFirstApproval() &&
                                loan.status ==
                                  Loan_STATUS_OPTIONS.PendingApproval && (
                                  <Tooltip message="Approve">
                                    <button>
                                      <ExclamationTriangleIcon
                                        color="#FFA70B"
                                        className="w-8 cursor-pointer"
                                        onClick={() => onFirstApproveLoan(loan)}
                                      />
                                    </button>
                                  </Tooltip>
                                )}

                              {auth?.userid != loan.approvedBy?.id &&
                                allowSecondApproval() &&
                                loan.status ==
                                  Loan_STATUS_OPTIONS.PendingDocumentCharge && (
                                  <Tooltip message="Release">
                                    <button>
                                      <PaperAirplaneIcon
                                        color="#FFA70B"
                                        className="w-8 cursor-pointer"
                                        onClick={() => onReleaseLoan(loan)}
                                      />
                                    </button>
                                  </Tooltip>
                                )}
                            </div>
                          </td>

                          <td className="py-5 px-4">
                            <div className="flex items-center space-x-3.5">
                              {allowEdit() && (
                                <button>
                                  <PencilSquareIcon
                                    className={`w-6 cursor-pointer text-primary ${
                                      loan.status !==
                                        Loan_STATUS_OPTIONS.PendingApproval &&
                                      loan.status !==
                                        Loan_STATUS_OPTIONS.PendingDocumentCharge &&
                                      'pointer-events-none opacity-40'
                                    }`}
                                    onClick={() => onSelectLoan(loan.id)}
                                  />
                                </button>
                              )}

                              {allowDelete() &&
                                (loan.status ==
                                  Loan_STATUS_OPTIONS.PendingApproval ||
                                  loan.status ==
                                    Loan_STATUS_OPTIONS.PendingDocumentCharge) && (
                                  <DeleteConfirmationModal
                                    title="Delete loan"
                                    message="Are you sure want to delete this loan?"
                                    onSubmit={() => onDelete(loan.id)}
                                  />
                                )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                ) : (
                  <div className="w-full py-5 ml-5">No data available</div>
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
            <AddLoanModal
              open={openAdd}
              onClose={onCloseAdd}
              onRefresh={onRefresh}
              loan={selectedLoan}
              branches={branchOptions}
              products={productOptions}
            />
          )}

          {openApprove && (
            <ApproveLoanModal
              open={openApprove}
              loan={selectedLoan}
              onClose={onCloseApprove}
              onRefresh={onRefresh}
            />
          )}

          {openRelease && (
            <ReleaseLoanModal
              open={openRelease}
              loan={selectedLoan}
              onClose={onCloseRelease}
              onRefresh={onRefresh}
            />
          )}
        </>
      )}
    </>
  );
};

export default Loans;
