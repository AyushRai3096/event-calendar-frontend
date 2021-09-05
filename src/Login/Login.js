import React, { useState } from "react";
import "./login.scss";
import logo from "../assets/logo.png"
import { connect } from "react-redux";
import { initLogin, initSignup } from "../store/actions";
import { Redirect, withRouter } from "react-router-dom";
import config from '../config'


const Login = (props) => {
  const [signInForm, setSignInForm] = useState({
    email: "",
    password: "",
  });
  const [signUpForm, setSignUpForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [login, setLogin] = useState(false);

  const signUp = () => {
    setSignUpForm({
      name: "",
      password: "",
      email: "",
    });
  };

  const signIn = () => {
    setSignInForm({
      password: "",
      email: "",
    });
  };

  const initLoginEvent = (email, password) => {
    if (email.length && password.length) {
      props.loginHandler(email, password)
    }
  }
  const initSignupEvent = (userName, email, password) => {
    if (email.length && password.length) {
      props.signupHandler(userName, email, password, props.history)
      setLogin(false);
    }
  }

  var page = (
    <div className="login">
      <div
        className={`login__colored-container ${login
          ? "login__colored-container--left"
          : "login__colored-container--right"
          }`}
      ></div>
      <div
        className={`login__welcome-back ${login
          ? "login__welcome-back--active"
          : "login__welcome-back--inactive"
          }`}
      >
        <div className="login__welcome-back__logo-container">  
          <img
            className="login__welcome-back__logo-container--image"
            src={logo}
            alt={config.appName}
          />
          {config.appName}
        </div>
        <div className="login__welcome-back__main-container">
          <div className="login__welcome-back__main-container__text-container">
            <span className="login__welcome-back__main-container__text-container--title">
              Welcome Back!
            </span>
            <span className="login__welcome-back__main-container__text-container--secondary">
              To continue, please log in.
            </span>
          </div>
          <div
            onClick={() => {
              setLogin(!login);
            }}
            className="login__welcome-back__main-container__button-container"
          >
            Sign In
          </div>
        </div>
      </div>
      <div
        className={`login__create-container ${login
          ? "login__create-container--active"
          : "login__create-container--inactive"
          }`}
      >
        Create Account
        <div className="login__create-container__form-container">
          <form
            className="login__create-container__form-container__form"
            onSubmit={(e) => {
              e.preventDefault();
              signUp();
            }}
          >
            <input
              className="login__create-container__form-container__form--name"
              type="text"
              placeholder="Name"
              value={signUpForm.name}
              onChange={(value) =>
                setSignUpForm({
                  name: value.target.value,
                  email: signUpForm.email,
                  password: signUpForm.password,
                })
              }
              required
            />
            <input
              className="login__create-container__form-container__form--email"
              type="email"
              placeholder="Email"
              value={signUpForm.email}
              onChange={(value) =>
                setSignUpForm({
                  email: value.target.value,
                  name: signUpForm.name,
                  password: signUpForm.password,
                })
              }
              required
            />
            <input
              className="login__create-container__form-container__form--password"
              type="password"
              placeholder="Password"
              value={signUpForm.password}
              onChange={(value) =>
                setSignUpForm({
                  password: value.target.value,
                  name: signUpForm.name,
                  email: signUpForm.email,
                })
              }
              required
            />
            <button onClick={() => initSignupEvent(signUpForm.name, signUpForm.email, signUpForm.password, props.history)} className="login__create-container__form-container__form--submit">
              Sign Up
            </button>
          </form>
        </div>
      </div>
      <div
        className={`login__login-container ${!login
          ? "login__login-container--active"
          : "login__login-container--inactive"
          }`}
      >
        <div className="login__login-container__logo-container">
          <img
            className="login__login-container__logo-container--image"
            src={logo}
            alt={config.appName}
          />
          {config.appName}
        </div>
        <div className="login__login-container__main-container">
          <div className="login__login-container__main-container__form-container">
            <form
              className="login__login-container__main-container__form-container__form"
              onSubmit={(e) => {
                e.preventDefault();
                signIn();
              }}
            >
              <input
                className="login__login-container__main-container__form-container__form--email"
                type="email"
                placeholder="Email"
                value={signInForm.email}
                onChange={(value) =>
                  setSignInForm({
                    email: value.target.value,
                    password: signInForm.password,
                  })
                }
                required
              />
              <input
                className="login__login-container__main-container__form-container__form--password"
                type="password"
                placeholder="Password"
                value={signInForm.password}
                onChange={(value) =>
                  setSignInForm({
                    password: value.target.value,
                    email: signInForm.email,
                  })
                }
                required
              />
              <button onClick={() => initLoginEvent(signInForm.email, signInForm.password)} className="login__login-container__main-container__form-container__form--submit">
                Sign In
              </button>
            </form>
          </div>
        </div>
      </div>
      <div
        className={`login__hello-container ${!login
          ? "login__hello-container--active"
          : "login__hello-container--inactive"
          }`}
      >
        <div className="login__welcome-back__main-container__text-container">
          <span className="login__welcome-back__main-container__text-container--title">
            New member ?
          </span>
          <span className="login__welcome-back__main-container__text-container--secondary">
            Enter your personal details and get started!
          </span>
        </div>
        <div
          onClick={() => {
            setLogin(!login);
          }}
          className="login__welcome-back__main-container__button-container"
        >
          Sign Up
        </div>
      </div>
    </div>
  );

  if (props.isLoggedIn) page = <Redirect to="/calendar" />;

  return <React.Fragment>{page}</React.Fragment>;
};

const mapStateToProps = (store) => {
  return {
    isLoggedIn: store.authToken ? true : false
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    loginHandler: (email, password) => dispatch(initLogin(email, password)),
    signupHandler: (userName, email, password, history) => dispatch(initSignup(userName, email, password, history))
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login));
