import { Formik } from 'formik';
import { Modal } from '../../../components/modal';
import { toastMessage } from '../../../components/toastMessage';
import { DEFAULT_ERROR_MESSAGE } from '../../../api/const/message';
import  Input from'../../../components/Input';
import Button from '../../../components/button';
import { User } from '../../../entries/user/user';
import { useEffect, useState } from 'react';
import { useAppStore } from '../../../hooks/useAppStore';
import { getNicDetails } from '../../../utils/nic';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { PASSWORD_REGEX } from '../../../api/auth/constants';
import { MultiselectDropdown } from '../../../components/MultiselectDropdown';
import { userRole } from '../../../api/RBAC/RBAC';
import { generateRandomPassword } from '../../../utils/generateRandomPassword';
import { updateUser } from '../../../api/user/updateUser';
import { createUser } from '../../../api/user/createUser';
import Checkbox from '../../../components/Checkbox';
import { useAuth } from '../../../hooks/useAuth';
import { Edit_User_Access } from '../../../api/RBAC/userAccess';

interface Props {
  open: boolean;
  accessList:any
  onClose: () => void;
  onRefresh: () => void;
  user?: User;
}

const AddUserModal = ({ open, accessList,onClose, onRefresh, user }: Props) => {

  const { auth }: any = useAuth();
  const { store }: any = useAppStore();
  const centerOptions = store?.centerFilters;

  const roleOptions = [
    { value: '1', name: 'Admin' },
    { value: '2', name: 'Manager' },
    { value: '3', name: 'Collection Officer' },
  ];
  
  const [showPassword, setShowPassword] = useState(false);
  const [allAccessList, setAllAccessList] = useState(accessList);

  const allowEditAccess = () => {
    return auth?.access?.includes(Edit_User_Access);
  };


  useEffect(()=>{
    if(user && user.id >0){
        setAllAccessList((prevData: any) =>
          prevData.map((category: any) => ({
            ...category,
            access: category.access.map((access: any) =>
              user.access.includes(access.id)
                ? { ...access, isChecked: true }
                : access,
            ),
          })),
        );
    }
  },[user])



  const OnSelectAccess = (
    categoryName: string,
    id: number,
    isChecked: boolean,
  ) => {
    setAllAccessList((prevData: any) =>
      prevData.map((category: any) =>
        category.category === categoryName
          ? {
              ...category,
              access: category.access.map((item: any) =>
                item.id === id ? { ...item, isChecked } : item,
              ),
            }
          : category,
      ),
    );
  }; 


  return (
    <Modal
      size='large'
      isOpen={open}
      setIsOpen={onClose}
      title={`${user && user?.id > 0 ? 'Update' : 'Add new'} user`}
      content={
        <div>
          <div className="flex flex-col gap-5.5 p-2 mt-3">
            <Formik
              initialValues={
                user
                  ? {
                      username: user.username,
                      password: '',
                      firstName: user.firstName,
                      lastName: user.lastName,
                      nic: user.nic,
                      empNumber: user.empNumber,
                      dob: user.dob,
                      address: user.address,
                      phoneNumber: user.phoneNumber,
                      centers: user?.centers?.map((center) => {
                        return { value: center.id, name: center.name };
                      }),
                      role: user?.role?.id,
                      access: user.access,
                    }
                  : {
                      username: '',
                      password: '',
                      firstName: '',
                      lastName: '',
                      nic: '',
                      empNumber: '',
                      dob: '',
                      address: '',
                      phoneNumber: '',
                      centers: [],
                      role: '',
                      access: [],
                    }
              }
              validate={(values) => {
                const errors: any = {};
                if (!values.username) {
                  errors.username = 'Username is required';
                }
                if (!user && !values.password) {
                  errors.password = 'Password is required';
                }
                if (!user && !PASSWORD_REGEX.test(values.password)) {
                  errors.password =
                    'Use at least 6 characters long and contain at least one digit';
                }
                if (!values.firstName) {
                  errors.firstName = 'First name is required';
                }
                if (!values.lastName) {
                  errors.lastName = 'Last name is required';
                }
                if (!values.nic) {
                  errors.nic = 'NIC is required';
                }

                if (!values.empNumber) {
                  errors.nic = 'Emp No is required';
                }

                if (!values.address) {
                  errors.address = 'Address is required';
                }
                if (!values.phoneNumber) {
                  errors.phoneNumber = 'Phone number is required';
                }
                if (
                  +values.role == userRole.Collector &&
                  (!values.centers || values.centers.length < 1)
                ) {
                  errors.centers = 'Centers required';
                }
                if (!values.role) {
                  errors.role = 'Role is required';
                }

                return errors;
              }}
              onSubmit={async (values, { setSubmitting }) => {
                const payload = {
                  ...values,
                  roleId: +values.role,
                };
                if (+values.role === userRole.Collector) {
                  const centers: any = values.centers.map((x: any) => {
                    return +x.value;
                  });
                  payload.centers = centers;
                }

                //set dashboard access with role
                const categoryDsh = allAccessList.find(
                  (x: any) => x.category === 'Dashboard',
                );

                const selectedAccess =
                  +values.role === userRole.Collector
                    ? categoryDsh.access.find(
                        (x: any) => x.name === 'Collector_Dashboard',
                      )
                    : categoryDsh.access.find(
                        (x: any) => x.name === 'Main_Dashboard',
                      );
                const currentAccess = values?.access ? values.access : [];
                const accessList = [...currentAccess, selectedAccess.id];
                payload.access = accessList;

                try {
                  const result =
                    user && user?.id > 0
                      ? await updateUser(user.id, payload)
                      : await createUser(payload);
                  setSubmitting(false);
                  if (result) {
                    onClose();
                    onRefresh();
                    toastMessage(
                      'User successfully saved',
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
                  <div className="pb-5 overflow-y-auto px-3">
                    <div className="mb-3 flex flex-col gap-6 xl:flex-row">
                      <div className="w-full xl:w-1/2">
                        <label className="text-sm text-black font-semibold dark:text-white">
                          Username <span className="text-danger">*</span>
                        </label>
                        <Input
                          type="username"
                          placeholder="username"
                          name="username"
                          value={values.username}
                          onChange={handleChange}
                          autoComplete="off"
                        />
                        {errors.username && touched.username && (
                          <p className="text-sm font-medium text-danger">
                            {errors.username}
                          </p>
                        )}
                      </div>

                      <div className="w-full xl:w-1/2">
                        <label className="text-sm text-black font-semibold dark:text-white">
                          Password <span className="text-danger">*</span>
                        </label>
                        <div className="relative">
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="password"
                            name="password"
                            value={values.password}
                            onChange={handleChange}
                            autoComplete="off"
                          />
                          <span
                            className="absolute right-4 top-4 cursor-pointer"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeIcon className="w-5 opacity-60" />
                            ) : (
                              <EyeSlashIcon className="w-5 opacity-60" />
                            )}
                          </span>
                        </div>
                        <p
                          className="ml-1 text-sm underline cursor-pointer"
                          onClick={() => {
                            const password = generateRandomPassword();
                            setFieldValue('password', password);
                            setShowPassword(true);
                          }}
                        >
                          Generate password
                        </p>
                        {errors.password && touched.password && (
                          <p className="text-sm font-medium text-danger">
                            {errors.password}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mb-3 flex flex-col gap-6 xl:flex-row">
                      <div className="w-full xl:w-1/2">
                        <label className="text-sm text-black font-semibold dark:text-white">
                          First Name <span className="text-danger">*</span>
                        </label>
                        <Input
                          type="text"
                          placeholder="first name"
                          name="firstName"
                          value={values.firstName}
                          onChange={handleChange}
                        />
                        {errors.firstName && touched.firstName && (
                          <p className="text-sm font-medium text-danger">
                            {errors.firstName}
                          </p>
                        )}
                      </div>

                      <div className="w-full xl:w-1/2">
                        <label className="text-sm text-black font-semibold dark:text-white">
                          Last Name <span className="text-danger">*</span>
                        </label>
                        <Input
                          type="text"
                          placeholder="last name"
                          name="lastName"
                          value={values.lastName}
                          onChange={handleChange}
                        />
                        {errors.lastName && touched.lastName && (
                          <p className="text-sm font-medium text-danger">
                            {errors.lastName}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mb-3 flex flex-col gap-6 xl:flex-row">
                      <div className="w-full xl:w-1/2">
                        <label className="text-sm text-black font-semibold dark:text-white">
                          NIC <span className="text-danger">*</span>
                        </label>
                        <Input
                          type="text"
                          placeholder="nic"
                          name="nic"
                          value={values.nic}
                          onChange={handleChange}
                          onBlur={async (e) => {
                            const result = getNicDetails(values.nic);
                            setFieldValue(
                              'dob',
                              result.isValid ? result.dob : 'N/A',
                            );
                          }}
                        />
                        {errors.nic && touched.nic && (
                          <p className="text-sm font-medium text-danger">
                            {errors.nic}
                          </p>
                        )}
                      </div>

                      <div className="w-full xl:w-1/2">
                        <label className="text-sm text-black font-semibold dark:text-white">
                          DOB
                        </label>
                        <Input
                          type="text"
                          name="dob"
                          value={values.dob}
                          disabled
                        />
                      </div>
                    </div>

                    <div className="mb-3 flex flex-col gap-6 xl:flex-row">
                      <div className="w-full xl:w-1/2">
                        <label className="text-sm text-black font-semibold dark:text-white">
                          Phone Number <span className="text-danger">*</span>
                        </label>
                        <Input
                          type="text"
                          name="phoneNumber"
                          value={values.phoneNumber}
                          onChange={handleChange}
                        />

                        {errors.phoneNumber && touched.phoneNumber && (
                          <p className="text-sm font-medium text-danger">
                            {errors.phoneNumber}
                          </p>
                        )}
                      </div>

                      <div className="w-full xl:w-1/2">
                        <label className="text-sm text-black font-semibold dark:text-white">
                          Emp No <span className="text-danger">*</span>
                        </label>
                        <Input
                          type="text"
                          placeholder="Emp No"
                          name="empNumber"
                          value={values.empNumber}
                          onChange={handleChange}
                        />

                        {errors.empNumber && touched.empNumber && (
                          <p className="text-sm font-medium text-danger">
                            {errors.empNumber}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="text-sm text-black font-semibold dark:text-white">
                        Address <span className="text-danger">*</span>
                      </label>
                      <textarea
                        rows={2}
                        name="address"
                        placeholder="address"
                        value={values.address}
                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                        onChange={handleChange}
                      ></textarea>
                      {errors.address && touched.address && (
                        <p className="text-sm font-medium text-danger">
                          {errors.address}
                        </p>
                      )}
                    </div>

                    <div className="mb-3">
                      <div className="w-full xl:w-1/2">
                        <label className="text-sm text-black font-semibold dark:text-white">
                          Role <span className="text-danger">*</span>
                        </label>
                        <select
                          name="role"
                          value={values.role}
                          className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
                          onChange={async (e) => {
                            setFieldValue('role', e.target.value);
                            setFieldValue('centers', []);
                          }}
                        >
                          <option value="">Select</option>
                          {roleOptions.map((role: any, index) => {
                            return (
                              <option
                                key={`role-op-${index}`}
                                value={role.value}
                              >
                                {role.name}
                              </option>
                            );
                          })}
                        </select>
                        {errors.role && touched.role && (
                          <p className="text-sm font-medium text-danger">
                            {errors.role}
                          </p>
                        )}
                      </div>
                    </div>

                    {values.role && +values.role === userRole.Collector && (
                      <div className="mb-8 mt-4">
                        <label className="text-sm text-black font-semibold dark:text-white">
                          Centers
                        </label>
                        <MultiselectDropdown
                          options={centerOptions}
                          selectedOptions={values.centers}
                          onSelectOptions={(values) => {
                            setFieldValue('centers', values);
                          }}
                        />
                        {errors.centers && touched.centers && (
                          <p className="text-sm font-medium text-danger">
                            {errors.centers as string}
                          </p>
                        )}
                      </div>
                    )}

                    <div className="mt-6">
                      <div>
                        <label className="text-sm text-black font-semibold dark:text-white">
                          Permissions
                        </label>
                      </div>

                      <div className="mt-3">
                        {allAccessList
                          .filter((x: any) => x.category != 'Dashboard')
                          .map((item: any, categoryIndex: number) => {
                            return (
                              <div
                                className="mb-3"
                                key={`cate-${categoryIndex}`}
                              >
                                <span className="font-medium">
                                  {item.category}
                                </span>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-auto lg:grid-cols-auto">
                                  {item.access.map(
                                    (access: any, accessIndex: number) => {
                                      return (
                                        <div
                                          key={`access-${accessIndex}`}
                                          className="p-2"
                                        >
                                          {allowEditAccess() ? (
                                            <Checkbox
                                              label={access.name}
                                              isChecked={access.isChecked}
                                              onChange={(value) => {
                                                OnSelectAccess(
                                                  item.category,
                                                  access.id,
                                                  value,
                                                );
                                                if (value) {
                                                  if (
                                                    !values.access?.includes(
                                                      access.id,
                                                    )
                                                  ) {
                                                    const list = [
                                                      ...values?.access,
                                                      access.id,
                                                    ];
                                                    setFieldValue(
                                                      'access',
                                                      list,
                                                    );
                                                  }
                                                } else {
                                                  const list =
                                                    values.access.filter(
                                                      (item: any) =>
                                                        item !== access.id,
                                                    );
                                                  setFieldValue('access', list);
                                                }
                                              }}
                                            />
                                          ) : (
                                            <li>{access.name}</li>
                                          )}
                                        </div>
                                      );
                                    },
                                  )}
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  </div>

                  <p className="mt-2 text-sm font-sm text-danger">
                    *Note: ensure that you saved the password before proceeding.
                  </p>
                  <div className="flex gap-3 mt-3 justify-end text-right">
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

export default AddUserModal;
