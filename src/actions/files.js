import {
    GET_FILE,
    GET_FILE_FAILURE,
    GET_FILE_REQUEST,
    GET_FILE_SUCCESS,
    GET_FILENAMES,
    GET_FILENAMES_FAILURE,
    GET_FILENAMES_REQUEST,
    GET_FILENAMES_SUCCESS,
    SAVE_ANNOTATIONS,
    SAVE_ANNOTATIONS_FAILURE,
    SAVE_ANNOTATIONS_REQUEST,
    SAVE_ANNOTATIONS_SUCCESS,
} from '../constants/index.js';

import { parseJSON } from '../utils/misc.js';
import { get_file, get_filenames, save_annotations } from '../utils/http_functions.js';

export function getFileSuccess(token) {
    localStorage.setItem('token', token);
    return {
        type: GET_FILE_SUCCESS,
        payload: {
            token,
        },
    };
}


export function getFileFailure(error) {
    localStorage.removeItem('token');
    return {
        type: GET_FILE_FAILURE,
        payload: {
            status: error.response.status,
            statusText: error.response.statusText,
        },
    };
}

export function getFileRequest() {
    return {
        type: GET_FILE_REQUEST,
    };
}

export function getFile(id, textDir = null, annDir = null) {
    return function (dispatch) {
        dispatch(getFileRequest());
        const file = get_file(id, textDir, annDir);
        return file;
    };
}

export function getFilenamesSuccess(token) {
    localStorage.setItem('token', token);
    return {
        type: GET_FILENAMES_SUCCESS,
        payload: {
            token,
        },
    };
}


export function getFilenamesFailure(error) {
    localStorage.removeItem('token');
    return {
        type: GET_FILENAMES_FAILURE,
        payload: {
            status: error.response.status,
            statusText: error.response.statusText,
        },
    };
}

export function getFilenamesRequest() {
    return {
        type: GET_FILENAMES_REQUEST,
    };
}

export function getFilenames() {
    return function (dispatch) {
        dispatch(getFilenamesRequest());
        const filenames = get_filenames();
        return filenames;
        // TODO: Look at how to get error messages back
        return get_filenames()
            .then(parseJSON)
            .then(response => {
                try {
                    dispatch(getFilenamesSuccess(response.token));
                } catch (e) {
                    alert(e);
                    dispatch(getFilenamesFailure({
                        response: {
                            status: 403,
                            statusText: 'Invalid file fetch',
                        },
                    }));
                }
            })
            .catch(error => {
                dispatch(getFilenamesFailure({
                    response: {
                        status: 403,
                        statusText: 'Invalid file fetch',
                    },
                }));
            });
    };
}

export function saveAnnotationsSuccess(token) {
    localStorage.setItem('token', token);
    return {
        type: SAVE_ANNOTATIONS_SUCCESS,
        payload: {
            token,
        },
    };
}


export function saveAnnotationsFailure(error) {
    localStorage.removeItem('token');
    return {
        type: SAVE_ANNOTATIONS_FAILURE,
        payload: {
            status: error.response.status,
            statusText: error.response.statusText,
        },
    };
}

export function saveAnnotationsRequest() {
    return {
        type: SAVE_ANNOTATIONS_REQUEST,
    };
}

export function saveAnnotations(id, annotations, dir) {
    return function (dispatch) {
        dispatch(saveAnnotationsRequest());
        return save_annotations(id, annotations, dir)
            .then(parseJSON)
            .then(response => {
                try {
                    dispatch(saveAnnotationsSuccess(response.token));
                    // browserHistory.push('/main');
                } catch (e) {
                    alert(e);
                    dispatch(saveAnnotationsFailure({
                        response: {
                            status: 403,
                            statusText: 'Invalid annotations',
                        },
                    }));
                }
            })
            .catch(error => {
                dispatch(saveAnnotationsFailure({
                    response: {
                        status: 403,
                        statusText: 'Invalid file save',
                    },
                }));
            });
    };
}
