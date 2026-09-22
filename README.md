Experimental study on the structural quality, maintainability, modularity, and security of AI-generated code, using static analysis metrics and refactoring techniques.

Este repositório contém os artefatos de um estudo experimental sobre a qualidade de código produzido com auxílio de Inteligência Artificial Generativa. O projeto avalia aspectos relacionados à qualidade estrutural, manutenibilidade, modularidade e segurança por meio de métricas de análise estática. Os códigos gerados são analisados inicialmente, submetidos a técnicas de refatoração e posteriormente reavaliados, permitindo comparar quantitativamente os indicadores antes e depois das intervenções. O experimento utiliza uma API REST com autenticação e controle de acesso como ambiente controlado de avaliação.

---

# API REST de Gerenciamento de Tarefas

API REST completa desenvolvida em **Node.js**, **Express**, **TypeScript** e **SQLite** para gerenciamento de tarefas com suporte a autenticação JWT, controle de acesso baseado em funções (RBAC com perfis `USER` e `ADMIN`) e validação de esquemas de dados com **Zod**.

---

## 🛠️ Tecnologias Utilizadas

- **Linguagem**: TypeScript
- **Runtime / Framework**: Node.js & Express
- **Banco de Dados**: SQLite (utilizando `sqlite3` e wrapper `sqlite`)
- **Autenticação**: JSON Web Token (`jsonwebtoken`) e Criptografia de Senhas (`bcryptjs`)
- **Validação de Dados**: Zod
- **Execução em Desenvolvimento**: `tsx`

---

## 📁 Estrutura de Pastas

```text
genai-code-quality-study/
├── package.json
├── tsconfig.json
├── .env.example
├── .env
├── README.md
└── src/
    ├── @types/
    │   └── express.d.ts             # Injeção de tipos customizados no Express (req.user)
    ├── config/
    │   └── database.ts              # Conexão SQLite e criação automática de tabelas
    ├── controllers/
    │   ├── auth.controller.ts       # Controle de cadastro e login
    │   ├── user.controller.ts       # Controle de gerenciamento de usuários (ADMIN)
    │   └── task.controller.ts       # Controle CRUD de tarefas
    ├── middlewares/
    │   ├── auth.middleware.ts       # Middleware de validação do Token JWT
    │   ├── role.middleware.ts       # Middleware de autorização por papel (USER/ADMIN)
    │   ├── validate.middleware.ts   # Middleware de validação Zod
    │   └── error.middleware.ts      # Middleware global de captura e resposta de erros HTTP
    ├── models/
    │   ├── user.model.ts            # Interfaces e DTOs de Usuário
    │   └── task.model.ts            # Interfaces e DTOs de Tarefa
    ├── repositories/
    │   ├── user.repository.ts       # Abstração de queries SQL de Usuários
    │   └── task.repository.ts       # Abstração de queries SQL de Tarefas
    ├── routes/
    │   ├── auth.routes.ts           # Rotas /api/auth
    │   ├── user.routes.ts           # Rotas /api/users
    │   ├── task.routes.ts           # Rotas /api/tasks
    │   └── index.ts                 # Roteador centralizador
    ├── schemas/
    │   ├── auth.schema.ts           # Schemas de validação Zod (register, login)
    │   └── task.schema.ts           # Schemas de validação Zod (tarefas)
    ├── services/
    │   ├── auth.service.ts          # Regras de negócio de cadastro e login
    │   ├── user.service.ts          # Regras de negócio de usuários
    │   └── task.service.ts          # Regras de negócio de tarefas e permissões
    ├── utils/
    │   ├── custom-error.ts          # Classe de erros customizados (AppError)
    │   └── jwt.ts                   # Utilitário para assinar e verificar JWT
    ├── app.ts                       # Configuração do app Express
    └── server.ts                    # Inicialização do servidor e banco de dados
```

---

## ⚙️ Instruções de Instalação e Execução

### 1. Pré-requisitos

Certifique-se de ter o [Node.js](https://nodejs.org/) (versão 18+ recomendada) e o `npm` instalados em sua máquina.

### 2. Instalação das Dependências

No terminal, navegue até a pasta raiz do projeto e execute:

```bash
npm install
```

### 3. Configuração de Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto (ou copie do `.env.example`):

```bash
cp .env.example .env
```

Conteúdo do `.env`:

```env
PORT=3000
JWT_SECRET=super_secret_jwt_key_change_in_production_12345
DATABASE_FILE=./database.sqlite
```

### 4. Inicialização do Projeto

#### Modo de Desenvolvimento:

Para iniciar o servidor em modo de desenvolvimento com recarregamento automático (hot-reload):

```bash
npm run dev
```

#### Modo de Produção:

Para compilar o código TypeScript em JavaScript e executar o servidor em produção:

```bash
npm run build
npm start
```

Ao iniciar, as tabelas `users` e `tasks` serão automaticamente criadas no arquivo SQLite configurado.

---

## 🔒 Regras de Negócio e Acesso (RBAC)

1. **Tipos de Usuário**:
   - `USER`: Usuário comum. Pode criar, visualizar, editar e excluir **apenas as suas próprias tarefas**.
   - `ADMIN`: Administrador. Pode consultar **todos os usuários cadastrados** e **todas as tarefas existentes no sistema**, além de gerenciar tarefas.

2. **Segurança de Tarefas**:
   - Um usuário com perfil `USER` receberá código HTTP `403 Forbidden` caso tente acessar, alterar ou excluir a tarefa pertencente a outro usuário.

---

## 📌 Documentação dos Endpoints

### Base URL: `http://localhost:3000/api`

### 1. Autenticação

#### 🔹 Cadastro de Usuário

- **POST** `/auth/register`
- **Acesso**: Público
- **Body**:
  ```json
  {
    "name": "Maria Silva",
    "email": "maria@example.com",
    "password": "senhaSegura123",
    "role": "USER"
  }
  ```
  _(Nota: O campo `role` é opcional e assume `"USER"` por padrão. Passe `"ADMIN"` para criar um usuário administrador)._
- **Resposta Sucesso (201 Created)**:
  ```json
  {
    "message": "Usuário cadastrado com sucesso",
    "user": {
      "id": 1,
      "name": "Maria Silva",
      "email": "maria@example.com",
      "role": "USER",
      "created_at": "2026-09-22 14:00:00"
    }
  }
  ```

#### 🔹 Login

- **POST** `/auth/login`
- **Acesso**: Público
- **Body**:
  ```json
  {
    "email": "maria@example.com",
    "password": "senhaSegura123"
  }
  ```
- **Resposta Sucesso (200 OK)**:
  ```json
  {
    "user": {
      "id": 1,
      "name": "Maria Silva",
      "email": "maria@example.com",
      "role": "USER",
      "created_at": "2026-09-22 14:00:00"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```

---

### 2. Usuários (Apenas Administradores)

#### 🔹 Listar Todos os Usuários

- **GET** `/users`
- **Acesso**: Requer autenticação + perfil `ADMIN`
- **Header**: `Authorization: Bearer <TOKEN_JWT>`
- **Resposta Sucesso (200 OK)**:
  ```json
  [
    {
      "id": 1,
      "name": "Maria Silva",
      "email": "maria@example.com",
      "role": "USER",
      "created_at": "2026-09-22 14:00:00"
    },
    {
      "id": 2,
      "name": "Admin Sistema",
      "email": "admin@example.com",
      "role": "ADMIN",
      "created_at": "2026-09-22 14:05:00"
    }
  ]
  ```

---

### 3. Tarefas

#### 🔹 Criar Tarefa

- **POST** `/tasks`
- **Acesso**: Requer Autenticação (`USER` ou `ADMIN`)
- **Header**: `Authorization: Bearer <TOKEN_JWT>`
- **Body**:
  ```json
  {
    "title": "Estudar TypeScript e SQLite",
    "description": "Desenvolver a API de tarefas em Node.js",
    "status": "PENDING"
  }
  ```
  _(Status válidos: `"PENDING"`, `"IN_PROGRESS"`, `"COMPLETED"`. Padrão: `"PENDING"`)._
- **Resposta Sucesso (201 Created)**:
  ```json
  {
    "message": "Tarefa criada com sucesso",
    "task": {
      "id": 1,
      "title": "Estudar TypeScript e SQLite",
      "description": "Desenvolver a API de tarefas em Node.js",
      "status": "PENDING",
      "created_at": "2026-09-22 14:10:00",
      "user_id": 1
    }
  }
  ```

#### 🔹 Listar Tarefas

- **GET** `/tasks`
- **Acesso**: Requer Autenticação
- **Header**: `Authorization: Bearer <TOKEN_JWT>`
- **Comportamento**:
  - Usuário `USER`: Retorna **apenas** as tarefas criadas pelo próprio usuário.
  - Usuário `ADMIN`: Retorna **todas** as tarefas do sistema.
- **Resposta Sucesso (200 OK)**:
  ```json
  [
    {
      "id": 1,
      "title": "Estudar TypeScript e SQLite",
      "description": "Desenvolver a API de tarefas em Node.js",
      "status": "PENDING",
      "created_at": "2026-09-22 14:10:00",
      "user_id": 1
    }
  ]
  ```

#### 🔹 Obter Tarefa por ID

- **GET** `/tasks/:id`
- **Acesso**: Requer Autenticação
- **Header**: `Authorization: Bearer <TOKEN_JWT>`
- **Resposta Sucesso (200 OK)**:
  ```json
  {
    "id": 1,
    "title": "Estudar TypeScript e SQLite",
    "description": "Desenvolver a API de tarefas em Node.js",
    "status": "PENDING",
    "created_at": "2026-09-22 14:10:00",
    "user_id": 1
  }
  ```

#### 🔹 Atualizar Tarefa

- **PUT** `/tasks/:id`
- **Acesso**: Requer Autenticação
- **Header**: `Authorization: Bearer <TOKEN_JWT>`
- **Body**:
  ```json
  {
    "title": "Estudar TypeScript e SQLite (Concluído)",
    "status": "COMPLETED"
  }
  ```
- **Resposta Sucesso (200 OK)**:
  ```json
  {
    "message": "Tarefa atualizada com sucesso",
    "task": {
      "id": 1,
      "title": "Estudar TypeScript e SQLite (Concluído)",
      "description": "Desenvolver a API de tarefas em Node.js",
      "status": "COMPLETED",
      "created_at": "2026-09-22 14:10:00",
      "user_id": 1
    }
  }
  ```

#### 🔹 Excluir Tarefa

- **DELETE** `/tasks/:id`
- **Acesso**: Requer Autenticação
- **Header**: `Authorization: Bearer <TOKEN_JWT>`
- **Resposta Sucesso (200 OK)**:
  ```json
  {
    "message": "Tarefa excluída com sucesso"
  }
  ```

---

## 🚦 Códigos de Resposta HTTP Utilizados

- **`200 OK`**: Operação realizada com sucesso.
- **`201 Created`**: Recurso criado com sucesso (usuário registrado ou tarefa criada).
- **`400 Bad Request`**: Dados de requisição inválidos (falha na validação Zod ou campos incorretos).
- **`401 Unauthorized`**: Token JWT ausente, expirado ou credenciais de login inválidas.
- **`403 Forbidden`**: Tentativa de acesso a recursos não permitidos (ex: `USER` acessando rotas `ADMIN` ou tarefas de outros usuários).
- **`404 Not Found`**: Rota ou recurso (tarefa) não encontrado.
- **`409 Conflict`**: Tentativa de cadastro de e-mail já existente.
- **`500 Internal Server Error`**: Erro inesperado do servidor.
