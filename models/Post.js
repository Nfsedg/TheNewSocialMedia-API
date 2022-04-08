const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
	content: {
		type: String,
		required: true,
	},
	date: Date,
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true
	},
	comments: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Comment"
	}]
});

postSchema.set("toJSON", {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id;

		delete returnedObject._id;
		delete returnedObject.__v;
	}
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;