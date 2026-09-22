import { z } from 'zod';

export const createTaskSchema = z.object({
  body: z.object({
    title: z.string({
      required_error: 'Título é obrigatório',
    }).min(1, 'Título não pode ser vazio'),
    description: z.string({
      required_error: 'Descrição é obrigatória',
    }),
    status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED'], {
      invalid_type_error: 'Status deve ser PENDING, IN_PROGRESS ou COMPLETED',
    }).optional(),
  }),
});

export const updateTaskSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'O ID da tarefa deve ser um número inteiro'),
  }),
  body: z.object({
    title: z.string().min(1, 'Título não pode ser vazio').optional(),
    description: z.string().optional(),
    status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED'], {
      invalid_type_error: 'Status deve ser PENDING, IN_PROGRESS ou COMPLETED',
    }).optional(),
  }).refine((data) => Object.keys(data).length > 0, {
    message: 'Forneça pelo menos um campo para atualização (title, description ou status)',
  }),
});

export const taskIdParamSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'O ID da tarefa deve ser um número inteiro'),
  }),
});
