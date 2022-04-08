const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/User");

usersRouter.get("/", async (req, res) => {
	const auth = req.headers.authorization;
	let token;
	if(auth && auth.toLocaleLowerCase().startsWith("bearer")) {
		token = auth.substring(7);
	} else {
		res.status("401").json({ error: "invalid or missing token" });
	}
	const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

	const user = await User.findById(decodedToken.id);
	res.send(user);
});

usersRouter.post("/", async (req, res) => {
	const { body } = req;
	const { username, name, password } = body;

	if(!username || !name || !password) {
		res.status(400).json({
			error: "Invalid information",
		});
	} else {
		const saltRounds = 10;
		const passwordHash = await bcrypt.hash(password, saltRounds);
		const user = new User({
			username,
			name,
			passwordHash,
			posts: []
		});
	
		const saveUser = await user.save();
		const userForToken = {
			id: saveUser._id,
			username: saveUser.username
		};
		const token = jwt.sign(userForToken, process.env.JWT_SECRET);
	
		const data = {
			username: saveUser.username,
			name: saveUser.name,
			id: saveUser.id,
			token
		};
	
		res.status(201).send(data);
	}
	
});

module.exports = usersRouter;