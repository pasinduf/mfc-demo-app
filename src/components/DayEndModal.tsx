import { Formik } from 'formik';
import { getCurrentDate } from '../utils/currentDate';
import Button from './button';
import { Modal } from './modal';
import { toastMessage } from './toastMessage';
import { DEFAULT_ERROR_MESSAGE } from '../api/const/message';
import { dayEnd } from '../api/collection/dayEnd';
import Checkbox from './Checkbox';

interface Props {
  open: boolean;
  onClose: () => void;
}

const DayEndModal = ({ open, onClose }: Props) => {
  const today = getCurrentDate();

  return (
    <Modal
      size='small'
      isOpen={open}
      setIsOpen={onClose}
      title="Day End"
      content={
        <div>
          <div className="flex flex-col gap-5.5 p-2">
            <Formik
              initialValues={{
                date: today,
                confirmed: false,
              }}
              validate={(values) => {
                const errors: any = {};
                if (!values.date) {
                  errors.date = 'date is required';
                }
                return errors;
              }}
              onSubmit={async (values, { setSubmitting }) => {
                try {
                  await dayEnd(values.date);
                  setSubmitting(false);
                  onClose();
                  toastMessage(
                    'day successfully ended',
                    'success',
                    'top-right',
                  );
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
                          value={values.date}
                          className="custom-input-date custom-input-date-1 w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                          onKeyDown={(e) => {
                            e.preventDefault();
                          }}
                          onChange={async (e) => {
                            const dt = e.target.value;
                            if (dt) {
                              setFieldValue('date', dt);
                              // const result = await findExistForLoanDate(
                              //   loan.id,
                              //   dt,
                              // );
                              // setPaymentExist(result.isExist);
                            }
                          }}
                          max={today}
                        />
                        {errors.date && touched.date && (
                          <p className="text-sm font-medium text-danger">
                            {errors.date}
                          </p>
                        )}
                      </div>

                      <div>
                        <div className="mt-3 pb-2">
                          <Checkbox
                            isChecked={values.confirmed}
                            onChange={(value) => {
                              setFieldValue('confirmed', value);
                            }}
                            label="confirm day end"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex mt-4 gap-3 justify-end text-right">
                    <Button
                      text="Save"
                      type="submit"
                      disabled={!values.confirmed || isSubmitting}
                    />
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

export default DayEndModal;
