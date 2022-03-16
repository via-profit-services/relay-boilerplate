import { Reducer } from 'redux';

const createReducer = (initialState: ReduxStore) => {
  const reducer: Reducer<ReduxStore, ReduxActions> = (state = initialState, action) => {
    switch (action.type) {
      case 'setUI': {
        const newState: ReduxStore = {
          ...state,
          ui: {
            ...state.ui,
            ...action.payload,
          },
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
