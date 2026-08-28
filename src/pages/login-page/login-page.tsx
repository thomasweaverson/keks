import { Link } from "react-router-dom"
import { AppRoute } from "../../const/infrastructure"
import LoginForm from "../../components/login-form/login-form";

const LoginPage = () => {
  return (
    <section className="login-page">
          <div className="login-page__header">
            <div className="login-page__img-wrap"><img className="login-page__img" src="img/svg/hero-keks.svg" width="727" height="569" alt="Картинка кота."/></div>
          </div>
          <div className="login-page__content">
            <div className="login-page__inner">
              <h1 className="login-page__title">Вход</h1>
              <LoginForm />
              <p className="login-page__text-wrap">Ещё не зарегистрированы? <Link className="login-page__link" to={AppRoute.Registration}>Создайте</Link> аккаунт прямо сейчас.</p>
            </div>
          </div>
        </section>
  )
}

export default LoginPage;
