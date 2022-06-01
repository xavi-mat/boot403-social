'use strict';
const express = require("express");
const app = express();
const PORT = 8080;
const { dbConnection } = require("./config/config");

app.use(express.json());
app.use(express.static('public'));

dbConnection();

app.use('/users', require('./routes/users'));
app.use('/posts', require('./routes/posts'));
app.use('/comments', require('./routes/comments'));

app.listen(PORT, console.log(`Server running on port ${PORT}`));