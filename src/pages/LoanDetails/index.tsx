import { useEffect, useState } from 'react';
import { PlusIcon, PencilSquareIcon,ArrowPathIcon } from '@heroicons/react/24/solid';
import Breadcrumb from '../../components/Breadcrumb';
import Loader from '../../components/loader';
import { getLoanDetails } from '../../api/loan/getLoanDetails';
import { useParams } from 'react-router-dom';
import AddPaymentModal from '../../components/AddPaymentModal';
import { Loan_STATUS_OPTIONS } from '../../api/auth/constants';
import { getCollectionsByLoan } from '../../api/collection/getCollectionsByLoan';
import { Collection } from '../../entries/loan/collection';
import DeleteConfirmationModal from '../../components/DeleteConfirmationModal';
import { deleteCollection } from '../../api/collection/deleteCollection';
import { toastMessage } from '../../components/toastMessage';
import { ShowError } from '../../components/ShowError';
import { DEFAULT_ERROR_MESSAGE } from '../../api/const/message';
import { useAuth } from '../../hooks/useAuth';
import { getCollectors } from '../../api/collection/getCollectors';
import { Add_Loan_Payment, Delete_Loan_Payment, Edit_Loan_Payment, View_Loan_Payment } from '../../api/RBAC/userAccess';
import { CollectionType } from '../../entries/loan/collection-type';
import { getStatusType } from '../../utils/getStatusType';
import { Badge } from '../../components/Badge';

const LoanDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { auth }: any = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [loan, setLoan] = useState<any>();
  const [openAddPayment, setOpenAddPayment] = useState(false);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [error, setError] = useState<any>(null);

  const [collection, setCollection] = useState<any>();
  const [collectors, setCollectors] = useState<any>([]);

  const onOpen = () => setOpenAddPayment(true);
  const onClose = () => {
    collection && setCollection(null);
    setOpenAddPayment(false);
  };

  const onEditCollection = (collection: any) => {
    setCollection(collection);
    onOpen();
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = () => {
    if (id && +id > 0) {
      fetchCollectors();
      fetchLoanDetails(+id);
      fetchCollections();
    }
  };


  const fetchCollectors = async()=>{
   const collectors = await getCollectors();
   setCollectors(collectors)
  }

  const fetchLoanDetails = async (id: number) => {
    try {
      const result = await getLoanDetails(id);
      setLoan(result);
    } catch (error: any) {
      setError(error?.response?.data?.statusCode || 400);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCollections = async () => {
    if(id){
      setIsLoading(true);
     try {
       const result = await getCollectionsByLoan(+id);
       setCollections(result);
     } catch (error: any) {
       setError(error?.response?.data?.statusCode || 400);
     } finally {
       setIsLoading(false);
     }
    }
  };

  const onDeleteCollection = async (id: number) => {
    try {
      await deleteCollection(id);
      fetchCollections();
      toastMessage('collection successfully deleted', 'success', 'top-right');
    } catch (error: any) {
      toastMessage(
        (error as any)?.response?.data?.message || DEFAULT_ERROR_MESSAGE,
        'error',
      );
    }
  };

   const allowViewPayment = () => {
     return auth?.access.includes(View_Loan_Payment);
   };


  const allowAddPayment = () => {
    return auth?.access.includes(Add_Loan_Payment)
  };

  const allowEditPayment = () => {
    return auth?.access.includes(Edit_Loan_Payment);
  };

  
  const allowDeletePayment = () => {
    return auth?.access.includes(Delete_Loan_Payment);
  };


  const installments = collections.filter(x=>x.type === CollectionType.Installment); 

  return (
    <>
      <Breadcrumb pageName="Loan Details" navigateBack="/loans" />
      {isLoading && <Loader />}
      {error && <ShowError error={error} />}
      {!error && !isLoading && loan && (
        <>
          <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
            <div className="flex flex-col gap-9">
              <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                  <div className="mb-2 flex flex-col gap-6 xl:flex-row">
                    <h3 className="text-title-md text-black dark:text-white xl:w-1/2">
                      Loan Details
                    </h3>
                    <div className="w-full xl:w-1/2 text-right">
                      <Badge
                        text={loan.status}
                        type={getStatusType(loan.status)}
                      />
                    </div>
                  </div>
                  <div className="text-sm text-black font-semibold w-full xl:w-1/2">
                    #{loan.code}
                  </div>
                </div>

                <div className="px-6.5 pt-4">
                  <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                    <div className="w-full xl:w-1/3">
                      <label className="text-sm text-black font-semibold dark:text-white">
                        Entered Date:
                      </label>
                      <span className="block ml-1 text-black dark:text-white">
                        {loan.enteredDate
                          ? new Date(loan.enteredDate).toLocaleDateString()
                          : 'N/A'}
                      </span>
                    </div>

                    <div className="w-full xl:w-1/3">
                      <label className="text-sm text-black font-semibold dark:text-white">
                        Entered By:
                      </label>
                      <span className="block ml-1 text-black dark:text-white">
                        {loan.enteredBy ? loan.enteredBy?.name : 'N/A'}
                      </span>
                    </div>
                  </div>

                  <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                    <div className="w-full xl:w-1/3">
                      <label className="text-sm text-black font-semibold dark:text-white">
                        Approved Date:
                      </label>
                      <span className="block ml-1 text-black dark:text-white">
                        {loan.approvedDate
                          ? new Date(loan.approvedDate).toLocaleDateString()
                          : 'N/A'}
                      </span>
                    </div>

                    <div className="w-full xl:w-1/3">
                      <label className="text-sm text-black font-semibold dark:text-white">
                        Approved By:
                      </label>
                      <span className="block ml-1 text-black dark:text-white">
                        {loan.approvedBy ? loan.approvedBy?.name : 'N/A'}
                      </span>
                    </div>
                  </div>

                  <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                    <div className="w-full xl:w-1/3">
                      <label className="text-sm text-black font-semibold dark:text-white">
                        Released Date:
                      </label>
                      <span className="block ml-1 text-black dark:text-white">
                        {loan.releasedDate
                          ? new Date(loan.releasedDate).toLocaleDateString()
                          : 'N/A'}
                      </span>
                    </div>

                    <div className="w-full xl:w-1/3">
                      <label className="text-sm text-black font-semibold dark:text-white">
                        Released By:
                      </label>
                      <span className="block ml-1 text-black dark:text-white">
                        {loan.releasedBy ? loan.releasedBy?.name : 'N/A'}
                      </span>
                    </div>

                    <div className="w-full xl:w-1/3">
                      <label className="text-sm text-black font-semibold dark:text-white">
                        Document Charge:
                      </label>
                      <span className="block ml-1 text-black dark:text-white">
                        {loan.documentCharge}
                      </span>
                    </div>
                  </div>

                  <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                    <div className="w-full xl:w-1/3">
                      <label className="text-sm text-black font-semibold dark:text-white">
                        Start Date:
                      </label>
                      <span className="block ml-1 text-black dark:text-white">
                        {loan.startDate
                          ? new Date(loan.startDate).toLocaleDateString()
                          : 'N/A'}
                      </span>
                    </div>

                    <div className="w-full xl:w-1/3">
                      <label className="text-sm text-black font-semibold dark:text-white">
                        End Date:
                      </label>
                      <span className="block ml-1 text-black dark:text-white">
                        {loan.endDate
                          ? new Date(loan.endDate).toLocaleDateString()
                          : 'N/A'}
                      </span>
                    </div>
                    <div className="w-full xl:w-1/3">
                      <label className="text-sm text-black font-semibold dark:text-white">
                        Re-payment term:
                      </label>
                      <span className="block ml-1 text-black dark:text-white">
                        {loan.repaymentTerm}
                      </span>
                    </div>
                  </div>

                  <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                    <div className="w-full xl:w-1/3">
                      <label className="text-sm text-black font-semibold dark:text-white">
                        Amount:
                      </label>
                      <span className="block ml-1 text-black dark:text-white">
                        {loan.amount}
                      </span>
                    </div>

                    <div className="w-full xl:w-1/3">
                      <label className="text-sm text-black font-semibold dark:text-white">
                        Rate:
                      </label>
                      <span className="block ml-1 text-black dark:text-white">
                        {loan.interestRate}%
                      </span>
                    </div>

                    <div className="w-full xl:w-1/3">
                      <label className="text-sm text-black font-semibold dark:text-white">
                        Total outstanding:
                      </label>
                      <span className="block ml-1 text-black dark:text-white">
                        {loan.totalOutstanding}
                      </span>
                    </div>
                  </div>

                  <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                    <div className="w-full xl:w-1/3">
                      <label className="text-sm text-black font-semibold dark:text-white">
                        Terms:
                      </label>
                      <span className="block ml-1 text-black dark:text-white">
                        {loan.terms}
                      </span>
                    </div>

                    <div className="w-full xl:w-1/3">
                      <label className="text-sm text-black font-semibold dark:text-white">
                        Installment:
                      </label>
                      <span className="block ml-1 text-black dark:text-white">
                        {loan.installmentAmount}
                      </span>
                    </div>
                    <div className="w-full xl:w-1/3">
                      <label className="text-sm text-black font-semibold dark:text-white">
                        Balance:
                      </label>
                      <span className="block ml-1 text-black dark:text-white">
                        {loan.balance}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                  <div className="text-title-md text-black dark:text-white">
                    Member Details
                  </div>
                </div>
                <div className="px-6.5 pt-4">
                  <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                    <div className="w-full xl:w-1/2">
                      <label className="text-sm text-black font-semibold dark:text-white">
                        Name:
                      </label>
                      <span className="block ml-1 text-black dark:text-white">
                        {loan.member?.firstName} {loan.member?.lastName} (
                        {loan.member?.code})
                      </span>
                    </div>

                    <div className="w-full xl:w-1/2">
                      <label className="text-sm text-black font-semibold dark:text-white">
                        NIC:
                      </label>
                      <span className="block ml-1 text-black dark:text-white">
                        {loan.member?.nic} (DOB: {loan.member?.dob || 'N/A'})
                      </span>
                    </div>
                  </div>

                  <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                    <div className="w-full xl:w-1/2">
                      <label className="text-sm text-black font-semibold dark:text-white">
                        Business Type:
                      </label>
                      <span className="block ml-1 text-black dark:text-white">
                        {loan.member?.businessType}
                      </span>
                    </div>

                    <div className="w-full xl:w-1/2">
                      <label className="text-sm text-black font-semibold dark:text-white">
                        Contact:
                      </label>
                      <span className="block ml-1 text-black dark:text-white">
                        {loan.member?.phoneNumber}
                      </span>
                    </div>
                  </div>

                  <div className="mb-4.5">
                    <label className="text-sm text-black font-semibold dark:text-white">
                      Address:
                    </label>
                    <div className="min-h-full overflow-y-auto block ml-1 text-black dark:text-white">
                      {loan.member?.address}
                    </div>
                  </div>

                  <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                    <div className="w-full xl:w-1/2">
                      <label className="text-sm text-black font-semibold dark:text-white">
                        Branch:
                      </label>
                      <span className="block ml-1 text-black dark:text-white">
                        {loan.center?.branch?.name} ({loan.center?.branch?.code}
                        )
                      </span>
                    </div>

                    <div className="w-full xl:w-1/2">
                      <label className="text-sm text-black font-semibold dark:text-white">
                        Center:
                      </label>
                      <span className="block ml-1 text-black dark:text-white">
                        {loan.center?.name} ({loan.center?.code})
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                  <h3 className="font-medium text-black dark:text-white">
                    Guardian Details
                  </h3>
                </div>
                <div className="px-6.5 pt-4">
                  <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                    <div className="w-full xl:w-1/2">
                      <label className="text-sm text-black font-semibold dark:text-white">
                        Name
                      </label>
                      <span className="block ml-1 text-black dark:text-white">
                        {loan.member?.guarantor?.firstName}{' '}
                        {loan.member?.guarantor?.lastName}
                      </span>
                    </div>

                    <div className="w-full xl:w-1/2">
                      <label className="text-sm text-black font-semibold dark:text-white">
                        NIC:
                      </label>
                      <span className="block ml-1 text-black dark:text-white">
                        {loan.member?.guarantor?.nic}
                      </span>
                    </div>
                  </div>

                  <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                    <div className="w-full xl:w-1/2">
                      <label className="text-sm text-black font-semibold dark:text-white">
                        Contact:
                      </label>
                      <span className="block ml-1 text-black dark:text-white">
                        {loan.member?.guarantor?.phoneNumber}
                      </span>
                    </div>

                    <div className="w-full xl:w-1/2">
                      <label className="text-sm text-black font-semibold dark:text-white">
                        Relationship:
                      </label>
                      <span className="block ml-1 text-black dark:text-white">
                        {loan.member?.guarantor?.relationship}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {allowViewPayment() && (
            <div className="rounded-sm border mt-6 border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                <div className="flex flex-col gap-4 xl:flex-row">
                  <div className="w-full">
                    <div className="text-title-md text-black dark:text-white">
                      Collection Details
                      <button className="ml-3" onClick={fetchCollections}>
                        <ArrowPathIcon
                          className="w-6 cursor-pointer"
                        />
                      </button>
                    </div>
                  </div>
                  <div className="w-full xl:w-1/2 text-right">
                    {allowAddPayment() &&
                      loan.status === Loan_STATUS_OPTIONS.InProgress && (
                        <button
                          onClick={onOpen}
                          className="inline-flex items-center justify-center rounded-full bg-primary py-2 px-4 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-6 ml-auto"
                        >
                          <PlusIcon className="w-4" />
                          Collection
                        </button>
                      )}
                  </div>
                </div>
              </div>
              <div className="px-6.5 pt-4">
                <div className="h-auto max-h-94 overflow-y-auto">
                  <table className="table-fixed w-full">
                    <thead className="sticky top-0 bg-graydark z-10">
                      <tr className="text-left bg-graydark">
                        <th className="min-w-[50px] py-4 font-medium text-white dark:text-white xl:pl-4">
                          Date
                        </th>
                        <th className="min-w-[50px] py-4 font-medium text-white dark:text-white xl:pl-4">
                          Type
                        </th>
                        <th className="min-w-[50px] py-4 font-medium text-white dark:text-white xl:pl-4">
                          Amount
                        </th>
                        <th className="min-w-[50px] py-4 font-medium text-white dark:text-white xl:pl-4">
                          Receipt No
                        </th>
                        <th className="min-w-[50px] py-4 font-medium text-white dark:text-white xl:pl-4">
                          Collector
                        </th>
                        <th className="min-w-[50px] py-4 px-4 font-medium text-white dark:text-white xl:pl-4">
                          Arrears
                        </th>
                        <th className="min-w-[50px] py-4 px-4 font-medium text-white dark:text-white xl:pl-4">
                          Balance
                        </th>
                        <th className="py-4 px-4 font-medium text-white dark:text-white"></th>
                      </tr>
                    </thead>
                    {collections && collections.length > 0 ? (
                      <tbody>
                        {collections
                          .filter(
                            (x) => x.type == CollectionType.DocumentCharge,
                          )
                          .map((doc, docIndex) => {
                            return (
                              <tr
                                key={`doc-charge-${docIndex}`}
                                className="bg-meta-10"
                              >
                                <td className="border-b border-[#eee] py-2 px-4 pl-2 dark:border-strokedark">
                                  {new Date(doc.date).toLocaleDateString()}
                                </td>
                                <td>
                                  <Badge
                                    text="Document"
                                    type={getStatusType('PendingApproval')}
                                  />
                                </td>
                                <td>{doc.amount}</td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td>{doc.balance?.toFixed(2)}</td>
                                <td></td>
                              </tr>
                            );
                          })}
                        {installments.map((collection, index) => {
                          return (
                            <tr key={`collection-${index}`}>
                              <td className="border-b border-[#eee] py-5 px-4 pl-2 dark:border-strokedark">
                                {new Date(collection.date).toLocaleDateString()}
                              </td>
                              <td className="border-b border-[#eee] py-5 px-4 pl-2 dark:border-strokedark">
                                <Badge
                                  text="Installment"
                                  type={getStatusType('Completed')}
                                />
                              </td>
                              <td className="border-b border-[#eee] py-5 px-4 pl-2 dark:border-strokedark">
                                {collection.amount}
                              </td>
                              <td className="border-b border-[#eee] py-5 px-4 pl-2 dark:border-strokedark">
                                {collection.receipt}
                              </td>
                              <td className="border-b border-[#eee] py-5 px-4 pl-2 dark:border-strokedark">
                                {collection.collectorId
                                  ? collectors.find(
                                      (x: any) =>
                                        +x.value == collection.collectorId,
                                    )?.name
                                  : ''}
                              </td>

                              <td className="border-b border-[#eee] py-5 px-4 pl-2 dark:border-strokedark">
                                {collection.arrears}
                              </td>
                              <td className="border-b border-[#eee] py-5 px-4 pl-2 dark:border-strokedark">
                                {collection.balance?.toFixed(2)}
                              </td>
                              {index == installments.length - 1 && (
                                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                  <div className="flex items-center gap-2">
                                    {allowEditPayment() && (
                                      <PencilSquareIcon
                                        className="w-6 cursor-pointer"
                                        onClick={() =>
                                          !isLoading &&
                                          onEditCollection(collection)
                                        }
                                      />
                                    )}
                                    {allowDeletePayment() && (
                                      <DeleteConfirmationModal
                                        title="Delete collection"
                                        message="Are you sure want to delete collection?"
                                        onSubmit={() =>
                                          !isLoading &&
                                          onDeleteCollection(collection.id)
                                        }
                                      />
                                    )}
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
            </div>
          )}

          {openAddPayment && (
            <AddPaymentModal
              open={openAddPayment}
              loan={loan}
              collectors={collectors}
              onClose={onClose}
              onRefresh={fetchData}
              collection={collection}
            />
          )}
        </>
      )}
    </>
  );
};

export default LoanDetails;
