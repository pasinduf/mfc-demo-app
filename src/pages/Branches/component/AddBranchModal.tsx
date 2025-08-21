import { Formik } from 'formik';
import { Modal } from '../../../components/modal';
import { createBranch } from '../../../api/branch/createBranch';
import { toastMessage } from '../../../components/toastMessage';
import { DEFAULT_ERROR_MESSAGE } from '../../../api/const/message';
import  Input from'../../../components/Input';
import Button from '../../../components/button';
import { Branch } from '../../../entries/branch/branch';
import { updateBranch } from '../../../api/branch/updateBranch';
import { useAppStore } from '../../../hooks/useAppStore';
import { getFilterBranches } from '../../../api/filters/getFilterBranches';

interface Props {
  open: boolean;
  onClose: () => void;
  onRefresh: () => void;
  branch?: Branch;
}

const AddBranchModal = ({ open, onClose, branch, onRefresh }: Props) => {

  const { store, setStore }: any = useAppStore();

  return (
    <Modal
      isOpen={open}
      setIsOpen={onClose}
      title={`${branch && branch?.id > 0 ? 'Update' : 'Add new'} branch`}
      content={
        <div>
          <div className="flex flex-col gap-5.5 p-4 mt-3">
            <Formik
              initialValues={
                branch
                  ? { name: branch.name, code: branch.code }
                  : { name: '', code: '' }
              }
              validate={(values) => {
                const errors: any = {};
                if (!values.name) {
                  errors.name = 'name is required';
                }
                if (!values.code) {
                  errors.code = 'code is required';
                }
                return errors;
              }}
              onSubmit={async (values, { setSubmitting }) => {
                try {
                  const result =
                    branch && branch?.id > 0
                      ? await updateBranch(branch.id, values)
                      : await createBranch(values);
                  setSubmitting(false);
                  if (result) {
                    onClose();
                    const branchFilters = await getFilterBranches();
                    setStore({
                      ...store,
                      branchFilters
                    });

                    onRefresh();
                    toastMessage(
                      'Branch successfully saved',
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
              }) => (
                <form onSubmit={handleSubmit}>
                  <div className="pb-5">
                    <label className="text-sm text-black font-semibold dark:text-white">
                      Branch name
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

                  <div className="pb-2">
                    <label className="text-sm text-black font-semibold dark:text-white">
                      Branch code
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

                  <div className="flex gap-3 mt-6 justify-end text-right">
                    <Button text="Save" type="submit" disabled={isSubmitting} />
                    <Button
                      text="Close"
                      inverse
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

export default AddBranchModal;
