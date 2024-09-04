const { Op } = require("sequelize");
const VendaProdutoModel = require('../model/VendaProduto');
const VendaModel = require('../model/Venda');
const ProdutoModel = require('../model/Produto');

module.exports = {
    create: async function(vendaProduto) {
        // Criação do item de venda
        const item = await VendaProdutoModel.create(vendaProduto);

        // Atualiza o total da venda
        await this.updateVendaTotal(vendaProduto.vendaId);

        // Atualiza o estoque do produto
        await this.updateEstoqueProduto(vendaProduto.produtoId, vendaProduto.quantidade);

        return item;
    },

    update: async function(id, vendaProduto) {
        // Obtém o item de venda antes da atualização
        const itemAntigo = await VendaProdutoModel.findByPk(id);

        // Atualiza o item de venda
        const [updated] = await VendaProdutoModel.update(vendaProduto, { where: { id } });

        if (updated) {
            // Atualiza o total da venda
            await this.updateVendaTotal(vendaProduto.vendaId);

            // Atualiza o estoque do produto
            await this.updateEstoqueProduto(vendaProduto.produtoId, vendaProduto.quantidade);

            // Reverte o estoque do produto antigo
            if (itemAntigo) {
                await this.updateEstoqueProduto(itemAntigo.produtoId, -itemAntigo.quantidade);
            }
        }

        return [updated];
    },

    delete: async function(id) {
        // Obtém o item de venda antes da exclusão
        const item = await VendaProdutoModel.findByPk(id);

        if (item) {
            // Remove o item de venda
            await VendaProdutoModel.destroy({ where: { id } });

            // Atualiza o total da venda
            await this.updateVendaTotal(item.vendaId);

            // Reverte o estoque do produto
            await this.updateEstoqueProduto(item.produtoId, -item.quantidade);
        }

        return item;
    },

    updateVendaTotal: async function(vendaId) {
        // Obtém todos os itens da venda
        const itens = await VendaProdutoModel.findAll({ where: { vendaId: vendaId } });

        // Calcula o novo total da venda
        const total = itens.reduce((acc, item) => acc + item.quantidade * item.unitario, 0);

        // Atualiza o total da venda
        await VendaModel.update({ total }, { where: { codigo: vendaId } });
    },

    updateEstoqueProduto: async function(produtoId, quantidade) {
        // Obtém o produto
        const produto = await ProdutoModel.findByPk(produtoId);

        if (produto) {
            // Atualiza o estoque do produto
            await ProdutoModel.update({ estoque: produto.estoque - quantidade }, { where: { codigo: produtoId } });
        }
    },
    list: async function(vendaId) {
        return await VendaProdutoModel.findAll({
            where: { vendaId },
            include: [{
                model: ProdutoModel,
                attributes: ['descricao'],
                as: 'produto'
            }],
            attributes: ['codigo', 'quantidade', 'unitario', 'total']
        });
    },

    // Listar itens de uma venda específica com paginação
    listPage: async function(vendaId, pagina, limite) {
        const offset = (pagina - 1) * limite;
    
        const limiteNumber = parseInt(limite, 10);
        if (isNaN(limiteNumber) || limiteNumber <= 0) {
            throw new Error('O limite deve ser um número positivo.');
        }
    
        return await VendaProdutoModel.findAll({
            where: { vendaId },
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
