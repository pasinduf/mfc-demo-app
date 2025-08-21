import { Formik } from 'formik';
import { Modal } from '../../../components/modal';
import { toastMessage } from '../../../components/toastMessage';
import { DEFAULT_ERROR_MESSAGE } from '../../../api/const/message';
import Button from '../../../components/button';
import { useEffect, useState } from 'react';
import { Loan } from '../../../entries/loan/loan';
import { REPAYMENT_TERM } from '../../../api/auth/constants';
import Checkbox from '../../../components/Checkbox';
import { getCurrentDate } from '../../../utils/currentDate';
import { getDateString } from '../../../utils/YYYY-MM-DD';
import { releaseLoan } from '../../../api/loan/releaseLoan';

interface Props {
  open: boolean;
  onClose: () => void;
  loan: Loan;
  onRefresh: () => void;
}

const ReleaseLoanModal = ({ open, onClose, loan, onRefresh }: Props) => {
  const today = getCurrentDate();
  const [startDate, setStartDate] = useState<any>('');
  const [endDate, setEndDate] = useState<any>('');
  const [customDate, setCustomDate] = useState<any>('');

  const options = { month: 'short', day: '2-digit', year: 'numeric' };

  useEffect(() => {
    setInitialDates();
  }, [loan]);

  const setInitialDates = () => {
    const startDate = new Date(loan.enteredDate);
    const endDate = new Date(loan.enteredDate);
    switch (loan.repaymentTerm) {
      case REPAYMENT_TERM.Daily:
        startDate.setDate(startDate.getDate() + 1);
        endDate.setDate(startDate.getDate() + 1 * loan.terms - 1);
        break;
      case REPAYMENT_TERM.Weekly:
        startDate.setDate(startDate.getDate() + 7);
        endDate.setDate(startDate.getDate() + 7 * loan.terms - 1);
        break;
      case REPAYMENT_TERM.Biweekly:
        startDate.setDate(startDate.getDate() + 14);
        endDate.setDate(startDate.getDate() + 14 * loan.terms - 1);
        break;
      case REPAYMENT_TERM.Monthly:
        startDate.setMonth(startDate.getMonth() + 1, startDate.getDate());
        endDate.setMonth(
          startDate.getMonth() + loan.terms,
          startDate.getDate(),
        );
        break;
      default:
        startDate.setDate(startDate.getDate() + 7);
        break;
    }
    setStartDate(startDate);
    setEndDate(endDate);
  };

  useEffect(() => {
    if (customDate != '') {
      const startDate = new Date(customDate);
      const newEndDate = new Date(customDate);
      switch (loan.repaymentTerm) {
        case REPAYMENT_TERM.Daily:
          newEndDate.setDate(startDate.getDate() + 1 * loan.terms - 1);
          break;
        case REPAYMENT_TERM.Weekly:
          newEndDate.setDate(startDate.getDate() + 7 * loan.terms - 1);
          break;
        case REPAYMENT_TERM.Biweekly:
          newEndDate.setDate(startDate.getDate() + 14 * loan.terms - 1);
          break;
        case REPAYMENT_TERM.Monthly:
          newEndDate.setMonth(
            startDate.getMonth() + loan.terms,
            startDate.getDate(),
          );
          break;
        default:
          newEndDate.setDate(startDate.getDate() + 7);
          break;
      }
      setEndDate(newEndDate);
    }
  }, [customDate]);

  

   return (
     startDate &&
     endDate && (
       <Modal
         isOpen={open}
         setIsOpen={onClose}
         title="Release loan"
         content={
           <div>
             <div className="flex flex-col gap-5.5 p-2 mt-3">
               <Formik
                 initialValues={{
                   overrideDefaultStart: false,
                   startDate,
                   customDate: '',
                   confirmed: false,
                 }}
                 validate={(values) => {
                   const errors: any = {};
                   if (values.overrideDefaultStart && !values.customDate) {
                     errors.customDate = 'date is required';
                   }
                   return errors;
                 }}
                 onSubmit={async (values, { setSubmitting }) => {
                   const payload = {
                     releasedDate: today,
                     startDate: values.overrideDefaultStart
                       ? values.customDate
                       : getDateString(values.startDate),
                     endDate: getDateString(endDate),
                   };
                   try {
                     const result = await releaseLoan(loan.id, payload);
                     setSubmitting(false);
                     if (result) {
                       onClose();
                       onRefresh();
                       toastMessage(
                         'Loan successfully released',
                         'success',
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
                     <div className="text-md font-bold">
                       This loan is scheduled to start on:
                       <span className="ml-1 text-sm text-black font-semibold dark:text-white">
                         {values.customDate == ''
                           ? startDate?.toLocaleDateString('en-US', options)
                           : customDate?.toLocaleDateString('en-US', options)}
                       </span>{' '}
                       and end on
                       <span className="ml-1 text-sm text-black font-semibold dark:text-white">
                         {endDate?.toLocaleDateString('en-US', options)}
                       </span>
                     </div>

                     <div className="mt-4 pb-2">
                       <Checkbox
                         isChecked={values.overrideDefaultStart}
                         onChange={(value) => {
                           setFieldValue('overrideDefaultStart', value);
                           setFieldValue(
                             'customDate',
                             value ? values.customDate : '',
                           );
                         }}
                         label="Change start date"
                       />
                       {values.overrideDefaultStart && (
                         <div className="pb-3 mt-1">
                           <div className="relative w-1/2">
                             <input
                               type="date"
                               name="customDate"
                               value={values.customDate}
                               className="custom-input-date custom-input-date-1 w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                               onKeyDown={(e) => {
                                 e.preventDefault();
                               }}
                               onChange={(e) => {
                                 setFieldValue('customDate', e.target.value);
                                 setCustomDate(new Date(e.target.value));
                               }}
                               // min={today}
                             />
                             {errors.customDate && touched.customDate && (
                               <p className="text-sm font-medium text-danger">
                                 {errors.customDate}
                               </p>
                             )}
                           </div>
                         </div>
                       )}
                     </div>

                     <div className="mt-3">
                       Document charges:
                       <span className="ml-1 text-sm text-black font-semibold dark:text-white">
                         {loan.documentChargePercentage}%
                       </span>
                       <span className='ml-1'>(Rs.{loan.documentCharge})</span>
                       <div className="mt-3 pb-2">
                         <Checkbox
                           isChecked={values.confirmed}
                           onChange={(value) => {
                             setFieldValue('confirmed', value);
                           }}
                           label="Confirm loan release"
                         />
                       </div>
                     </div>

                     <div className="flex mt-4 gap-3 justify-end text-right">
                       <Button
                         text="Confirm"
                         type="submit"
                         disabled={!values.confirmed || isSubmitting}
                       />
                       <Button
                         text="Close"
                         inverse
                         className="bg-bodydark2"
                         onClick={() => {
                           setErrors({});
                           onClose();
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
     )
   );
};

export default ReleaseLoanModal;
