# 🍽️ KDS Restaurante — API de Comandas

> **Estudo de Caso Acadêmico — Apresentação: 30/09/2026**  
> Solução de software para gestão de pedidos de cozinha (Kitchen Display System) em ambiente de restaurante.

---

## 👥 Integrantes do Grupo

| Aluno | RA | Função / Contribuição |
|---|---|---|
| **Guilherme portilho** | `25000151` | Desenvolvimento Back-end |
| **Kauan Leander Leandrini** | `25000795` | Testes & Regras de Negócio e Apresentação |

---

## O Problema & A Solução

### Situação-Problema
1. **Segurança no Salão**: Clientes mal-intencionados conectados à rede Wi-Fi do restaurante conseguiam interceptar requisições para alterar status, adicionar itens ou cancelar comandas indevidamente.
2. **Saúde e Alergias**: Garçons lançavam comandas sem registro formal e obrigatório de restrições alimentares/alergias, gerando riscos graves à saúde dos clientes e retrabalho na cozinha.

### Solução Técnica Proposta
- **Autenticação e Proteção via JWT**: Todas as rotas de manipulação de comandas exigem token JWT assinado, gerado no login e verificado via middleware `verifyToken`.
- **Validação Rigorosa com express-validator**: Sanitização e validação de mesa (1 a 60), estrutura de itens e observações obrigatórias de alergias.
- **Criptografia com bcrypt**: Senhas de garçons e cozinheiros são hasheadas com salt antes de persistir no banco.
- **ORM Sequelize + MySQL**: Mapeamento objeto-relacional estruturado com validações de integridade no banco de dados.

---

## Tecnologias e Bibliotecas

| Tecnologia | Finalidade |
|---|---|
| **Node.js (v18+)** | Ambiente de execução JavaScript |
| **Express 5** | Framework HTTP para criação da API REST |
| **Sequelize** | ORM para mapeamento relacional |
| **MySQL2** | Driver de banco de dados relacional MySQL |
| **JSON Web Token (jsonwebtoken)** | Geração e validação de tokens de autenticação |
| **bcryptjs** | Hashing criptográfico unidirecional de senhas |
| **express-validator** | Middleware de validação e sanitização de requisições HTTP |
| **cors** | Habilitação de Cross-Origin Resource Sharing |
| **dotenv** | Carregamento de variáveis de ambiente |

---

## Requisitos Acadêmicos Atendidos

- [x] **Mapeamento e Banco de Dados**: Models `Usuario` e `Comanda` com Sequelize e MySQL (`sequelize.sync`).
- [x] **Segurança & Autenticação**: Middleware `verifyToken` protegendo todas as rotas `/comandas`.
- [x] **Validação & Tratamento de Dados**: `express-validator` em cadastro, login, criação de comanda e atualização de status, com middleware centralizado `handleValidation`.
- [x] **Criptografia**: `bcryptjs` utilizado na criação e validação das credenciais de acesso de usuários.

---

## Estrutura do Projeto (MVC)

```text
├── server.js                      # Ponto de entrada — conecta ao MySQL e inicia o servidor
├── insomnia_kds_restaurante.json  # Collection do Insomnia pronta para 'Run Collection'
├── .env                           # Configurações de ambiente (portas, credenciais, segredo JWT)
├── .gitignore                     # Arquivos ignorados pelo Git (node_modules, .env)
├── src/
│   ├── app.js                     # Configuração do Express, CORS e montagem de rotas
│   ├── config/
│   │   └── database.js            # Conexão Sequelize com MySQL
│   ├── models/
│   │   ├── Usuario.js             # Model: Garçom e Cozinheiro (com hash de senha)
│   │   └── Comanda.js             # Model: Comanda (mesa, itens, status, alergias)
│   ├── controllers/
│   │   ├── authController.js      # Cadastro e Login (bcrypt + geração JWT)
│   │   └── comandaController.js   # Regras de negócio e CRUD de Comandas
│   ├── routes/
│   │   ├── authRoutes.js          # POST /auth/cadastro, POST /auth/login
│   │   └── comandaRoutes.js       # CRUD /comandas (protegidas por JWT)
│   └── middlewares/
│       ├── verifyToken.js         # Validador de token Bearer JWT
│       └── handleValidation.js    # Coletor de erros do express-validator
└── docs/
    └── README.md                  # Documentação complementar
```

---

## Como Rodar Localmente

### 1. Pré-requisitos
- **Node.js** instalado (v18 ou superior)
- **MySQL Server** ativo e rodando (porta padrão 3306)

### 2. Configurar o Banco de Dados
No terminal MySQL ou cliente gráfico (DBeaver, MySQL Workbench):
```sql
CREATE DATABASE IF NOT EXISTS restaurante_kds CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3. Configurar o `.env`
Crie ou edite o arquivo `.env` na raiz do projeto com as credenciais do seu banco:
```env
PORT=3001
DB_HOST=localhost
DB_PORT=3306
DB_NAME=restaurante_kds
DB_USER=root
DB_PASS=sua_senha
JWT_SECRET=kds_restaurante_super_secreto_2026
JWT_EXPIRES_IN=8h
```

### 4. Instalar as Dependências
```bash
npm install
```

### 5. Iniciar a Aplicação
Modo de produção:
```bash
npm run start
```
Ou modo de desenvolvimento (com reload automático nativo do Node):
```bash
npm run dev
```
> O servidor iniciará em `http://localhost:3001` e o Sequelize sincronizará automaticamente as tabelas (`Usuario` e `Comanda`).

---

## Endpoints da API

### Rotas Públicas (Autenticação)

| Método | Endpoint | Descrição |
|---|---|---|
| `POST` | `/auth/cadastro` | Registra novo garçom ou cozinheiro (com validação e hash bcrypt) |
| `POST` | `/auth/login` | Autentica usuário e retorna o token JWT de acesso |

### Rotas Protegidas (Exigem `Authorization: Bearer <token>`)

| Método | Endpoint | Descrição |
|---|---|---|
| `POST` | `/comandas` | Abre uma nova comanda de mesa (valida mesa 1-60, itens e alergia) |
| `GET` | `/comandas` | Lista todas as comandas (opcional: filtrar por `?status=PENDENTE`) |
| `GET` | `/comandas/:id` | Consulta detalhes de uma comanda específica |
| `PATCH` | `/comandas/:id/status` | Atualiza o status (`PENDENTE` ➔ `PREPARANDO` ➔ `PRONTO` ➔ `ENTREGUE`) |
| `DELETE` | `/comandas/:id` | Cancela uma comanda (permitido apenas se estiver em `PENDENTE`) |

---

## Testes Automatizados no Insomnia

O projeto inclui o arquivo [`insomnia_kds_restaurante.json`](./insomnia_kds_restaurante.json) já preparado para execução contínua:

1. Abra o **Insomnia**.
2. Clique em **Import** e selecione o arquivo `insomnia_kds_restaurante.json`.
3. Selecione o Workspace importado **KDS Restaurante**.
4. Clique na aba ou botão **Run Collection** (ou Runner).
5. As 13 requisições serão executadas em sequência ordenada:
   - Cadastros e Logins (com captura dinâmica automática do JWT via template tag `{% response %}`)
   - Teste de segurança sem token (esperado 401 Unauthorized)
   - Validações de erro (mesa inválida 99, itens vazios)
   - Ciclo de vida completo da comanda (Criação, Consulta, Atualização de status e Cancelamento)
