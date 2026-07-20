# BookStore_Manager_CLI

Sistema de gerenciamento de biblioteca desenvolvido como aplicação de linha de comando (CLI) utilizando **Node.js**, **TypeScript** e **PostgreSQL**.
Projeto de desenvolvimento em back-end, de execução em terminal, elaborada por: [SCTEC] - SENAI/SC.

## Objetivo

Desenvolvimento de aplicação CLI capaz de gerenciar autores, livros, clientes e empréstimos, persistindo os dados em um banco de dados relacional PostgreSQL e aplicando regras de negócio com arquitetura em camadas.

---

## 🛠️ Tecnologias Utilizadas

| Tecnologia   | Versão   | Uso                                        |
|--------------|----------|--------------------------------------------|
| Node.js      | 18+      | Ambiente de execução                       |
| TypeScript   | 5.x      | Tipagem estática e POO                     |
| PostgreSQL   | 14+      | Banco de dados relacional                  |
| pg           | 8.x      | Driver PostgreSQL para Node.js             |
| dotenv       | 16.x     | Gerenciamento de variáveis de ambiente     |
| ts-node      | 10.x     | Execução direta de TypeScript              |

---

## 📋 Requisitos para Execução

- [Node.js](https://nodejs.org/) v18 ou superior
- [PostgreSQL](https://www.postgresql.org/) v14 ou superior
- [TypeScript] npm install -g typescript
- [NPM] v9 ou superior.

---

## ⚙️ Configuração do Banco de Dados

**1. Crie o banco de dados no PostgreSQL:**

```sql
CREATE DATABASE bookstore_db;
```

**2. Execute o script de criação das tabelas:**

```bash
psql -U postgres -d bookstore_db -f src/database/schema.sql
```

---

## 🚀 Instalação e Execução

**1. Clone o repositório:**

```bash
git clone https://github.com/gelobs/BookStore_Manager_CLI.git
cd BookStore_Manager_CLI
```

**2. Instale as dependências:**

```bash
npm install
```

**3. Configure as variáveis de ambiente:**

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas credenciais do PostgreSQL:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=bookstore_db
DB_USER=postgres
DB_PASSWORD=SUA_SENHA_AQUI
```

**4. Execute a aplicação:**

```bash
npm run dev
```

**Ou compile e execute:**

```bash
npm run build
npm start
```

---

## 🏗️ Arquitetura do Projeto

O projeto segue uma **arquitetura em camadas**, separando responsabilidades conforme descrito abaixo:

```
bookstore-manager-cli/
├── src/
│   ├── main.ts                        # Ponto de entrada da aplicação
│   ├── controllers/                   # Camada de apresentação (CLI)
│   │   ├── AutorController.ts
│   │   ├── LivroController.ts
│   │   ├── ClienteController.ts
│   │   └── EmprestimoController.ts
│   ├── services/                      # Regras de negócio
│   │   ├── AutorService.ts
│   │   ├── LivroService.ts
│   │   ├── ClienteService.ts
│   │   └── EmprestimoService.ts
│   ├── repositories/                  # Acesso ao banco de dados
│   │   ├── AutorRepository.ts
│   │   ├── LivroRepository.ts
│   │   ├── ClienteRepository.ts
│   │   └── EmprestimoRepository.ts
│   ├── models/                        # Interfaces e classes das entidades
│   │   ├── Autor.ts
│   │   ├── Livro.ts
│   │   ├── Cliente.ts
│   │   └── Emprestimo.ts
│   ├── database/
│   │   ├── connection.ts              # Configuração da conexão (pg Pool)
│   │   └── schema.sql                # Script de criação do banco
│   ├── utils/
│   │   ├── input.ts                   # Utilitário de leitura do terminal
│   │   └── formatter.ts              # Formatação de saída no console
│   └── menus/
│       ├── mainMenu.ts
│       ├── autorMenu.ts
│       ├── livroMenu.ts
│       ├── clienteMenu.ts
│       ├── emprestimoMenu.ts
│       └── relatorioMenu.ts
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

### Fluxo de execução

```
Usuário → Menu → Controller → Service → Repository → PostgreSQL
```

| Camada       | Responsabilidade                                                    |
|--------------|---------------------------------------------------------------------|
| Main         | Inicializa a aplicação e a conexão com o banco                     |
| Menus        | Exibem opções e capturam a escolha do usuário                      |
| Controllers  | Leem entradas do usuário e chamam os serviços correspondentes      |
| Services     | Aplicam regras de negócio e validações antes de persistir          |
| Repositories | Executam os comandos SQL no PostgreSQL via biblioteca `pg`          |
| Models       | Definem interfaces e classes tipadas das entidades do sistema       |

---

## ✅ Funcionalidades Implementadas

### Autores
- Cadastrar autor (nome, e-mail, nacionalidade)
- Listar todos os autores
- Consultar autor por ID
- Atualizar autor
- Remover autor (validação: sem livros vinculados)

### Livros
- Cadastrar livro (vinculado a um autor)
- Listar todos os livros (com nome do autor via JOIN)
- Consultar livro por ID
- Atualizar livro
- Remover livro (validação: sem empréstimos ativos)

### Clientes
- Cadastrar cliente
- Listar todos os clientes
- Consultar cliente por ID
- Atualizar cliente
- Remover cliente (validação: sem empréstimos ativos)

### Empréstimos
- Realizar empréstimo (valida livro, cliente e disponibilidade)
- Registrar devolução (atualiza quantidade disponível)
- Listar todos os empréstimos (com JOIN livro + cliente)
- Consultar empréstimo por ID

### Relatórios
- Livros disponíveis
- Livros atualmente emprestados
- Livros cadastrados por autor (GROUP BY + COUNT)
- Quantidade de empréstimos por livro (TOP 10, ORDER BY)
- Clientes com empréstimos ativos

---

## 🧪 Exemplos de Utilização

```
========================================
   📚 Bookstore Manager CLI
========================================
✅ Conexão com o PostgreSQL estabelecida com sucesso.

============================================================
  📚 Bookstore Manager CLI
============================================================
1. Autores
2. Livros
3. Clientes
4. Empréstimos
5. Relatórios
0. Encerrar aplicação

Escolha uma opção: 1

============================================================
  📚 Gerenciamento de Autores
============================================================
1. Cadastrar autor
2. Listar autores
...
```

---

## 📌 Link do Kanban

[Kanban do projeto] https://trello.com/b/u0sNd0kw/sctec-bookstore-manager-cli