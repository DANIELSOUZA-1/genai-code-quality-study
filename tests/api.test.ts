import request from 'supertest';
import app from '../src/app.js';
import { getDatabase, initDatabase } from '../src/config/database.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserRole } from '../src/models/user.model.js';

let db: any;

beforeAll(async () => {
  // Configurações críticas para o ambiente de testes
  process.env.DATABASE_FILE = './test.sqlite';
  process.env.JWT_SECRET = 'super-secret-key-for-testing';
  process.env.ALLOWED_ORIGINS = 'http://localhost:3000,http://test.com';
  
  await initDatabase();
  db = await getDatabase();
});

afterEach(async () => {
  if (db) {
    // Limpa os dados entre os testes para garantir o isolamento
    await db.exec('DELETE FROM tasks; DELETE FROM users;');
  }
});

describe('API Tests - GenAI Code Quality Study', () => {

  // Dados comuns para os testes
  const validUserPayload = {
    name: 'User Test',
    email: 'user@test.com',
    password: 'securepassword123', // 17 chars (válida)
  };

  const validAdminPayload = {
    name: 'Admin Test',
    email: 'admin@test.com',
    password: 'securepassword123',
  };

  const anotherUserPayload = {
    name: 'Another User',
    email: 'another@test.com',
    password: 'securepassword123',
  };

  const getValidTokenFor = async (email: string, id: number, role: any) => {
    return jwt.sign({ id, email, role }, process.env.JWT_SECRET!, { expiresIn: '1h' });
  };

  const insertUser = async (user: any, role: any) => {
    const hashed = await bcrypt.hash(user.password, 10);
    const result = await db.run(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [user.name, user.email, hashed, role]
    );
    return result.lastID;
  };

  const insertTask = async (title: string, userId: number) => {
    const result = await db.run(
      'INSERT INTO tasks (title, description, status, user_id) VALUES (?, ?, ?, ?)',
      [title, 'Desc', 'PENDING', userId]
    );
    return result.lastID;
  };

  describe('Grupo A — Funcionalidades e Isolamentos da Validação Original', () => {
    
    // 1. Cadastro válido de USER
    it('should register a valid USER successfully', async () => {
      const res = await request(app).post('/api/auth/register').send(validUserPayload);
      expect(res.status).toBe(201);
      expect(res.body.user).toHaveProperty('id');
      expect(res.body.user.role).toBe('USER');
    });

    // 2. Login válido
    it('should login with valid credentials and return a token', async () => {
      await insertUser(validUserPayload, 'USER');
      const res = await request(app).post('/api/auth/login').send({
        email: validUserPayload.email,
        password: validUserPayload.password,
      });
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user.role).toBe('USER');
    });

    // 3. Login inválido
    it('should reject login with invalid credentials', async () => {
      await insertUser(validUserPayload, 'USER');
      const res = await request(app).post('/api/auth/login').send({
        email: validUserPayload.email,
        password: 'wrongpassword', // Senha incorreta
      });
      expect(res.status).toBe(401);
    });

    // 4. Rota protegida sem autenticação
    it('should reject access to protected route without token', async () => {
      const res = await request(app).get('/api/tasks');
      expect(res.status).toBe(401);
    });

    // 5. Token inválido
    it('should reject access with an invalid token', async () => {
      const res = await request(app).get('/api/tasks').set('Authorization', 'Bearer invalid-token');
      expect(res.status).toBe(401);
    });

    // 6. Token expirado
    it('should reject access with an expired token', async () => {
      const expiredToken = jwt.sign(
        { id: 1, email: 'user@test.com', role: 'USER' },
        process.env.JWT_SECRET!,
        { expiresIn: '-1s' } // Já expirado
      );
      const res = await request(app).get('/api/tasks').set('Authorization', `Bearer ${expiredToken}`);
      expect(res.status).toBe(401);
    });

    // 7. Entrada inválida genérica
    it('should return 400 on generic invalid input data', async () => {
      const res = await request(app).post('/api/auth/register').send({
        email: 'not-an-email',
      });
      expect(res.status).toBe(400);
    });

    // 8. Criação de tarefa
    it('should create a task for the authenticated user', async () => {
      const userId = await insertUser(validUserPayload, 'USER');
      const token = await getValidTokenFor(validUserPayload.email, userId, 'USER');
      
      const res = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'My Task',
          description: 'A task description',
          status: 'PENDING'
        });
      expect(res.status).toBe(201);
      expect(res.body.task.title).toBe('My Task');
      expect(res.body.task.user_id).toBe(userId);
    });

    // 9. USER consulta própria tarefa
    it('should allow a USER to read their own task', async () => {
      const userId = await insertUser(validUserPayload, 'USER');
      const taskId = await insertTask('Own Task', userId);
      const token = await getValidTokenFor(validUserPayload.email, userId, 'USER');
      
      const res = await request(app)
        .get(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.id).toBe(taskId);
    });

    // 10. USER altera própria tarefa
    it('should allow a USER to update their own task', async () => {
      const userId = await insertUser(validUserPayload, 'USER');
      const taskId = await insertTask('Own Task', userId);
      const token = await getValidTokenFor(validUserPayload.email, userId, 'USER');
      
      const res = await request(app)
        .put(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ status: 'COMPLETED' });
      expect(res.status).toBe(200);
      expect(res.body.task.status).toBe('COMPLETED');
    });

    // 11. USER exclui própria tarefa
    it('should allow a USER to delete their own task', async () => {
      const userId = await insertUser(validUserPayload, 'USER');
      const taskId = await insertTask('Own Task', userId);
      const token = await getValidTokenFor(validUserPayload.email, userId, 'USER');
      
      const res = await request(app)
        .delete(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
    });

    // 12. USER consulta tarefa de 3º
    it("should prevent a USER from reading another user's task", async () => {
      const userId1 = await insertUser(validUserPayload, 'USER');
      const userId2 = await insertUser(anotherUserPayload, 'USER');
      const taskIdOther = await insertTask('Other Task', userId2);
      
      const token1 = await getValidTokenFor(validUserPayload.email, userId1, 'USER');
      const res = await request(app)
        .get(`/api/tasks/${taskIdOther}`)
        .set('Authorization', `Bearer ${token1}`);
      expect(res.status).toBe(403); // Bloqueio correto na validação
    });

    // 13. USER altera tarefa de 3º
    it("should prevent a USER from updating another user's task", async () => {
      const userId1 = await insertUser(validUserPayload, 'USER');
      const userId2 = await insertUser(anotherUserPayload, 'USER');
      const taskIdOther = await insertTask('Other Task', userId2);
      
      const token1 = await getValidTokenFor(validUserPayload.email, userId1, 'USER');
      const res = await request(app)
        .put(`/api/tasks/${taskIdOther}`)
        .set('Authorization', `Bearer ${token1}`)
        .send({ status: 'COMPLETED' });
      expect(res.status).toBe(403);
    });

    // 14. USER exclui tarefa de 3º
    it("should prevent a USER from deleting another user's task", async () => {
      const userId1 = await insertUser(validUserPayload, 'USER');
      const userId2 = await insertUser(anotherUserPayload, 'USER');
      const taskIdOther = await insertTask('Other Task', userId2);
      
      const token1 = await getValidTokenFor(validUserPayload.email, userId1, 'USER');
      const res = await request(app)
        .delete(`/api/tasks/${taskIdOther}`)
        .set('Authorization', `Bearer ${token1}`);
      expect(res.status).toBe(403);
    });

    // 15. USER acessa admin
    it('should prevent a USER from accessing administrative routes', async () => {
      const userId = await insertUser(validUserPayload, 'USER');
      const token = await getValidTokenFor(validUserPayload.email, userId, 'USER');
      
      const res = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(403);
    });

    // 16. ADMIN consulta usuários
    it('should allow ADMIN to list all users', async () => {
      const adminId = await insertUser(validAdminPayload, 'ADMIN');
      const token = await getValidTokenFor(validAdminPayload.email, adminId, 'ADMIN');
      
      const res = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    // 17. ADMIN consulta tarefas de 3º
    it('should allow ADMIN to read tasks from all users', async () => {
      const adminId = await insertUser(validAdminPayload, 'ADMIN');
      const userId = await insertUser(validUserPayload, 'USER');
      await insertTask('User Task', userId);
      
      const token = await getValidTokenFor(validAdminPayload.email, adminId, 'ADMIN');
      const res = await request(app)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(0);
    });

    // 18. Cadastro público de ADMIN
    it('should ignore ADMIN role payload and register as USER', async () => {
      const res = await request(app).post('/api/auth/register').send({
        ...validUserPayload,
        email: 'hacker@test.com',
        role: 'ADMIN' // Payload malicioso
      });
      // Verifica estado final que mitiga a falha detectada no TCC
      expect(res.status).toBe(201);
      expect(res.body.user.role).toBe('USER');
    });

    // 19. ADMIN altera tarefa de 3º
    it("should prevent ADMIN from updating another user's task", async () => {
      const adminId = await insertUser(validAdminPayload, 'ADMIN');
      const userId = await insertUser(anotherUserPayload, 'USER');
      const taskIdOther = await insertTask('Other Task', userId);
      
      const token = await getValidTokenFor(validAdminPayload.email, adminId, 'ADMIN');
      const res = await request(app)
        .put(`/api/tasks/${taskIdOther}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ status: 'COMPLETED' });
      
      // Verifica estado final onde ADMIN também é impedido de modificar tarefas de terceiros
      expect(res.status).toBe(403);
    });

    // 20. ADMIN exclui tarefa de 3º
    it("should prevent ADMIN from deleting another user's task", async () => {
      const adminId = await insertUser(validAdminPayload, 'ADMIN');
      const userId = await insertUser(anotherUserPayload, 'USER');
      const taskIdOther = await insertTask('Other Task', userId);
      
      const token = await getValidTokenFor(validAdminPayload.email, adminId, 'ADMIN');
      const res = await request(app)
        .delete(`/api/tasks/${taskIdOther}`)
        .set('Authorization', `Bearer ${token}`);
      
      // Verifica estado final onde ADMIN também é impedido de excluir tarefas de terceiros
      expect(res.status).toBe(403);
    });

  });

  describe('Grupo B — Correções de Segurança Posteriores', () => {

    // 21. Senha mín. 15 caracteres
    it('should enforce minimum 15 characters for passwords', async () => {
      const res = await request(app).post('/api/auth/register').send({
        ...validUserPayload,
        password: 'shortpassword', // 13 chars (< 15 chars)
      });
      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/mínimo/i);
    });

    // 22. Senha máx. limite bcrypt
    it('should enforce maximum 72 bytes limit for bcrypt passwords', async () => {
      const longPassword = 'a'.repeat(73); // 73 bytes
      const res = await request(app).post('/api/auth/register').send({
        ...validUserPayload,
        password: longPassword,
      });
      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/limite/i);
    });

    // 23. Rate Limit de login
    it('should block login after 10 attempts within windowMs', async () => {
      await insertUser(validUserPayload, 'USER');
      
      // Envia 10 requisições
      for (let i = 0; i < 10; i++) {
        await request(app).post('/api/auth/login').send({
          email: validUserPayload.email,
          password: validUserPayload.password,
        });
      }

      // 11ª requisição deve falhar com 429
      const res = await request(app).post('/api/auth/login').send({
        email: validUserPayload.email,
        password: validUserPayload.password,
      });
      
      expect(res.status).toBe(429);
    });

    // 24. JWT_SECRET obrigatório
    it('should throw an Error if JWT_SECRET is not set', async () => {
      const oldSecret = process.env.JWT_SECRET;
      delete process.env.JWT_SECRET;
      
      // A função utils/jwt lança throw new Error internamente se faltar
      const { generateToken } = await import('../src/utils/jwt.js');
      expect(() => generateToken({ id: 1, email: 'test@test.com', role: 'USER' }))
        .toThrow('JWT_SECRET environment variable is required');
      
      process.env.JWT_SECRET = oldSecret;
    });

    // 25. CORS restritivo
    it('should return 403 Forbidden for unauthorized CORS origins', async () => {
      const res = await request(app)
        .get('/api/health') // Rota livre de auth para testar apenas o CORS
        .set('Origin', 'http://malicious-site.com');
      
      expect(res.status).toBe(403);
      expect(res.body.message).toMatch(/CORS/i);
    });

    // 26. Ocultar X-Powered-By
    it('should not expose X-Powered-By header in HTTP responses', async () => {
      const res = await request(app).get('/api/health');
      expect(res.headers['x-powered-by']).toBeUndefined();
    });

  });

});
