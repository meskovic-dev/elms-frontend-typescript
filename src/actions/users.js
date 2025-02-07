import { authFail } from './auth';

const axios = require('axios');

export const RETRIEVE_USERS_SUCCESS = 'RETRIEVE_USERS_SUCCESS';
export const RETRIEVE_USERS_FAIL = 'RETRIEVE_USERS_FAIL';
export const RETRIEVE_USERS_PENDING = 'RETRIEVE_USERS_PENDING';
export const CURRENT_USER_INFO = 'CURRENT_USER_INFO';

function currentUser(user) {
  return {
    type: CURRENT_USER_INFO,
    user,
  };
}

export function addUser(authUserRoles, email, username, password, roles, name, image, bio, token) {
  const headers = { Authorization: `Bearer ${token}`, roles: authUserRoles };
  return () =>
    axios
      .post(
        'http://localhost:3500/users',
        { email, username, password, roles, name, image, bio },
        { headers }
      )
      .then((response) => response)
      .catch((error) => error.response.data);
}

function retrieveUsersPending() {
  return {
    type: RETRIEVE_USERS_PENDING,
  };
}

function retrieveUsersSuccess(users) {
  return {
    type: RETRIEVE_USERS_SUCCESS,
    users,
  };
}

function retrieveUsersFail(error) {
  return {
    type: RETRIEVE_USERS_FAIL,
    error,
  };
}

export function getUsers(token) {
  return (dispatch) => {
    dispatch(retrieveUsersPending());
    const headers = { Authorization: `Bearer ${token}` };
    const url = 'http://localhost:3500/users';
    return axios
      .get(url, { headers })
      .then((response) => {
        dispatch(retrieveUsersSuccess(response.data));
      })
      .catch((error) => {
        if (error.response.data.statusCode !== 200) {
          dispatch(retrieveUsersFail(error.message));
        }
      });
  };
}

export function getCurrentUser(token) {
  const headers = { Authorization: `Bearer ${token}` };
  const url = 'http://localhost:8888/api/user';

  return (dispatch) =>
    axios
      .get(url, { headers })
      .then((response) => {
        dispatch(currentUser(response.data));
      })
      .catch((error) => {
        if (error.message.includes('401')) {
          dispatch(authFail(error));
        }
      });
}

export function editUser(authUserRoles, id, email, roles, name, image, bio, token) {
  const headers = { Authorization: `Bearer ${token}`, roles: authUserRoles };
  const url = `http://localhost:3500/users`;

  return () =>
    axios
      .put(url, { id, email, roles, name, image, bio }, { headers })
      .then((response) => response)
      .catch((error) => error.response.data);
}

export function deleteUser(authUserRoles, id, token) {
  const config = {
    headers: { authorization: `Bearer ${token}`, roles: authUserRoles },
    data: { id },
  };
  const url = `http://localhost:3500/users`;

  return () =>
    axios
      .delete(url, config)
      .then((response) => response)
      .catch((error) => error.response.data);
}

export function notifyUser(token, authUserRoles, userId, message) {
  const headers = { Authorization: `Bearer ${token}`, roles: authUserRoles };
  const url = `http://localhost:3500/users`;

  return () =>
    axios
      .put(url, { id: userId, newNotification: message, seen: 'false' }, { headers })
      .then((response) => response)
      .catch((error) => error.response.data);
}

export function updateNotifications(token, roles, userId, notifications) {
  const headers = { Authorization: `Bearer ${token}`, roles };
  const url = `http://localhost:3500/users`;

  return () =>
    axios
      .put(url, { id: userId, notifications }, { headers })
      .then((response) => response)
      .catch((error) => error.response.data);
}
