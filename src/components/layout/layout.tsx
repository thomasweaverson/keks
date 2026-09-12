import { Outlet, ScrollRestoration, useMatches } from 'react-router-dom';
import type { TRouteHandle } from '../../types/infrastructure';
import Header from './header/header';
import Footer from './footer/footer';

const Layout = () => {
  const matches = useMatches();
  const currentRoute = matches.at(-1);

  const handle = currentRoute?.handle as TRouteHandle | undefined;

  const hideHeader = handle?.hideHeader;
  const hideFooter = handle?.hideFooter;

  return (
    <>
      {!hideHeader && <Header />}
      <main>
        <Outlet />
      </main>
      {!hideFooter && <Footer />}
      <ScrollRestoration />
    </>
  );
};

export default Layout;
