"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initDatabase = exports.getDatabase = void 0;
const sqlite3_1 = __importDefault(require("sqlite3"));
const sqlite_1 = require("sqlite");
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
let dbInstance = null;
const getDatabase = async () => {
    if (dbInstance) {
        return dbInstance;
    }
    const dbPath = process.env.DATABASE_FILE
        ? path_1.default.resolve(process.env.DATABASE_FILE)
        : path_1.default.resolve(__dirname, '../../database.sqlite');
    dbInstance = await (0, sqlite_1.open)({
        filename: dbPath,
        driver: sqlite3_1.default.Database,
    });
    await dbInstance.exec('PRAGMA foreign_keys = ON;');
    return dbInstance;
};
exports.getDatabase = getDatabase;
const initDatabase = async () => {
    const db = await (0, exports.getDatabase)();
    // Criar tabela de Usuários
    await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('USER', 'ADMIN')) DEFAULT 'USER',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
    // Criar tabela de Tarefas
    await db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      status TEXT NOT NULL CHECK(status IN ('PENDING', 'IN_PROGRESS', 'COMPLETED')) DEFAULT 'PENDING',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      user_id INTEGER NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    );
  `);
    console.log('Banco de dados SQLite inicializado com sucesso.');
};
exports.initDatabase = initDatabase;
