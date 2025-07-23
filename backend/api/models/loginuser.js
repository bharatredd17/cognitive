const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

const loginuserSchema = new mongoose.Schema({
	name: { type: String, required: true },
	
	email: { type: String, required: true },
	password: { type: String, required: true },
});

loginuserSchema.methods.generateAuthToken = function () {
	const token = jwt.sign({ _id: this._id }, "jJPh462VRjobOmXgzElwt2t7pYiq7zCm", {
		expiresIn: "1d",
	});
	return token;
};

const loginUser = mongoose.model("loginuser", loginuserSchema);

const validate = (data) => {
	const schema = Joi.object({
		name: Joi.string().required().label("Name"),
		email: Joi.string().email().required().label("Email"),
		password: passwordComplexity().required().label("Password"),
	});
	return schema.validate(data);
};

module.exports = { loginUser, validate };