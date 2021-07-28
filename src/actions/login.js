import {
    LOGIN_FAILURE,
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_CHECK_FAILURE,
    LOGIN_CHECK_REQUEST,
    LOGIN_CHECK_SUCCESS,
    LOGOUT_FAILURE,
    LOGOUT_REQUEST,
    LOGOUT_SUCCESS,
} from '../constants/index.js';

import { parseJSON } from '../utils/misc.js';
import { post_login, post_logout, check_login_status } from '../utils/http_functions.js';

export function loginSuccess(response) {
    return {
        type: LOGIN_SUCCESS,
        payload: {
        },
    };
}

export function loginFailure(response) {
    return {
        type: LOGIN_FAILURE,
        payload: {
        },
    };
}

export function loginRequest() {
    return {
        type: LOGIN_REQUEST,
    };
}


export function login(email, password) {
    return function (dispatch) {
        dispatch(loginRequest())
        return post_login(email, password)
            .then(parseJSON)
            .then(response => {
                try {
                    const out = response.success ? loginSuccess(response) : loginFailure(response);
                    dispatch(out);
                    return out;
                } catch (e) {
                    alert(e);
                    dispatch(loginFailure({
                        response: {
                            status: 403,
                            statusText: 'Invalid Login',
                        },
                    }));
                }
            })
            .catch(error => {
                dispatch(loginFailure({
                    response: {
                        status: 403,
                        statusText: 'Invalid login',
                    },
                }));
            });
    };
}

export function logoutSuccess(response) {
    return {
        type: LOGOUT_SUCCESS,
        payload: {
        },
    };
}

export function logoutFailure(response) {
    return {
        type: LOGOUT_FAILURE,
        payload: {
        },
    };
}

export function logoutRequest() {
    return {
        type: LOGOUT_REQUEST,
    };
}


export function logout() {
    return function (dispatch) {
        dispatch(logoutRequest())
        return post_logout()
            .then(parseJSON)
            .then(response => {
                try {
                    const out = response.success ? logoutSuccess(response) : logoutFailure(response);
                    dispatch(out);
                    return out;
                } catch (e) {
                    alert(e);
                    dispatch(logoutFailure({
                        response: {
                            status: 403,
                            statusText: 'Invalid Logout',
                        },
                    }));
                }
            })
            .catch(error => {
                dispatch(logoutFailure({
                    response: {
                        status: 403,
                        statusText: 'Invalid logout',
                    },
                }));
            });
    };
}

export function loginCheckSuccess(response) {
    return {
        type: LOGIN_CHECK_SUCCESS,
        payload: {
        },
    };
}

export function loginCheckFailure(response) {
    return {
        type: LOGIN_CHECK_FAILURE,
        payload: {
        },
    };
}

export function loginCheckRequest() {
    return {
        type: LOGIN_CHECK_REQUEST,
    };
}


export function loginCheck(email, password) {
    return function (dispatch) {
        dispatch(loginCheckRequest())
        return check_login_status(email, password)
            .then(parseJSON)
            .then(response => {
                const out = response.isLoggedIn ? loginCheckSuccess(response) : loginCheckFailure(response);
                dispatch(out);
                return out;
            })
            .catch(error => {
                dispatch(loginCheckFailure({
                    response: {
                        status: 403,
                        statusText: 'Something went wrong!',
                    },
                }));
            });
    };
}
