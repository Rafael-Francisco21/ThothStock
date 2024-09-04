const { DataTypes } = require("sequelize");
const sequelize = require("../helpers/db");
const VendaModel = require('./Venda'); // Importando o modelo de Venda
const ProdutoModel = require('./Produto'); // Importando o modelo de Produto

const VendaProdutoModel = sequelize.define('VendaProduto', {
    codigo: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    quantidade: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    unitario: {
        type: DataTypes.FLOAT, 
        allowNull: false
    },
    total: {
        type: DataTypes.FLOAT, 
        allowNull: false
    },
    vendaId: {
        type: DataTypes.INTEGER,
        references: {
            model: VendaModel,
            key: 'codigo'
        },
        allowNull: false
    },
    produtoId: {
        type: DataTypes.INTEGER,
        references: {
            model: ProdutoModel,
            key: 'codigo'
        },
        allowNull: false
    }
}, {
    freezeTableName: true,
    timestamps: false
});


VendaProdutoModel.belongsTo(VendaModel, { foreignKey: 'vendaId', as: 'venda', onDelete: 'CASCADE' });
VendaProdutoModel.belongsTo(ProdutoModel, { foreignKey: 'produtoId', as: 'produto' });

sequelize.sync()

module.exports = VendaProdutoModel;
