import { createError } from "../utils/create-error.js";

const validBodyRequest = (schema) => (req, res, next) => {
	try {
		const data = schema.parse(req.body);
		req.body = data;
		next();
	} catch (error) {
		if (error.issues && Array.isArray(error.issues)) {
			const allMessages = error.issues.map((err) => err.path[0] + ": " + err.message).join("; ");
			return next(createError(400, allMessages));
		}
		return next(createError(400, "Invalid request"));
	}
};

export default validBodyRequest;