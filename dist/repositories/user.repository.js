"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const database_js_1 = require("../config/database.js");
class UserRepository {
    async create(userData) {
        const db = await (0, database_js_1.getDatabase)();
        const role = userData.role || 'USER';
        const result = await db.run(`INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`, [userData.name, userData.email, userData.password, role]);
        const userId = result.lastID;
        const user = await this.findById(userId);
        return user;
    }
    async findByEmail(email) {
        const db = await (0, database_js_1.getDatabase)();
        const user = await db.get(`SELECT * FROM users WHERE email = ?`, [email]);
        return user || null;
    }
    async findById(id) {
        const db = await (0, database_js_1.getDatabase)();
        const user = await db.get(`SELECT id, name, email, role, created_at FROM users WHERE id = ?`, [id]);
        return user || null;
    }
    async findAll() {
        const db = await (0, database_js_1.getDatabase)();
        const users = await db.all(`SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC`);
        return users;
    }
}
exports.UserRepository = UserRepository;
