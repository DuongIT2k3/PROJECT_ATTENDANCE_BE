export const createError = (statusCode, message) => {
	const error = new Error(message || "Internal Server Error");
	error.statusCode = statusCode || 500;
	return error;
};

export const throwError = (status, message) => {
	throw createError(status, message);
};