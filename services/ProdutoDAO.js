const { DataTypes, Op } = require("sequelize");
const ProdutoModel = require('../model/Produto');

module.exports = {

    create: async function(produto) {
        return await ProdutoModel.create({
            descricao: produto.descricao,
            custo: produto.custo,
            valor: produto.valor,
            estoque: produto.estoque
        });
    },

    update: async function(id, produto) {
        return await ProdutoModel.update({
            descricao: produto.descricao,
            custo: produto.custo,
            valor: produto.valor,
            estoque: produto.estoque
        }, { where: { codigo: id } });
    },

    getById: async function(id) {
        return await ProdutoModel.findByPk(id);
    },

    delete: async function(id) {
        return await ProdutoModel.destroy({ where: { codigo: id } });
    },

    list: async function() {
        return await ProdutoModel.findAll({
            attributes: ['codigo', 'descricao', 'valor', 'estoque']
        });
    },

    listPage: async function(pagina, limite) {
        const offset = (pagina - 1) * limite;
    
        const limiteNumber = parseInt(limite, 10);
        if (isNaN(limiteNumber) || limiteNumber <= 0) {
            throw new Error('O limite deve ser um número positivo.');
        }
    
        return await ProdutoModel.findAll({
            attributes: ['codigo', 'descricao', 'valor', 'estoque'],
            limit: limiteNumber,
            offset: offset
        });
    }

};
