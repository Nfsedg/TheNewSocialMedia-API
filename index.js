require("dotenv").config();
require("./mongo");
const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const login = require("./controllers/login");
const user = require("./controllers/users");
const post = require("./controllers/posts");
const comments = require("./controllers/comments");
const upload = require("./controllers/upload");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
	res.send("Hello from the root");
});
app.use("/login", login);
app.use("/user", user);
app.use("/posts", post);
app.use("/comments", comments);
app.use("/upload", upload);

app.get("/", (req, res) => {
	res.send("anything here");
});

const PORT = process.env.PORT_DEV || 3004;

const server = app.listen(PORT, () => {
	console.log(`Listen on http://localhost:${PORT}`);
});

module.exports = { app, server };