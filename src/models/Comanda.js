// src/models/Comanda.js
// Model de Comanda — cada comanda pertence a um usuário (garçom responsável)
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Usuario = require('./Usuario');

const Comanda = sequelize.define('Comanda', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  numeroMesa: {
    // Inteiro entre 1 e 60 — validado também no express-validator
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 1, max: 60 },
  },
  itens: {
    // JSON com os itens pedidos: [{ nome, quantidade, preco }]
    type: DataTypes.JSON,
    allowNull: false,
  },
  valorTotal: {
    // Decimal maior que zero — validado no express-validator
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: { min: 0.01 },
  },
  observacaoAlergia: {
    // Restrições alimentares / alergias — campo crítico de segurança alimentar
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: null,
  },
  statusPreparo: {
    // Ciclo de vida da comanda na cozinha
    type: DataTypes.ENUM('PENDENTE', 'PREPARANDO', 'PRONTO', 'ENTREGUE'),
    allowNull: false,
    defaultValue: 'PENDENTE',
  },
  usuarioId: {
    // FK para o garçom que abriu a comanda
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'usuarios', key: 'id' },
  },
}, {
  tableName: 'comandas',
  timestamps: true,
});

// Associação: uma comanda pertence a um usuário (garçom)
Comanda.belongsTo(Usuario, { foreignKey: 'usuarioId', as: 'garcom' });
Usuario.hasMany(Comanda, { foreignKey: 'usuarioId', as: 'comandas' });

module.exports = Comanda;
