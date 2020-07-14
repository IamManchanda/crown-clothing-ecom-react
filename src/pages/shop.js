import React, { Fragment, useEffect, lazy, Suspense, memo } from "react";
import { PrerenderedComponent } from "react-prerendered-component";
import { Switch, Route } from "react-router-dom";
import { connect } from "react-redux";

import { fetchCollectionsStart } from "../store/shop/shop.actions";
import {
  SpinnerOverlayStyled,
  SpinnerStyled,
} from "../components/with-spinner";
import ErrorBoundary from "../components/error-boundary";

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

const CollectionsOverviewWithContainer = prerenderedLazy(() =>
  import("../components/collections-overview/with-container"),
);
const CollectionPageWithContainer = prerenderedLazy(() =>
  import("../components/collection-page/with-container"),
);

const ShopPage = ({ match, fetchCollectionsStart }) => {
  useEffect(() => {
    fetchCollectionsStart();
  }, [fetchCollectionsStart]);
  return (
    <Fragment>
      <Switch>
        <ErrorBoundary>
          <Suspense
            fallback={
              <SpinnerOverlayStyled>
                <SpinnerStyled />
              </SpinnerOverlayStyled>
            }
          >
            <Route
              exact
              path={`${match.path}`}
              component={CollectionsOverviewWithContainer}
            />
            <Route
              path={`${match.path}/:collection`}
              component={CollectionPageWithContainer}
            />
          </Suspense>
        </ErrorBoundary>
      </Switch>
    </Fragment>
  );
};

const mapStateToProps = null;
const mapDispatchToProps = (dispatch) => ({
  fetchCollectionsStart: () => dispatch(fetchCollectionsStart()),
});
export default connect(mapStateToProps, mapDispatchToProps)(ShopPage);
