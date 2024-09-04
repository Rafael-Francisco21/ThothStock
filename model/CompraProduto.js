const { DataTypes } = require("sequelize");
const sequelize = require("../helpers/db");
const CompraModel = require('./Compra');
const ProdutoModel = require('./Produto');

const CompraProdutoModel = sequelize.define('CompraProduto', 
    {
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
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        total: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        produtoId: {
            type: DataTypes.INTEGER,
            references: {
                model: ProdutoModel,
                key: 'codigo'
            },
            allowNull: false
        },
        compraId: {
            type: DataTypes.INTEGER,
            references: {
                model: CompraModel,
                key: 'codigo'
            },
            allowNull: false
        }
    }, 
    {
        freezeTableName: true,
        timestamps: false
    }
);

CompraProdutoModel.belongsTo(ProdutoModel, { foreignKey: 'produtoId', as: 'Produto' });
CompraProdutoModel.belongsTo(CompraModel, { foreignKey: 'compraId', as: 'Compra', onDelete: 'CASCADE' });

module.exports = CompraProdutoModel;
