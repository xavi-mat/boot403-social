module.exports = {
  components: {
    schemas: {
      user: {
        type: 'object',
        properties: {
          _id: {
            type: "ObjectId",
            description: "User Identifier Code. Created by MongoDB",
            example: "629e138db6e9749879d0deaa"
          },
          username: {
            type: "string",
            description: "Name/alias of user. Changeable. Not used for identificacion.",
            example: "janedoe",
          },
          TODO: {}
        }
      },
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
            example: "johndoe@email.com",
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
      }
    }
  }
};