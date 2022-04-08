const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
	content: {
		type: String,
		required: true
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true
	},
	post: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Post",
		required: true,
	}
});

commentSchema.set("toJSON", {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id;

		delete returnedObject._id;
		delete returnedObject.__v;
	}
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;