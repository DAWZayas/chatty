import { LOGOUT, SET_CURRENT_USER } from '../constants/constants';

const initialState = {
  loading: true,
};

const auth = (state = initialState, action) => {
  switch (action.type) {
    case SET_CURRENT_USER:
      return { ...state, ...action.user };
    case LOGOUT:
      return { loading: false };
    default:
      return state;
  }
};

export default auth;
