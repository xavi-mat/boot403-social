module.exports = {
  paths: {
    "/users": {
      post: {},
      get: {},
      put: {},
    },

    "/users/login": {
      post: {}
    },
    "/users/confirm/{emailToken}": {
      get: {}
    },
    "/users/search": {
      get: {}
    },
    "/users/id/{_id}": {
      get: {}
    },
    "/users/follow/{_id}": {
      put: {},
      delete: {}
    },
    "/users/delete": {
      delete: {}
    },
    "/users/logout": {
      delete: {}
    },
    "/users/clean-all": {
      delete: {}
    },
  }
};