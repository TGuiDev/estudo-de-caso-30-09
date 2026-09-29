// server.js
// Ponto de entrada da aplicação
// Sincroniza os Models com o banco de dados e inicia o servidor Express.
require('dotenv').config();
const app = require('./src/app');
const sequelize = require('./src/config/database');

// Importa os models para garantir que o Sequelize os registre antes do sync
require('./src/models/Usuario');
require('./src/models/Comanda');

const PORT = process.env.PORT || 3000;

async function iniciar() {
  try {
    // Verifica a conexão com o MySQL
    await sequelize.authenticate();
    console.log('✅  Conexão com o MySQL estabelecida com sucesso.');

    // Sincroniza (cria/atualiza) as tabelas automaticamente
    // alter: true atualiza a estrutura sem apagar dados existentes
    await sequelize.sync({ alter: true });
    console.log('✅  Tabelas sincronizadas (Sequelize sync).');

    app.listen(PORT, () => {
      console.log(`🚀  Servidor KDS rodando em http://localhost:${PORT}`);
      console.log('     Pressione CTRL+C para encerrar.');
    });
  } catch (err) {
    console.error('❌  Erro ao conectar ao banco de dados:', err.message);
    process.exit(1);
  }
}

iniciar();
