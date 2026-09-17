import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useLocation } from 'react-router-dom';

import Details from './details';
import useFavorite from '../../../hooks/use-favorite';

import type { TProductExtended } from '../../../types/product';
import {
  AuthorizationStatus,
  RegistrationStatus,
} from '../../../const/infrastructure';
import { DESCRIPTION_LENGTH } from '../../../const/business';
import {
  withHistory,
  withStore,
} from '../../../utils/testing/mock-components';
import { makeFakeState } from '../../../utils/testing/mocks';
import type { TAuthorizationStatus } from '../../../types/infrastructure';

const { mockToggleFavorite } = vi.hoisted(() => ({
  mockToggleFavorite: vi.fn(),
}));

vi.mock('../../../hooks/use-favorite', () => ({
  default: vi.fn(),
}));

const mockUseFavorite = vi.mocked(useFavorite);

const product: TProductExtended = {
  id: '1',
  title: 'Чизкейк Нью-Йорк',
  category: 'cheesecake',
  type: 'new-york',
  price: 450,
  previewImage: '/images/product.jpg',
  previewImageWebp: '/images/product.webp',
  isFavorite: false,
  isNew: false,
  description: 'Вкусный классический чизкейк Нью-Йорк.',
  images: ['/images/product-full.jpg'],
  weight: 500,
  rating: 4.5,
  reviewCount: 12,
};

const mockOnShowReviewFormClick = vi.fn();

const LocationDisplay = () => {
  const location = useLocation();

  return <span data-testid="location">{location.pathname}</span>;
};

const renderDetails = (
  detailsProduct: TProductExtended = product,
  isReviewFormOpen = false,
  authorizationStatus: TAuthorizationStatus = AuthorizationStatus.Auth,
) => {
  mockUseFavorite.mockReturnValue({
    isPending: false,
    toggleFavorite: mockToggleFavorite,
  });

  const { withStoreComponent } = withStore(
    withHistory(
      <>
        <Details
          product={detailsProduct}
          onShowReviewFormClick={mockOnShowReviewFormClick}
          isReviewFormOpen={isReviewFormOpen}
        />
        <LocationDisplay />
      </>,
    ),
    makeFakeState({
      User: {
        authorizationStatus,
        registrationStatus: RegistrationStatus.Idle,
        userInfo: null,
        isAvatarLoadingError: false,
      },
    }),
  );

  return render(withStoreComponent);
};

describe('Component: Details', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders product information', () => {
    renderDetails();

    expect(
      screen.getByRole('heading', { name: product.title }),
    ).toBeInTheDocument();

    expect(screen.getByText('450 р')).toBeInTheDocument();
    expect(screen.getByText('500 грамм')).toBeInTheDocument();

    expect(
      screen.getByRole('img', { name: product.title }),
    ).toHaveAttribute('src', product.previewImage);
  });

  it('renders "Новинка" label for a new product', () => {
    renderDetails({
      ...product,
      isNew: true,
    });

    expect(screen.getByText('Новинка')).toBeInTheDocument();
  });

  it('does not render "Новинка" label for a regular product', () => {
    renderDetails();

    expect(screen.queryByText('Новинка')).not.toBeInTheDocument();
  });

  it('renders rating and review count', () => {
    renderDetails();

    expect(
      screen.getByLabelText('Рейтинг 5 из 5'),
    ).toBeInTheDocument();

    expect(screen.getByText('12')).toBeInTheDocument();
  });

  it('renders short description', () => {
    renderDetails();

    expect(screen.getByText(product.description)).toBeInTheDocument();

    expect(
      screen.queryByRole('button', { name: 'Читать полностью' }),
    ).not.toBeInTheDocument();
  });

  it('renders expandable button for long description', () => {
    const longDescription = 'a'.repeat(DESCRIPTION_LENGTH + 1);

    renderDetails({
      ...product,
      description: longDescription,
    });

    expect(
      screen.getByRole('button', { name: 'Читать полностью' }),
    ).toBeInTheDocument();

    expect(
      screen.getByText(longDescription.slice(0, DESCRIPTION_LENGTH)),
    ).toBeInTheDocument();
  });

  it('expands long description after clicking "Читать полностью"', async () => {
    const user = userEvent.setup();
    const longDescription = 'a'.repeat(DESCRIPTION_LENGTH + 1);

    renderDetails({
      ...product,
      description: longDescription,
    });

    await user.click(
      screen.getByRole('button', { name: 'Читать полностью' }),
    );

    expect(screen.getByText(longDescription)).toBeInTheDocument();

    expect(
      screen.queryByRole('button', { name: 'Читать полностью' }),
    ).not.toBeInTheDocument();
  });

  it('renders active favorite state', () => {
    renderDetails({
      ...product,
      isFavorite: true,
    });

    expect(
      screen.getByRole('button', { name: 'Понравилось' }),
    ).toHaveClass('item-details__like-button--active');
  });

  it('calls toggleFavorite when favorite button is clicked', async () => {
    const user = userEvent.setup();

    renderDetails();

    await user.click(
      screen.getByRole('button', { name: 'Понравилось' }),
    );

    expect(mockToggleFavorite).toHaveBeenCalledOnce();
  });

  it('renders "Оставить отзыв" when review form is closed', () => {
    renderDetails();

    expect(
      screen.getByRole('button', { name: 'Оставить отзыв' }),
    ).toBeInTheDocument();
  });

  it('renders "Отменить отзыв" when review form is open', () => {
    renderDetails(product, true);

    expect(
      screen.getByRole('button', { name: 'Отменить отзыв' }),
    ).toBeInTheDocument();
  });

  it('adds form-open class when review form is open', () => {
    renderDetails(product, true);

    const section = screen
      .getByRole('heading', { name: product.title })
      .closest('section');

    expect(section).toHaveClass('item-details--form-open');
  });

  it('calls onShowReviewFormClick with true for authorized user', async () => {
    const user = userEvent.setup();

    renderDetails(product, false, AuthorizationStatus.Auth);

    await user.click(
      screen.getByRole('button', { name: 'Оставить отзыв' }),
    );

    expect(mockOnShowReviewFormClick).toHaveBeenCalledWith(true);
  });

  it('calls onShowReviewFormClick with false when review form is open', async () => {
    const user = userEvent.setup();

    renderDetails(product, true, AuthorizationStatus.Auth);

    await user.click(
      screen.getByRole('button', { name: 'Отменить отзыв' }),
    );

    expect(mockOnShowReviewFormClick).toHaveBeenCalledWith(false);
  });

  it('redirects unauthorized user to login page', async () => {
    const user = userEvent.setup();

    renderDetails(
      product,
      false,
      AuthorizationStatus.NoAuth,
    );

    await user.click(
      screen.getByRole('button', { name: 'Оставить отзыв' }),
    );

    expect(screen.getByTestId('location')).toHaveTextContent('/login');
    expect(mockOnShowReviewFormClick).not.toHaveBeenCalled();
  });
});
