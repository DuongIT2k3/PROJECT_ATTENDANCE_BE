import { createError } from "./create-error.js";
import mongoose from "mongoose";

export const queryBuilder = async (Model, queryParams, options = {}) => {
  const {
    page = 1,
    limit = 10,
    sort = "createdAt",
    order = "desc",
    search,
    searchFields = [],
    isDeleted,
    ...filters
  } = queryParams;

  const { populate = [] } = options;

  // Xây dựng điều kiện truy vấn
  const queryConditions = {};

  // * Nếu không truyền isDeleted (undefined) thì lấy tất cả dữ liệu chưa xoá mềm và đã xoá mềm
  // * Nếu truyền isDeleted là false thì chỉ lấy dữ liệu chưa xoá mềm
  if (isDeleted === "false") {
    queryConditions.deletedAt = null;
  }

  //* Nếu truyền isDeleted là true thì chỉ lấy cả dữ liệu đã xoá mềm
  if (isDeleted === "true") {
    queryConditions.deletedAt = { $ne: null };
  }

  // Áp dụng bộ lọc từ query parameters
  Object.entries(filters).forEach(([key, value]) => {
    if (value == null || value === "") return;
    // Boolean
    if (value === "true" || value === "false") {
      queryConditions[key] = value === "true";
      return;
    }
    // Number
    if (
      typeof value === "string" &&
      value.trim() !== "" &&
      !isNaN(Number(value))
    ) {
      queryConditions[key] = Number(value);
      return;
    }
    // ObjectId
    if (mongoose.Types.ObjectId.isValid(value)) {
      queryConditions[key] = value;
      return;
    }
    // String → Regex
    if (typeof value === "string") {
      queryConditions[key] = { $regex: new RegExp(`^${value}$`, "i") };
      return;
    }
    // Fallback
    queryConditions[key] = value;
  });

  // Áp dụng tìm kiếm nếu có
  if (search && searchFields.length > 0) {
    const searchRegex = new RegExp(search, "i"); // Không phân biệt chữ hoa/thường
    queryConditions.$or = searchFields.map((field) => ({
      [field]: searchRegex,
    }));
  }

  // Tạo truy vấn Mongoose với các điều kiện
  let query = Model.find(queryConditions);

  // Áp dụng population nếu có
  if (populate.length > 0) {
    populate.forEach((pop) => {
      query = query.populate({
        path: pop.path,
        select: pop.select || "name", // Mặc định lấy trường name nếu không chỉ định select
      });
    });
  }

  // await Class.find({}).populate({path: "teacherId", select: "username fullname, email"}).populate({path: "majorId", select: "name code"}).populate({})

  // Áp dụng sắp xếp
  const sortOrder = order === "desc" ? -1 : 1;
  query = query.sort({ [sort]: sortOrder });

  // Áp dụng phân trang
  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const skip = (pageNum - 1) * limitNum;
  query = query.skip(skip).limit(limitNum);

  // Thực thi truy vấn
  const total = await Model.countDocuments(queryConditions);
  const data = await query.exec();

  if (!data || data.length === 0) {
    throw createError(404, "Not found");
  }

  return {
    data,
    meta: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    },
  };
};