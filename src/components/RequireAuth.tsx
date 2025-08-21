import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { validateJwt } from '../utils/parseJwt';

interface Props {
  allowedAccess: string[];
}

const RequireAuth = ({ allowedAccess }: Props) => {
  const { auth }: any = useAuth();
  const location = useLocation();

  return auth?.accessToken && validateJwt(auth.accessToken) ? (
    auth?.access?.find((access: any) => allowedAccess?.includes(access)) ? (
      <Outlet />
    ) : (
      <Navigate to="/" state={{ from: location }} replace />
    )
  ) : (
    <Navigate to="/signin" state={{ from: location }} replace />
  );
};

export default RequireAuth;
