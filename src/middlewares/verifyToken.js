// src/middlewares/verifyToken.js
// Middleware de autenticação JWT
// Bloqueia qualquer rota protegida que não envie um Bearer Token válido.
const jwt = require('jsonwebtoken');
require('dotenv').config();

function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];

  // O header deve ser: Authorization: Bearer <token>
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      erro: 'Acesso negado. Token não fornecido.',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded; // injeta os dados do usuário na requisição
    next();
  } catch (err) {
    return res.status(403).json({
      erro: 'Token inválido ou expirado. Faça login novamente.',
    });
  }
}

module.exports = verifyToken;
