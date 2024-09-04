const { Op } = require("sequelize");
const VendaModel = require('../model/Venda');
const CompraModel = require('../model/Compra');
const ClienteModel = require('../model/Cliente');
const FornecedorModel = require('../model/Fornecedor');
const UsuarioModel = require('../model/Usuario');
const ProdutoModel = require('../model/Produto');
const VendaProdutoModel = require('../model/VendaProduto');
const CompraProdutoModel = require('../model/CompraProduto');

module.exports = {
    // Relatório de Vendas
    relatorioVendas: async function(dataInicio, dataFim, clienteId = null, produtoId = null, usuarioId = null) {
        const inicio = new Date(dataInicio);
        const fim = new Date(dataFim);
        fim.setHours(23, 59, 59, 999);

        const filtros = {
            data: { [Op.between]: [inicio, fim] }
        };

        if (clienteId) filtros.clienteId = clienteId;
        if (produtoId) {
            const vendasComProduto = await VendaProdutoModel.findAll({ where: { produtoId } });
            const idsVendas = vendasComProduto.map(venda => venda.vendaId);
            filtros.codigo = { [Op.in]: idsVendas };
        }
        if (usuarioId) filtros.usuarioId = usuarioId;

        return await VendaModel.findAll({
            where: filtros,
            include: [
                { model: ClienteModel, attributes: ['nome'] },
                { model: UsuarioModel, attributes: ['nome'] }
            ],
            attributes: ['codigo', 'total', 'data']
        });
    },

    // Relatório de Compras
    relatorioCompras: async function(dataInicio, dataFim, fornecedorId = null, produtoId = null, usuarioId = null) {
        const inicio = new Date(dataInicio);
        const fim = new Date(dataFim);
        fim.setHours(23, 59, 59, 999);

        const filtros = {
            data: { [Op.between]: [inicio, fim] }
        };

        if (fornecedorId) filtros.fornecedorId = fornecedorId;
        if (produtoId) {
            const comprasComProduto = await CompraProdutoModel.findAll({ where: { produtoId } });
            const idsCompras = comprasComProduto.map(compra => compra.compraId);
            filtros.codigo = { [Op.in]: idsCompras };
        }
        if (usuarioId) filtros.usuarioId = usuarioId;

        return await CompraModel.findAll({
            where: filtros,
            include: [
                { model: FornecedorModel, attributes: ['nome'] },
                { model: UsuarioModel, attributes: ['nome'] }
            ],
            attributes: ['codigo', 'total', 'data']
        });
    },

    totalVenda: async function(dataInicio, dataFim) {
        const inicio = new Date(dataInicio);
        const fim = new Date(dataFim);
        fim.setHours(23, 59, 59, 999);

        const vendas = await VendaModel.findAll({
            where: {
                data: { [Op.between]: [inicio, fim] }
            }
        });

        const totalVendas = vendas.reduce((acc, venda) => acc + venda.total, 0);

        return { lucroLiquido: totalVendas };
    },

    lucroBruto: async function(dataInicio, dataFim) {
        const inicio = new Date(dataInicio);
        const fim = new Date(dataFim);
        fim.setHours(23, 59, 59, 999);

        // Calcular total das vendas
        const vendas = await VendaModel.findAll({
            where: {
                data: { [Op.between]: [inicio, fim] }
            }
        });
        const totalVendas = vendas.reduce((acc, venda) => acc + venda.total, 0);

        // Calcular total das compras
        const compras = await CompraModel.findAll({
            where: {
                data: { [Op.between]: [inicio, fim] }
            }
        });
        const totalCompras = compras.reduce((acc, compra) => acc + compra.total, 0);

        const lucroBruto = totalVendas - totalCompras;

        return { lucroBruto };
    }
};
