"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_js_1 = require("../controllers/user.controller.js");
const auth_middleware_js_1 = require("../middlewares/auth.middleware.js");
const role_middleware_js_1 = require("../middlewares/role.middleware.js");
const router = (0, express_1.Router)();
const userController = new user_controller_js_1.UserController();
// Rota restrita apenas para administradores autenticados
router.get('/', auth_middleware_js_1.authMiddleware, (0, role_middleware_js_1.requireRole)(['ADMIN']), userController.getAllUsers);
exports.default = router;
