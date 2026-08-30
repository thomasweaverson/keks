import WidgetHero from "../../components/widget-hero/widget-hero";
import WidgetLastReview from "../../components/widget-last-review/widget-last-review";
import WidgetMap from "../../components/widget-map/widget-map";
import WidgetRandomProducts from "../../components/widget-random-products/widget-random-products";
import { useAppSelector } from "../../hooks";
import { getProducts } from "../../store/slices/products/products.selectors";
import { getRandomThree } from "./utils";

const MainPage = () => {
  const products = useAppSelector(getProducts);
  const randomThreeProducts = getRandomThree(products);

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
