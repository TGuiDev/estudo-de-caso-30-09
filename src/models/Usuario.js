// src/models/Usuario.js
// Model de Usuário (Garçom ou Cozinheiro)
// A senha é armazenada como hash bcrypt — NUNCA em texto puro.
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Usuario = sequelize.define('Usuario', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nome: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  matricula: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING(150),
    allowNull: false,
    unique: true,
    validate: { isEmail: true },
  },
  senha: {
    // Armazena o HASH bcrypt — nunca a senha em texto puro
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  perfil: {
    // Garçom ou Cozinheiro — controla o que cada um pode fazer
    type: DataTypes.ENUM('GARCOM', 'COZINHEIRO'),
    allowNull: false,
    defaultValue: 'GARCOM',
  },
}, {
  tableName: 'usuarios',
  timestamps: true, // cria createdAt e updatedAt automaticamente
});

module.exports = Usuario;
