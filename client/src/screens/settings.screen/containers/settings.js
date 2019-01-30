import { connect } from 'react-redux';
import { logout } from 'chatty/src/actions/auth.actions';
import { NavigationActions } from 'react-navigation';
import Settings from '../components/settings';

const mapStateToProps = ({ auth }) => ({
  auth,
});

const mapDispatchToProps = dispatch => ({
  logout: () => {
    dispatch(logout());
    dispatch(
      NavigationActions.navigate({
        routeName: 'Auth',
      }),
    );
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Settings);
