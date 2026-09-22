import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Nome é obrigatório',
    }).min(2, 'Nome deve ter pelo menos 2 caracteres'),
    email: z.string({
      required_error: 'E-mail é obrigatório',
    }).email('Formato de e-mail inválido'),
    password: z.string({
      required_error: 'Senha é obrigatória',
    }).min(6, 'A senha deve ter no mínimo 6 caracteres'),
    role: z.enum(['USER', 'ADMIN'], {
      invalid_type_error: 'O papel deve ser USER ou ADMIN',
    }).optional(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string({
      required_error: 'E-mail é obrigatório',
    }).email('Formato de e-mail inválido'),
    password: z.string({
      required_error: 'Senha é obrigatória',
    }).min(1, 'Informe a senha'),
  }),
});
