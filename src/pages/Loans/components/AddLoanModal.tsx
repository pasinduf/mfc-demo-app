import { Formik } from 'formik';
import { Modal } from '../../../components/modal';
import { toastMessage } from '../../../components/toastMessage';
import { DEFAULT_ERROR_MESSAGE } from '../../../api/const/message';
import  Input from'../../../components/Input';
import Button from '../../../components/button';
import { Option } from '../../../entries/options';
import { useEffect, useState } from 'react';
import { getCentersByBranch } from '../../../api/center/getCentersByBranch';
import { getMembersByCenter } from '../../../api/member/getMembersByCenter';
import { AutoComplete } from '../../../components/autoComplete';
import { updateLoan } from '../../../api/loan/updateLoan';
import { createLoan } from '../../../api/loan/createLoan';
import { getCurrentDate } from '../../../utils/currentDate';
import { LoanDetail } from '../../../entries/loan/loan-detail';

interface Props {
  open: boolean;
  onClose: () => void;
  onRefresh: () => void;
  branches: Option[];
  products: any[];
  loan?: LoanDetail;
}

const AddLoanModal = ({
  open,
  onClose,
  branches,
  products,
  onRefresh,
  loan,
}: Props) => {
  const [centerOptions, setCenterOptions] = useState([]);
  const [memberOptions, setMemberOptions] = useState([]);

  const [selectedProduct, setSelectedProduct] = useState<any>(
    loan ? loan.product : null,
  );
  const today = getCurrentDate();

  useEffect(() => {
    const fetchCenterOptions = async () => {
      const centers = await getCentersByBranch(loan?.center?.branch?.id);
      const result = centers.map((center: any) => {
        return {
          value: center.id,
          name: center.name,
        };
      });
      setCenterOptions(result);
    };

    const fetchMemberOptions = async () => {
      const members = await getMembersByCenter(loan?.center?.id?.toString());
      const result = members.map((member: any) => {
        return {
          value: member.id,
          name: `${member.code} - ${member.firstName}`,
        };
      });
      setMemberOptions(result);
    };

    if (loan && loan.id > 0 && loan.center?.id > 0) {
      fetchCenterOptions();
      fetchMemberOptions();
    }
  }, [loan?.center, loan?.member]);

  return (
    <Modal
      isOpen={open}
      setIsOpen={onClose}
      title={`${loan && loan?.id > 0 ? 'Update' : 'Add new'} loan`}
      content={
        <div>
          <div className="flex flex-col gap-5.5 p-2 mt-3">
            <Formik
              initialValues={
                loan
                  ? {
                      enteredDate: loan.enteredDate
                        ? loan.enteredDate?.split('T')[0]
                        : '',
                      branch: loan.center?.branch?.id,
                      center: loan.center?.id,
                      member: loan.member?.id,
                      product: loan.product?.id,
                      amount: loan.amount,
                      repaymentTerm: loan.repaymentTerm,
                      terms: loan.terms,
                    }
                  : {
                      enteredDate: today,
                      branch: '',
                      center: '',
                      member: '',
                      product: '',
                      amount: 0,
                      repaymentTerm: '',
                      terms: 0,
                    }
              }
              validate={(values) => {
                const errors: any = {};
                if (!values.enteredDate) {
                  errors.enteredDate = 'date is required';
                }
                if (!values.center) {
                  errors.center = 'center is required';
                }
                if (!values.member) {
                  errors.member = 'member is required';
                }
                if (!values.product) {
                  errors.product = 'product is required';
                }
                if (!values.amount) {
                  errors.amount = 'amount is required';
                }
                if (!values.repaymentTerm) {
                  errors.repaymentTerm = 're-payment term is required';
                }
                if (!values.terms) {
                  errors.terms = 'terms is required';
                }
                return errors;
              }}
              onSubmit={async (values, { setSubmitting }) => {
                const payload = {
                  ...values,
                  branchId: +values.branch,
                  centerId: +values.center,
                  memberId: +values.member,
                  productId: +values.product,
                };
                try {
                  const result =
                    loan && loan?.id > 0
                      ? await updateLoan(loan.id, payload)
                      : await createLoan(payload);
                  setSubmitting(false);
                  if (result) {
                    onClose();
                    onRefresh();
                    toastMessage(
                      'Loan successfully saved',
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
                  <div className="h-auto pb-3">
                    <div className="pb-3">
                      <label className="text-sm text-black font-semibold dark:text-white">
                        Date
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          name="date"
                          value={values.enteredDate}
                          className="custom-input-date custom-input-date-1 w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                          onKeyDown={(e) => {
                            e.preventDefault();
                          }}
                          onChange={(e) => {
                            setFieldValue('enteredDate', e.target.value);
                          }}
                          max={today}
                        />
                        {errors.enteredDate && touched.enteredDate && (
                          <p className="text-sm font-medium text-danger">
                            {errors.enteredDate}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mb-3 flex flex-col gap-6 xl:flex-row">
                      <div className="w-full xl:w-1/2">
                        <label className="text-sm text-black font-semibold dark:text-white">
                          Branch
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
                            setFieldValue('center', '');
                            setCenterOptions(result);
                          }}
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
                          Center
                        </label>
                        <select
                          name="center"
                          value={values.center}
                          disabled={values.branch == ''}
                          className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
                          onChange={async (e) => {
                            const id = +e.target.value;
                            const members = await getMembersByCenter(
                              id?.toString(),
                            );
                            const result = members.map((member: any) => {
                              return {
                                value: member.id,
                                name: `${member.code} - ${member.firstName}`,
                              };
                            });
                            setFieldValue('center', id);
                            setFieldValue('member', '');
                            setMemberOptions(result);
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

                    <div className="pb-3">
                      <label className="text-sm text-black font-semibold dark:text-white">
                        Member
                      </label>
                      <AutoComplete
                        name="member"
                        placeholder="All Members"
                        options={values.center !== '' ? memberOptions : []}
                        value={values.member}
                        onChangeSelect={(option) =>
                          setFieldValue('member', option.value)
                        }
                        className="mb-2"
                      />
                      {errors.member && touched.member && (
                        <p className="text-sm font-medium text-danger">
                          {errors.member}
                        </p>
                      )}
                    </div>

                    <div className="mb-4 flex flex-col gap-6 xl:flex-row">
                      <div className="w-full xl:w-1/2">
                        <label className="text-sm text-black font-semibold dark:text-white">
                          Product
                        </label>
                        <select
                          name="product"
                          value={values.product}
                          className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
                          onChange={async (e) => {
                            const id = +e.target.value;
                            setFieldValue('product', id);

                            const product = products.find((x) => x.value == id);
                            if (product) {
                              setSelectedProduct(product);
                              setFieldValue(
                                'repaymentTerm',
                                product.repaymentTerm,
                              );
                            }
                          }}
                        >
                          <option value="">Select</option>
                          {products.map((product, index) => {
                            return (
                              <option
                                key={`product-op-${index}`}
                                value={product.value}
                              >
                                {product.name}
                              </option>
                            );
                          })}
                        </select>
                        {values.product != '' && (
                          <div className="ml-1">
                            <div className="text-sm font-bold">
                              Rate: {selectedProduct.interestRate}%
                            </div>
                            <div className="text-sm font-bold">
                              Doc.charges: {selectedProduct.documentCharge}%
                            </div>
                          </div>
                        )}
                        {errors.product && touched.product && (
                          <p className="text-sm font-medium text-danger">
                            {errors.product}
                          </p>
                        )}
                      </div>
                      <div className="w-full xl:w-1/2">
                        <label className="text-sm text-black font-semibold dark:text-white">
                          Repayment Term
                        </label>
                        <Input
                          type="text"
                          name="repaymentTerm"
                          value={values.repaymentTerm}
                          disabled
                        />
                        {errors.repaymentTerm && touched.repaymentTerm && (
                          <p className="text-sm font-medium text-danger">
                            {errors.repaymentTerm}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-6 xl:flex-row">
                      <div className="w-full xl:w-1/2">
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
                        />
                        {errors.amount && touched.amount && (
                          <p className="text-sm font-medium text-danger">
                            {errors.amount}
                          </p>
                        )}
                      </div>
                      <div className="w-full xl:w-1/2">
                        <label className="text-sm text-black font-semibold dark:text-white">
                          Terms
                        </label>
                        <Input
                          type="number"
                          placeholder="terms"
                          name="terms"
                          value={values.terms}
                          onChange={(e) => {
                            const value = e.target.value;
                            setFieldValue('terms', +value > 0 ? value : 0);
                          }}
                        />
                        {errors.terms && touched.terms && (
                          <p className="text-sm font-medium text-danger">
                            {errors.terms}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex mt-4 gap-3 justify-end text-right">
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

export default AddLoanModal;
