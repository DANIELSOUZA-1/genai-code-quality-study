"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
const custom_error_js_1 = require("../utils/custom-error.js");
const errorMiddleware = (error, _req, res, _next) => {
    if (error instanceof custom_error_js_1.AppError) {
        res.status(error.statusCode).json({
            status: 'error',
            message: error.message,
        });
        return;
    }
    console.error('Erro interno não tratado:', error);
    res.status(500).json({
        status: 'error',
        message: 'Erro interno do servidor',
    });
};
exports.errorMiddleware = errorMiddleware;
