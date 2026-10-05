"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_js_1 = require("../services/auth.service.js");
class AuthController {
    authService;
    constructor() {
        this.authService = new auth_service_js_1.AuthService();
    }
    register = async (req, res, next) => {
        try {
            const user = await this.authService.register(req.body);
            res.status(201).json({
                message: 'Usuário cadastrado com sucesso',
                user,
            });
        }
        catch (error) {
            next(error);
        }
    };
    login = async (req, res, next) => {
        try {
            const { email, password } = req.body;
            const result = await this.authService.login(email, password);
            res.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    };
}
exports.AuthController = AuthController;
