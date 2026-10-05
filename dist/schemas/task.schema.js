"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskIdParamSchema = exports.updateTaskSchema = exports.createTaskSchema = void 0;
const zod_1 = require("zod");
exports.createTaskSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string({
            required_error: 'Título é obrigatório',
        }).min(1, 'Título não pode ser vazio'),
        description: zod_1.z.string({
            required_error: 'Descrição é obrigatória',
        }),
        status: zod_1.z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED'], {
            invalid_type_error: 'Status deve ser PENDING, IN_PROGRESS ou COMPLETED',
        }).optional(),
    }),
});
exports.updateTaskSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().regex(/^\d+$/, 'O ID da tarefa deve ser um número inteiro'),
    }),
    body: zod_1.z.object({
        title: zod_1.z.string().min(1, 'Título não pode ser vazio').optional(),
        description: zod_1.z.string().optional(),
        status: zod_1.z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED'], {
            invalid_type_error: 'Status deve ser PENDING, IN_PROGRESS ou COMPLETED',
        }).optional(),
    }).refine((data) => Object.keys(data).length > 0, {
        message: 'Forneça pelo menos um campo para atualização (title, description ou status)',
    }),
});
exports.taskIdParamSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().regex(/^\d+$/, 'O ID da tarefa deve ser um número inteiro'),
    }),
});
