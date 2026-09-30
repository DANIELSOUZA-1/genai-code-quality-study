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
    })
      .min(15, 'A senha deve ter no mínimo 15 caracteres')
      .refine(
        (password) => Buffer.byteLength(password, 'utf8') <= 72,
        { message: 'A senha excede o limite máximo suportado de 72 bytes' }
      ),
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
