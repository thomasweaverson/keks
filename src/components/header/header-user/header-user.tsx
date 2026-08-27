import { memo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { getUserInfo } from '../../../store/slices/user/user.selectors';
import { getFavoritesCount } from '../../../store/slices/favorites/favorites.selectors';
import { logoutAction } from '../../../store/api-actions';
import { AppRoute } from '../../../const/infrastructure';

const HeaderUser = memo(() => {
  const dispatch = useAppDispatch();
  const userData = useAppSelector(getUserInfo);
  const favoritesCount = useAppSelector(getFavoritesCount);

  const handleLogout = useCallback(() => {
    dispatch(logoutAction());
  }, [dispatch]);

  return (
    <>
      <div className="header__user-info-wrap">
        <div className="header__user-info">
          <div className="header__user-avatar">
            <picture>
              <source
                type="image/webp"
                srcSet="/img/content/user-avatar.webp, /img/content/user-avatar@2x.webp 2x"
              />
              <img
                src={userData?.avatarUrl ?? '/img/content/user-avatar.jpg'}
                srcSet="/img/content/user-avatar@2x.jpg 2x"
                width="62"
                height="62"
                alt="Аватар пользователя."
              />
            </picture>
          </div>
          <p className="header__user-mail">{userData?.email}</p>
        </div>
      </div>

      <div className="header__buttons">
        <Link className="header__favourite" to={AppRoute.Favorites}>
          <span className="header__favourite-icon">
            <svg width="33" height="29" aria-hidden="true">
              <use href="#icon-favourite" />
            </svg>
          </span>
          <span className="header__favourite-number">{favoritesCount}</span>
          <span className="visually-hidden">Избранное</span>
        </Link>

        <div className="header__buttons-authorized">
          <div className="header__btn">
            <button
              className="btn btn--second"
              type="button"
              onClick={handleLogout}
            >
              Выйти
            </button>
          </div>
        </div>
      </div>
    </>
  );
});

HeaderUser.displayName = 'HeaderUser';

export default HeaderUser
