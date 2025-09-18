import User from "./user.model.js";
import MESSAGES from "./user.message.js";
import { queryBuilder } from "../../common/utils/query-builder.js";
import {
  randomPassword,
  hashPassword,
} from "../../common/utils/password-handler.js";
import {
  generateStudentId,
  generateTeacherId,
  generateUsername,
} from "../../common/utils/code-generator.js";
import { createError } from "../../common/utils/create-error.js";
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
  if (userData.role === "student" || !userData.role) {
    userData.studentId = await generateStudentId();
  } else{
    userData.studentId = await generateTeacherId();
  }
  const plainPassword = randomPassword();
  const hashedPassword = await hashPassword(plainPassword);
  userData.password = hashedPassword;

  const newUser = await User.create(userData);
  const userResponse = newUser.toObject();
  delete userResponse.password;
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