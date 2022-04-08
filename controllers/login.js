const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const loginrouter = require("express").Router();
const User = require("../models/User");

loginrouter.post("/", async (req, res) => {
	const { body } = req;
	const { username, password } = body;

	const user = await User.findOne({ username });

	const passwordCorrect = user === null
		? false
		: await bcrypt.compare(password, user.passwordHash);
	

	if(!(user && passwordCorrect)) {
		res.status(404).json({
			error: "Invalid information"
		});
	} else {
		const userForToken = {
			id: user._id,
			username: user.username
		};

		const token = jwt.sign(userForToken, process.env.JWT_SECRET);

		res.send({
			name: user.name,
			username: user.username,
			token
		});
	}
});

module.exports = loginrouter;