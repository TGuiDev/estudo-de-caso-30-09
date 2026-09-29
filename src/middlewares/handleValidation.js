// src/middlewares/handleValidation.js
// Middleware auxiliar: verifica se a etapa de express-validator encontrou erros.
// Deve ser usado APÓS os validators de cada rota.
const { validationResult } = require('express-validator');

function handleValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      erro: 'Dados inválidos na requisição.',
      detalhes: errors.array().map((e) => ({
        campo: e.path,
        mensagem: e.msg,
      })),
    });
  }
  next();
}

module.exports = handleValidation;
