/* eslint camelcase: 0 */
import { SERVER_ADDRESS } from '../../constants.js';

import axios from 'axios';

axios.defaults.withCredentials = true

export function get_filenames() {
  return axios.get(`${SERVER_ADDRESS}api/get_filenames`, { });
}

export function get_file(id, textDir, annDir) {
  return axios.post(`${SERVER_ADDRESS}api/get_file`, { id, textDir, annDir });
}

export function save_annotations(id, annotations, dir) {
  return axios.post(`${SERVER_ADDRESS}api/save_annotations`, { id, annotations, dir });
}

export function recommend_labels(searchTerm, isKeyword, mode) {
  return axios.post(`${SERVER_ADDRESS}api/recommend_labels`, { searchTerm, isKeyword, mode });
}

export function search_labels(searchTerm) {
  return axios.post(`${SERVER_ADDRESS}api/search_labels`, { searchTerm });
}

export function get_colormap() {
  return axios.post(`${SERVER_ADDRESS}api/get_colormap`, { });
}

export function get_umls_info(cui) {
  return axios.post(`${SERVER_ADDRESS}api/get_umls_info`, { cui });
}

export function start_tutorial(userId) {
  return axios.post(`${SERVER_ADDRESS}api/start_tutorial`, { userId });
}

export function get_tutorial_evaluation(fileId, userId) {
  return axios.post(`${SERVER_ADDRESS}api/get_tutorial_evaluation`, { fileId, userId });
}

export function restart_tutorial(userId) {
  return axios.post(`${SERVER_ADDRESS}api/restart_tutorial`, { userId });
}

export function add_log_entry(id, action, annotation_id, metadata) {
  return axios.post(`${SERVER_ADDRESS}api/add_log_entry`, { id, action, annotation_id, metadata});
}

export function post_login(email, password) {
  const form = { email, password };
  return axios.post(`${SERVER_ADDRESS}api/login`, { form });
}
export function post_logout() {
  return axios.post(`${SERVER_ADDRESS}api/logout`, { });
}

export function check_login_status() {
  return axios.get(`${SERVER_ADDRESS}api/check_login`, { });
}
