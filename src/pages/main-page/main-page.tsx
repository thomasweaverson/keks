import { LoadingStatus } from '../../const/infrastructure';
import { useAppSelector } from '../../hooks';
import { getFavoritesLoadingStatus } from '../../store/slices/favorites/favorites.selectors';
import {
  getProductsLoadingStatus,
} from '../../store/slices/products/products.selectors';
import ErrorPage from '../error-page/error-page';
import Hero from './hero/hero';
import LastReview from './last-review/last-review';
import MapSection from './map-section/map-section';
import RandomProducts from './random-products/random-products';

const MainPage = () => {
  const productsLoadingStatus = useAppSelector(getProductsLoadingStatus);
  const isProductsLoadingError = productsLoadingStatus === LoadingStatus.Failed;

  const favoritesLoadingStatus = useAppSelector(getFavoritesLoadingStatus);
  const isFavoritesLoadingError =
    favoritesLoadingStatus === LoadingStatus.Failed;

  if (isProductsLoadingError || isFavoritesLoadingError) {
    return <ErrorPage />;
  }

  return (
    <>
      <h1 className="visually-hidden">КЕКС - Твоя пушистая кондитерская</h1>
      <Hero />
      <RandomProducts />
      <LastReview />
      <MapSection />
    </>
  );
};

export default MainPage;
