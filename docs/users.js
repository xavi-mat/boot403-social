module.exports = {
  paths: {
    "/users": {
      post: {
        tags: {
          Users: "Register"
        },
        description: "TODO",
        operationId: "registerUser",
        parameters: [],
        requestBody: {
          content: {
            "application/json": {
              schema: { $ref: "#components/schemas/UserRegister" }
            }
          }
        },
        responses: {
          201: {
            description: "User successfully registered"
          },
          400: {
            description: "Data required: username, email, password"
          },
          500: {
            description: "Internal server error"
          },
        }
      },
      get: {
        tags: {
          Users: "Get info"
        },
        description: "TODO description",
        operationId: "getUserInfo",
        parameters: [],
        responses: {
          200: {
            description: "All User's data was obtained",
            content: {
              "application/json": {
                schema: { $ref: "#components/schemas/user" },
              }
            }
          }
        }
      },
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