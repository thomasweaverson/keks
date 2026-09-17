import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Route, Routes } from 'react-router-dom';

import ProductPage from './product-page';
import useProductData from '../../hooks/use-product-data';
import {
  AuthorizationStatus,
  LoadingStatus,
  RegistrationStatus,
} from '../../const/infrastructure';
import { makeFakeProductExtended, makeFakeState } from '../../utils/testing/mocks';
import { withHistory, withStore } from '../../utils/testing/mock-components';


vi.mock('../../hooks/use-product-data', () => ({
  default: vi.fn(),
}));

vi.mock('../../components/back-link/back-link', () => ({
  default: () => <div data-testid="back-link">BackLink</div>,
}));

vi.mock('./product-page-title/product-page-title', () => ({
  default: () => <h1>Product page title</h1>,
}));

vi.mock('./product-reviews/product-reviews', () => ({
  default: () => <div data-testid="product-reviews">ProductReviews</div>,
}));

vi.mock('../loading-screen/loading-screen', () => ({
  default: () => <div>Loading...</div>,
}));

vi.mock('../error-page/error-page', () => ({
  default: () => <div>Error page</div>,
}));

vi.mock('../not-found-page/not-found-page', () => ({
  default: () => <div>Not found page</div>,
}));

vi.mock('./review-form/review-form', () => ({
  default: ({ productId }: { productId: string }) => (
    <div data-testid="review-form">
      Review form for {productId}
    </div>
  ),
}));

vi.mock('./details/details', () => ({
  default: ({
    onShowReviewFormClick,
    isReviewFormOpen,
  }: {
    onShowReviewFormClick: (isShowing: boolean) => void;
    isReviewFormOpen: boolean;
  }) => (
    <div data-testid="details">
      <span>
        Review form is {isReviewFormOpen ? 'open' : 'closed'}
      </span>

      <button
        type="button"
        onClick={() => onShowReviewFormClick(true)}
      >
        Show review form
      </button>
    </div>
  ),
}));

const mockUseProductData = vi.mocked(useProductData);

const fakeProduct = makeFakeProductExtended({
  id: 'product-1',
  title: 'Cheesecake',
});

const renderProductPage = (
  initialState = makeFakeState({
    Product: {
      product: fakeProduct,
      productLoadingStatus: LoadingStatus.Loaded,
      isProductNotFound: false,
    },
    Favorites: {
      favorites: [],
      favoritesLoadingStatus: LoadingStatus.Loaded,
    },
    User: {
      authorizationStatus: AuthorizationStatus.Auth,
      registrationStatus: RegistrationStatus.Idle,
      userInfo: null,
      isAvatarLoadingError: false,
    },
  }),
) => {
  const { withStoreComponent } = withStore(
    <Routes>
      <Route
        path="/product/:id"
        element={<ProductPage />}
      />
    </Routes>,
    initialState,
  );

  return render(
    withHistory(withStoreComponent, ['/product/product-1']),
  );
};

describe('Component: ProductPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call useProductData with product id', () => {
    renderProductPage();

    expect(mockUseProductData).toHaveBeenCalledTimes(1);
    expect(mockUseProductData).toHaveBeenCalledWith('product-1');
  });

  it('should render not found page when product is not found', () => {
    renderProductPage(
      makeFakeState({
        Product: {
          product: null,
          productLoadingStatus: LoadingStatus.Loaded,
          isProductNotFound: true,
        },
      }),
    );

    expect(screen.getByText('Not found page')).toBeInTheDocument();
    expect(screen.queryByTestId('details')).not.toBeInTheDocument();
  });

  it('should render error page when product loading fails', () => {
    renderProductPage(
      makeFakeState({
        Product: {
          product: null,
          productLoadingStatus: LoadingStatus.Failed,
          isProductNotFound: false,
        },
      }),
    );

    expect(screen.getByText('Error page')).toBeInTheDocument();
  });

  it('should render error page when favorites loading fails', () => {
    renderProductPage(
      makeFakeState({
        Favorites: {
          favorites: [],
          favoritesLoadingStatus: LoadingStatus.Failed,
        },
      }),
    );

    expect(screen.getByText('Error page')).toBeInTheDocument();
  });

  it('should render loader when product is loading', () => {
    renderProductPage(
      makeFakeState({
        Product: {
          product: fakeProduct,
          productLoadingStatus: LoadingStatus.Loading,
          isProductNotFound: false,
        },
      }),
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should render loader when product is null', () => {
    renderProductPage(
      makeFakeState({
        Product: {
          product: null,
          productLoadingStatus: LoadingStatus.Loaded,
          isProductNotFound: false,
        },
      }),
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should render product page when product is loaded', () => {
    renderProductPage();

    expect(
      screen.getByRole('heading', {
        name: 'Product page title',
      }),
    ).toBeInTheDocument();

    expect(screen.getByTestId('back-link')).toBeInTheDocument();
    expect(screen.getByTestId('details')).toBeInTheDocument();
    expect(
      screen.getByTestId('product-reviews'),
    ).toBeInTheDocument();
  });

  it('should set page title when product page is rendered', () => {
    renderProductPage();

    expect(document.title).toBe(
      'Кондитерская Кекс - Карточка товара',
    );
  });

  it('should not show review form initially', () => {
    renderProductPage();

    expect(
      screen.getByText('Review form is closed'),
    ).toBeInTheDocument();

    expect(
      screen.queryByTestId('review-form'),
    ).not.toBeInTheDocument();
  });

  it('should show review form for authorized user after clicking show button', async () => {
    const user = userEvent.setup();

    renderProductPage();

    await user.click(
      screen.getByRole('button', {
        name: 'Show review form',
      }),
    );

    expect(
      screen.getByText('Review form is open'),
    ).toBeInTheDocument();

    expect(
      screen.getByTestId('review-form'),
    ).toHaveTextContent('Review form for product-1');
  });

  it('should not show review form for unauthorized user', async () => {
    const user = userEvent.setup();

    renderProductPage(
      makeFakeState({
        Product: {
          product: fakeProduct,
          productLoadingStatus: LoadingStatus.Loaded,
          isProductNotFound: false,
        },
        User: {
          authorizationStatus: AuthorizationStatus.NoAuth,
          registrationStatus: RegistrationStatus.Idle,
          userInfo: null,
          isAvatarLoadingError: false,
        },
      }),
    );

    await user.click(
      screen.getByRole('button', {
        name: 'Show review form',
      }),
    );

    expect(
      screen.getByText('Review form is closed'),
    ).toBeInTheDocument();

    expect(
      screen.queryByTestId('review-form'),
    ).not.toBeInTheDocument();
  });
});
