const express = require('express');
const router = express.Router();
const RelatorioDAO = require('../services/RelatorioDAO');
const {
    relatorioVendasSchema,
    relatorioComprasSchema,
    lucroBrutoSchema,
    totalVendaSchema
} = require('../validators/RelatorioValidator');

// Função para validar a entrada com Joi
const validarEntrada = (schema, data) => {
    const { error } = schema.validate(data);
    if (error) {
        throw new Error(error.details[0].message);
    }
};

// Rota para relatório de vendas
router.get('/vendas', async (req, res) => {
    try {
        // Valida as entradas
        validarEntrada(relatorioVendasSchema, req.body);

        const { dataInicio, dataFim, clienteId, produtoId, usuarioId } = req.body;
        
        const relatorio = await RelatorioDAO.relatorioVendas(dataInicio, dataFim, clienteId, produtoId, usuarioId);
        res.json({ status: true, data: relatorio });
    } catch (error) {
        res.status(400).json({ status: false, message: error.message });
    }
});

// Rota para relatório de compras
router.get('/compras', async (req, res) => {
    try {
        // Valida as entradas
        validarEntrada(relatorioComprasSchema, req.body);

        const { dataInicio, dataFim, fornecedorId, produtoId, usuarioId } = req.body;
        
        const relatorio = await RelatorioDAO.relatorioCompras(dataInicio, dataFim, fornecedorId, produtoId, usuarioId);
        res.json({ status: true, data: relatorio });
    } catch (error) {
        res.status(400).json({ status: false, message: error.message });
    }
});

// Rota para relatório de lucro bruto
router.get('/bruto', async (req, res) => {
    try {
        // Valida as entradas
        validarEntrada(lucroBrutoSchema, req.body);

        const { dataInicio, dataFim } = req.body;
        
        const lucroBruto = await RelatorioDAO.lucroBruto(dataInicio, dataFim);
        res.json({ status: true, lucroBruto });
    } catch (error) {
        res.status(400).json({ status: false, message: error.message });
    }
});

// Rota para relatório de lucro líquido
router.get('/totalvenda', async (req, res) => {
    try {
        // Valida as entradas
        validarEntrada(totalVendaSchema, req.body);

        const { dataInicio, dataFim } = req.body;
        
        const totalVenda = await RelatorioDAO.totalVenda(dataInicio, dataFim);
        res.json({ status: true, totalVenda });
    } catch (error) {
        res.status(400).json({ status: false, message: error.message });
    }
});

module.exports = router;
