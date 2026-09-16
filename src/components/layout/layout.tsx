import { Outlet, ScrollRestoration, useMatches } from 'react-router-dom';
import Header from './header/header';
import Footer from './footer/footer';
import { isRouteHandle } from '../../utils/guards/router';

const Layout = () => {
  const matches = useMatches();
  const currentRoute = matches.at(-1);

  const handle = isRouteHandle(currentRoute?.handle)
    ? currentRoute.handle
    : undefined;

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
