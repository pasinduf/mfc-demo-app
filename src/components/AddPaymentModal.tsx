import { Formik } from 'formik';
import { useEffect, useState } from 'react';
import { LoanDetail } from '../entries/loan/loan-detail';
import { getCurrentDate } from '../utils/currentDate';
import Button from './button';
import { Modal } from './modal';
import { findExistForLoanDate } from '../api/collection/findExistForLoanDate';
import  Input from'./Input';
import { addCollection } from '../api/collection/addCollection';
import { toastMessage } from './toastMessage';
import { DEFAULT_ERROR_MESSAGE } from '../api/const/message';
import { Collection } from '../entries/loan/collection';
import { updateCollection } from '../api/collection/updateCollection';
import { getArrears } from '../utils/calculations';
import { getLoanPrevCollection } from '../api/loan/getLoanPrevCollection';

interface Props {
  open: boolean;
  onClose: () => void;
  loan: LoanDetail;
  collectors:any;
  onRefresh: () => void;
  collection?: Collection;
}

const AddPaymentModal = ({
  open,
  loan,
  collectors,
  onRefresh,
  onClose,
  collection,
}: Props) => {
  const today = getCurrentDate();
  const [paymentExist, setPaymentExist] = useState(false);
  
  const [arrears,setArrears] = useState(collection ? collection.arrears : 0);
  const [prevCollection,setPrevCollection] = useState<any>(null)


  useEffect(()=>{
    if (collection && +collection.id > 0) {
      setPrevCollection({
        prevCollectionDate: collection.date,
        lastCollection : {
          id:collection.id,
          arrears:collection.arrears,
          amount: 0
        },
      });
    }
  },[collection])

  


  return (
    <Modal
      isOpen={open}
      setIsOpen={onClose}
      title={`${collection ? 'Update' : 'Add'} Collection`}
      content={
        <div>
          <div className="flex flex-col gap-5.5 p-2">
            <Formik
              initialValues={{
                date: collection ? collection.date?.split('T')[0] : '',
                amount: collection ? collection.amount : 0,
                collectorId: collection ? collection?.collectorId || '' : '',
              }}
              validate={(values) => {
                const errors: any = {};
                if (!values.date) {
                  errors.date = 'date is required';
                }
                if (!values.amount) {
                  errors.amount = 'amount is required';
                }
                return errors;
              }}
              onSubmit={async (values, { setSubmitting }) => {
                try {
                  const payload = {
                    ...values,
                    arrears,
                  };
                  const result = collection
                    ? await updateCollection(collection.id, payload)
                    : await addCollection(loan.id, payload);
                  setSubmitting(false);
                  if (result.status) {
                    onClose();
                    onRefresh();
                    toastMessage(
                      'collection successfully saved',
                      'success',
                      'top-right',
                    );
                  } else {
                    toastMessage(
                      "couldn't save collection",
                      'error',
                      'top-right',
                    );
                  }
                } catch (error: any) {
                  setSubmitting(false);
                  toastMessage(
                    (error as any)?.response?.data?.message ||
                      DEFAULT_ERROR_MESSAGE,
                    'error',
                  );
                }
              }}
            >
              {({
                values,
                errors,
                touched,
                handleSubmit,
                isSubmitting,
                setErrors,
                setFieldValue,
              }) => (
                <form onSubmit={handleSubmit}>
                  <div className="mt-1">
                    <label className="text-sm text-black font-semibold dark:text-white">
                      Date
                    </label>
                    <div className="pb-3 mt-1">
                      <div className="relative w-full">
                        <input
                          type="date"
                          name="date"
                          disabled={!!collection}
                          value={values.date}
                          className="custom-input-date custom-input-date-1 w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                          onKeyDown={(e) => {
                            e.preventDefault();
                          }}
                          onChange={async (e) => {
                            const dt = e.target.value;
                            if (dt) {
                              setFieldValue('date', dt);
                              const result = await findExistForLoanDate(
                                loan.id,
                                dt,
                              );
                              setPaymentExist(result.isExist);

                              const prevCollection =
                                await getLoanPrevCollection(loan.id, dt);
                              setPrevCollection(prevCollection);
                              setArrears(0);
                            }
                          }}
                          max={today}
                        />
                        {paymentExist && (
                          <p className="text-sm font-medium text-danger">
                            payment already exist for given date
                          </p>
                        )}
                        {errors.date && touched.date && (
                          <p className="text-sm font-medium text-danger">
                            {errors.date}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="pb-3">
                      <label className="text-sm text-black font-semibold dark:text-white">
                        Collector
                      </label>
                      <select
                        name="collectorId"
                        value={values.collectorId}
                        className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
                        onChange={async (e) => {
                          const id = +e.target.value;
                          setFieldValue('collectorId', id);
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
                    </div>

                    <div className="pb-3">
                      <label className="text-sm text-black font-semibold dark:text-white">
                        Amount
                      </label>
                      <Input
                        type="number"
                        placeholder="amount"
                        name="amount"
                        value={values.amount}
                        onChange={(e) => {
                          const value = e.target.value;
                          setFieldValue('amount', +value > 0 ? value : 0);
                        }}
                        onBlur={(e) => {
                          const collectionAmount = +e.target.value;
                          const arrears = getArrears(
                            prevCollection.prevCollectionDate,
                            values.date,
                            collectionAmount,
                            prevCollection.lastCollection
                              ? prevCollection.lastCollection.arrears
                              : 0,
                             + loan.installmentAmount,
                            loan.repaymentTerm,
                            +loan.balance,
                            collection ? true : false,
                           collection ? +collection.amount :0
                          );
                          setArrears(arrears);
                        }}
                      />
                      {errors.amount && touched.amount && (
                        <p className="text-sm font-medium text-danger">
                          {errors.amount}
                        </p>
                      )}
                    </div>

                    <div>
                      <span className="text-sm font-bold"> Installment: </span>
                      {loan.installmentAmount}
                    </div>
                    <div>
                      <span className="text-sm font-bold">Arrears: </span>
                      <span
                        className={
                          arrears > 0
                            ? 'text-danger'
                            : arrears < 0
                            ? 'text-success'
                            : ''
                        }
                      >
                        {arrears}
                      </span>
                    </div>
                  </div>

                  <div className="flex mt-4 gap-3 justify-end text-right">
                    <Button
                      text="Save"
                      type="submit"
                      disabled={isSubmitting || paymentExist}
                    />
                    <Button
                      text="Close"
                      inverse
                      className="bg-bodydark2"
                      onClick={() => {
                        onClose();
                        setErrors({});
                      }}
                    />
                  </div>
                </form>
              )}
            </Formik>
          </div>
        </div>
      }
    />
  );
};

export default AddPaymentModal;
