
import { useAuth } from '../../hooks/useAuth';
import Breadcrumb from '../../components/Breadcrumb';
import 'react-tabs/style/react-tabs.css';
import { getCurrentDate } from '../../utils/dateConvert';
import { useEffect, useState } from 'react';
import {
  CenterLoanstFilterField,
  FilterInputs,
} from '../../entries/payments/center-loans-filter';
import { ChevronDownIcon, XCircleIcon, MagnifyingGlassCircleIcon } from '@heroicons/react/24/outline';
import { createObjectWithoutEmptyValues } from '../../utils/createObjectWithoutEmptyValues';
import { getCentersByDate } from '../../api/center/getCentersByDate';
import { getLoansByCenter } from '../../api/loan/getLoansByCenter';
import { CenterLoans } from '../../entries/payments/center-loans';
import Loader from '../../components/loader';
import Input from '../../components/Input';
import { getArrears } from '../../utils/calculations';
import Button from '../../components/button';
import { Add_Bulk_Payment } from '../../api/RBAC/userAccess';
import { saveBulkCollection } from '../../api/collection/saveBulkCollection';
import { getDateString } from '../../utils/YYYY-MM-DD';
import { toastMessage } from '../../components/toastMessage';
import { DEFAULT_ERROR_MESSAGE } from '../../api/const/message';
import { getCollectors } from '../../api/collection/getCollectors';

const Payments = () => {
  const { auth }: any = useAuth();


     const today = getCurrentDate();
      const [centerOptions,setCenterOptions] = useState<any>([]);
      const [collectors, setCollectors] = useState<any>([]);
      const [isLoading, setIsLoading] = useState(false);
      const [date, setDate] = useState<any>(today);
      const [selectedCenter, setSelectedCenter] = useState<any>(0);
      const [data,setData] = useState<CenterLoans[]>([])
    
    
      const [filter, setFilter] = useState<FilterInputs>({
        [CenterLoanstFilterField.Date]: date,
        [CenterLoanstFilterField.Center]: null,
      });

      const [submitting, setSubmitting] = useState<boolean>(false);


      const allowSave = ()=>{
        return auth?.access?.includes(Add_Bulk_Payment);
      }
    

    useEffect(()=>{
      fetchCenters(date);
      fetchCollectors();
      
    },[])

    const fetchCenters = async (date:string)=>{
      const centers = await getCentersByDate(date);
      setCenterOptions(centers);
    }

    const fetchCollectors = async () => {
      const collectors = await getCollectors();
      setCollectors(collectors);
    };
    
    const onSelectCenter = (event: any) => {
      const value = +event.target.value;
      if (value > 0) {
        setSelectedCenter(value);
        setFilter({
          ...filter,
          [CenterLoanstFilterField.Center]: value,
        });
        setData([]);
      }
    };

      
     
      const fetchLoans = async () => {
        setIsLoading(true)
        try {
          const filters = createObjectWithoutEmptyValues(filter);
    
          const params = {
            ...filters,
          };
          const result = await getLoansByCenter(params);

          const records :any = [];
        
          result.map((item: any) =>
            records.push({
              ...item,
              arrears: getArrears(
                item.prevCollectionDate,
                date,
                item.collection,
                item.lastCollection ? item.lastCollection.arrears : 0,
                item.installmentAmount,
                item.repaymentTerm,
                item.balance,
                item.lastCollection ? true : false,
                item.lastCollection ? item.lastCollection.amount : 0,
              ),
            }),
          ),
          setData(records);
    
        } catch (error: any) {
        } finally {
          setIsLoading(false);
        }
      };
    
      const onClearFilter = ()=> {
        setData([])
        setCenterOptions([]);
        setDate(today);
        setSelectedCenter(0);
        setFilter({
          [CenterLoanstFilterField.Date]: today,
          [CenterLoanstFilterField.Center]: null,
        });
      };


  const saveBulk = async ()=>{
    
    if(data?.length >0){
      setSubmitting(true);
      const payload: any = [];
      const collectionDate = getDateString(date);
      data.map((item) => {
        payload.push({
          date: collectionDate,
          loanId: item.id,
          amount: item.collection,
          arrears: item.arrears,
          collectionId: item.lastCollection ? item.lastCollection.id : null,
          collectorId: item.lastCollection ? item.lastCollection?.collectorId : null,
        });
      });

      try{
        const result = await saveBulkCollection(payload)
        setSubmitting(false);
          if (result.status) {
              fetchLoans();
              toastMessage(
                'collections saved successfully',
                'success',
                'top-right',
              );
          } else {
            toastMessage(
              "couldn't save collections",
              'error',
              'top-right',
            );
          }
      }catch(error) {
        setSubmitting(false);
        toastMessage(
          (error as any)?.response?.data?.message ||
            DEFAULT_ERROR_MESSAGE,
          'error',
        );
      }
    }
  }
    

  return (
    <>
      <Breadcrumb pageName="Payments" />
      <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between rounded-sm border border-stroke bg-white px-5 sm:px-4 xl:col-span-8 py-4">
        <div className="flex items-start gap-4">
          <div>
            <input
              type="date"
              name="date"
              value={date}
              className="custom-input-date custom-input-date-1 w-full rounded border-[2px] border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              onKeyDown={(e) => {
                e.preventDefault();
              }}
              onChange={async (e) => {
                setSelectedCenter(0);
                const dt = e.target.value;
                if (dt) {
                  setDate(dt);
                  setFilter({
                    ...filter,
                    [CenterLoanstFilterField.Date]: dt,
                  });
                  fetchCenters(dt);
                  setData([]);
                }
              }}
              max={today}
            />
          </div>

          <div className="relative inline-block">
            <select
              name="centers"
              id="centers"
              value={selectedCenter}
              onChange={onSelectCenter}
              style={{
                width: '220px',
                height: '45px',
              }}
              className="relative z-20 inline-flex appearance-none   pl-3 pr-8 text-black text-md  rounded border-[2px] border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            >
              <option value="">Select Center</option>
              {centerOptions &&
                centerOptions.length > 0 &&
                centerOptions.map((center: any, index: number) => {
                  return (
                    <option key={`center-opt-${index}`} value={center.id}>
                      {center.name}
                    </option>
                  );
                })}
            </select>
            <ChevronDownIcon className="w-5 absolute top-1/2 right-3 z-10 -translate-y-1/2 cursor-pointer" />
          </div>

          <div className="w-full lg:w-1/2 xl:w-1/4 mt-2">
            <MagnifyingGlassCircleIcon
              className="w-8 cursor-pointer text-primary"
              onClick={() => !isLoading && selectedCenter && fetchLoans()}
            />
          </div>

          <div className="w-full lg:w-1/2 xl:w-1/4 mt-2">
            <XCircleIcon
              className="w-8 cursor-pointer text-base"
              onClick={onClearFilter}
            />
          </div>
        </div>
        <div className="text-right mr-4">
          {allowSave() && data.length > 0 && (
            <Button
              text="Save"
              type="submit"
              onClick={saveBulk}
              disabled={submitting}
            />
          )}
        </div>
      </div>

      {isLoading && <Loader />}

      {!isLoading && data.length > 0 && (
        <div>
          <div className="container mx-auto p-4">
            <table className="table-auto w-full">
              <thead>
                <tr>
                  <th>Loan Num</th>
                  <th>Member Code</th>
                  <th>Name</th>
                  <th>Installment (Rs.)</th>
                  <th>Collector</th>
                  <th>Amount (Rs.)</th>
                </tr>
              </thead>

              <tbody>
                {data.map((item) => (
                  <tr
                    key={item.id}
                    className="border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                  >
                    <td className="text-center">{item.code}</td>
                    <td className="text-center">{item.memberCode}</td>
                    <td className="text-center">{item.memberName}</td>
                    <td className="text-center">{item.installmentAmount}</td>
                    <td className="text-center">
                      <select
                        name="collectorId"
                        value={item.lastCollection ? item.lastCollection?.collectorId : ''}
                        className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
                        onChange={async (e) => {
                          const id = +e.target.value;
                          
                             setData((prevData: any) =>
                               prevData.map((data: any) =>
                                 data.id === item.id
                                   ? {
                                       ...data,
                                       lastCollection: {
                                         ...data.lastCollection,
                                         collectorId: id > 0 ? id : '',
                                       },
                                     }
                                   : data,
                               ),
                             );
                        }}
                      >
                        <option value="">Select</option>
                        {collectors.map((collector: any, index: number) => {
                          return (
                            <option
                              key={`collectors-op-${index}`}
                              value={collector.value}
                            >
                              {collector.name}
                            </option>
                          );
                        })}
                      </select>
                    </td>
                    <td className="text-center">
                      <div className="flex justify-center items-center p-1 mt-2">
                        <Input
                          type="number"
                          placeholder="Amount"
                          style={{ width: '140px' }}
                          name="amount"
                          value={item.collection}
                          disabled={!allowSave()}
                          onChange={(e) => {
                            const value = +e.target.value;
                            setData((prevData: any) =>
                              prevData.map((data: any) =>
                                data.id === item.id
                                  ? {
                                      ...data,
                                      collection: value > 0 ? value : 0,
                                    }
                                  : data,
                              ),
                            );
                          }}
                          onBlur={(e) => {
                            const collectionAmount = +e.target.value;
                            setData((prevData: any) =>
                              prevData.map((data: any) =>
                                data.id === item.id
                                  ? {
                                      ...data,
                                      arrears: getArrears(
                                        item.prevCollectionDate,
                                        date,
                                        collectionAmount,
                                        item.lastCollection
                                          ? item.lastCollection.arrears
                                          : 0,
                                        item.installmentAmount,
                                        item.repaymentTerm,
                                        item.balance,
                                        item.lastCollection ? true : false,
                                        item.lastCollection
                                          ? item.lastCollection.amount
                                          : 0,
                                      ),
                                    }
                                  : data,
                              ),
                            );
                          }}
                        />
                      </div>
                      <div>
                        <span className="text-sm font-bold">Arrears: </span>
                        <span
                          className={
                            item.arrears > 0
                              ? 'text-danger'
                              : item.arrears < 0
                              ? 'text-success'
                              : ''
                          }
                        >
                          {item.arrears}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
};

export default Payments;
