# 🍽️ KDS Restaurante — API de Comandas

Sistema de **Kitchen Display System (KDS)** para restaurantes, desenvolvido como estudo de caso acadêmico.  
Resolve o problema de **garçons lançando pedidos sem identificar alergias** e o **acesso indevido de clientes conectados ao Wi-Fi** para alterar ou fechar comandas.

---

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Finalidade |
|---|---|
| Node.js + Express | Servidor HTTP / API REST |
| Sequelize + MySQL | ORM e banco de dados relacional |
| JSON Web Token (JWT) | Autenticação e autorização |
| bcryptjs | Criptografia de senhas |
| express-validator | Validação e sanitização de entrada |
| dotenv | Gerenciamento de variáveis de ambiente |

---

## 📁 Estrutura do Projeto (MVC)

```
├── server.js                   # Ponto de entrada — conecta ao DB e sobe o servidor
├── src/
│   ├── app.js                  # Configuração do Express e registro de rotas
│   ├── config/
│   │   └── database.js         # Conexão Sequelize / MySQL
│   ├── models/
│   │   ├── Usuario.js          # Model: Garçom / Cozinheiro
│   │   └── Comanda.js          # Model: Comanda (pedido de mesa)
│   ├── controllers/
│   │   ├── authController.js   # Cadastro e Login (bcrypt + JWT)
│   │   └── comandaController.js# CRUD de Comandas
│   ├── routes/
│   │   ├── authRoutes.js       # POST /auth/cadastro, POST /auth/login
│   │   └── comandaRoutes.js    # CRUD /comandas (protegido por JWT)
│   └── middlewares/
│       ├── verifyToken.js      # Middleware de autenticação JWT
│       └── handleValidation.js # Coleta erros do express-validator
└── .env                        # Variáveis de ambiente (NÃO versionar)
```

---

## ⚙️ Como Rodar Localmente

### 1. Pré-requisitos
- Node.js ≥ 18
- MySQL rodando localmente (porta padrão 3306)

### 2. Criar o banco de dados no MySQL
```sql
CREATE DATABASE restaurante_kds CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3. Configurar o `.env`
Edite o arquivo `.env` na raiz do projeto com suas credenciais:
```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=restaurante_kds
DB_USER=root
DB_PASS=sua_senha_aqui
JWT_SECRET=kds_restaurante_super_secreto_2026
JWT_EXPIRES_IN=8h
PORT=3000
```

### 4. Instalar dependências
```bash
npm install
```

### 5. Iniciar o servidor
```bash
npm start
```
> As tabelas são criadas automaticamente via `sequelize.sync({ alter: true })`.

---

## 🔌 Endpoints da API

### 🔓 Rotas Públicas (sem token)

| Método | Rota | Descrição |
|---|---|---|
| POST | `/auth/cadastro` | Cadastra um novo usuário (garçom ou cozinheiro) |
| POST | `/auth/login` | Realiza login e retorna o token JWT |

### 🔐 Rotas Protegidas (exigem `Authorization: Bearer <token>`)

| Método | Rota | Descrição |
|---|---|---|
| POST | `/comandas` | Abre uma nova comanda para a mesa |
| GET | `/comandas` | Lista todas as comandas |
| GET | `/comandas/:id` | Busca uma comanda pelo ID |
| PATCH | `/comandas/:id/status` | Atualiza o status de preparo |
| DELETE | `/comandas/:id` | Cancela uma comanda (somente PENDENTE) |

---

## 🧪 Exemplos de Teste no Insomnia

### 1. Cadastrar Usuário
**POST** `http://localhost:3000/auth/cadastro`
```json
{
  "nome": "João Garçom",
  "matricula": "G001",
  "email": "joao@restaurante.com",
  "senha": "senha123",
  "perfil": "GARCOM"
}
```

### 2. Login
**POST** `http://localhost:3000/auth/login`
```json
{
  "email": "joao@restaurante.com",
  "senha": "senha123"
}
```
> Copie o `token` da resposta para usar nas rotas protegidas.

### 3. Abrir Comanda (com token)
**POST** `http://localhost:3000/comandas`  
Header: `Authorization: Bearer <token>`
```json
{
  "numeroMesa": 5,
  "itens": [
    { "nome": "Pizza Margherita", "quantidade": 1, "preco": 45.90 },
    { "nome": "Coca-Cola 600ml", "quantidade": 2, "preco": 8.00 }
  ],
  "valorTotal": 61.90,
  "observacaoAlergia": "Cliente alérgico a glúten — sem massa de trigo"
}
```

### 4. ❌ Acesso Bloqueado (sem token)
**GET** `http://localhost:3000/comandas` *(sem header Authorization)*
```json
{ "erro": "Acesso negado. Token não fornecido." }
```

### 5. ❌ Validação de Erro (mesa inválida)
**POST** `http://localhost:3000/comandas` com `numeroMesa: 99`
```json
{
  "erro": "Dados inválidos na requisição.",
  "detalhes": [{ "campo": "numeroMesa", "mensagem": "A mesa deve ser um inteiro entre 1 e 60." }]
}
```

### 6. Atualizar Status
**PATCH** `http://localhost:3000/comandas/1/status`  
Header: `Authorization: Bearer <token>`
```json
{ "statusPreparo": "PREPARANDO" }
```

---

## 🔒 Requisitos Atendidos

- ✅ **Model com Sequelize/MySQL**: `Usuario` e `Comanda`
- ✅ **JWT verifyToken**: aplicado em todas as rotas `/comandas`
- ✅ **express-validator**: validação em cadastro, login, criação de comanda e atualização de status
- ✅ **bcrypt**: senha do usuário nunca armazenada em texto puro
