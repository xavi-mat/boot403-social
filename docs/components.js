module.exports = {
  components: {
    schemas: {
      users: {
        type: 'object',
        properties: {
          _id: {
            type: "ObjectId",
            description: "User Identifier Code. Created by MongoDB",
            example: "TODO"
          },
          username: {
            type: "string",
            description: "Name/alias of user. Changeable. Not used for identificacion.",
            example: "janedoe",
            required: true
          }
        }
      }
    }
  }
};