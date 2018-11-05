import * as React from 'react';
import PropTypes from 'prop-types';
import hoistNonReactStatics from 'hoist-non-react-statics';
import { ActivityIndicator } from 'react-native';

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Loading';
}

export const withLoading = (WrappedComponent) => {
  class Loading extends React.PureComponent {
    render() {
      const { loading } = this.props;
      if (loading) return <ActivityIndicator size="small" color="white" />;
      return <WrappedComponent {...this.props} />;
    }
  }

  Loading.propTypes = {
    loading: PropTypes.bool,
  };

  hoistNonReactStatics(Loading, WrappedComponent);

  Loading.displayName = `WithLoading(${getDisplayName(WrappedComponent)})`;

  return Loading;
};

export default withLoading;
