import React from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "./LoginPage";
import SignupForm from "./SignupPage";

import {
  containerClass,
  signUpContainer,
  signInContainer,
  formClass,
  titleClass,
  ghostButtonClass,
  overlayContainer,
  overlay,
  leftOverlayPanel,
  rightOverlayPanel,
  paragraphClass,
} from "./Componenets";

export default function AuthLayout({ currentPath, onLogin }) {
  const navigate = useNavigate();
  const signIn = currentPath === "login";
  
  return (
    <div className={containerClass}>
      <div className={signUpContainer(signIn)}>
        <div className={formClass}>
          {/* Pass onLogin instead of setUser */}
          <SignupForm setUser={onLogin} />
        </div>
      </div>

      <div className={signInContainer(signIn)}>
        <div className={formClass}>
          {/* Pass onLogin instead of setUser */}
          <LoginForm setUser={onLogin} />
        </div>
      </div>

      <div className={overlayContainer(signIn)}>
        <div className={overlay(signIn)}>
          <div className={leftOverlayPanel(signIn)}>
            <h1 className={titleClass}>Already have an account?</h1>
            <p className={paragraphClass}>
              Login to your account and start using our services
            </p>
            <button
              type="button"
              className={ghostButtonClass}
              onClick={() => navigate("/login")}
            >
              LOG IN
            </button>
          </div>

          <div className={rightOverlayPanel(signIn)}>
            <h1 className={titleClass}>Hello, There!</h1>
            <p className={paragraphClass}>
              New to our services? Sign up here!
            </p>
            <button
              type="button"
              className={ghostButtonClass}
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}