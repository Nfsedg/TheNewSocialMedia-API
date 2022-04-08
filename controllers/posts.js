const postRouter = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");
const userExtractor = require("../middleware/userExtractor");

postRouter.get("/", async (req, res) => {
	const allPost = await Post.find({}).populate("user", {
		name: 1,
		username: 1
	});

	res.send(allPost);
});
postRouter.get("/:username", async (req, res) => {
	const { username } = req.params;
	const user = await User.findOne({username});

	const allPost = await Post.findById(user.posts);

	res.send(allPost);
});

postRouter.post("/", userExtractor, async (req, res) => {
	const { content } = req.body;
	const { userId } = req;

	try {
		const searchUser = await User.findById(userId);
		
		const newNote = new Post({
			content: content,
			user: searchUser._id,
			date: new Date()
		}); 
    
		await newNote.save();

		searchUser.posts = searchUser.posts.concat(newNote._id);
		await User.updateOne({ _id: searchUser._id }, {
			posts: searchUser.post
		});
    
		res.status(201).send(newNote);
	} catch(e) {
		console.error(e.message);
		res.status(404).end();
	}

	
});

postRouter.delete("/:postId", userExtractor, async (req, res) => {
	const { postId } = req.params;
	const { userId } = req;
	
	try {
		const searchUser = await User.findById(userId);
		const findPost = searchUser.posts.find(p => p === postId);
		const indexOfPost = searchUser.posts.indexOf(findPost);

		const updatedPosts = [...searchUser.posts];
		updatedPosts.splice(indexOfPost, 1);

		await Post.findByIdAndDelete(postId);
		await User.updateOne({ _id: searchUser._id }, {
			posts: updatedPosts
		});

		res.status(204).end();
		
	} catch (e) {
		console.error(e);
	}
});

module.exports = postRouter;