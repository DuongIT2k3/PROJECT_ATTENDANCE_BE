import User from "./user.model.js";
import MESSAGES from "./user.message.js";
import { queryBuilder } from "../../common/utils/query-builder.js";
import {
  generateDefaultPassword,
  hashPassword,
} from "../../common/utils/password-handler.js";
import {
  generateStudentId,
  generateTeacherId,
  generateUsername,
} from "../../common/utils/code-generator.js";
import { createError } from "../../common/utils/create-error.js";
import sendEmail from "../../common/utils/send-email.js";
import mongoose from "mongoose";

export const updateUserRole = async (userId, updateData) => {
  const user = await User.findById(userId);
  if (!user) {
    throw createError(404, MESSAGES.USER_NOT_FOUND);
  }

  if (updateData.role === "superAdmin") {
    throw createError(400, MESSAGES.UNAUTHORIZED);
  }

  // Cập nhật các trường được cung cấp
  if (updateData.role) {
    user.role = updateData.role;
  }
  if (updateData.majorId) {
    user.majorId = updateData.majorId;
  }
  if (updateData.phone) {
    user.phone = updateData.phone;
  }
  
  user.updatedAt = new Date();
  return user.save();
};

export const blockUser = async (reqUserId, userId, isBlocked) => {
  if (reqUserId.toString() === userId) {
    throw createError(400, MESSAGES.CANNOT_BLOCK_YOUR_SELF);
  }
  const user = await User.findById(userId);
  if (!user) {
    throw createError(404, MESSAGES.USER_NOT_FOUND);
  }
  user.isBlocked = isBlocked;
  user.updatedAt = new Date();
  await user.save();
  return user;
};

export const getUserById = async (userId) => {
  const user = await User.findById(userId).select("-password");
  if (!user) {
    throw createError(404, MESSAGES.USER_NOT_FOUND);
  }
  return user;
};

export const updateProfile = async (userId, profileData) => {
  const user = await User.findById(userId);
  if (!user) {
    throw createError(404, MESSAGES.USER_NOT_FOUND);
  }
  if (profileData.email && profileData.email !== user.email) {
    const existingUser = await User.findOne({ email: profileData.email });
    if (existingUser) {
      throw createError(400, MESSAGES.EMAIL_ALREADY_EXISTS);
    }
  }
  user = {
    ...user.toObject(),
    ...profileData,
    updatedAt: new Date(),
  };
  return user.save();
};

export const createUser = async (userData) => {
  const existingEmail = await User.findOne({ email: userData.email });
  if (existingEmail) {
    throw createError(400, MESSAGES.EXISTING_EMAIL);
  }
  
  userData.username = await generateUsername(userData.fullname);
  
  let userCode;
  if (userData.role === "student" || !userData.role) {
    userCode = await generateStudentId();
    userData.studentId = userCode;
  } else {
    userCode = await generateTeacherId();
    userData.studentId = userCode;
  }
  
  const plainPassword = generateDefaultPassword(userCode);
  const hashedPassword = await hashPassword(plainPassword);
  userData.password = hashedPassword;

  const newUser = await User.create(userData);
  const userResponse = newUser.toObject();
  delete userResponse.password;
  

  try {
    const subject = "Thông tin tài khoản của bạn";
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333; text-align: center;">Chào mừng bạn đến với hệ thống điểm danh!</h2>
        
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #333; margin-top: 0;">Thông tin đăng nhập của bạn:</h3>
          <p><strong>Tên đăng nhập:</strong> ${userData.username}</p>
          <p><strong>Email:</strong> ${userData.email}</p>
          <p><strong>Mã sinh viên/giảng viên:</strong> ${userCode}</p>
          <p><strong>Mật khẩu:</strong> <span style="background-color: #e8f4fd; padding: 4px 8px; border-radius: 4px; font-family: monospace;">${plainPassword}</span></p>
        </div>
        
        <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 4px; padding: 15px; margin: 20px 0;">
          <p style="margin: 0; color: #856404;">
            <strong>⚠️ Lưu ý quan trọng:</strong><br>
            • Vui lòng đổi mật khẩu sau lần đăng nhập đầu tiên<br>
            • Không chia sẻ thông tin đăng nhập với người khác<br>
            • Liên hệ quản trị viên nếu bạn gặp vấn đề với tài khoản
          </p>
        </div>
        
        <p style="text-align: center; color: #666; font-size: 14px;">
          Cảm ơn bạn đã sử dụng hệ thống của chúng tôi!
        </p>
      </div>
    `;
    
    await sendEmail(userData.email, subject, { html });
  } catch (emailError) {
    console.error("Lỗi gửi email:", emailError);
    // Không throw error để không làm fail việc tạo user
  }

  userResponse.plainPassword = plainPassword;
  return userResponse;
};

export const getAllUsers = async (query) => {
  const { includeDeleted = false, ...queryParams } = query;
  const data = await queryBuilder(
    User,
    {
      ...queryParams,
      searchFields: ["fullname", "email", "username", "studentId"],
    },
    {
      populate: [{ path: "majorId", select: "name code" }],
    }
  );
  return data;
};