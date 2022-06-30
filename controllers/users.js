const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/User");
const userExtractor = require("../middleware/userExtractor");

usersRouter.get("/", async (req, res) => {
	const auth = req.headers.authorization;

	try { 
		let token;
		if(auth && auth.toLocaleLowerCase().startsWith("bearer")) {
			token = auth.substring(7);
		} else {
			res.status("401").json({ error: "invalid or missing token" });
		}
		const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
	
		const user = await User.findById(decodedToken.id);
		res.send(user);
	} catch (e) {
		res.status(404).send(e.message);
	} 
});

usersRouter.post("/", async (req, res) => {
	const { body } = req;
	const { username, name, password } = body;

	try {
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
				bio: "",
				timestamps: new Date().getTime(),
				profileImage: undefined,
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
	} catch (e) {
		res.status(404).send(e.message);
	}

	
});

usersRouter.put("/", userExtractor, async (req, res) => {
	const { userId } = req;
	const { bio, name } = req.body;

	try {
		const updatedUser = await User.updateOne({id: userId}, {
			bio,
			name
		});
		res.status(204).send(updatedUser);
	} catch(e) {
		console.log(e);
		res.status(402).send(e);
	}
});

module.exports = usersRouter;