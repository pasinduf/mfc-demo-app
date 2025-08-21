import { Formik } from 'formik';
import { Modal } from '../../../components/modal';
import { toastMessage } from '../../../components/toastMessage';
import { DEFAULT_ERROR_MESSAGE } from '../../../api/const/message';
import  Input from'../../../components/Input';
import Button from '../../../components/button';
import { LoanProduct } from '../../../entries/loan-product/loanProduct';
import { updateProduct } from '../../../api/loan-product/updateProduct';
import { createProduct } from '../../../api/loan-product/createProduct';

interface Props {
  open: boolean;
  onClose: () => void;
  onRefresh: () => void;
  product?: LoanProduct;
}

const AddLoanProductModal = ({ open, onClose, onRefresh, product }: Props) => {
  const terms = [
    { value: 'Daily', name: 'Daily' },
    { value: 'Weekly', name: 'Weekly' },
    { value: 'Biweekly', name: 'Biweekly' },
    { value: 'Monthly', name: 'Monthly' },
  ];

  return (
    <Modal
      isOpen={open}
      setIsOpen={onClose}
      title={`${product && product?.id > 0 ? 'Update' : 'Add new'} product`}
      content={
        <div>
          <div className="flex flex-col gap-5.5 p-2 mt-3">
            <Formik
              initialValues={
                product
                  ? {
                      code: product.code,
                      interestRate: product.interestRate,
                      repaymentTerm: product.repaymentTerm,
                      documentCharge: product.documentCharge,
                    }
                  : {
                      code: '',
                      interestRate: 0,
                      repaymentTerm: '',
                      documentCharge: 5,
                    }
              }
              validate={(values) => {
                const errors: any = {};
                if (!values.code) {
                  errors.code = 'code is required';
                }
                if (!values.interestRate) {
                  errors.interestRate = 'rate is required';
                }
                if (!values.repaymentTerm) {
                  errors.repaymentTerm = 're-payment term is required';
                }
                if (!values.documentCharge) {
                  errors.documentCharge = 'document charge is required';
                }
                return errors;
              }}
              onSubmit={async (values, { setSubmitting }) => {
                try {
                  const result =
                    product && product?.id > 0
                      ? await updateProduct(product.id, values)
                      : await createProduct(values);
                  setSubmitting(false);
                  if (result) {
                    onClose();
                    onRefresh();
                    toastMessage(
                      'Product successfully saved',
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
                      Code
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
                      Interest Rate
                    </label>
                    <Input
                      type="number"
                      placeholder="interestRate"
                      name="interestRate"
                      value={values.interestRate}
                      onChange={(e) => {
                        const value = e.target.value;
                        setFieldValue('interestRate', +value > 0 ? value : 0);
                      }}
                    />
                    {errors.interestRate && touched.interestRate && (
                      <p className="text-sm font-medium text-danger">
                        {errors.interestRate}
                      </p>
                    )}
                  </div>
                  <div className="pb-3">
                    <label className="text-sm text-black font-semibold dark:text-white">
                      Term
                    </label>
                    <select
                      name="repaymentTerm"
                      value={values.repaymentTerm}
                      className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
                      onChange={(e) =>
                        setFieldValue('repaymentTerm', e.target.value)
                      }
                    >
                      <option value="">Select</option>
                      {terms.map((term, index) => {
                        return (
                          <option key={`term-op-${index}`} value={term.value}>
                            {term.name}
                          </option>
                        );
                      })}
                    </select>
                    {touched.repaymentTerm && errors.repaymentTerm && (
                      <p className="text-sm font-medium text-danger">
                        {errors.repaymentTerm}
                      </p>
                    )}
                  </div>

                  <div className="pb-3">
                    <label className="text-sm text-black font-semibold dark:text-white">
                      Document Charge(%)
                    </label>
                    <Input
                      type="number"
                      placeholder="documentCharge"
                      name="documentCharge"
                      value={values.documentCharge}
                      onChange={(e) => {
                        const value = e.target.value;
                        setFieldValue('documentCharge', +value > 0 ? value : 0);
                      }}
                    />
                    {errors.documentCharge && touched.documentCharge && (
                      <p className="text-sm font-medium text-danger">
                        {errors.documentCharge}
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

export default AddLoanProductModal;
