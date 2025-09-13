import bcrypt from "bcryptjs";

// * src/common/utils/password-handler.js
export const hashPassword = async (password) => {
	const salt = await bcrypt.genSalt(10);
	const hash = await bcrypt.hash(password, salt);
	return hash;
};

export const comparePassword = async (password, hash) => {
	const isMatch = await bcrypt.compare(password, hash);
	return isMatch;
};

// Hàm kiểm tra password có đáp ứng yêu cầu hay không
export const validatePasswordFormat = (password) => {
	const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]+$/;
	return password.length >= 8 && regex.test(password);
};

export const randomPassword = (length = 8) => {
	// Đảm bảo length tối thiểu là 8 để có đủ chỗ cho các loại ký tự bắt buộc
	if (length < 8) length = 8;

	const lowercase = "abcdefghijklmnopqrstuvwxyz";
	const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	const numbers = "0123456789";
	const specialChars = "@#$%&*";
	
	let password = "";
	let attempts = 0;
	const maxAttempts = 10;
	
	do {
		password = "";
		// Đảm bảo có ít nhất 1 ký tự từ mỗi loại
		password += lowercase[Math.floor(Math.random() * lowercase.length)];
		password += uppercase[Math.floor(Math.random() * uppercase.length)];
		password += numbers[Math.floor(Math.random() * numbers.length)];
		password += specialChars[Math.floor(Math.random() * specialChars.length)];
		
		// Điền phần còn lại với ký tự ngẫu nhiên từ tất cả loại
		const allChars = lowercase + uppercase + numbers + specialChars;
		for (let i = password.length; i < length; i++) {
			password += allChars[Math.floor(Math.random() * allChars.length)];
		}
		
		// Trộn lại các ký tự để không có pattern cố định
		password = password.split('').sort(() => Math.random() - 0.5).join('');
		attempts++;
	} while (!validatePasswordFormat(password) && attempts < maxAttempts);
	
	return password;
};