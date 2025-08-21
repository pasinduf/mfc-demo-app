import { Formik } from 'formik';
import Button from '../../components/button';
import { UserIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import  Input from'../../components/Input';
import { signIn } from '../../api/auth/signin';
import { useState } from 'react';
import { parseJwt } from '../../utils/parseJwt';
import { useAuth } from '../../hooks/useAuth';
import { useLocation, useNavigate } from 'react-router-dom';
import { tokenRepository } from '../../api';
import { getFilterBranches } from '../../api/filters/getFilterBranches';
import { getFilterCenters } from '../../api/filters/getFilterCenters';
import { useAppStore } from '../../hooks/useAppStore';
import Logo from '../../images/logo/logo.png';
import { getAccessList } from '../../api/auth/access/getAccessList';
import { COLLECTION_OFFICER } from '../../api/RBAC/userRoles';

const SignIn = () => {
  const [loginError, setLoginError] = useState('');
  const { setStore }: any = useAppStore();
  const { setAuth }: any = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location?.state?.from?.pathname || '/';

  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark mx-10 my-10">
        <div className="flex flex-wrap items-center">
          <div className="hidden w-full xl:block xl:w-1/2">
            <div className="py-17.5 px-26 text-center">
              {/* <p className="2xl:px-20">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit
                suspendisse.
              </p> */}
              <img src={Logo} alt="Logo" />
            </div>
          </div>

          <div className="w-full border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2">
            <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
              <h2 className="mb-9 text-center text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
                Sign In to Portal
              </h2>

              <Formik
                initialValues={{ username: '', password: '' }}
                validate={(values) => {
                  const errors: any = {};
                  if (!values.username) {
                    errors.username = 'username is required';
                  }
                  if (!values.password) {
                    errors.password = 'password is required';
                  }
                  return errors;
                }}
                onSubmit={async (values, { setSubmitting }) => {
                  try {
                    const result = await signIn(values);
                    if (result) {
                      const decoded: any = parseJwt(result.access_token);
                      const payload = {
                        username: decoded.name,
                        userid: decoded.sub,
                        roles: decoded.roles,
                        access: decoded.access,
                        accessToken: result.access_token,
                      };

                      setAuth(payload);
                      tokenRepository.setAccessAuth(JSON.stringify(payload));
                      
                      if (decoded.roles?.includes(COLLECTION_OFFICER)) {
                        localStorage.setItem('sidebar-expanded', 'false');
                      }

                      
                      const branchFilters = await getFilterBranches();
                      const centerFilters = await getFilterCenters();
                       const accessList = await getAccessList();
                      setStore({
                        branchFilters,
                        centerFilters,
                        accessList
                      });

                      navigate(from, { replace: true });
                    }
                  } catch (error: any) {
                    setSubmitting(false);
                    setLoginError((error as any)?.response?.data?.message);
                  }
                }}
              >
                {({
                  values,
                  errors,
                  touched,
                  setFieldValue,
                  handleSubmit,
                  isSubmitting,
                }) => (
                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <label className="mb-2.5 block font-medium text-black dark:text-white">
                        Username
                      </label>
                      <div className="relative">
                        <Input
                          placeholder="Enter your username"
                          name="username"
                          value={values.username}
                          onChange={(e) => {
                            setLoginError('');
                            setFieldValue('username', e.target.value);
                          }}
                        />
                        <span className="absolute right-4 top-4">
                          <UserIcon className="w-6 opacity-60" />
                        </span>
                      </div>
                      {errors.username && touched.username && (
                        <p className="text-sm font-medium text-danger">
                          {errors.username}
                        </p>
                      )}
                    </div>

                    <div className="mb-6">
                      <label className="mb-2.5 block font-medium text-black dark:text-white">
                        Password
                      </label>
                      <div className="relative">
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Enter your password"
                          name="password"
                          value={values.password}
                          onChange={(e) => {
                            setLoginError('');
                            setFieldValue('password', e.target.value);
                          }}
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
                      {errors.password && touched.password && (
                        <p className="text-sm font-medium text-danger">
                          {errors.password}
                        </p>
                      )}
                    </div>

                    <div className="mb-5">
                      <Button
                        text="Sign In"
                        type="submit"
                        className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
                        disabled={isSubmitting}
                      />
                      {loginError && (
                        <p className="mt-4 text-sm font-medium text-center text-danger">
                          {loginError}
                        </p>
                      )}
                    </div>
                  </form>
                )}
              </Formik>
            </div>
          </div>
        </div>

        {/* <div className="flex flex-wrap items-center">
          <div className="w-full border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2">
            <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
              <h2 className="mb-9 text-center text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
                Sign In to Portal
              </h2>

              <Formik
                initialValues={{ username: '', password: '' }}
                validate={(values) => {
                  const errors: any = {};
                  if (!values.username) {
                    errors.username = 'username is required';
                  }
                  if (!values.password) {
                    errors.password = 'password is required';
                  }
                  return errors;
                }}
                onSubmit={async (values, { setSubmitting }) => {
                  try {
                    const result = await signIn(values);
                    if (result) {
                      const decoded: any = parseJwt(result.access_token);
                      const payload = {
                        username: decoded.name,
                        userid: decoded.sub,
                        roles: decoded.roles,
                        accessToken: result.access_token,
                      };

                      setAuth(payload);
                      tokenRepository.setAccessAuth(JSON.stringify(payload));

                      const branchFilters = await getFilterBranches();
                      const centerFilters = await getFilterCenters();
                      setStore({
                        branchFilters,
                        centerFilters,
                      });

                      navigate(from, { replace: true });
                    }
                  } catch (error: any) {
                    setSubmitting(false);
                    setLoginError((error as any)?.response?.data?.message);
                  }
                }}
              >
                {({
                  values,
                  errors,
                  touched,
                  setFieldValue,
                  handleSubmit,
                  isSubmitting,
                }) => (
                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <label className="mb-2.5 block font-medium text-black dark:text-white">
                        Username
                      </label>
                      <div className="relative">
                        <Input
                          placeholder="Enter your username"
                          name="username"
                          value={values.username}
                          onChange={(e) => {
                            setLoginError('');
                            setFieldValue('username', e.target.value);
                          }}
                        />
                        <span className="absolute right-4 top-4">
                          <UserIcon className="w-6 opacity-60" />
                        </span>
                      </div>
                      {errors.username && touched.username && (
                        <p className="text-sm font-medium text-danger">
                          {errors.username}
                        </p>
                      )}
                    </div>

                    <div className="mb-6">
                      <label className="mb-2.5 block font-medium text-black dark:text-white">
                        Password
                      </label>
                      <div className="relative">
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Enter your password"
                          name="password"
                          value={values.password}
                          onChange={(e) => {
                            setLoginError('');
                            setFieldValue('password', e.target.value);
                          }}
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
                      {errors.password && touched.password && (
                        <p className="text-sm font-medium text-danger">
                          {errors.password}
                        </p>
                      )}
                    </div>

                    <div className="mb-5">
                      <Button
                        text="Sign In"
                        type="submit"
                        className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
                        disabled={isSubmitting}
                      />
                      {loginError && (
                        <p className="mt-4 text-sm font-medium text-center text-danger">
                          {loginError}
                        </p>
                      )}
                    </div>
                  </form>
                )}
              </Formik>

            </div>
          </div>
        </div> */}
      </div>
    </>
  );
};

export default SignIn;
