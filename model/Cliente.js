const { DataTypes } = require("sequelize"); 
const sequelize = require("../helpers/db");

const ClienteModel = sequelize.define('Cliente', 
    {
        codigo: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        nome: {
            type: DataTypes.STRING, 
            allowNull: false
        },
        telefone: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                isEmail: true
            }
        },
        endereco: {
            type: DataTypes.STRING,
            allowNull: true
        },
        cidade: {
            type: DataTypes.STRING,
            allowNull: true
        },
        bairro: {
            type: DataTypes.STRING,
            allowNull: true
        },
        cep: {
            type: DataTypes.STRING,
            allowNull: true
        },
        uf: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                len: [2, 2]
            }
        }
    }, {
        freezeTableName: true,
        timestamps: false
    }
);

sequelize.sync()

module.exports = ClienteModel;
