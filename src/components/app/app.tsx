import { RouterProvider } from 'react-router-dom';
import { AuthorizationStatus } from '../../const/infrastructure';
import { useAppSelector } from '../../hooks';
import { getAuthorizationStatus } from '../../store/slices/user/user.selectors';
import LoaderScreen from '../../pages/loading-screen/loading-screen';
import { router } from './router';
import useAppInitialization from '../../hooks/use-app-initialization';

const App = () => {
  useAppInitialization();

  const authorizationStatus = useAppSelector(getAuthorizationStatus);

  if (authorizationStatus === AuthorizationStatus.Unknown) {
    return <LoaderScreen />;
  }
  return <RouterProvider router={router} />;
};

export default App;
