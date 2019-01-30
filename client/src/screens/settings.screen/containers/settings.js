import { connect } from 'react-redux';
import Settings from '../components/settings';

const mapStateToProps = ({ auth }) => ({
  auth,
});

export default connect(mapStateToProps)(Settings);
