
import { useEffect, useState } from 'react';
import { getCurrentDate } from '../../../utils/currentDate.ts';
import {
  CollectorLoanFilterField,
  FilterInputs,
} from '../../../entries/loan/collector-loan-filter.ts';
import { CollectorCenterDto } from '../../../entries/center/collector-center.ts';
import { CollectorLoanDto } from '../../../entries/loan/collector-loan.ts';
import { getCenters } from '../../../api/dashboard/collector/getCenters/index.ts';
import { createObjectWithoutEmptyValues } from '../../../utils/createObjectWithoutEmptyValues.ts';
import { getLoans } from '../../../api/dashboard/collector/getLoans/index.ts';
import Loader from '../../../components/loader.tsx';
import { ShowError } from '../../../components/ShowError/index.tsx';
import LoanCard from './loanCard.tsx';
import AddPaymentModal from './addPaymentModal.tsx';



const CollectorDashboard = () => {
  const today = getCurrentDate();
  const [type, setType] = useState<string>('daily');

  const [filter, setFilter] = useState<FilterInputs>({
    [CollectorLoanFilterField.Type]: type,
    [CollectorLoanFilterField.Date]: today,
    [CollectorLoanFilterField.Center]: null,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [centers, setCenters] = useState<CollectorCenterDto[]>([]);
  const [selectedCenter, setSelectedCenter] = useState<any>(0);
  const [data, setData] = useState<CollectorLoanDto[]>([]);

  const [selectedLoan, setSelectedLoan] = useState<any>({});
  const [openAddPayment, setOpenAddPayment] = useState(false);

  useEffect(() => {
    fetchCenters();
  }, [type]);
  

  useEffect(() => {
    fetchLoans();
  }, [filter]);

  const fetchCenters = async () => {
    try {
      const params = {
        type,
        date: type === 'daily' ? today : null,
      };
      const result = await getCenters(params);
      setCenters(result);
    } catch (error: any) {
      setError(error?.response?.data?.statusCode || 400);
    }
  };

  const fetchLoans = async () => {
    setIsLoading(true);
    try {
      const filters = createObjectWithoutEmptyValues(filter);

      const params = {
        ...filters,
      };
      const result = await getLoans(params);
      setData(result);
    } catch (error: any) {
      setError(error?.response?.data?.statusCode || 400);
    } finally {
      setIsLoading(false);
    }
  };

  const changeType = (type: string) => {
    setSelectedCenter('');
    setType(type);
    setFilter({
      [CollectorLoanFilterField.Type]: type,
      [CollectorLoanFilterField.Date]: type === 'daily' ? today : null,
      [CollectorLoanFilterField.Center]: null,
    });
  };

  const onSelectCenter = (event: any) => {
    const value = +event.target.value;
    if (value > 0) {
      setSelectedCenter(value);
      setFilter({
        [CollectorLoanFilterField.Type]: type,
        [CollectorLoanFilterField.Date]: type === 'daily' ? today : null,
        [CollectorLoanFilterField.Center]: value,
      });
    }
  };

  const onAddPayment = (loan: any) => {
    setSelectedLoan(loan);
    setOpenAddPayment(true);
  };

  const onCloseAddPayment = () => {
    setSelectedLoan(null);
    setOpenAddPayment(false);
  };

  const onRefresh = () => {
    setSelectedCenter('');
    setType('daily');
    setFilter({
      [CollectorLoanFilterField.Type]: 'daily',
      [CollectorLoanFilterField.Date]: today,
      [CollectorLoanFilterField.Center]: null,
    });
  };

  const onExpand = (id: number) => {
    const selectedLoan = data.find((x) => x.id === id);
    if (selectedLoan) {
      selectedLoan.expanded = !selectedLoan.expanded;
      setData((prevState) => {
        return prevState.map((loan) => (loan.id === id ? selectedLoan : loan));
      });
    }
  };

  return (
    <>
      <div className="grid grid-cols-12 gap-4 md:gap-6 2xl:gap-7.5">
        <div className="col-span-12 xl:col-span-12">
          <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pt-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-4 xl:col-span-8">
            <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
              {/* <div className="flex w-full flex-wrap gap-3 sm:gap-5">
                <div className="flex min-w-47.5">
                  <div className="flex w-full max-w-50">
                    <div className="items-center rounded-md bg-whiter p-3 dark:bg-meta-4">
                      <button
                        onClick={() => changeType('daily')}
                        className={
                          type === 'daily'
                            ? 'rounded py-2 px-4 text-white bg-primary shadow-card text-xs font-medium hover:bg-primary hover:shadow-card dark:bg-boxdark dark:hover:bg-boxdark'
                            : 'rounded py-2 px-4 text-xs font-medium hover:bg-white  dark:bg-white dark:hover:bg-boxdark text-black bg-white'
                        }
                      >
                        Day
                      </button>
                      <button
                        onClick={() => changeType('weekly')}
                        className={
                          type === 'weekly'
                            ? 'rounded py-2 px-4 text-white bg-primary shadow-card text-xs font-medium hover:bg-primary hover:shadow-card dark:bg-boxdark dark:hover:bg-boxdark'
                            : 'rounded py-2 px-4 text-xs font-medium hover:bg-white hover:shadow-card dark:bg-boxdark dark:hover:bg-boxdark text-black bg-white'
                        }
                      >
                        Week
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex min-w-47.5">
                  <div>
                    <div className="relative inline-block">
                      <select
                        name="centers"
                        id="centers"
                        value={selectedCenter}
                        onChange={onSelectCenter}
                        style={{
                          width: '200px',
                        }}
                        className="relative z-20 inline-flex appearance-none bg-transparent py-1 pl-3 pr-8 rounded border-[2px] border-stroke  font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                      >
                        <option value="">Select Center</option>
                        {centers.map((center, index) => {
                          return (
                            <option key={`center-${index}`} value={center.id}>
                              {center.name}
                            </option>
                          );
                        })}
                      </select>
                      <span className="absolute top-1/2 right-3 z-10 -translate-y-1/2">
                        <svg
                          width="10"
                          height="6"
                          viewBox="0 0 10 6"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M0.47072 1.08816C0.47072 1.02932 0.500141 0.955772 0.54427 0.911642C0.647241 0.808672 0.809051 0.808672 0.912022 0.896932L4.85431 4.60386C4.92785 4.67741 5.06025 4.67741 5.14851 4.60386L9.09079 0.896932C9.19376 0.793962 9.35557 0.808672 9.45854 0.911642C9.56151 1.01461 9.5468 1.17642 9.44383 1.27939L5.50155 4.98632C5.22206 5.23639 4.78076 5.23639 4.51598 4.98632L0.558981 1.27939C0.50014 1.22055 0.47072 1.16171 0.47072 1.08816Z"
                            fill="#1C2434"
                          />
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M1.22659 0.546578L5.00141 4.09604L8.76422 0.557869C9.08459 0.244537 9.54201 0.329403 9.79139 0.578788C10.112 0.899434 10.0277 1.36122 9.77668 1.61224L9.76644 1.62248L5.81552 5.33722C5.36257 5.74249 4.6445 5.7544 4.19352 5.32924C4.19327 5.32901 4.19377 5.32948 4.19352 5.32924L0.225953 1.61241C0.102762 1.48922 -4.20186e-08 1.31674 -3.20269e-08 1.08816C-2.40601e-08 0.905899 0.0780105 0.712197 0.211421 0.578787C0.494701 0.295506 0.935574 0.297138 1.21836 0.539529L1.22659 0.546578ZM4.51598 4.98632C4.78076 5.23639 5.22206 5.23639 5.50155 4.98632L9.44383 1.27939C9.5468 1.17642 9.56151 1.01461 9.45854 0.911642C9.35557 0.808672 9.19376 0.793962 9.09079 0.896932L5.14851 4.60386C5.06025 4.67741 4.92785 4.67741 4.85431 4.60386L0.912022 0.896932C0.809051 0.808672 0.647241 0.808672 0.54427 0.911642C0.500141 0.955772 0.47072 1.02932 0.47072 1.08816C0.47072 1.16171 0.50014 1.22055 0.558981 1.27939L4.51598 4.98632Z"
                            fill="#1C2434"
                          />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </div> */}

              <div className="flex w-full flex-col sm:flex-row flex-wrap gap-2 sm:gap-5">
                {/* Day / Week buttons */}
                <div className="flex w-full sm:w-auto">
                  <div className="flex w-full items-center rounded-md bg-whiter p-2 dark:bg-meta-4">
                    <button
                      onClick={() => changeType('daily')}
                      className={
                        type === 'daily'
                          ? 'rounded py-2 px-4 text-white bg-primary shadow-card text-xs font-medium hover:bg-primary hover:shadow-card dark:bg-boxdark dark:hover:bg-boxdark'
                          : 'rounded py-2 px-4 text-xs font-medium hover:bg-white dark:bg-white dark:hover:bg-boxdark text-black bg-white'
                      }
                    >
                      Day
                    </button>
                    <button
                      onClick={() => changeType('weekly')}
                      className={
                        type === 'weekly'
                          ? 'rounded py-2 px-4 text-white bg-primary shadow-card text-xs font-medium hover:bg-primary hover:shadow-card dark:bg-boxdark dark:hover:bg-boxdark'
                          : 'rounded py-2 px-4 text-xs font-medium hover:bg-white hover:shadow-card dark:bg-boxdark dark:hover:bg-boxdark text-black bg-white'
                      }
                    >
                      Week
                    </button>
                  </div>
                </div>

                {/* Center select dropdown */}
                <div className="flex w-full sm:w-auto">
                  <div className="relative inline-block w-full sm:w-[200px]">
                    <select
                      name="centers"
                      id="centers"
                      value={selectedCenter}
                      onChange={onSelectCenter}
                      className="relative z-20 inline-flex w-full appearance-none bg-transparent py-2 pl-3 pr-8 rounded border-[2px] border-stroke font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    >
                      <option value="">Select Center</option>
                      {centers.map((center, index) => (
                        <option key={`center-${index}`} value={center.id}>
                          {center.name}
                        </option>
                      ))}
                    </select>
                    <span className="absolute top-1/2 right-3 z-10 -translate-y-1/2">
                      {/* Chevron icon */}
                      <svg
                        width="10"
                        height="6"
                        viewBox="0 0 10 6"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M0.47072 1.08816C0.47072 1.02932 0.500141 0.955772 0.54427 0.911642C0.647241 0.808672 0.809051 0.808672 0.912022 0.896932L4.85431 4.60386C4.92785 4.67741 5.06025 4.67741 5.14851 4.60386L9.09079 0.896932C9.19376 0.793962 9.35557 0.808672 9.45854 0.911642C9.56151 1.01461 9.5468 1.17642 9.44383 1.27939L5.50155 4.98632C5.22206 5.23639 4.78076 5.23639 4.51598 4.98632L0.558981 1.27939C0.50014 1.22055 0.47072 1.16171 0.47072 1.08816Z"
                          fill="#1C2434"
                        />
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M1.22659 0.546578L5.00141 4.09604L8.76422 0.557869C9.08459 0.244537 9.54201 0.329403 9.79139 0.578788C10.112 0.899434 10.0277 1.36122 9.77668 1.61224L9.76644 1.62248L5.81552 5.33722C5.36257 5.74249 4.6445 5.7544 4.19352 5.32924C4.19327 5.32901 4.19377 5.32948 4.19352 5.32924L0.225953 1.61241C0.102762 1.48922 -4.20186e-08 1.31674 -3.20269e-08 1.08816C-2.40601e-08 0.905899 0.0780105 0.712197 0.211421 0.578787C0.494701 0.295506 0.935574 0.297138 1.21836 0.539529L1.22659 0.546578ZM4.51598 4.98632C4.78076 5.23639 5.22206 5.23639 5.50155 4.98632L9.44383 1.27939C9.5468 1.17642 9.56151 1.01461 9.45854 0.911642C9.35557 0.808672 9.19376 0.793962 9.09079 0.896932L5.14851 4.60386C5.06025 4.67741 4.92785 4.67741 4.85431 4.60386L0.912022 0.896932C0.809051 0.808672 0.647241 0.808672 0.54427 0.911642C0.500141 0.955772 0.47072 1.02932 0.47072 1.08816C0.47072 1.16171 0.50014 1.22055 0.558981 1.27939L4.51598 4.98632Z"
                          fill="#1C2434"
                        />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex min-w-50 justify-end">
                <div className="flex w-full max-w-30 mt-2">
                  <div className="items-center rounded-md p-1.5 dark:bg-meta-4">
                    <button
                      className="mt-2 sm:mt-0 items-center rounded-full bg-body py-1.5 px-2 text-center font-medium text-white hover:bg-opacity-90 w-full sm:w-auto"
                      onClick={onRefresh}
                    >
                      Refresh
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="py-4">
              {isLoading && <Loader />}
              {!isLoading && error && <ShowError error={error} />}
              {!isLoading &&
                !error &&
                (data.length > 0 ? (
                  data.map((loan) => {
                    return (
                      <LoanCard
                        key={`loan-${loan.id}`}
                        type={type}
                        loan={loan}
                        onExpand={onExpand}
                        openAddPayment={onAddPayment}
                      />
                    );
                  })
                ) : (
                  <div className="w-40 py-4">No loans available</div>
                ))}
            </div>

            {openAddPayment && (
              <AddPaymentModal
                open={openAddPayment}
                onClose={onCloseAddPayment}
                onRefresh={onRefresh}
                {...selectedLoan}
              />
            )}

            {/* <div>
              <div className="mt-1">
                <div className="max-w-full overflow-x-auto h-auto max-h-115 overflow-y-auto">
                  <table className="w-full table-auto">
                    <thead className=" sticky top-0  bg-graydark z-10">
                      <tr className="text-left">
                        <th className="min-w-[120px] py-4 px-4 font-medium text-white dark:text-white">
                          Center
                        </th>
                        <th className="min-w-[120px] py-4 px-4 font-medium text-white dark:text-white">
                          Code
                        </th>
                        <th className="min-w-[120px] py-4 px-4 font-medium text-white dark:text-white">
                          Name
                        </th>
                        <th className="py-4 px-4 font-medium text-white dark:text-white">
                          Balance
                        </th>
                        {type === 'daily' && (
                          <th className="py-4 px-4 font-medium text-white dark:text-white">
                            Status
                          </th>
                        )}
                      </tr>
                    </thead>
                    {isLoading && <Loader />}
                    {error && <ShowError error={error} />}
                    {!error && data.length > 0 ? (
                      <tbody>
                        {data.map((item, index) => {
                          return (
                            <tr key={`loan-${index}`}>
                              <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                <h5 className="font-medium text-black dark:text-white">
                                  {item.center}
                                </h5>
                              </td>
                              <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                <h5 className="font-medium text-black dark:text-white">
                                  {item.member?.code}
                                </h5>
                              </td>
                              <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                <p className="text-black dark:text-white">
                                  {`${item.member?.firstName} ${item.member?.lastName}`}
                                </p>
                              </td>
                              <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                {item.balance}
                              </td>
                              {type === 'daily' && (
                                <td>
                                  <div className="flex flex-wrap gap-4">
                                    {item.isDailyCollected ? (
                                      <InformationCircleIcon
                                        className="w-5 cursor-pointer"
                                        color="#219653"
                                      />
                                    ) : (
                                      <PlusCircleIcon
                                        className="w-6 cursor-pointer"
                                        color="#3C50E0"
                                      />
                                    )}
                                    <Badge
                                      text={
                                        item.isDailyCollected
                                          ? Collection_STATUS_OPTIONS.Collected
                                          : Collection_STATUS_OPTIONS.Pending
                                      }
                                      type={getCollectionStatusType(
                                        item.isDailyCollected
                                          ? Collection_STATUS_OPTIONS.Collected
                                          : Collection_STATUS_OPTIONS.Pending,
                                      )}
                                    />
                                  </div>
                                </td>
                              )}
                            </tr>
                          );
                        })}
                      </tbody>
                    ) : (
                      <div className="w-40 py-4">No centers available</div>
                    )}
                  </table>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
};


export default CollectorDashboard;
