import { createStore, applyMiddleware, combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import { loadState, saveState } from './localStorage';
import throttle from 'lodash/throttle';
// Import reducers
import session from '../reducers/session';

// Create the main reducer
const Reducers = combineReducers({
    session
});

// Create the init function for multiple entry point
export const initStore = () => {
    const persistedState = loadState();
    const store = createStore(Reducers, persistedState, composeWithDevTools(applyMiddleware(thunk)));
    store.subscribe(throttle(() => {
        if(process.browser) {
            saveState({
                session: store.getState().session
            })
        }
    }, 1000));
    return store;
};

