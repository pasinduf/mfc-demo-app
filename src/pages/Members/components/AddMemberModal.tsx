import { Formik } from 'formik';
import { Modal } from '../../../components/modal';
import { toastMessage } from '../../../components/toastMessage';
import { DEFAULT_ERROR_MESSAGE } from '../../../api/const/message';
import  Input from'../../../components/Input';
import Button from '../../../components/button';
import { Option } from '../../../entries/options';
import { Member } from '../../../entries/member/member';
import { useEffect, useState } from 'react';
import { getCentersByBranch } from '../../../api/center/getCentersByBranch';
import { getNicDetails } from '../../../utils/nic';
import { generateMemberCode } from '../../../api/member/generateMemberCode';
import { createMember } from '../../../api/member/createMember';
import { updateMember } from '../../../api/member/updateMember';

interface Props {
  open: boolean;
  onClose: () => void;
  onRefresh: () => void;
  branches: Option[];
  member?: Member;
}

const AddMemberModal = ({
  open,
  onClose,
  branches,
  onRefresh,
  member,
}: Props) => {
  const [centerOptions, setCenterOptions] = useState([]);

  const relations = [
    { value: 'Husband', name: 'Husband' },
    { value: 'Son', name: 'Son' },
    { value: 'Daughter', name: 'Daughter' },
    { value: 'Mother', name: 'Mother' },
    { value: 'Father', name: 'Father' },
    { value: 'Other', name: 'Other' },
  ];

  useEffect(() => {
    const fetchCenterOptions = async () => {
      const centers = await getCentersByBranch(member?.center?.branch?.id);
      const result = centers.map((center: any) => {
        return {
          value: center.id,
          name: center.name,
        };
      });
      setCenterOptions(result);
    };

    if (member && member.id > 0 && member.center?.id > 0) {
      fetchCenterOptions();
    }
  }, [member]);

  return (
    <Modal
      size='large'
      isOpen={open}
      setIsOpen={onClose}
      title={`${member && member?.id > 0 ? 'Update' : 'Add new'} member`}
      content={
        <div>
          <div className="flex flex-col gap-5.5 p-2 mt-3">
            <Formik
              initialValues={
                member
                  ? {
                      code: member.code,
                      firstName: member.firstName,
                      lastName: member.lastName,
                      nic: member.nic,
                      address: member.address,
                      phoneNumber: member.phoneNumber,
                      businessType: member.businessType,
                      center: member.center.id,
                      branch: member.center.branch?.id,
                      dob: member.dob,
                      garantorFirstName: member.guarantor.firstName,
                      garantorLastName: member.guarantor.lastName,
                      garantorNic: member.guarantor.nic,
                      garantorPhoneNumber: member.guarantor.phoneNumber,
                      garantorRelationShip: member.guarantor.relationship,
                    }
                  : {
                      code: '',
                      firstName: '',
                      lastName: '',
                      nic: '',
                      dob: '',
                      address: '',
                      phoneNumber: '',
                      businessType: '',
                      branch: '',
                      center: '',
                      garantorFirstName: '',
                      garantorLastName: '',
                      garantorNic: '',
                      garantorPhoneNumber: '',
                      garantorRelationShip: '',
                    }
              }
              validate={(values) => {
                const errors: any = {};
                if (!values.code) {
                  errors.code = 'code is required';
                }
                if (!values.firstName) {
                  errors.firstName = 'first name is required';
                }
                if (!values.lastName) {
                  errors.lastName = 'last name is required';
                }
                if (!values.nic) {
                  errors.nic = 'nic is required';
                }
                if (!values.phoneNumber) {
                  errors.phoneNumber = 'phone number is required';
                }
                if (!values.businessType) {
                  errors.businessType = 'business type is required';
                }
                if (!values.address) {
                  errors.address = 'address is required';
                }
                if (!values.center) {
                  errors.center = 'center is required';
                }
                if (!values.garantorFirstName) {
                  errors.garantorFirstName = 'garantor first name is required';
                }
                if (!values.garantorLastName) {
                  errors.garantorLastName = 'garantor last name is required';
                }
                if (!values.garantorNic) {
                  errors.garantorNic = 'garantor nic is required';
                }
                if (!values.garantorPhoneNumber) {
                  errors.garantorPhoneNumber =
                    'garantor phone number is required';
                }
                if (!values.garantorRelationShip) {
                  errors.garantorRelationShip = 'relationship is required';
                }

                return errors;
              }}
              onSubmit={async (values, { setSubmitting }) => {
                const payload = {
                  ...values,
                  centerId: +values.center,
                  guarantor: {
                    firstName: values.garantorFirstName,
                    lastName: values.garantorLastName,
                    nic: values.garantorNic,
                    relationship: values.garantorRelationShip,
                    phoneNumber: values.garantorPhoneNumber,
                  },
                };
                try {
                  const result =
                    member && member?.id > 0
                      ? await updateMember(member.id, payload)
                      : await createMember(payload);
                  setSubmitting(false);
                  if (result) {
                    onClose();
                    onRefresh();
                    toastMessage(
                      'Member successfully saved',
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
                  <div className="h-100 overflow-y-auto">
                    <div className="mb-4 flex flex-col gap-6 xl:flex-row">
                      <div className="w-full xl:w-1/2">
                        <label className="text-sm text-black font-semibold dark:text-white">
                          Branch <span className="text-danger">*</span>
                        </label>
                        <select
                          name="branch"
                          value={values.branch}
                          className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
                          onChange={async (e) => {
                            const id = +e.target.value;
                            const centers = await getCentersByBranch(id);
                            const result = centers.map((center: any) => {
                              return {
                                value: center.id,
                                name: center.name,
                              };
                            });
                            setFieldValue('branch', id);
                            setCenterOptions(result);
                          }}
                          disabled={!!member}
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
                      </div>
                      <div className="w-full xl:w-1/2">
                        <label className="text-sm text-black font-semibold dark:text-white">
                          Center <span className="text-danger">*</span>
                        </label>
                        <select
                          name="center"
                          value={values.center}
                          disabled={!!member || values.branch == ''}
                          className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
                          onChange={async (e) => {
                            const id = +e.target.value;
                            const result = await generateMemberCode(id);
                            setFieldValue('center', id);
                            setFieldValue('code', result?.code);
                          }}
                        >
                          <option value="">Select</option>
                          {centerOptions.map((center: any, index) => {
                            return (
                              <option
                                key={`center-op-${index}`}
                                value={center.value}
                              >
                                {center.name}
                              </option>
                            );
                          })}
                        </select>
                        {errors.center && touched.center && (
                          <p className="text-sm font-medium text-danger">
                            {errors.center}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="text-sm text-black font-semibold dark:text-white">
                        Code
                      </label>
                      <Input
                        type="text"
                        name="dob"
                        value={values.code}
                        disabled
                      />
                    </div>

                    <div className="mb-3 flex flex-col gap-6 xl:flex-row">
                      <div className="w-full xl:w-1/2">
                        <label className="text-sm text-black font-semibold dark:text-white">
                          First Name <span className="text-danger">*</span>
                        </label>
                        <Input
                          type="text"
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
                          Business Type <span className="text-danger">*</span>
                        </label>
                        <Input
                          type="text"
                          name="businessType"
                          value={values.businessType}
                          onChange={handleChange}
                        />
                        {errors.businessType && touched.businessType && (
                          <p className="text-sm font-medium text-danger">
                            {errors.businessType}
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

                    <div className="border-b border-stroke py-3 px-6.5 dark:border-strokedark">
                      <h3 className="text-center font-medium text-black dark:text-white">
                        Guardian Details
                      </h3>
                    </div>

                    <div className="mt-2 mb-3 flex flex-col gap-6 xl:flex-row">
                      <div className="w-full xl:w-1/2">
                        <label className="text-sm text-black font-semibold dark:text-white">
                          First Name <span className="text-danger">*</span>
                        </label>
                        <Input
                          type="text"
                          name="garantorFirstName"
                          value={values.garantorFirstName}
                          onChange={handleChange}
                        />
                        {errors.garantorFirstName &&
                          touched.garantorFirstName && (
                            <p className="text-sm font-medium text-danger">
                              {errors.garantorFirstName}
                            </p>
                          )}
                      </div>

                      <div className="w-full xl:w-1/2">
                        <label className="text-sm text-black font-semibold dark:text-white">
                          Last Name <span className="text-danger">*</span>
                        </label>
                        <Input
                          type="text"
                          name="garantorLastName"
                          value={values.garantorLastName}
                          onChange={handleChange}
                        />
                        {errors.garantorLastName &&
                          touched.garantorLastName && (
                            <p className="text-sm font-medium text-danger">
                              {errors.garantorLastName}
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
                          name="garantorNic"
                          value={values.garantorNic}
                          onChange={handleChange}
                        />
                        {errors.garantorNic && touched.garantorNic && (
                          <p className="text-sm font-medium text-danger">
                            {errors.garantorNic}
                          </p>
                        )}
                      </div>

                      <div className="w-full xl:w-1/2">
                        <label className="text-sm text-black font-semibold dark:text-white">
                          Phone Number <span className="text-danger">*</span>
                        </label>
                        <Input
                          type="text"
                          name="garantorPhoneNumber"
                          value={values.garantorPhoneNumber}
                          onChange={handleChange}
                        />
                        {errors.garantorPhoneNumber &&
                          touched.garantorPhoneNumber && (
                            <p className="text-sm font-medium text-danger">
                              {errors.garantorPhoneNumber}
                            </p>
                          )}
                      </div>
                    </div>

                    <div className="mb-4 flex flex-col gap-6 xl:flex-row">
                      <div className="w-full xl:w-1/2">
                        <label className="text-sm text-black font-semibold dark:text-white">
                          Relationship <span className="text-danger">*</span>
                        </label>
                        <select
                          name="garantorRelationShip"
                          value={values.garantorRelationShip}
                          className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
                          onChange={async (e) => {
                            setFieldValue(
                              'garantorRelationShip',
                              e.target.value,
                            );
                          }}
                        >
                          <option value="">Select</option>
                          {relations.map((relation: any, index) => {
                            return (
                              <option
                                key={`relation-op-${index}`}
                                value={relation.value}
                              >
                                {relation.name}
                              </option>
                            );
                          })}
                        </select>
                        {errors.garantorRelationShip &&
                          touched.garantorRelationShip && (
                            <p className="text-sm font-medium text-danger">
                              {errors.garantorRelationShip}
                            </p>
                          )}
                      </div>
                    </div>
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

export default AddMemberModal;
