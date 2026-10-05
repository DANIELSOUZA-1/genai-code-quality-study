"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const custom_error_js_1 = require("./custom-error.js");
const getJwtSecret = () => {
    return process.env.JWT_SECRET || 'fallback_secret_key';
};
const generateToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, getJwtSecret(), {
        expiresIn: '24h',
    });
};
exports.generateToken = generateToken;
const verifyToken = (token) => {
    try {
        return jsonwebtoken_1.default.verify(token, getJwtSecret());
    }
    catch (error) {
        throw new custom_error_js_1.AppError('Token de autenticação inválido ou expirado', 401);
    }
};
exports.verifyToken = verifyToken;
