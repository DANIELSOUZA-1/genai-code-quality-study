"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const index_js_1 = __importDefault(require("./routes/index.js"));
const error_middleware_js_1 = require("./middlewares/error.middleware.js");
const app = (0, express_1.default)();
// Middlewares globais
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Rota de Healthcheck
app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date() });
});
// Rotas da API
app.use('/api', index_js_1.default);
// Tratamento de rotas inexistentes (404)
app.use((_req, res) => {
    res.status(404).json({
        status: 'error',
        message: 'Rota não encontrada',
    });
});
// Middleware global de erros
app.use(error_middleware_js_1.errorMiddleware);
exports.default = app;
