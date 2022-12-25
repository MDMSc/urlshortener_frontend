import { LOGIN, LOGOUT, SET_USER } from "./Action.type";

export const Reducer = (state, action) => {
  switch (action.type) {
    case LOGIN:
      return {...state, isLoggedIn: true};
    case LOGOUT:
      return {...state, isLoggedIn: false, user: {}};
    case SET_USER:
        return {
            ...state,
            user: {...action.payload}
        }
    default:
      return state;
  }
};
