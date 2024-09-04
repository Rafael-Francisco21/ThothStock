const { DataTypes } = require("sequelize"); 
const sequelize = require("../helpers/db");

const ProdutoModel = sequelize.define('Produto', 
    {
        codigo: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        descricao: {
            type: DataTypes.STRING, 
            allowNull: false
        },
        custo: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        valor: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        estoque: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        freezeTableName: true,
        timestamps: false
    }
);

sequelize.sync()

module.exports = ProdutoModel;
