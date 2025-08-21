import { Formik } from 'formik';
import { getCurrentDate } from '../../../utils/dateConvert';
import { Modal } from '../../../components/modal';
import { toastMessage } from '../../../components/toastMessage';
import { DEFAULT_ERROR_MESSAGE } from '../../../api/const/message';
import  Input  from '../../../components/Input';
import Button from '../../../components/button';
import { addCollection } from '../../../api/collection/addCollection';
import { updateCollection } from '../../../api/collection/updateCollection';
import { CollectionDto } from '../../../entries/loan/collector-loan';
import { useEffect, useState } from 'react';
import { getArrears } from '../../../utils/calculations';
import { getLoanPrevCollection } from '../../../api/loan/getLoanPrevCollection';
import { useAuth } from '../../../hooks/useAuth';

interface Props {
  open: boolean;
  onClose: () => void;
  id: number;
  installmentAmount: string;
  balance: string;
  loanAmount: string;
  repaymentTerm:string;
  onRefresh: () => void;
  collection?: CollectionDto;
}

const AddPaymentModal = ({
  open,
  onClose,
  id,
  installmentAmount,
  balance,
  loanAmount,
  repaymentTerm,
  onRefresh,
  collection,
}: Props) => {

   const { auth }: any = useAuth();
  const today = getCurrentDate();

  const [arrears,setArrears] = useState(collection ? collection.arrears : 0);
  const [prevCollection,setPrevCollection] = useState<any>(null)


    useEffect(() => {
      fetchPrevCollection();
    }, []);

    const fetchPrevCollection=async ()=>{
        const prevCollection = await getLoanPrevCollection(id, today);
        setPrevCollection(prevCollection);
    }

     useEffect(() => {
      if (prevCollection && prevCollection.prevCollectionDate){
         const arrears = getArrears(
           prevCollection.prevCollectionDate,
           today,
           collection ? collection.amount : 0,
           prevCollection.lastCollection
             ? prevCollection.lastCollection.arrears
             : 0,
           +installmentAmount,
           repaymentTerm,
           +balance,
           collection ? true : false,
           collection ? +collection.amount : 0,
         );
         setArrears(arrears);

      }
     }, [prevCollection]);
  

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
                amount: collection ? Math.trunc(+collection.amount) : 0,
              }}
              validate={(values) => {
                const errors: any = {};
                if (!values.amount) {
                  errors.amount = 'amount is required';
                }
                if (values.amount && +values.amount > +loanAmount) {
                  errors.amount = `amount can't exceed full amount`;
                }
                if (values.amount && +values.amount > +balance) {
                  errors.amount = `amount can't exceed balance amount`;
                }
                return errors;
              }}
              onSubmit={async (values, { setSubmitting }) => {
                try {
                  const payload = {
                    date: today,
                    amount: +values.amount,
                    arrears,
                    collectorId: auth.userid,
                  };
                  const result = collection
                    ? await updateCollection(collection.id, payload)
                    : await addCollection(id, payload);
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
                    <div className="pb-3">
                      <label className="text-sm text-black font-semibold dark:text-white">
                        Amount
                      </label>
                      <Input
                        type="number"
                        placeholder="Enter amount"
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
                            today,
                            collectionAmount,
                            prevCollection.lastCollection
                              ? prevCollection.lastCollection.arrears
                              : 0,
                            +installmentAmount,
                            repaymentTerm,
                            +balance,
                            collection ? true : false,
                            collection ? +collection.amount : 0,
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
                      <div className="text-sm font-bold">Installment: {+installmentAmount} </div>
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
                    <Button text="Save" type="submit" disabled={isSubmitting} />
                    <Button
                      text="Close"
                      inverse
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
