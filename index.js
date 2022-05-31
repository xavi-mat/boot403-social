'use strict';
const express = require("express");
const app = express();
const PORT = 8080;
const { dbConnection } = require("./config/config");

app.use(express.json());

dbConnection();

app.use('/users', require('./routes/users'));

app.listen(PORT, console.log(`Server running on port ${PORT}`));