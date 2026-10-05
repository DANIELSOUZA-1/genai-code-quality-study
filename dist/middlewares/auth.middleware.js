"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jwt_js_1 = require("../utils/jwt.js");
const custom_error_js_1 = require("../utils/custom-error.js");
const authMiddleware = (req, _res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new custom_error_js_1.AppError('Não autorizado. Token de acesso ausente ou malformatado', 401);
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = (0, jwt_js_1.verifyToken)(token);
        req.user = decoded;
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.authMiddleware = authMiddleware;
