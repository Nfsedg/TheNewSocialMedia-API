require("dotenv").config();
const mongoose = require("mongoose");

const contectionString = process.env.NODE_ENV === "test"
	? process.env.MONGODB_DEV
	: process.env.MONGODB_PROD;

mongoose.connect(contectionString).then(() => {
	console.log("Database successful conected");
}).catch(err => {
	console.error(err);
	mongoose.disconnect();
});