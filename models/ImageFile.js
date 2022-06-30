const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
		unique: true
	},
	img: {
		data: Buffer,
		contentType: String
	}
});

const ImageFile = mongoose.model("ImageFile", imageSchema);

module.exports = ImageFile;