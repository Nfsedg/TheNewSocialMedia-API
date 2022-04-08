require("dotenv").config();
require("./mongo");
const express = require("express");
const app = express();
const cors = require("cors");
const login = require("./controllers/login");
const user = require("./controllers/users");
const post = require("./controllers/posts");
const comments = require("./controllers/comments");

app.use(cors());
app.use(express.json());
app.use(express.static("../app/build"));

app.use("/login", login);
app.use("/user", user);
app.use("/posts", post);
app.use("/comments", comments);

app.get("/", (req, res) => {
	res.send("anything here");
});

const PORT = process.env.PORT_DEV || 3004;

const server = app.listen(PORT, () => {
	console.log(`Listen on http://localhost:${PORT}`);
});

module.exports = { app, server };