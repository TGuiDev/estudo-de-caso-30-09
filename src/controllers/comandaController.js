// src/controllers/comandaController.js
// CRUD de Comandas — todas as rotas são PROTEGIDAS por verifyToken
const Comanda = require('../models/Comanda');
const Usuario = require('../models/Usuario');

// POST /comandas — Abre uma nova comanda (somente GARCOM)
async function criarComanda(req, res) {
  try {
    const { numeroMesa, itens, valorTotal, observacaoAlergia } = req.body;

    // Verifica se já existe comanda PENDENTE ou PREPARANDO nessa mesa
    const mesaOcupada = await Comanda.findOne({
      where: {
        numeroMesa,
        statusPreparo: ['PENDENTE', 'PREPARANDO'],
      },
    });
    if (mesaOcupada) {
      return res.status(409).json({
        erro: `Mesa ${numeroMesa} já possui uma comanda em aberto (ID: ${mesaOcupada.id}).`,
      });
    }

    const comanda = await Comanda.create({
      numeroMesa,
      itens,
      valorTotal,
      observacaoAlergia: observacaoAlergia || null,
      statusPreparo: 'PENDENTE',
      usuarioId: req.usuario.id, // ID vem do token JWT injetado pelo verifyToken
    });

    return res.status(201).json({
      mensagem: 'Comanda aberta com sucesso.',
      comanda,
    });
  } catch (err) {
    return res.status(500).json({ erro: 'Erro ao criar comanda.', detalhe: err.message });
  }
}

// GET /comandas — Lista todas as comandas (todos os perfis autenticados)
async function listarComandas(req, res) {
  try {
    const comandas = await Comanda.findAll({
      include: [{ model: Usuario, as: 'garcom', attributes: ['id', 'nome', 'perfil'] }],
      order: [['createdAt', 'DESC']],
    });
    return res.status(200).json(comandas);
  } catch (err) {
    return res.status(500).json({ erro: 'Erro ao listar comandas.', detalhe: err.message });
  }
}

// GET /comandas/:id — Busca uma comanda específica
async function buscarComanda(req, res) {
  try {
    const comanda = await Comanda.findByPk(req.params.id, {
      include: [{ model: Usuario, as: 'garcom', attributes: ['id', 'nome', 'perfil'] }],
    });
    if (!comanda) {
      return res.status(404).json({ erro: 'Comanda não encontrada.' });
    }
    return res.status(200).json(comanda);
  } catch (err) {
    return res.status(500).json({ erro: 'Erro ao buscar comanda.', detalhe: err.message });
  }
}

// PATCH /comandas/:id/status — Atualiza o status de preparo (COZINHEIRO ou GARCOM)
async function atualizarStatus(req, res) {
  try {
    const comanda = await Comanda.findByPk(req.params.id);
    if (!comanda) {
      return res.status(404).json({ erro: 'Comanda não encontrada.' });
    }

    // Impede retroceder o status (ex: de PRONTO para PENDENTE)
    const fluxo = ['PENDENTE', 'PREPARANDO', 'PRONTO', 'ENTREGUE'];
    const indexAtual = fluxo.indexOf(comanda.statusPreparo);
    const indexNovo = fluxo.indexOf(req.body.statusPreparo);

    if (indexNovo < indexAtual) {
      return res.status(400).json({
        erro: `Não é possível retroceder o status de "${comanda.statusPreparo}" para "${req.body.statusPreparo}".`,
      });
    }

    await comanda.update({ statusPreparo: req.body.statusPreparo });
    return res.status(200).json({
      mensagem: 'Status atualizado com sucesso.',
      comanda,
    });
  } catch (err) {
    return res.status(500).json({ erro: 'Erro ao atualizar status.', detalhe: err.message });
  }
}

// DELETE /comandas/:id — Cancela/remove uma comanda (apenas PENDENTE)
async function cancelarComanda(req, res) {
  try {
    const comanda = await Comanda.findByPk(req.params.id);
    if (!comanda) {
      return res.status(404).json({ erro: 'Comanda não encontrada.' });
    }

    if (comanda.statusPreparo !== 'PENDENTE') {
      return res.status(400).json({
        erro: 'Somente comandas com status PENDENTE podem ser canceladas.',
      });
    }

    await comanda.destroy();
    return res.status(200).json({ mensagem: 'Comanda cancelada com sucesso.' });
  } catch (err) {
    return res.status(500).json({ erro: 'Erro ao cancelar comanda.', detalhe: err.message });
  }
}

module.exports = { criarComanda, listarComandas, buscarComanda, atualizarStatus, cancelarComanda };
