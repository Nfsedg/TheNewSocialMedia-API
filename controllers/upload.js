const uploadRouter = require("express").Router();
const userExtractor = require("../middleware/userExtractor");
const User = require("../models/User");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const ImageFile = require("../models/ImageFile");

uploadRouter.get("/", userExtractor, async (req, res) => {
	const { userId } = req;

	try {
		const findUser = await User.findById(userId);
		const image = await ImageFile.findById(findUser.profileImage._id);
		// console.log(image.img.data.buffer);
	
		const thumb = new Buffer.from(image.img.data.buffer).toString("base64");
	
		res.status(200).json({
			contentType: image.img.contentType.split("/")[1],
			thumb: thumb
		});

	} catch (e) {
		console.log(e);
		res.status(400).json({error: e.message});
	}
});

uploadRouter.post("/", userExtractor, upload.single("image"), async (req, res) => {
	// fs.renameSync(req.file.path, req.file.path + "." + req.file.mimetype.split("/")[1]);
	const { userId } = req;

	
	try {
		const findUserId = await User.findById(userId);
	
		let payload = new ImageFile ({
			name: req.file.originalname,
			desc: "Profile Image",
			user: findUserId._id,
			img: {
				data: req.file.buffer,
				contentType: "image/" + req.file.mimetype.split("/")[1],
			}
		});

		const imageSaved = await payload.save();
		await User.updateOne({ id: userId }, {
			profileImage: imageSaved._id
		});
		res.json("Checked image");
	} catch (e) {
		console.log(e);
		res.status(400).json({error: e.message});
	}
});

uploadRouter.put("/", userExtractor, upload.single("image"), async (req, res) => {
	const { userId } = req;

	try {
		const findUser = await User.findById(userId);
		await ImageFile.updateOne({id: findUser.profileImage._id}, {
			img: {
				data: req.file.buffer,
				contentType: "image/" + req.file.mimetype.split("/")[1],
			}
		});

		res.status(202).json({ message: "Image updated" });

	} catch (e) {
		console.log(e);
		res.status(400).json({error: e.message});
	}
});

module.exports = uploadRouter;
