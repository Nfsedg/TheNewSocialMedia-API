const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		unique: true,
	},
	name: String,
	passwordHash: String,
	biography: String,
	timestamps: Number,
	profileImage: {
		type: mongoose.Schema.ObjectId,
		ref: "ImageFile",
		unique: true
	},
	posts: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Post"
	}]
});

userSchema.plugin(uniqueValidator);

const User = mongoose.model("User", userSchema);

module.exports = User;