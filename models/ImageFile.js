const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
	name: String,
	desc: String,
	img: {
		data: Buffer,
		contentType: String
	}
});

const ImageFile = mongoose.model("ImageFile", imageSchema);

module.exports = ImageFile;