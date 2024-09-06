const express = require("express");
const router = express.Router();
const sequelize = require("../helpers/db"); // Ajuste conforme o caminho do seu arquivo de configuração do Sequelize

const ClienteDAO = require('../services/ClienteDAO');
const ProdutoDAO = require('../services/ProdutoDAO');
const FornecedorDAO = require('../services/FornecedorDAO');
const CompraDAO = require('../services/CompraDAO');
const VendaDAO = require('../services/VendaDAO');
const CompraProdutoDAO = require('../services/CompraProdutoDAO');
const VendaProdutoDAO = require('../services/VendaProdutoDAO');
const UsuarioDAO = require('../services/UsuarioDAO'); // Importa o DAO do Usuário

/**
 * @swagger
 * /:
 *   get:
 *     summary: Inicializa o banco de dados e insere dados iniciais.
 *     description: Recria as tabelas no banco de dados e insere usuários, clientes, produtos, fornecedores, compras e vendas de exemplo.
 *     responses:
 *       200:
 *         description: Dados iniciais inseridos com sucesso.
 *       500:
 *         description: Erro ao instalar o banco de dados.
 */
router.get('/', async (req, res) => {
    try {
        // #swagger.description = 'Sincroniza os modelos com o banco de dados, recriando as tabelas (force: true) e insere dados iniciais como usuários, clientes, produtos, fornecedores, compras e vendas.'

        // Sincroniza os modelos com o banco de dados
        await sequelize.sync({ force: true });

        // Dados iniciais
        const usuarios = [
            { nome: 'Admin 1', email: 'admin1@example.com', senha: 'senha123', acesso: 1 },
            { nome: 'Admin 2', email: 'admin2@example.com', senha: 'senha123', acesso: 1 },
            { nome: 'User 1', email: 'user1@example.com', senha: 'senha123', acesso: 2 },
            { nome: 'User 2', email: 'user2@example.com', senha: 'senha123', acesso: 2 },
            { nome: 'User 3', email: 'user3@example.com', senha: 'senha123', acesso: 3 }
        ];
        const clientes = [
            { nome: 'Cliente 1', telefone: '123456789', email: 'cliente1@example.com', endereco: 'Rua A', cidade: 'Cidade A', bairro: 'Bairro A', cep: '12345678', uf: 'AC' },
            { nome: 'Cliente 2', telefone: '234567890', email: 'cliente2@example.com', endereco: 'Rua B', cidade: 'Cidade B', bairro: 'Bairro B', cep: '23456789', uf: 'AL' },
            { nome: 'Cliente 3', telefone: '345678901', email: 'cliente3@example.com', endereco: 'Rua C', cidade: 'Cidade C', bairro: 'Bairro C', cep: '34567890', uf: 'AM' },
            { nome: 'Cliente 4', telefone: '456789012', email: 'cliente4@example.com', endereco: 'Rua D', cidade: 'Cidade D', bairro: 'Bairro D', cep: '45678901', uf: 'AP' },
            { nome: 'Cliente 5', telefone: '567890123', email: 'cliente5@example.com', endereco: 'Rua E', cidade: 'Cidade E', bairro: 'Bairro E', cep: '56789012', uf: 'BA' }
        ];
        const produtos = [
            { descricao: 'Produto 1', custo: 10.0, valor: 15.0, estoque: 100 },
            { descricao: 'Produto 2', custo: 20.0, valor: 25.0, estoque: 200 },
            { descricao: 'Produto 3', custo: 30.0, valor: 35.0, estoque: 300 },
            { descricao: 'Produto 4', custo: 40.0, valor: 45.0, estoque: 400 },
            { descricao: 'Produto 5', custo: 50.0, valor: 55.0, estoque: 500 }
        ];
        const fornecedores = [
            { nome: 'Fornecedor 1', telefone: '987654321', email: 'fornecedor1@example.com', endereco: 'Avenida 1', bairro: 'Bairro X', cidade: 'Cidade X', uf: 'CE', cep: '87654321' },
            { nome: 'Fornecedor 2', telefone: '876543210', email: 'fornecedor2@example.com', endereco: 'Avenida 2', bairro: 'Bairro Y', cidade: 'Cidade Y', uf: 'DF', cep: '76543210' },
            { nome: 'Fornecedor 3', telefone: '765432109', email: 'fornecedor3@example.com', endereco: 'Avenida 3', bairro: 'Bairro Z', cidade: 'Cidade Z', uf: 'ES', cep: '65432109' },
            { nome: 'Fornecedor 4', telefone: '654321098', email: 'fornecedor4@example.com', endereco: 'Avenida 4', bairro: 'Bairro W', cidade: 'Cidade W', uf: 'GO', cep: '54321098' },
            { nome: 'Fornecedor 5', telefone: '543210987', email: 'fornecedor5@example.com', endereco: 'Avenida 5', bairro: 'Bairro V', cidade: 'Cidade V', uf: 'MA', cep: '43210987' }
        ];
        const compras = [
            { data: new Date(), total: 100.0, fornecedorId: 1, usuarioId: 1 },
            { data: new Date(), total: 200.0, fornecedorId: 2, usuarioId: 1 },
            { data: new Date(), total: 300.0, fornecedorId: 3, usuarioId: 2 },
            { data: new Date(), total: 400.0, fornecedorId: 4, usuarioId: 2 },
            { data: new Date(), total: 500.0, fornecedorId: 5, usuarioId: 3 }
        ];
        const vendas = [
            { data: new Date(), total: 150.0, clienteId: 1, usuarioId: 1 },
            { data: new Date(), total: 250.0, clienteId: 2, usuarioId: 1 },
            { data: new Date(), total: 350.0, clienteId: 3, usuarioId: 2 },
            { data: new Date(), total: 450.0, clienteId: 4, usuarioId: 2 },
            { data: new Date(), total: 550.0, clienteId: 5, usuarioId: 3 }
        ];
        
        // Insere os dados iniciais
        const insertedUsuarios = await Promise.all(usuarios.map(usuario => UsuarioDAO.create(usuario)));
        const insertedClientes = await Promise.all(clientes.map(cliente => ClienteDAO.create(cliente)));
        const insertedProdutos = await Promise.all(produtos.map(produto => ProdutoDAO.create(produto)));
        const insertedFornecedores = await Promise.all(fornecedores.map(fornecedor => FornecedorDAO.create(fornecedor)));
        const insertedCompras = await Promise.all(compras.map(compra => CompraDAO.create(compra)));
        const insertedVendas = await Promise.all(vendas.map(venda => VendaDAO.create(venda)));

        // Se você quiser adicionar detalhes das compras e vendas (produtos comprados e vendidos)
        const compraProdutos = [
            { quantidade: 10, unitario: 10.0, total: 100.0, compraId: 1, produtoId: 1 },
            { quantidade: 5, unitario: 20.0, total: 100.0, compraId: 2, produtoId: 2 },
            { quantidade: 3, unitario: 30.0, total: 90.0, compraId: 3, produtoId: 3 }
        ];
        const vendaProdutos = [
            { quantidade: 2, unitario: 15.0, total: 30.0, vendaId: 1, produtoId: 1 },
            { quantidade: 1, unitario: 25.0, total: 25.0, vendaId: 2, produtoId: 2 },
            { quantidade: 4, unitario: 35.0, total: 140.0, vendaId: 3, produtoId: 3 }
        ];

        await Promise.all(compraProdutos.map(cp => CompraProdutoDAO.create(cp)));
        await Promise.all(vendaProdutos.map(vp => VendaProdutoDAO.create(vp)));

        res.json({
            status: true,
            clientes: insertedClientes,
            produtos: insertedProdutos,
            fornecedores: insertedFornecedores,
            compras: insertedCompras,
            vendas: insertedVendas,
            usuarios: insertedUsuarios
        });
    } catch (error) {
        // #swagger.description = 'Em caso de erro, retorna a mensagem com o erro ocorrido ao tentar instalar o banco de dados.'
        console.error('Erro ao instalar o banco de dados:', error);
        res.status(500).json({ status: false, message: 'Erro ao instalar o banco de dados' });
    }
});

module.exports = router;
