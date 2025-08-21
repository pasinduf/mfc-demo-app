import Breadcrumb from '../../components/Breadcrumb';
import { useEffect, useState } from 'react';
import { getActiveUser } from '../../api/user/getActiveUser';
import Loader from '../../components/loader';
import { ShowError } from '../../components/ShowError';
import { Formik } from 'formik';
import  Input from'../../components/Input';
import { UserIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import Button from '../../components/button';
import { updatePassword } from '../../api/user/updatePassword';
import { toastMessage } from '../../components/toastMessage';
import { DEFAULT_ERROR_MESSAGE } from '../../api/const/message';
import { MultiselectDropdown } from '../../components/MultiselectDropdown';
import { useAppStore } from '../../hooks/useAppStore';

const Settings = () => {
  const { store }: any = useAppStore();
  const centerOptions = store?.centerFilters;
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<any>(null);

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    async function fetchuser() {
      try {
        const user = await getActiveUser();
        setUser(user);
      } catch (error: any) {
        setError(error?.response?.data?.statusCode || 400);
      } finally {
        setIsLoading(false);
      }
    }
    fetchuser();
  }, []);

  return (
    <>
      <div className="mx-auto max-w-270">
        <Breadcrumb pageName="Profile" />

        {isLoading && <Loader />}
        {error && <ShowError error={error} />}

        {!error && !isLoading && user && (
          <div className="grid grid-cols-5 gap-8">
            <div className="col-span-5 xl:col-span-3">
              <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
                  <h3 className="font-medium text-black dark:text-white">
                    Personal Information
                  </h3>
                </div>
                <div className="p-7">
                  <form action="#">
                    <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                      <div className="w-full sm:w-1/2">
                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                          Full Name
                        </label>
                        <div className="relative">
                          <span className="absolute left-4.5 top-4">
                            <UserIcon className="w-4" />
                          </span>
                          <input
                            className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                            type="text"
                            name="fullName"
                            value={`${user?.firstName} ${user?.lastName}`}
                            disabled
                          />
                        </div>
                      </div>

                      <div className="w-full sm:w-1/2">
                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                          Phone Number
                        </label>
                        <input
                          className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                          type="text"
                          name="phoneNumber"
                          value={user?.phoneNumber}
                          disabled
                        />
                      </div>
                    </div>

                    <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                      <div className="w-full sm:w-1/2">
                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                          Username
                        </label>
                        <div className="relative">
                          <span className="absolute left-4.5 top-4">
                            <UserIcon className="w-4" />
                          </span>
                          <input
                            className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                            type="text"
                            name="fullName"
                            value={user?.username}
                            disabled
                          />
                        </div>
                      </div>

                      <div className="w-full sm:w-1/2">
                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                          Role
                        </label>
                        <input
                          className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                          type="text"
                          name="role"
                          disabled
                          value={user?.role?.name}
                        />
                      </div>
                    </div>

                    <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                      <div className="w-full sm:w-1/2">
                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                          NIC
                        </label>
                        <div className="relative">
                          <span className="absolute left-4.5 top-4">
                            <UserIcon className="w-4" />
                          </span>
                          <input
                            className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                            type="text"
                            name="nic"
                            value={user?.nic}
                            disabled
                          />
                        </div>
                      </div>

                      <div className="w-full sm:w-1/2">
                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                          DOB
                        </label>
                        <input
                          className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                          type="text"
                          name="role"
                          disabled
                          value={user?.dob}
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                        Address
                      </label>
                      <div className="relative">
                        <textarea
                          className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                          name="address"
                          rows={3}
                          value={user?.address}
                          disabled
                        ></textarea>
                      </div>
                    </div>

                    {user.centers && user.centers.length > 0 && (
                      <div className="mb-5.5">
                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                          Centers
                        </label>
                        <div className="relative">
                          <MultiselectDropdown
                            options={centerOptions}
                            selectedOptions={user?.centers?.map(
                              (center: any) => {
                                return { value: center.id, name: center.name };
                              },
                            )}
                            onSelectOptions={() => {}}
                            disabled
                          />
                        </div>
                      </div>
                    )}

                    {/* <div className="flex justify-end gap-4.5">
                    <button
                      className="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                      type="submit"
                    >
                      Cancel
                    </button>
                    <button
                      className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:shadow-1"
                      type="submit"
                      onClick={fireToast}
                    >
                      Save
                    </button>
                  </div> */}
                  </form>
                </div>
              </div>
            </div>
            <div className="col-span-5 xl:col-span-2">
              <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
                  <h3 className="font-medium text-black dark:text-white">
                    Update Password
                  </h3>
                </div>
                <div className="px-7 py-5">
                  <Formik
                    initialValues={{
                      currentPassword: '',
                      newPassword: '',
                      confirmPassword: '',
                    }}
                    validate={(values) => {
                      const errors: any = {};
                      if (!values.currentPassword) {
                        errors.currentPassword = 'current password is required';
                      }
                      if (!values.newPassword) {
                        errors.newPassword = 'new password is required';
                      }

                      if (values.newPassword !== values.confirmPassword) {
                        errors.confirmPassword = "passwords doesn't match";
                      }
                      return errors;
                    }}
                    onSubmit={async (values, { setSubmitting, resetForm }) => {
                      const payload = {
                        currentPassword: values.currentPassword,
                        newPassword: values.newPassword,
                      };
                      try {
                        const result = await updatePassword(payload);
                        setSubmitting(false);

                        if (result) {
                          resetForm();
                          toastMessage(
                            'password successfully updated',
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
                      handleChange,
                      touched,
                      handleSubmit,
                      isSubmitting,
                    }) => (
                      <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                          <label className="mb-2.5 block font-medium text-black dark:text-white">
                            Current Password
                          </label>
                          <div className="relative">
                            <Input
                              placeholder="Enter current password"
                              name="currentPassword"
                              value={values.currentPassword}
                              onChange={handleChange}
                            />
                          </div>
                          {errors.currentPassword &&
                            touched.currentPassword && (
                              <p className="ml-1 text-sm font-medium text-danger">
                                {errors.currentPassword}
                              </p>
                            )}
                        </div>

                        <div className="mb-4">
                          <label className="mb-2.5 block font-medium text-black dark:text-white">
                            New Password
                          </label>
                          <div className="relative">
                            <Input
                              type={showNewPassword ? 'text' : 'password'}
                              placeholder="Enter new password"
                              name="newPassword"
                              value={values.newPassword}
                              onChange={handleChange}
                            />
                            <span
                              className="absolute right-4 top-4 cursor-pointer"
                              onClick={() =>
                                setShowNewPassword(!showNewPassword)
                              }
                            >
                              {showNewPassword ? (
                                <EyeIcon className="w-5 opacity-60" />
                              ) : (
                                <EyeSlashIcon className="w-5 opacity-60" />
                              )}
                            </span>
                          </div>
                          {errors.newPassword && touched.newPassword && (
                            <p className="ml-1 text-sm font-medium text-danger">
                              {errors.newPassword}
                            </p>
                          )}
                        </div>

                        <div className="mb-5">
                          <label className="mb-2.5 block font-medium text-black dark:text-white">
                            Confirm Password
                          </label>
                          <div className="relative">
                            <Input
                              type={showConfirmPassword ? 'text' : 'password'}
                              placeholder="Confirm password"
                              name="confirmPassword"
                              value={values.confirmPassword}
                              onChange={handleChange}
                            />
                            <span
                              className="absolute right-4 top-4 cursor-pointer"
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                            >
                              {showConfirmPassword ? (
                                <EyeIcon className="w-5 opacity-60" />
                              ) : (
                                <EyeSlashIcon className="w-5 opacity-60" />
                              )}
                            </span>
                          </div>
                          {errors.confirmPassword &&
                            touched.confirmPassword && (
                              <p className="ml-1 text-sm font-medium text-danger">
                                {errors.confirmPassword}
                              </p>
                            )}
                        </div>

                        <div className="pt-2 mb-5">
                          <Button
                            text="Update"
                            type="submit"
                            className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-2 text-white transition hover:bg-opacity-90"
                            disabled={isSubmitting}
                          />
                          {/* {loginError && (
                            <p className="text-sm font-medium text-center text-danger">
                              {loginError}
                            </p>
                          )} */}
                        </div>
                      </form>
                    )}
                  </Formik>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Settings;
