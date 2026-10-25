import { Suspense } from 'react';
import { Route, Routes } from 'react-router';
import { routes } from './routes.tsx';
import AppLayout from '../../layout/app-layout';

const Router = () => {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        {routes.map(({ path, element }) => (
          <Route
            key={path}
            path={path}
            element={<Suspense fallback={null}>{element}</Suspense>}
          />
        ))}
      </Route>
    </Routes>
  );
};

export default Router;
