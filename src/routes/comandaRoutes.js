// src/routes/comandaRoutes.js
// Rotas PROTEGIDAS de Comandas — todas exigem token JWT válido
const { Router } = require('express');
const { body, param } = require('express-validator');
const {
  criarComanda,
  listarComandas,
  buscarComanda,
  atualizarStatus,
  cancelarComanda,
} = require('../controllers/comandaController');
const verifyToken = require('../middlewares/verifyToken');
const handleValidation = require('../middlewares/handleValidation');

const router = Router();

// Todos os endpoints abaixo exigem autenticação JWT
router.use(verifyToken);

// Validators para criação de comanda
const validarComanda = [
  body('numeroMesa')
    .notEmpty().withMessage('O número da mesa é obrigatório.')
    .isInt({ min: 1, max: 60 }).withMessage('A mesa deve ser um inteiro entre 1 e 60.'),
  body('itens')
    .notEmpty().withMessage('Os itens do pedido são obrigatórios.')
    .isArray({ min: 1 }).withMessage('Informe ao menos 1 item no pedido.')
    .custom((itens) => {
      for (const item of itens) {
        if (!item.nome || typeof item.nome !== 'string') throw new Error('Cada item deve ter um campo "nome" válido.');
        if (!item.quantidade || item.quantidade < 1) throw new Error('Cada item deve ter "quantidade" >= 1.');
        if (item.preco === undefined || item.preco <= 0) throw new Error('Cada item deve ter "preco" maior que zero.');
      }
      return true;
    }),
  body('valorTotal')
    .notEmpty().withMessage('O valor total é obrigatório.')
    .isFloat({ min: 0.01 }).withMessage('O valor total deve ser um decimal maior que zero.'),
  body('observacaoAlergia')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('A observação de alergia deve ter no máximo 500 caracteres.'),
];

// Validators para atualização de status
const validarStatus = [
  param('id')
    .isInt({ min: 1 }).withMessage('ID da comanda inválido.'),
  body('statusPreparo')
    .notEmpty().withMessage('O status é obrigatório.')
    .isIn(['PENDENTE', 'PREPARANDO', 'PRONTO', 'ENTREGUE'])
    .withMessage('Status deve ser: PENDENTE, PREPARANDO, PRONTO ou ENTREGUE.'),
];

// POST   /comandas
router.post('/', validarComanda, handleValidation, criarComanda);

// GET    /comandas
router.get('/', listarComandas);

// GET    /comandas/:id
router.get('/:id', buscarComanda);

// PATCH  /comandas/:id/status
router.patch('/:id/status', validarStatus, handleValidation, atualizarStatus);

// DELETE /comandas/:id
router.delete('/:id', cancelarComanda);

module.exports = router;
