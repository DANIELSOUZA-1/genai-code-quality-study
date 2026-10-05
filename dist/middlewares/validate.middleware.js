"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const zod_1 = require("zod");
const custom_error_js_1 = require("../utils/custom-error.js");
const validate = (schema) => {
    return async (req, _res, next) => {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                const errorMessage = error.errors.map((err) => `${err.path.join('.')}: ${err.message}`).join(', ');
                next(new custom_error_js_1.AppError(`Erro de validação: ${errorMessage}`, 400));
            }
            else {
                next(error);
            }
        }
    };
};
exports.validate = validate;
