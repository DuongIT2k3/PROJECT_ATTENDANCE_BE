import User from "../../modules/user/user.model.js";

// * Hàm này tự sinh username theo định dạng: Tên cuối + Ký tự đầu của họ/tên đệm + Số thứ tự (3 chữ số)

// * Ví dụ: Nguyễn Văn A -> A + NV + 001 = ANV001
export const generateUsername = async (fullname) => {
	const parts = fullname
		.trim()
		.toLowerCase()
		.replace(/[^a-z\s]/g, "") // Loại bỏ ký tự không phải chữ cái và khoảng trắng
		.split(/\s+/);

	// Lấy tên chính (phần cuối) và các ký tự đầu của họ/tên đệm
	const lastName = parts[parts.length - 1]; // Tên người Việt thường ở cuối fullname
	const initials = parts
		.slice(0, -1) // Các phần họ/tên đệm
		.map((part) => part[0]) // Lấy ký tự đầu
		.join(""); // Ghép lại
	const prefix = `${lastName}${initials}`.slice(0, 20); // Giới hạn độ dài tối đa 20 ký tự

	// Tìm các username bắt đầu bằng prefix
	const regex = new RegExp(`^${prefix}\\d{0,3}$`);
	const existingUsers = await User.find({ username: regex }).select("username").lean().exec();

	//* Nếu không có username nào khớp, trả về prefix
	if (!existingUsers || existingUsers.length === 0) {
		return `${prefix}001`;
	}

	//* Lấy danh sách số thứ tự từ các username hiện có
	const sequenceNumbers = existingUsers
		.map((user) => {
			const match = user.username.match(/\d+$/);
			return match ? parseInt(match[0], 10) : 0;
		})
		.filter((num) => num >= 0);

	// Tìm số thứ tự lớn nhất và tăng lên 1
	const maxSequence = sequenceNumbers.length > 0 ? Math.max(...sequenceNumbers) : 0;
	const nextSequence = maxSequence + 1;

	// Kiểm tra giới hạn số thứ tự
	if (nextSequence > 999) {
		throw createError(400, "Đã đạt giới hạn số thứ tự cho username này");
	}

	// Định dạng số thứ tự (3 chữ số, nếu cần)
	const formattedSequence = nextSequence.toString().padStart(3, "0");
	return `${prefix}${formattedSequence}`;
};

//* Hàm này tự sinh studentId theo định dạng CFYYXXX
//* CF: prefix, YY: 2 chữ số cuối của năm hiện tại, XXX: 3 chữ số thứ tự từ 001 đến 999
export const generateStudentId = async () => {
	const currentYear = new Date().getFullYear().toString().slice(-2);
	const prefix = `CF${currentYear}`;

	const regex = new RegExp(`^${prefix}\\d{3}$`);
	const existingIds = await User.find({ studentId: regex }).select("studentId").lean().exec();

	if (!existingIds || existingIds.length === 0) {
		return `${prefix}001`;
	}

	// Lấy danh sách số thứ tự (XXX) từ các studentId
	const sequenceNumbers = existingIds.map((doc) => parseInt(doc.studentId.slice(-3), 10)).filter((num) => !isNaN(num));

	// Tìm số thứ tự lớn nhất và tăng lên 1
	const maxSequence = Math.max(...sequenceNumbers);
	const nextSequence = maxSequence + 1;

	// Kiểm tra nếu số thứ tự vượt quá 999
	if (nextSequence > 999) {
		throw createError(400, "Đã đạt giới hạn mã sinh viên cho năm hiện tại");
	}

	// Format số thứ tự thành chuỗi 3 chữ số
	const formattedSequence = nextSequence.toString().padStart(3, "0");

	return `${prefix}${formattedSequence}`;
};