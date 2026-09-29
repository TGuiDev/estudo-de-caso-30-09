// src/app.js
// Configuração central do Express
// Registra middlewares globais e todas as rotas da aplicação.
const express = require('express');
const cors = require('cors');
const app = express();

// Habilita CORS
app.use(cors());

// Permite receber e enviar JSON nas requisições
app.use(express.json());

// --- Rotas ---
const authRoutes = require('./routes/authRoutes');
const comandaRoutes = require('./routes/comandaRoutes');

// Rotas públicas (sem token)
app.use('/auth', authRoutes);

// Rotas protegidas (exigem Bearer Token)
app.use('/comandas', comandaRoutes);

// Rota raiz — health check
app.get('/', (req, res) => {
  res.json({
    sistema: 'KDS Restaurante — API',
    versao: '1.0.0',
    status: 'online',
  });
});

// Handler de rotas não encontradas
app.use((req, res) => {
  res.status(404).json({ erro: 'Rota não encontrada.' });
});

module.exports = app;
