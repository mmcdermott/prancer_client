import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import rootReducer from '../reducers/index.js';
import { createLogger } from 'redux-logger'

const debugware = [];
if (process.env.NODE_ENV !== 'production') {
    debugware.push(createLogger({
        collapsed: true,
    }));
}

export default function configureStore(initialState) {
    const store = createStore(
        rootReducer,
        initialState,
        applyMiddleware(thunkMiddleware, ...debugware)
    );

    if (import.meta.hot) {
        // Enable Webpack hot module replacement for reducers
        import.meta.hot.accept('../reducers', ({module, deps}) => {
            store.replaceReducer(module);
        });
    }

    return store;
}
