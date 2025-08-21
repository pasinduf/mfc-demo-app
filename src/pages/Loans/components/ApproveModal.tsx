import { Formik } from 'formik';
import { Modal } from '../../../components/modal';
import { toastMessage } from '../../../components/toastMessage';
import { DEFAULT_ERROR_MESSAGE } from '../../../api/const/message';
import Button from '../../../components/button';
import { Loan } from '../../../entries/loan/loan';
import Checkbox from '../../../components/Checkbox';
import { getCurrentDate } from '../../../utils/currentDate';
import { approveLoan } from '../../../api/loan/approveLoan';

interface Props {
  open: boolean;
  onClose: () => void;
  loan: Loan;
  onRefresh: () => void;
}

const ApproveLoanModal = ({ open, onClose, loan, onRefresh }: Props) => {
  const today = getCurrentDate();
 
  return (
    <Modal
      isOpen={open}
      setIsOpen={onClose}
      title="Approve loan"
      content={
        <div>
          <div className="flex flex-col gap-5.5 p-2 mt-3">
            <Formik
              initialValues={{
                confirmed: false,
              }}
              validate={() => {}}
              onSubmit={async (values, { setSubmitting }) => {
                const payload = {
                  approvedDate: today,
                };
                try {
                  const result = await approveLoan(loan.id, payload);
                  setSubmitting(false);
                  if (result) {
                    onClose();
                    onRefresh();
                    toastMessage(
                      'Loan successfully approved',
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
                    Once approve the loan need to add document charges to
                    release..
                  </div>

                  <div>
                    <div className="mt-3 pb-2">
                      <Checkbox
                        isChecked={values.confirmed}
                        onChange={(value) => {
                          setFieldValue('confirmed', value);
                        }}
                        label="Confirm loan approve"
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
  );
};

export default ApproveLoanModal;
