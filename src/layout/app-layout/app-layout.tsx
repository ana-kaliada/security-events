import { Outlet, NavLink } from 'react-router';
import { routes } from '../../app/router/routes.tsx';
import styles from './app-layout.module.css';

export const AppLayout = () => {
  return (
    <>
      <header className={styles.header}>
        <nav className={styles.nav} aria-label="Primary navigation">
          {routes.map(({ path, name }) => {
            if (path === '/') return null;

            return (
              <NavLink
                className={({ isActive }) =>
                  isActive
                    ? `${styles.link} ${styles.activeLink}`
                    : styles.link
                }
                to={path}
                key={path}
              >
                {name}
              </NavLink>
            );
          })}
        </nav>
      </header>
      <div className={styles.content}>
        <Outlet />
      </div>
    </>
  );
};
