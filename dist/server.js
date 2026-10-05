"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const app_js_1 = __importDefault(require("./app.js"));
const database_js_1 = require("./config/database.js");
dotenv_1.default.config();
const PORT = process.env.PORT || 3000;
async function startServer() {
    try {
        await (0, database_js_1.initDatabase)();
        app_js_1.default.listen(PORT, () => {
            console.log(`Servidor rodando com sucesso na porta ${PORT}`);
            console.log(`URL base: http://localhost:${PORT}/api`);
        });
    }
    catch (error) {
        console.error('Falha ao inicializar a aplicação:', error);
        process.exit(1);
    }
}
startServer();
