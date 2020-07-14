import React, { Fragment, useEffect, lazy, Suspense, memo } from "react";
import { PrerenderedComponent } from "react-prerendered-component";
import { Switch, Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";

import HeaderNavigation from "./components/header-navigation";
import { selectCurrentUser } from "./store/user/user.selectors";
import { checkUserSession } from "./store/user/user.actions";
import { SpinnerOverlayStyled, SpinnerStyled } from "./components/with-spinner";
import ErrorBoundary from "./components/error-boundary";

const prefetchMap = new WeakMap();
const prefetchLazy = (LazyComponent) => {
  if (!prefetchMap.has(LazyComponent)) {
    prefetchMap.set(LazyComponent, LazyComponent._ctor());
  }
  return prefetchMap.get(LazyComponent);
};

const prerenderedLazy = (dynamicImport) => {
  const LazyComponent = lazy(dynamicImport);
  return memo((props) => (
    <PrerenderedComponent live={prefetchLazy(LazyComponent)}>
      <LazyComponent {...props} />
    </PrerenderedComponent>
  ));
};

const HomePage = prerenderedLazy(() => import("./pages/index"));
const ShopPage = prerenderedLazy(() => import("./pages/shop"));
const AuthPage = prerenderedLazy(() => import("./pages/auth"));
const CheckoutPage = prerenderedLazy(() => import("./pages/checkout"));

const App = ({ currentUser, checkUserSession }) => {
  useEffect(() => {
    checkUserSession();
  }, [checkUserSession]);
  return (
    <Fragment>
      <HeaderNavigation />
      <Switch>
        <ErrorBoundary>
          <Suspense
            fallback={
              <SpinnerOverlayStyled>
                <SpinnerStyled />
              </SpinnerOverlayStyled>
            }
          >
            <Route exact path="/" component={HomePage} />
            <Route path="/shop" component={ShopPage} />
            <Route exact path="/checkout" component={CheckoutPage} />
            <Route
              exact
              path="/auth"
              render={() => (currentUser ? <Redirect to="/" /> : <AuthPage />)}
            />
          </Suspense>
        </ErrorBoundary>
      </Switch>
    </Fragment>
  );
};

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser,
});
const mapDispatchToProps = (dispatch) => ({
  checkUserSession: () => dispatch(checkUserSession()),
});
export default connect(mapStateToProps, mapDispatchToProps)(App);
