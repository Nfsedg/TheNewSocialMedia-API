const uploadRouter = require("express").Router();
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const upload = multer({ dest: "static/images" });
const ImageFile = require("../models/ImageFile");
const {rootPath} = require("../config");

uploadRouter.get("/", async (req, res) => {
	const image = await ImageFile.find({});

	res.json(image).end();

	fs.readFile(image[0].img.data, (err, content) => {
		if(err) {
			res.writeHead(404, { "Content-type": "text/html" });
			res.end("Image don't find");
		} else {
			res.writeHead(200, { "Content-type": "image/*" });
			res.end(content);
		}
	});
});

uploadRouter.post("/", upload.single("image"), async (req, res) => {
	// fs.renameSync(req.file.path, req.file.path + "." + req.file.mimetype.split("/")[1]);
	let payload = new ImageFile ({
		name: "name",
		desc: "desc",
		img: {
			data: fs.readFileSync(path.join(rootPath + "/static/images/" + req.file.filename)),
			contentType: "image/*",
		}
	});
	try {
		await payload.save();
		res.json("Checked image");
	} catch (e) {
		console.log(e);
	}
});

module.exports = uploadRouter;