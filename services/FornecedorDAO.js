const FornecedorModel = require('../model/Fornecedor');

module.exports = {

    create: async function(fornecedor) {
        return await FornecedorModel.create(fornecedor);
    },

    update: async function(id, fornecedor) {
        return await FornecedorModel.update(fornecedor, { where: { codigo: id } });
    },

    getById: async function(id) {
        return await FornecedorModel.findByPk(id);
    },

    delete: async function(id) {
        return await FornecedorModel.destroy({ where: { codigo: id } });
    },

    list: async function() {
        return await FornecedorModel.findAll();
    },

    listPage: async function(pagina, limite) {
        const offset = (pagina - 1) * limite;
        const limiteNumber = parseInt(limite, 10);

        if (isNaN(limiteNumber) || limiteNumber <= 0) {
            throw new Error('O limite deve ser um número positivo.');
        }

        return await FornecedorModel.findAll({
            limit: limiteNumber,
            offset: offset
        });
    }

};
