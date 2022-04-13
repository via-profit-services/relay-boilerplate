import { Reducer } from 'redux';
import Cookie from 'js-cookie';

import defaultState from './defaultState';

const createReducer = (initialState: ReduxStore = defaultState) => {
  const reducer: Reducer<ReduxStore, ReduxActions> = (state = initialState, action) => {
    switch (action.type) {
      case 'setTheme': {
        const newState: ReduxStore = {
          ...state,
          theme: action.payload,
        };
        Cookie.set('theme', newState.theme);

        return newState;
      }

      case 'setFontSize': {
        const newState: ReduxStore = {
          ...state,
          fontSize: action.payload,
        };
        Cookie.set('fontSize', newState.fontSize);

        return newState;
      }

      case 'setDeviceMode': {
        const newState: ReduxStore = {
          ...state,
          deviceMode: action.payload,
        };

        return newState;
      }

      case 'setTokens': {
        const { accessToken, refreshToken } = action.payload;
        const newState: ReduxStore = {
          ...state,
          accessToken,
          refreshToken,
        };

        return newState;
      }
      case 'resetTokens': {
        const newState: ReduxStore = {
          ...state,
          accessToken: null,
          refreshToken: null,
        };

        return newState;
      }

      default:
        return state;
    }
  };

  return reducer;
};

export default createReducer;
