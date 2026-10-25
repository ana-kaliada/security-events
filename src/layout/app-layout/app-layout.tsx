import { Outlet, NavLink } from 'react-router';
import { routes } from '../../app/router/routes.tsx';

export const AppLayout = () => {
  return (
    <>
      <header>
        <nav aria-label="sections">
          {routes.map(({ path, name }) => {
            if (path === '/') return null;

            return (
              <NavLink to={path} key={path}>
                {name}
              </NavLink>
            );
          })}
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
};
