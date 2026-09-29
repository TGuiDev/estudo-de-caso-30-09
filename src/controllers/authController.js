// src/controllers/authController.js
// Cadastro e Login de Usuários (Garçom / Cozinheiro)
// Usa bcryptjs para hash da senha e jsonwebtoken para emitir o token JWT.
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');
require('dotenv').config();

// POST /auth/cadastro — cria um novo usuário com senha criptografada
async function cadastrar(req, res) {
  try {
    const { nome, matricula, email, senha, perfil } = req.body;

    // Verifica se o email ou matrícula já estão cadastrados
    const existe = await Usuario.findOne({ where: { email } });
    if (existe) {
      return res.status(409).json({ erro: 'E-mail já cadastrado.' });
    }

    // Gera o hash bcrypt com custo 10 — protege contra ataques de força bruta
    const senhaHash = await bcrypt.hash(senha, 10);

    const novoUsuario = await Usuario.create({
      nome,
      matricula,
      email,
      senha: senhaHash, // NUNCA salvar a senha em texto puro
      perfil: perfil || 'GARCOM',
    });

    return res.status(201).json({
      mensagem: 'Usuário cadastrado com sucesso.',
      usuario: {
        id: novoUsuario.id,
        nome: novoUsuario.nome,
        matricula: novoUsuario.matricula,
        email: novoUsuario.email,
        perfil: novoUsuario.perfil,
      },
    });
  } catch (err) {
    return res.status(500).json({ erro: 'Erro interno ao cadastrar usuário.', detalhe: err.message });
  }
}

// POST /auth/login — valida credenciais e retorna o token JWT
async function login(req, res) {
  try {
    const { email, senha } = req.body;

    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      return res.status(401).json({ erro: 'Credenciais inválidas.' });
    }

    // Compara a senha informada com o hash armazenado no banco
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    if (!senhaCorreta) {
      return res.status(401).json({ erro: 'Credenciais inválidas.' });
    }

    // Gera o JWT com os dados do usuário no payload
    const token = jwt.sign(
      {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        perfil: usuario.perfil,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
    );

    return res.status(200).json({
      mensagem: `Bem-vindo(a), ${usuario.nome}!`,
      token,
      perfil: usuario.perfil,
    });
  } catch (err) {
    return res.status(500).json({ erro: 'Erro interno ao realizar login.', detalhe: err.message });
  }
}

module.exports = { cadastrar, login };
