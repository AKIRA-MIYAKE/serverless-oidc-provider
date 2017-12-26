const getToken = authorizationToken => {
  if (!authorizationToken) {
    return undefined
  }

  if (!/^Bearer[ ]+([^ ]+)[ ]*$/i.test(authorizationToken)) {
    return undefined
  }

  return authorizationToken.slice(7)
}

module.exports = {
  getToken
}
