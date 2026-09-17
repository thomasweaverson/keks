import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { LoadingStatus } from '../../const/infrastructure';
import { useAppSelector } from '../../hooks';
import CatalogPage from './catalog-page';
import type {
  TProduct,
  TProductCategory,
  TProductType,
} from '../../types/product';
import type { TLoadingStatus } from '../../types/infrastructure';
import { makeFakeProduct } from '../../utils/testing/mocks';

type TSelectorValues = {
  filteredProducts?: TProduct[];
  productsLoadingStatus?: TLoadingStatus;
  favoritesLoadingStatus?: TLoadingStatus;
  filtersLoadingStatus?: TLoadingStatus;
  currentCategory?: TProductCategory | null;
  selectedTypes?: TProductType[];
};

vi.mock('../../hooks', () => ({
  useAppSelector: vi.fn(),
}));

vi.mock('../../components/back-link/back-link', () => ({
  default: () => <div>BackLink</div>,
}));

vi.mock('./filter/filter', () => ({
  default: () => <div>Filter</div>,
}));

vi.mock('./catalog/catalog', () => ({
  default: () => <div>Catalog</div>,
}));

vi.mock('./not-found-products/not-found-products', () => ({
  default: () => <div>NotFoundProducts</div>,
}));

vi.mock('../loading-screen/loading-screen', () => ({
  default: () => <div>LoaderScreen</div>,
}));

vi.mock('../error-page/error-page', () => ({
  default: () => <div>ErrorPage</div>,
}));

const mockUseAppSelector = vi.mocked(useAppSelector);

describe('Component: CatalogPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const setSelectorValues = ({
    filteredProducts = [],
    productsLoadingStatus = LoadingStatus.Loaded,
    favoritesLoadingStatus = LoadingStatus.Loaded,
    filtersLoadingStatus = LoadingStatus.Loaded,
    currentCategory = null,
    selectedTypes = [],
  }: TSelectorValues = {}) => {
    mockUseAppSelector
      .mockReturnValueOnce(filteredProducts)
      .mockReturnValueOnce(productsLoadingStatus)
      .mockReturnValueOnce(favoritesLoadingStatus)
      .mockReturnValueOnce(filtersLoadingStatus)
      .mockReturnValueOnce(currentCategory)
      .mockReturnValueOnce(selectedTypes);
  };

  it('should render loader when products are loading', () => {
    setSelectorValues({
      productsLoadingStatus: LoadingStatus.Loading,
    });

    render(<CatalogPage />);

    expect(screen.getByText('LoaderScreen')).toBeInTheDocument();
    expect(screen.queryByText('Catalog')).not.toBeInTheDocument();
    expect(screen.queryByText('Filter')).not.toBeInTheDocument();
  });

  it('should render loader when filters are loading', () => {
    setSelectorValues({
      filtersLoadingStatus: LoadingStatus.Loading,
    });

    render(<CatalogPage />);

    expect(screen.getByText('LoaderScreen')).toBeInTheDocument();
    expect(screen.queryByText('Catalog')).not.toBeInTheDocument();
    expect(screen.queryByText('Filter')).not.toBeInTheDocument();
  });

  it('should render error page when products loading fails', () => {
    setSelectorValues({
      productsLoadingStatus: LoadingStatus.Failed,
    });

    render(<CatalogPage />);

    expect(screen.getByText('ErrorPage')).toBeInTheDocument();
  });

  it('should render error page when favorites loading fails', () => {
    setSelectorValues({
      favoritesLoadingStatus: LoadingStatus.Failed,
    });

    render(<CatalogPage />);

    expect(screen.getByText('ErrorPage')).toBeInTheDocument();
  });

  it('should render error page when filters loading fails', () => {
    setSelectorValues({
      filtersLoadingStatus: LoadingStatus.Failed,
    });

    render(<CatalogPage />);

    expect(screen.getByText('ErrorPage')).toBeInTheDocument();
  });

  it('should render catalog when filtered products are available', () => {
    setSelectorValues({
      filteredProducts: [makeFakeProduct()],
    });

    render(<CatalogPage />);

    expect(screen.getByText('Catalog')).toBeInTheDocument();
    expect(screen.getByText('BackLink')).toBeInTheDocument();
    expect(screen.getByText('Filter')).toBeInTheDocument();
    expect(screen.queryByText('NotFoundProducts')).not.toBeInTheDocument();
  });

  it('should render not found products when filtered products are empty', () => {
    setSelectorValues({
      filteredProducts: [],
    });

    render(<CatalogPage />);

    expect(screen.getByText('NotFoundProducts')).toBeInTheDocument();
    expect(screen.getByText('BackLink')).toBeInTheDocument();
    expect(screen.getByText('Filter')).toBeInTheDocument();
    expect(screen.queryByText('Catalog')).not.toBeInTheDocument();
  });

  it('should render page title', () => {
    setSelectorValues();

    render(<CatalogPage />);

    expect(document.title).toBe('Кондитерская Кекс - Каталог');
  });
});
