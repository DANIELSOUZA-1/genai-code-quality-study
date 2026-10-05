"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = void 0;
const custom_error_js_1 = require("../utils/custom-error.js");
const requireRole = (allowedRoles) => {
    return (req, _res, next) => {
        if (!req.user) {
            throw new custom_error_js_1.AppError('Usuário não autenticado', 401);
        }
        if (!allowedRoles.includes(req.user.role)) {
            throw new custom_error_js_1.AppError('Acesso negado. Permissão insuficiente para realizar esta operação', 403);
        }
        next();
    };
};
exports.requireRole = requireRole;
