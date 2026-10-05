"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({
            required_error: 'Nome é obrigatório',
        }).min(2, 'Nome deve ter pelo menos 2 caracteres'),
        email: zod_1.z.string({
            required_error: 'E-mail é obrigatório',
        }).email('Formato de e-mail inválido'),
        password: zod_1.z.string({
            required_error: 'Senha é obrigatória',
        }).min(6, 'A senha deve ter no mínimo 6 caracteres'),
        role: zod_1.z.enum(['USER', 'ADMIN'], {
            invalid_type_error: 'O papel deve ser USER ou ADMIN',
        }).optional(),
    }),
});
exports.loginSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string({
            required_error: 'E-mail é obrigatório',
        }).email('Formato de e-mail inválido'),
        password: zod_1.z.string({
            required_error: 'Senha é obrigatória',
        }).min(1, 'Informe a senha'),
    }),
});
