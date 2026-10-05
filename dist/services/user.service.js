"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const user_repository_js_1 = require("../repositories/user.repository.js");
class UserService {
    userRepository;
    constructor() {
        this.userRepository = new user_repository_js_1.UserRepository();
    }
    async getAllUsers() {
        return this.userRepository.findAll();
    }
}
exports.UserService = UserService;
