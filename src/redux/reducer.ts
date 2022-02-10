import { Reducer } from 'redux';
import Cookies from 'js-cookie';

const createReducer = (initialState: ReduxState) => {
  const reducer: Reducer<ReduxState, ReduxActions> = (state = initialState, action) => {
    switch (action.type) {
      case 'theme': {
        const newState: ReduxState = {
          ...state,
          theme: action.payload,
        };
        Cookies.set('theme', newState.theme);

        return newState;
      }
      case 'locale': {
        const newState: ReduxState = {
          ...state,
          locale: action.payload,
        };
        Cookies.set('locale', newState.locale);

        return newState;
      }

      default:
        return state;
    }
  };

  return reducer;
};

export default createReducer;
