import Cookies from 'js-cookie'

/**
* To get localStorage tokens
* @return {refreshToken} refreshToken
* @return {accessToken} accessToken
*/

export const getCookies = () => {
  const cookies = Cookies.get()
  return cookies
}
/**
* To store cookies
* @param {Array} cookies - An array of cookies with key and value pair
*/

export const setCookieStorage = (key, value, expires) => {
  Cookies.set(key, value, { expires: expires || 1 })
}

export const removeCookie = (cookie) => {
  Cookies.remove(cookie)
}

export const setCookies = (cookies) => {
  for (let i = 0; i < cookies.length; i++) {
    Cookies.set(cookies[i].key, cookies[i].value, { expires: cookies[i].expires })
  }
}

export const removeCookies = (cookies) => {
  for (let i = 0; i < cookies.length; i++) {
    Cookies.remove(cookies[i])
  }
}

export const getAuthTokens = () => {
  const cookies = getCookies()
  const accessToken = cookies.accessToken
  const refreshToken = cookies.refreshToken
  return { accessToken, refreshToken }
}
export const setUserDetails = (userDetails) => {
  Cookies.set('userDetails', JSON.stringify(userDetails), { expires: 1 / 2 })
}
export const setAuthTokens = (cookies) => {
  Cookies.set('refreshToken', cookies.refreshToken, { expires: 1 / 2 })
  Cookies.set('accessToken', cookies.accessToken, { expires: 1 / 96 })
}

export const setPublishingQuizID = (quizData) => {
  Cookies.set('publishingQuizID', String(quizData.quizID), { expires: 1 / 2 })
  Cookies.set('isQuizPublished', String(quizData.isQuizPublished), { expires: 1 / 2 })
}

export const getPublishingQuizID = () => {
  const cookies = getCookies()
  const quizID = cookies.publishingQuizID
  const isQuizPublished = cookies.isQuizPublished
  return { quizID, isQuizPublished }
}
