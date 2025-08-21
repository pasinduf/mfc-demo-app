import { Suspense, lazy, useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import SignIn from './pages/Authentication/SignIn';
import routes from './routes';
import Loader from './components/loader';
import { ToastContainer } from 'react-toastify';
import RequireAuth from './components/RequireAuth';
import { useAuth } from './hooks/useAuth';
import { validateJwt } from './utils/parseJwt';
import { Main_Dashboard, Collector_Dashboard } from './api/RBAC/userAccess';
const DefaultLayout = lazy(() => import('./layout/DefaultLayout'));
const PageNotFound = lazy(() => import('./pages/PageNotFound'));

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { auth }: any = useAuth();

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <>
      <ToastContainer position="top-right" />
      <Routes>
        <Route
          path="/signin"
          element={
            auth?.accessToken && validateJwt(auth.accessToken) ? (
              <Navigate to="/" />
            ) : (
              <SignIn />
            )
          }
        />
        <Route element={<RequireAuth allowedAccess={[Main_Dashboard, Collector_Dashboard]} />}>
          <Route element={<DefaultLayout />}>
            {routes.map((routes, index) => {
              const { path, component: Component, allowedAccess } = routes;
              return (
                <Route
                  element={
                    <RequireAuth
                      allowedAccess={allowedAccess}
                      key={`route-${index}`}
                    />
                  }
                >
                  <Route
                    path={path}
                    element={
                      <Suspense fallback={<Loader />}>
                        <Component />
                      </Suspense>
                    }
                  />
                </Route>
              );
            })}
            <Route path="*" element={<PageNotFound />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
