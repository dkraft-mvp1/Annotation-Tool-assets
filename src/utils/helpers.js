import axios from 'axios'
import Cookies from 'js-cookie'
import { API_BASE_URL } from '../config/config'
import { getCookies, setAuthTokens, setUserDetails } from './cookieStorage'

// let BASE_URL = 'https://dev.qzkraft.com/v1'
const BASE_URL = API_BASE_URL
// const APP_URL = window.location.origin

// if (APP_URL === 'https://development.qzkraft.com') {
//   BASE_URL = ' https://dev.qzkraft.com/v1'
// } else if (APP_URL === 'https://staging.qzkraft.com') {
//   BASE_URL = 'https://app.qzkraft.com/v1'
// } else if (APP_URL === 'https://www.qzkraft.com') {
//   BASE_URL = 'https://prod.qzkraft.com/v1'
// }

/**
* This function is for making unauthenticated server requests
* @param {String} route - The route to be called
* @param {String} method - The HTTP method to be called
* @param {String} body - The body to be passed
* @return {Object} - The response from the server
*/

export const makeServerRequest = async (route, method, body) => {
  try {
    const response = await axios({
      method,
      url: `${BASE_URL}${route}`,
      headers: { 'content-type': 'application/JSON' },
      data: body
    })
    return response
  } catch (error) {
    return error.response
  }
}
export const makeUrlRequest = async (route, method, body) => {
  const response = await axios({
    method,
    url: `${route}`,
    headers: { 'content-type': 'application/JSON' },
    data: body
  })
  return response
}

/**
* This function is for making unauthenticated server GET requests
* @param {String} route - The route to be called
* @param {String} params - The params to be passed
* @return {Object} - The response from the server
*/
export const makeServerGETRequest = async (route, params) => {
  try {
    const response = await axios({
      method: 'GET',
      url: `${BASE_URL}${route}`,
      headers: { 'content-type': 'application/JSON' },
      params
    })
    return response
  } catch (error) {
    return error.response
  }
}

/**
* This function is for making any authenticated server requests
* @param {String} route - The route to be called
* @param {String} method - The HTTP method to be called
* @param {String} body - The body to be passed
* @return {Object} - The response from the server
*/

export const makeAuthenticatedServerRequest = async (route, method, body) => {
  refreshAuthToken()
  const { accessToken } = getCookies()
  try {
    const response = await axios({
      method,
      url: `${BASE_URL}${route}`,
      headers: { Authorization: `Bearer ${accessToken}`, 'content-type': 'application/JSON' },
      data: body
    })
    return response
  } catch (error) {
    return error.response
  }
}

export const authrequest = async (route, method, body) => {
  refreshAuthToken()
  const { accessToken } = getCookies()
  try {
    const response = await axios({
      method,
      url: `${BASE_URL}${route}`,
      headers: { Authorization: `Bearer ${accessToken}`, 'content-type': 'application/JSON' },
      data: body
    })
    return response
  } catch (error) {
    return error.response
  }
}

/**
* This function is for making authenticated server GET requests
* @param {String} route - The route to be called
* @param {String} params - The params to be passed
* @return {Object} - The response from the server
*/

export const makeAuthenticatedServerGETRequest = async (route, params) => {
  refreshAuthToken()
  const { accessToken } = getCookies()

  try {
    const response = await axios({
      method: 'GET',
      url: `${BASE_URL}${route}`,
      headers: { Authorization: `Bearer ${accessToken}` },
      params
    })

    return response
  } catch (error) {
    return error.response
  }
}

/**
* This function is for uploading file to the server unauthenticated
* @param {String} route - The route to be called
* @param {String} filePath - The file path to be passed
* @return {Object} - The response from the server
*/

export const fileUploadRequest = (route, filePath, uploadProgressEmitter) => {
  const response = axios({
    method: 'POST',
    url: `${BASE_URL}${route}`,
    data: filePath,
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    onUploadProgress: uploadProgressEmitter
  })

  return response
}

/**
* This function is for refreshing the access token
*/

export const refreshAuthToken = async () => {
  const { refreshToken, userDetails } = getCookies()
  const res = await makeServerRequest('/auth/refreshToken', 'POST', {
    refreshToken
  })
  if (res.status === 200) {
    setAuthTokens({ accessToken: res.data.accessToken, refreshToken: res.data.refreshToken })
  } else {
    Cookies.remove('userDetails')
    return
  }

  // In case the user is loggedIn but its userDetails that are stored in cookies is expired, so again make request to get userDetails and store it in cookies
  if (userDetails === undefined) {
    try {
      const response = await axios({
        method: 'GET',
        url: `${BASE_URL}/profile`,
        headers: { Authorization: `Bearer ${getCookies().accessToken}` }
      })
      setUserDetails(response.data.user)
    } catch (error) {
    }
  }
  return res
}
