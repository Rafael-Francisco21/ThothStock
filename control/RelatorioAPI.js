const express = require('express');
const router = express.Router();
const RelatorioDAO = require('../services/RelatorioDAO');
const {
    relatorioVendasSchema,
    relatorioComprasSchema,
    lucroBrutoSchema,
    totalVendaSchema,
    validarEntrada
} = require('../validators/RelatorioValidator');
const { sucess, fail } = require("../helpers/resposta");
const auth = require("../helpers/authUtils");

// Rota para relatório de vendas
router.get('/vendas', auth.validaJWT, auth.verificaAcesso(2), async (req, res) => {
    // #swagger.description = 'Gera um relatório de vendas com base nos filtros fornecidos.'
    // #swagger.parameters['body'] = {
    //   in: 'body',
    //   description: 'Filtros para o relatório de vendas.',
    //   required: true,
    //   schema: {
    //     type: 'object',
    //     properties: {
    //       dataInicio: { type: 'string', format: 'date', description: 'Data de início para o relatório' },
    //       dataFim: { type: 'string', format: 'date', description: 'Data de fim para o relatório' },
    //       clienteId: { type: 'string', description: 'ID do cliente para filtrar as vendas' },
    //       produtoId: { type: 'string', description: 'ID do produto para filtrar as vendas' },
    //       usuarioId: { type: 'string', description: 'ID do usuário para filtrar as vendas' }
    //     }
    //   }
    // }
    // #swagger.responses[200] = {
    //   description: 'Relatório de vendas gerado com sucesso.',
    //   schema: {
    //     status: true,
    //     data: { type: 'array', items: { type: 'object' } },
    //     message: { type: 'string', example: 'Vendas' }
    //   }
    // }
    // #swagger.responses[400] = {
    //   description: 'Erro na validação dos parâmetros de entrada.',
    //   schema: {
    //     status: false,
    //     message: { type: 'string', example: 'Erro na validação dos parâmetros de entrada' }
    //   }
    // }
    try {
        // Valida as entradas
        validarEntrada(relatorioVendasSchema, req.body);

        const { dataInicio, dataFim, clienteId, produtoId, usuarioId } = req.body;
        
        const relatorio = await RelatorioDAO.relatorioVendas(dataInicio, dataFim, clienteId, produtoId, usuarioId);
        res.json(sucess(relatorio, 'Vendas'));
    } catch (error) {
        res.status(400).json(fail(error.message));
    }
});

// Rota para relatório de compras
router.get('/compras', auth.validaJWT, auth.verificaAcesso(2), async (req, res) => {
    // #swagger.description = 'Gera um relatório de compras com base nos filtros fornecidos.'
    // #swagger.parameters['body'] = {
    //   in: 'body',
    //   description: 'Filtros para o relatório de compras.',
    //   required: true,
    //   schema: {
    //     type: 'object',
    //     properties: {
    //       dataInicio: { type: 'string', format: 'date', description: 'Data de início para o relatório' },
    //       dataFim: { type: 'string', format: 'date', description: 'Data de fim para o relatório' },
    //       fornecedorId: { type: 'string', description: 'ID do fornecedor para filtrar as compras' },
    //       produtoId: { type: 'string', description: 'ID do produto para filtrar as compras' },
    //       usuarioId: { type: 'string', description: 'ID do usuário para filtrar as compras' }
    //     }
    //   }
    // }
    // #swagger.responses[200] = {
    //   description: 'Relatório de compras gerado com sucesso.',
    //   schema: {
    //     status: true,
    //     data: { type: 'array', items: { type: 'object' } },
    //     message: { type: 'string', example: 'Compras' }
    //   }
    // }
    // #swagger.responses[400] = {
    //   description: 'Erro na validação dos parâmetros de entrada.',
    //   schema: {
    //     status: false,
    //     message: { type: 'string', example: 'Erro na validação dos parâmetros de entrada' }
    //   }
    // }
    try {
        // Valida as entradas
        validarEntrada(relatorioComprasSchema, req.body);

        const { dataInicio, dataFim, fornecedorId, produtoId, usuarioId } = req.body;
        
        const relatorio = await RelatorioDAO.relatorioCompras(dataInicio, dataFim, fornecedorId, produtoId, usuarioId);
        res.json(sucess(relatorio, 'Compras'));
    } catch (error) {
        res.status(400).json(fail(error.message));
    }
});

// Rota para relatório de lucro bruto
router.get('/bruto', auth.validaJWT, auth.verificaAcesso(2), async (req, res) => {
    // #swagger.description = 'Gera um relatório de lucro bruto com base nas datas fornecidas.'
    // #swagger.parameters['body'] = {
    //   in: 'body',
    //   description: 'Datas para calcular o lucro bruto.',
    //   required: true,
    //   schema: {
    //     type: 'object',
    //     properties: {
    //       dataInicio: { type: 'string', format: 'date', description: 'Data de início para o cálculo do lucro bruto' },
    //       dataFim: { type: 'string', format: 'date', description: 'Data de fim para o cálculo do lucro bruto' }
    //     }
    //   }
    // }
    // #swagger.responses[200] = {
    //   description: 'Relatório de lucro bruto gerado com sucesso.',
    //   schema: {
    //     status: true,
    //     data: { type: 'number', description: 'Lucro Bruto' },
    //     message: { type: 'string', example: 'Lucro Bruto' }
    //   }
    // }
    // #swagger.responses[400] = {
    //   description: 'Erro na validação dos parâmetros de entrada.',
    //   schema: {
    //     status: false,
    //     message: { type: 'string', example: 'Erro na validação dos parâmetros de entrada' }
    //   }
    // }
    try {
        // Valida as entradas
        validarEntrada(lucroBrutoSchema, req.body);

        const { dataInicio, dataFim } = req.body;
        
        const lucroBruto = await RelatorioDAO.lucroBruto(dataInicio, dataFim);
        res.json(sucess(lucroBruto, 'Lucro Bruto'));
    } catch (error) {
        res.status(400).json(fail(error.message));
    }
});

// Rota para relatório de lucro líquido
router.get('/totalvenda', auth.validaJWT, auth.verificaAcesso(2), async (req, res) => {
    // #swagger.description = 'Gera um relatório de total de vendas com base nas datas fornecidas.'
    // #swagger.parameters['body'] = {
    //   in: 'body',
    //   description: 'Datas para calcular o total de vendas.',
    //   required: true,
    //   schema: {
    //     type: 'object',
    //     properties: {
    //       dataInicio: { type: 'string', format: 'date', description: 'Data de início para o cálculo do total de vendas' },
    //       dataFim: { type: 'string', format: 'date', description: 'Data de fim para o cálculo do total de vendas' }
    //     }
    //   }
    // }
    // #swagger.responses[200] = {
    //   description: 'Relatório de total de vendas gerado com sucesso.',
    //   schema: {
    //     status: true,
    //     data: { type: 'number', description: 'Total de Vendas' },
    //     message: { type: 'string', example: 'Total vendido' }
    //   }
    // }
    // #swagger.responses[400] = {
    //   description: 'Erro na validação dos parâmetros de entrada.',
    //   schema: {
    //     status: false,
    //     message: { type: 'string', example: 'Erro na validação dos parâmetros de entrada' }
    //   }
    // }
    try {
        // Valida as entradas
        validarEntrada(totalVendaSchema, req.body);

        const { dataInicio, dataFim } = req.body;
        
        const totalVenda = await RelatorioDAO.totalVenda(dataInicio, dataFim);
        res.json(sucess(totalVenda, 'Total vendido'));
    } catch (error) {
        res.status(400).json(fail(error.message));
    }
});

module.exports = router;
