export const appInitialState = {
  loading: false,
  episodesLoading: false,
  content: [],
  episodes: null,
  show: null,
  error: null,
  clean: true,
};

export const actionsTypes = {
  CLEAR_CONTENT: 'app/clear_content',
  CLEAR_DETAILS: 'app/clear_details',
  REQUEST_ERROR: 'app/request_error',
  REQUEST_PENDING: 'app/request_pending',
  REQUEST_EPISODES_ERROR: 'app/request_episodes_error',
  REQUEST_EPISODES_PENDING: 'app/request_episodes_pending',
  REQUEST_PAGE_SUCCESS: 'app/request_page_success',
  REQUEST_SEARCH_SUCCESS: 'app/request_search_success',
  REQUEST_SHOW_SUCCESS: 'app/request_show_success',
  REQUEST_EPISODES_SUCCESS: 'app/request_episodes_success',
};

export default (state, {type, payload}) => {
  switch (type) {
    case actionsTypes.CLEAR_CONTENT: {
      return {
        ...state,
        content: [],
        episodes: null,
        show: null,
        error: null,
      };
    }
    case actionsTypes.CLEAR_DETAILS: {
      return {
        ...state,
        episodes: null,
        show: null,
        clean: true,
      };
    }
    case actionsTypes.REQUEST_PENDING: {
      return {
        ...state,
        loading: true,
      };
    }
    case actionsTypes.REQUEST_EPISODES_PENDING: {
      return {
        ...state,
        episodesLoading: true,
      };
    }
    case actionsTypes.REQUEST_PAGE_SUCCESS: {
      let deDupeIt = (...arrs) => [...new Set([].concat(...arrs))];
      let newContent = deDupeIt(state.content, payload);
      return {
        ...state,
        content: newContent,
        error: null,
        loading: false,
      };
    }
    case actionsTypes.REQUEST_SEARCH_SUCCESS: {
      return {
        ...state,
        content: payload,
        error: null,
        loading: false,
      };
    }
    case actionsTypes.REQUEST_SHOW_SUCCESS: {
      return {
        ...state,
        show: payload,
        clean: false,
        error: null,
        loading: false,
      };
    }
    case actionsTypes.REQUEST_EPISODES_SUCCESS: {
      return {
        ...state,
        episodes: payload,
        clean: false,
        error: null,
        episodesLoading: false,
      };
    }
    case actionsTypes.REQUEST_ERROR: {
      return {
        ...state,
        error: 'Something went wrong.',
        loading: false,
      };
    }
    case actionsTypes.REQUEST_EPISODES_ERROR: {
      return {
        ...state,
        error: 'Something went wrong.',
        episodesLoading: false,
      };
    }
    default:
      return state;
  }
};
