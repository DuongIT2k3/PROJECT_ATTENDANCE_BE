import nodemailer from "nodemailer";
import { createError } from "./create-error.js";
import { EMAIL_PASSWORD, EMAIL_USERNAME } from "../configs/environments.js";

const sendEmail = async (email, subject, options = {}) => {
	const { text, html } = options;

	const transporter = nodemailer.createTransport({
		service: "gmail",
		auth: {
			user: EMAIL_USERNAME,
			pass: EMAIL_PASSWORD,
		},
	});

	const mailOptions = {
		from: '"CodeFarm" <doanduong161@gmail.com>',
		to: email,
		subject: subject,
		text: text || "This email requires an HTML-compatible email client.",
		html: html || text,
	};

	try {
		await transporter.sendMail(mailOptions);
	} catch (error) {
		throw createError(500, `Gửi email thất bại: ${error.message}`);
	}
};

export default sendEmail;