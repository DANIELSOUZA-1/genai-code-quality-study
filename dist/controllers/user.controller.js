"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const user_service_js_1 = require("../services/user.service.js");
class UserController {
    userService;
    constructor() {
        this.userService = new user_service_js_1.UserService();
    }
    getAllUsers = async (_req, res, next) => {
        try {
            const users = await this.userService.getAllUsers();
            res.status(200).json(users);
        }
        catch (error) {
            next(error);
        }
    };
}
exports.UserController = UserController;
