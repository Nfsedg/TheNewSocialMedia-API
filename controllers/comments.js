const commentsRouters = require("express").Router();
const userExtractor = require("../middleware/userExtractor");
const User = require("../models/User");
const Comment = require("../models/Comment");
const Post = require("../models/Post");

commentsRouters.get("/:id", async (req, res) => {
	const {id} = req.params;
	try {
		const comments = await Comment.find({
			post: id
		});
		res.send(comments);
	} catch (e) {
		console.error(e.message);
		res.status(404).end();
	}
});

commentsRouters.post("/", userExtractor, async (req, res) => {
	const { userId } = req;
	const { content, postId } = req.body;

	
	try {
		const findUser = await User.findById(userId);
		const findPost = await Post.findById(postId);
	
		let newComment;
	
		if(findUser && findPost) {
			newComment = new Comment({
				user: findUser._id,
				post: findPost._id,
				content,
			});
		} else {
			console.error("Information did not found");
		}

		await newComment.save();

		findPost.comments = findPost.comments.concat(newComment._id);
		await Post.updateOne({_id: findPost._id}, {
			comments: findPost.comments
		});

		res.status(201).send(newComment);        
	} catch(e) {
		console.error(e);
		res.status(404).end();
	}

});

module.exports = commentsRouters;