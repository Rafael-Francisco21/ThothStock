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
const UsuarioDAO = require('../services/UsuarioDAO');

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
            { nome: 'Ana Costa', email: 'ana.costa@lojatc.com', senha: 'admin123', acesso: 1 , contLogin: 0 },
            { nome: 'Bruno Almeida', email: 'bruno.almeida@lojatc.com', senha: 'admin123', acesso: 1 , contLogin: 0 },
            { nome: 'Carlos Souza', email: 'carlos.souza@lojatc.com', senha: 'user123', acesso: 2 , contLogin: 0 },
            { nome: 'Diana Silva', email: 'diana.silva@lojatc.com', senha: 'user123', acesso: 2 , contLogin: 0 },
            { nome: 'Eduardo Lima', email: 'eduardo.lima@lojatc.com', senha: 'analista123', acesso: 3 , contLogin: 0 }
        ];
        const clientes = [
            { nome: 'Maria Oliveira', telefone: '11987654321', email: 'maria.oliveira@cliente.com', endereco: 'Rua das Flores, 101', cidade: 'São Paulo', bairro: 'Vila Madalena', cep: '05423-000', uf: 'SP' },
            { nome: 'Pedro Santos', telefone: '11976543210', email: 'pedro.santos@cliente.com', endereco: 'Avenida Paulista, 1500', cidade: 'São Paulo', bairro: 'Bela Vista', cep: '01311-000', uf: 'SP' },
            { nome: 'Lucas Pereira', telefone: '1134567890', email: 'lucas.pereira@cliente.com', endereco: 'Rua dos Anjos, 305', cidade: 'São Paulo', bairro: 'Itaim Bibi', cep: '04543-000', uf: 'SP' },
            { nome: 'Juliana Costa', telefone: '1123456789', email: 'juliana.costa@cliente.com', endereco: 'Rua dos Tecnólogos, 400', cidade: 'São Paulo', bairro: 'Pinheiros', cep: '05422-000', uf: 'SP' },
            { nome: 'Renato Lima', telefone: '1191234567', email: 'renato.lima@cliente.com', endereco: 'Praça da República, 50', cidade: 'São Paulo', bairro: 'Centro', cep: '01010-000', uf: 'SP' }
        ];
        const produtos = [
            { descricao: 'Smartphone Galaxy S23', custo: 3000.0, valor: 3500.0, estoque: 50 },
            { descricao: 'Laptop Dell Inspiron 15', custo: 4000.0, valor: 4500.0, estoque: 20 },
            { descricao: 'Smartwatch Apple Watch Series 8', custo: 1500.0, valor: 1800.0, estoque: 30 },
            { descricao: 'Headphone Sony WH-1000XM4', custo: 1200.0, valor: 1500.0, estoque: 25 },
            { descricao: 'Tablet Samsung Galaxy Tab S8', custo: 2000.0, valor: 2200.0, estoque: 15 },
            { descricao: 'Monitor LG UltraWide 29"', custo: 1200.0, valor: 1400.0, estoque: 10 },
            { descricao: 'Teclado Mecânico Corsair K95', custo: 800.0, valor: 1000.0, estoque: 40 },
            { descricao: 'Mouse Logitech MX Master 3', custo: 500.0, valor: 700.0, estoque: 35 },
            { descricao: 'Câmera Nikon D7500', custo: 3500.0, valor: 4000.0, estoque: 5 },
            { descricao: 'Fone de Ouvido Bose QuietComfort 35', custo: 1600.0, valor: 1900.0, estoque: 20 }
        ];
        const fornecedores = [
            { nome: 'ElectroSupply Ltda.', telefone: '1134567890', email: 'vendas@electrosupply.com', endereco: 'Avenida dos Eletrodomésticos, 100', bairro: 'Centro', cidade: 'São Paulo', uf: 'SP', cep: '01010-000' },
            { nome: 'TechWare Distribuidora', telefone: '1145678901', email: 'contato@techware.com', endereco: 'Rua da Tecnologia, 200', bairro: 'Vila Mariana', cidade: 'São Paulo', uf: 'SP', cep: '04040-000' },
            { nome: 'Gadget Partners', telefone: '1156789012', email: 'suporte@gadgetpartners.com', endereco: 'Avenida das Inovações, 300', bairro: 'Itaim Bibi', cidade: 'São Paulo', uf: 'SP', cep: '04543-000' },
            { nome: 'Innovate Tech', telefone: '1167890123', email: 'info@innovatech.com', endereco: 'Rua das Novidades, 400', bairro: 'Pinheiros', cidade: 'São Paulo', uf: 'SP', cep: '05422-000' },
            { nome: 'Advanced Electronics', telefone: '1178901234', email: 'vendas@advancedelectronics.com', endereco: 'Praça das Tecnologias, 500', bairro: 'Centro', cidade: 'São Paulo', uf: 'SP', cep: '01010-000' }
        ];
        const compras = [
            { data: new Date(), total: 30000.0, fornecedorId: 1, usuarioId: 1 },
            { data: new Date(), total: 20000.0, fornecedorId: 2, usuarioId: 1 },
            { data: new Date(), total: 12000.0, fornecedorId: 3, usuarioId: 2 },
            { data: new Date(), total: 8000.0, fornecedorId: 4, usuarioId: 2 },
            { data: new Date(), total: 7000.0, fornecedorId: 5, usuarioId: 3 }
        ];
        const vendas = [
            { data: new Date(), total: 7000.0, clienteId: 1, usuarioId: 1 },
            { data: new Date(), total: 4500.0, clienteId: 2, usuarioId: 1 },
            { data: new Date(), total: 3000.0, clienteId: 3, usuarioId: 2 },
            { data: new Date(), total: 4000.0, clienteId: 4, usuarioId: 2 },
            { data: new Date(), total: 5500.0, clienteId: 5, usuarioId: 3 }
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
            { quantidade: 5, unitario: 3000.0, total: 15000.0, compraId: 1, produtoId: 1 },
            { quantidade: 2, unitario: 4000.0, total: 8000.0, compraId: 1, produtoId: 2 },
            { quantidade: 10, unitario: 1500.0, total: 15000.0, compraId: 2, produtoId: 3 },
            { quantidade: 8, unitario: 1200.0, total: 9600.0, compraId: 3, produtoId: 4 },
            { quantidade: 5, unitario: 2000.0, total: 10000.0, compraId: 4, produtoId: 5 }
        ];
        const vendaProdutos = [
            { quantidade: 1, unitario: 3500.0, total: 3500.0, vendaId: 1, produtoId: 1 },
            { quantidade: 1, unitario: 4500.0, total: 4500.0, vendaId: 2, produtoId: 2 },
            { quantidade: 2, unitario: 1800.0, total: 3600.0, vendaId: 3, produtoId: 3 },
            { quantidade: 4, unitario: 1000.0, total: 4000.0, vendaId: 4, produtoId: 4 },
            { quantidade: 1, unitario: 2200.0, total: 2200.0, vendaId: 5, produtoId: 5 }
        ];

        await Promise.all(compraProdutos.map(cp => CompraProdutoDAO.create(cp)));
        await Promise.all(vendaProdutos.map(vp => VendaProdutoDAO.create(vp)));

        res.json({
            status: 'success',
            message: 'Dados iniciais inseridos com sucesso.'
        });
    } catch (error) {
        console.error('Erro ao instalar o banco de dados:', error);
        res.status(500).json({
            status: 'error',
            message: 'Erro ao instalar o banco de dados.'
        });
    }
});

module.exports = router;
