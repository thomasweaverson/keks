import WidgetHero from "../../components/widget-hero/widget-hero";
import WidgetLastReview from "../../components/widget-last-review/widget-last-review";
import WidgetMap from "../../components/widget-map/widget-map";
import WidgetRandomProducts from "../../components/widget-random-products/widget-random-products";
import { useAppSelector } from "../../hooks";
import { getIsProductsLoadingError, getRandomPack } from "../../store/slices/products/products.selectors";
import ErrorPage from "../error-page/error-page";


const MainPage = () => {
  const randomThreeProducts = useAppSelector(getRandomPack);
  const isProductsLoadingError = useAppSelector(getIsProductsLoadingError);
  if ( isProductsLoadingError) {
    return <ErrorPage />;
  }
  return (
    <>
      <WidgetHero />
      <WidgetRandomProducts products={randomThreeProducts} />
      <WidgetLastReview />
      <WidgetMap />
    </>
  );
};

export default MainPage;
