export const createResponse = (res, statusCode, message, data = null, meta = null) => {
	const response = {
		success: statusCode >= 200 && statusCode < 300,
		message,
		...(data && { data }),
		...(meta && { meta }),
	};
	return res.status(statusCode).json(response);
};