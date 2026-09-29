// src/routes/authRoutes.js
// Rotas PÚBLICAS de autenticação — não exigem token
const { Router } = require('express');
const { body } = require('express-validator');
const { cadastrar, login } = require('../controllers/authController');
const handleValidation = require('../middlewares/handleValidation');

const router = Router();

// Validators de cadastro
const validarCadastro = [
  body('nome')
    .trim()
    .notEmpty().withMessage('O nome é obrigatório.')
    .isLength({ max: 100 }).withMessage('O nome deve ter no máximo 100 caracteres.'),
  body('matricula')
    .trim()
    .notEmpty().withMessage('A matrícula é obrigatória.')
    .isLength({ max: 20 }).withMessage('A matrícula deve ter no máximo 20 caracteres.'),
  body('email')
    .trim()
    .notEmpty().withMessage('O e-mail é obrigatório.')
    .isEmail().withMessage('Informe um e-mail válido.')
    .normalizeEmail(),
  body('senha')
    .notEmpty().withMessage('A senha é obrigatória.')
    .isLength({ min: 6 }).withMessage('A senha deve ter no mínimo 6 caracteres.'),
  body('perfil')
    .optional()
    .isIn(['GARCOM', 'COZINHEIRO']).withMessage('Perfil deve ser GARCOM ou COZINHEIRO.'),
];

// Validators de login
const validarLogin = [
  body('email')
    .trim()
    .notEmpty().withMessage('O e-mail é obrigatório.')
    .isEmail().withMessage('Informe um e-mail válido.')
    .normalizeEmail(),
  body('senha')
    .notEmpty().withMessage('A senha é obrigatória.'),
];

// POST /auth/cadastro
router.post('/cadastro', validarCadastro, handleValidation, cadastrar);

// POST /auth/login
router.post('/login', validarLogin, handleValidation, login);

module.exports = router;
