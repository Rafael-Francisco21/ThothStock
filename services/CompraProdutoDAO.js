const { Op } = require("sequelize");
const CompraProdutoModel = require('../model/CompraProduto');
const CompraModel = require('../model/Compra');
const ProdutoModel = require('../model/Produto');

module.exports = {
    create: async function(compraProduto) {
        // Criação do item de compra
        const item = await CompraProdutoModel.create(compraProduto);

        // Atualiza o total da compra
        await this.updateCompraTotal(compraProduto.compraId);

        // Atualiza o estoque do produto
        await this.updateEstoqueProduto(compraProduto.produtoId, compraProduto.quantidade);

        return item;
    },

    update: async function(id, compraProduto) {
        // Obtém o item de compra antes da atualização
        const itemAntigo = await CompraProdutoModel.findByPk(id);

        // Atualiza o item de compra
        const [updated] = await CompraProdutoModel.update(compraProduto, { where: { codigo: id } });

        if (updated) {
            // Atualiza o total da compra
            await this.updateCompraTotal(compraProduto.compraId);

            // Atualiza o estoque do produto
            await this.updateEstoqueProduto(compraProduto.produtoId, compraProduto.quantidade);

            // Reverte o estoque do produto antigo
            if (itemAntigo) {
                await this.updateEstoqueProduto(itemAntigo.produtoId, -itemAntigo.quantidade);
            }
        }

        return [updated];
    },

    delete: async function(id) {
        // Obtém o item de compra antes da exclusão
        const item = await CompraProdutoModel.findByPk(id);

        if (item) {
            // Remove o item de compra
            await CompraProdutoModel.destroy({ where: { codigo: id } });

            // Atualiza o total da compra
            await this.updateCompraTotal(item.compraId);

            // Reverte o estoque do produto
            await this.updateEstoqueProduto(item.produtoId, -item.quantidade);
        }

        return item;
    },

    updateCompraTotal: async function(compraId) {
        // Obtém todos os itens da compra
        const itens = await CompraProdutoModel.findAll({ where: { compraId: compraId } });

        // Calcula o novo total da compra
        const total = itens.reduce((acc, item) => acc + item.quantidade * item.unitario, 0);

        // Atualiza o total da compra
        await CompraModel.update({ total }, { where: { codigo: compraId } });
    },

    updateEstoqueProduto: async function(produtoId, quantidade) {
        // Obtém o produto
        const produto = await ProdutoModel.findByPk(produtoId);

        if (produto) {
            // Atualiza o estoque do produto
            await ProdutoModel.update({ estoque: produto.estoque + quantidade }, { where: { codigo: produtoId } });
        }
    },

    list: async function(compraId) {
        return await CompraProdutoModel.findAll({
            where: { compraId },
            include: [{
                model: ProdutoModel,
                attributes: ['descricao'],
                as: 'produto'
            }],
            attributes: ['codigo', 'quantidade', 'unitario', 'total']
        });
    },

    // Listar itens de uma compra específica com paginação
    listPage: async function(compraId, pagina, limite) {
        const offset = (pagina - 1) * limite;

        const limiteNumber = parseInt(limite, 10);
        if (isNaN(limiteNumber) || limiteNumber <= 0) {
            throw new Error('O limite deve ser um número positivo.');
        }

        return await CompraProdutoModel.findAll({
            where: { compraId },
            limit: limiteNumber,
            offset: offset,
            include: [{
                model: ProdutoModel,
                attributes: ['descricao'],
                as: 'produto'
            }],
            attributes: ['codigo', 'quantidade', 'unitario', 'total']
        });
    }
};
