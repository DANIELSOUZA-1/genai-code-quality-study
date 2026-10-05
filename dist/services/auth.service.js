"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_repository_js_1 = require("../repositories/user.repository.js");
const custom_error_js_1 = require("../utils/custom-error.js");
const jwt_js_1 = require("../utils/jwt.js");
class AuthService {
    userRepository;
    constructor() {
        this.userRepository = new user_repository_js_1.UserRepository();
    }
    async register(userData) {
        const existingUser = await this.userRepository.findByEmail(userData.email);
        if (existingUser) {
            throw new custom_error_js_1.AppError('Este endereço de e-mail já está cadastrado', 409);
        }
        const hashedPassword = await bcryptjs_1.default.hash(userData.password, 10);
        const user = await this.userRepository.create({
            ...userData,
            password: hashedPassword,
        });
        return user;
    }
    async login(email, password) {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new custom_error_js_1.AppError('Credenciais inválidas', 401);
        }
        const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            throw new custom_error_js_1.AppError('Credenciais inválidas', 401);
        }
        const token = (0, jwt_js_1.generateToken)({
            id: user.id,
            email: user.email,
            role: user.role,
        });
        const userResponse = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            created_at: user.created_at,
        };
        return {
            user: userResponse,
            token,
        };
    }
}
exports.AuthService = AuthService;
