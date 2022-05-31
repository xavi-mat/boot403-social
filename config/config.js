const mongoose = require("mongoose");

const { MONGO_URI } = require("./keys");

const dbConnection = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("DB successfully connected");
  } catch (error) {
    console.error(error);
    throw new Error("Error connecting to DB");
  }
};

module.exports = {
  dbConnection,
};
