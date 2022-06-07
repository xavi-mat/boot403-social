module.exports = {
  components: {
    securitySchemes: {
      ApiKeyAuth: {
        type: "apiKey",
        in: "header",
        name: "Authorization",
      },
    },
    schemas: {
      UserRegister: {
        type: "object",
        properties: {
          username: {
            type: "string",
            description: "Name/alias of user. Changeable. Not used for identificacion.",
            example: "janedoe",
            required: true,
            minLength: 3,
            maxLength: 40
          },
          email: {
            type: "string",
            description: "User's email. Used for login. Must be unique.",
            example: "janedoe@email.com",
            required: true,
            format: "email",
          },
          password: {
            type: "string",
            description: "User's password",
            required: true,
            format: "password",
          }
        }
      },
      UserLogin: {
        type: "object",
        properties: {
          email: {
            type: "string",
            description: "User's email",
            example: "janedoe@email.com",
            required: true,
            format: "email",
          },
          password: {
            type: "string",
            description: "User's password",
            required: true,
            format: "password",
          }
        }
      },
      // UserId: {
      //   type: 'ObjectId',
      //   description: "User Identifier Code. Created by MongoDB",
      //   example: "629e138db6e9749879d0deaa"
      // },
      // user: {
      //   type: 'object',
      //   properties: {
      //     _id: {
      //       type: "ObjectId",
      //       description: "User Identifier Code. Created by MongoDB",
      //       example: "629e138db6e9749879d0deaa"
      //     },
      //     username: {
      //       type: "string",
      //       description: "Name/alias of user. Changeable. Not used for identificacion.",
      //       example: "janedoe",
      //     },
      //     TODO: {}
      //   }
      // },
    }
  }
};