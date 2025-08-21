import { Formik } from 'formik';
import { Modal } from '../../../components/modal';
import { toastMessage } from '../../../components/toastMessage';
import { DEFAULT_ERROR_MESSAGE } from '../../../api/const/message';
import  Input from'../../../components/Input';
import Button from '../../../components/button';
import { Center } from '../../../entries/center/center';
import { createCenter } from '../../../api/center/createCenter';
import { updateCenter } from '../../../api/center/updateCenter';
import { Option } from '../../../entries/options';
import { useAppStore } from '../../../hooks/useAppStore';
import { getFilterCenters } from '../../../api/filters/getFilterCenters';

interface Props {
  open: boolean;
  onClose: () => void;
  onRefresh: () => void;
  branches: Option[];
  collectionDays: any[];
  center?: Center;
}

const AddCenterModal = ({
  open,
  onClose,
  center,
  branches,
  collectionDays,
  onRefresh,
}: Props) => {

    const { store, setStore }: any = useAppStore();
  return (
    <Modal
      isOpen={open}
      setIsOpen={onClose}
      title={`${center && center?.id > 0 ? 'Update' : 'Add new'} center`}
      content={
        <div>
          <div className="flex flex-col gap-5.5 p-4 mt-3">
            <Formik
              initialValues={
                center
                  ? {
                      name: center.name,
                      code: center.code,
                      branch: center.branch.id,
                      collectionWeekDay: center.collectionWeekDay,
                    }
                  : { name: '', code: '', branch: '', collectionWeekDay: '' }
              }
              validate={(values) => {
                const errors: any = {};
                if (!values.name) {
                  errors.name = 'name is required';
                }
                if (!values.code) {
                  errors.code = 'code is required';
                }
                if (!values.branch) {
                  errors.branch = 'branch is required';
                }
                if (!values.collectionWeekDay) {
                  errors.collectionWeekDay = 'collection day is required';
                }
                return errors;
              }}
              onSubmit={async (values, { setSubmitting }) => {
                const payload = {
                  ...values,
                  branchId: +values.branch,
                  collectionWeekDay: +values.collectionWeekDay,
                };
                try {
                  const result =
                    center && center?.id > 0
                      ? await updateCenter(center.id, payload)
                      : await createCenter(payload);
                  setSubmitting(false);
                  if (result) {
                    onClose();

                    const centerFilters = await getFilterCenters();
                    setStore({
                      ...store,
                      centerFilters,
                    });

                    onRefresh();
                    toastMessage(
                      'Center successfully saved',
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
                handleChange,
                handleSubmit,
                isSubmitting,
                setErrors,
                setFieldValue,
              }) => (
                <form onSubmit={handleSubmit}>
                  <div className="pb-3">
                    <label className="text-sm text-black font-semibold dark:text-white">
                      Center name
                    </label>
                    <Input
                      type="text"
                      placeholder="name"
                      name="name"
                      value={values.name}
                      onChange={handleChange}
                    />
                    {errors.name && touched.name && (
                      <p className="text-sm font-medium text-danger">
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div className="pb-3">
                    <label className="text-sm text-black font-semibold dark:text-white">
                      Center code
                    </label>
                    <Input
                      type="text"
                      placeholder="code"
                      name="code"
                      value={values.code}
                      onChange={handleChange}
                    />
                    {errors.code && touched.code && (
                      <p className="text-sm font-medium text-danger">
                        {errors.code}
                      </p>
                    )}
                  </div>
                  <div className="pb-3">
                    <label className="text-sm text-black font-semibold dark:text-white">
                      Branch
                    </label>
                    <select
                      name="branch"
                      value={values.branch}
                      className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
                      onChange={(e) => setFieldValue('branch', e.target.value)}
                    >
                      <option value="">Select</option>
                      {branches.map((branch, index) => {
                        return (
                          <option
                            key={`branch-op-${index}`}
                            value={branch.value}
                          >
                            {branch.name}
                          </option>
                        );
                      })}
                    </select>
                    {touched.branch && errors.branch && (
                      <p className="text-sm font-medium text-danger">
                        {errors.branch}
                      </p>
                    )}
                  </div>

                  <div className="pb-2">
                    <label className="text-sm text-black font-semibold dark:text-white">
                      Collection Day
                    </label>
                    <select
                      name="collectionWeekDay"
                      value={values.collectionWeekDay}
                      className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
                      onChange={(e) =>
                        setFieldValue('collectionWeekDay', e.target.value)
                      }
                    >
                      <option value="">Select</option>
                      {collectionDays.map((day, index) => {
                        return (
                          <option key={`day-op-${index}`} value={day.value}>
                            {day.name}
                          </option>
                        );
                      })}
                    </select>
                    {errors.collectionWeekDay && touched.collectionWeekDay && (
                      <p className="text-sm font-medium text-danger">
                        {errors.collectionWeekDay}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-3 mt-6 justify-end text-right">
                    <Button text="Save" type="submit" disabled={isSubmitting} />
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

export default AddCenterModal;
