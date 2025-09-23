const MESSAGES = {
	LOGIN_SUCCESS: "Đăng nhập thành công",
	LOGOUT_SUCCESS: "Đăng xuất thành công",
	REGISTER_SUCCESS: "Đăng ký thành công",
	LOGIN_FAILED: "Đăng nhập thất bại, vui lòng kiểm tra lại thông tin",
	UNAUTHORIZED: "Bạn cần đăng nhập để thực hiện hành động này",
	INVALID_TOKEN: "Token không hợp lệ hoặc đã hết hạn",
	EMAIL_NOT_VERIFIED: "Email chưa được xác minh",
	EMAIL_VERIFIED: "Email đã được xác minh",
	PASSWORD_RESET_SUCCESS: "Đặt lại mật khẩu thành công",
	PASSWORD_RESET_FAILED: "Đặt lại mật khẩu thất bại, vui lòng thử lại",
	PASSWORD_CHANGE_SUCCESS: "Đổi mật khẩu thành công",
	PASSWORD_CHANGE_FAILED: "Đổi mật khẩu thất bại, vui lòng thử lại",
	EMAIL_ALREADY_EXISTS: "Email đã được sử dụng",
	USERNAME_ALREADY_EXISTS: "Tên người dùng đã được sử dụng",
	INVALID_EMAIL: "Email không hợp lệ",
	INVALID_PASSWORD: "Mật khẩu không hợp lệ",
	ACCOUNT_BLOCKED: "Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên.",
	AUTH_ACCOUNT_INACTIVE: "Tài khoản của bạn chưa được kích hoạt hoặc đã bị vô hiệu hóa",
	ACCESS_DENIED: "Bạn không có quyền truy cập vào tài nguyên này",
	NOT_AUTHENTICATED: "Bạn chưa đăng nhập",
	FORBIDDEN: "Bạn không có quyền thực hiện hành động này",
	NO_REFRESH_TOKEN: "Không có refresh token",
	INVALID_REFRESH_TOKEN: "Refresh token đã hết hạn hoặc không hợp lệ",
	SEND_SUCCESS: "Gửi email thành công, vui lòng kiểm tra hộp thư đến",
	SEND_MAIL_FAIL: "Gửi email thất bại, vui lòng kiểm tra lại!",
};

Object.freeze(MESSAGES);

export default MESSAGES;