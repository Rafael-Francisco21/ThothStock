const { DataTypes, Op } = require("sequelize");
const ClienteModel = require('../model/Cliente');

module.exports = {

    create: async function(cliente) {
        return await ClienteModel.create({
            nome: cliente.nome,
            telefone: cliente.telefone,
            email: cliente.email,
            endereco: cliente.endereco,
            cidade: cliente.cidade,
            bairro: cliente.bairro,
            cep: cliente.cep,
            uf: cliente.uf
        });
    },

    update: async function(id, cliente) {
        return await ClienteModel.update({
            nome: cliente.nome,
            telefone: cliente.telefone,
            email: cliente.email,
            endereco: cliente.endereco,
            cidade: cliente.cidade,
            bairro: cliente.bairro,
            cep: cliente.cep,
            uf: cliente.uf
        }, { where: { codigo: id } });
    },

    getById: async function(id) {
        return await ClienteModel.findByPk(id);
    },

    delete: async function(id) {
        return await ClienteModel.destroy({ where: { codigo: id } });
    },

    list: async function() {
        return await ClienteModel.findAll({
            attributes: ['codigo', 'nome', 'telefone']
        });
    },

    listPage: async function(pagina, limite) {
        const offset = (pagina - 1) * limite;
    
        const limiteNumber = parseInt(limite, 10);
        if (isNaN(limiteNumber) || limiteNumber <= 0) {
            throw new Error('O limite deve ser um número positivo.');
        }
    
        return await ClienteModel.findAll({
            attributes: ['codigo', 'nome', 'telefone'],
            limit: limiteNumber,
            offset: offset
        });
    }

};
