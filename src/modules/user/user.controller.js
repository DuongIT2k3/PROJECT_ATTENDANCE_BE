import { createResponse } from "../../common/utils/create-response.js";
import * as userService from "./user.service.js";
import MESSAGES from "./user.message.js";
import handleAsync from "../../common/utils/async-handler.js";

export const updateRole = handleAsync(async (req, res) => {
    const { userId } = req.params;
    const { role } = req.body;

    const updatedUser = await userService.updateUserRole(userId, role);
    return createResponse(res, 200, MESSAGES.UPDATE_USER_ROLE_SUCCESS, updatedUser);
})

export const blockUserController = handleAsync(async (req, res) => {
    const { userId } = req.params;
    const { isBlocked } = req.body;
    const reqUserId = req.user.id;
    const updatedUser = await userService.blockUser(reqUserId, userId, isBlocked);
    return createResponse(res, 200, `User ${isBlocked ? "blocked" : "unblocked"} successfully`, updatedUser);
});

export const getUser = handleAsync(async (req,res) => {
    const { userId} = req.params;
    const user = await userService.getUserById(userId);
    return createResponse(res, 200, MESSAGES.USER_RETRIEVED_SUCCESS, user);
});

export const getProfileController = handleAsync(async (req,res) => {
    const userId = req.user._id;
    const user = await userService.getUserById(userId);
    return createResponse(res, 200, MESSAGES.USER_RETRIEVED_SUCCESS, user);
});

export const updateProfileController = handleAsync(async (req, res) => {
    const userId = req.user._id;
    const profileData = req.body;
    const updatedUser = await userService.updateProfile(userId, profileData);
    return createResponse(res, 200, MESSAGES.UPDATE_USER_SUCCESS, updatedUser);
});

export const createUser = handleAsync(async(req,res) => {
    const data = await userService.createUser(req.body);
    return createResponse(res, 201, MESSAGES.CREATE_USER_SUCCESS, data);
});

export const getAllUsersController = handleAsync(async(req, res) => {
    const query = req.query;
    const users = await userService.getAllUsers(query);
    return createResponse(res, 200, MESSAGES.GET_SUCCESS, users.data, users.meta);
});