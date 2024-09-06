const express = require("express");
const { validaVenda } = require('../validators/VendaValidator');
const router = express.Router();

const { sucess, fail } = require("../helpers/resposta");
const auth = require("../helpers/authUtils");
const VendaDAO = require('../services/VendaDAO.js');

// Rota para criar uma nova venda
router.post("/", auth.validaJWT, validaVenda, async (req, res) => {
    // #swagger.description = 'Cria uma nova venda.'
    // #swagger.parameters['body'] = {
    //   in: 'body',
    //   description: 'Informações da nova venda.',
    //   required: true,
    //   schema: {
    //     type: 'object',
    //     properties: {
    //       clienteId: { type: 'integer', description: 'ID do cliente' },
    //       usuarioId: { type: 'integer', description: 'ID do usuário responsável pela venda' },
    //       data: { type: 'string', format: 'date-time', description: 'Data da venda' },
    //       total: { type: 'number', format: 'float', description: 'Valor total da venda' }
    //     }
    //   }
    // }
    // #swagger.responses[200] = {
    //   description: 'Venda criada com sucesso.',
    //   schema: {
    //     status: true,
    //     venda: { type: 'object' }
    //   }
    // }
    try {
        let obj = await VendaDAO.create(req.body);
        if (obj) {
            res.json(sucess(obj, 'Venda'));
        } else {
            res.status(500).json(fail("Falha ao salvar a nova venda"));
        }
    } catch (error) {
        res.status(500).json(fail("Erro no servidor: " + error.message));
    }
});

// Rota para atualizar os dados de uma venda pelo ID
router.put("/:id", auth.validaJWT, validaVenda, async (req, res) => {
    // #swagger.description = 'Atualiza os dados de uma venda pelo ID.'
    // #swagger.parameters['id'] = { description: 'ID da venda a ser atualizada.', type: 'string' }
    // #swagger.parameters['body'] = {
    //   in: 'body',
    //   description: 'Dados atualizados da venda.',
    //   required: true,
    //   schema: {
    //     type: 'object',
    //     properties: {
    //       clienteId: { type: 'integer', description: 'ID do cliente' },
    //       usuarioId: { type: 'integer', description: 'ID do usuário responsável pela venda' },
    //       data: { type: 'string', format: 'date-time', description: 'Data da venda' },
    //       total: { type: 'number', format: 'float', description: 'Valor total da venda' }
    //     }
    //   }
    // }
    // #swagger.responses[200] = {
    //   description: 'Venda atualizada com sucesso.',
    //   schema: {
    //     status: true,
    //     message: { type: 'string', description: 'Mensagem de sucesso.' }
    //   }
    // }
    try {
        let existente = await VendaDAO.getById(req.params.id);

        if (!existente)
            return res.status(400).json(fail("Venda não encontrada")); 

        let [result] = await VendaDAO.update(req.params.id, req.body);
        if (result)
            res.json(sucess('Venda atualizada com sucesso', 'message'));
        else
            res.status(500).json(fail("Nenhuma alteração realizada"));
    } catch (error) {
        res.status(500).json(fail("Erro no servidor: " + error.message));
    }
});

// Rota para excluir uma venda pelo ID
router.delete("/:id", auth.validaJWT, auth.verificaAcesso(2), async (req, res) => {
    // #swagger.description = 'Exclui uma venda pelo ID.'
    // #swagger.parameters['id'] = { description: 'ID da venda a ser excluída.', type: 'string' }
    // #swagger.responses[200] = {
    //   description: 'Venda excluída com sucesso.',
    //   schema: {
    //     status: true,
    //     message: { type: 'string', description: 'Mensagem de sucesso.' }
    //   }
    // }
    try {
        let venda = await VendaDAO.getById(req.params.id);

        if (!venda) {
            return res.status(404).json(fail("Venda não encontrada"));
        }

        let result = await VendaDAO.delete(venda.codigo);
        if (result)
            res.json(sucess('Venda excluída com sucesso', 'message'));
        else
            res.status(500).json(fail("Erro ao excluir venda"));
    } catch (error) {
        res.status(500).json(fail("Erro no servidor: " + error.message));
    }
});

// Rota para listar as vendas com paginação ou lista completa
router.get("/list", auth.validaJWT, async (req, res) => {
    // #swagger.description = 'Lista as vendas com paginação ou lista completa.'
    // #swagger.parameters['query'] = {
    //   in: 'query',
    //   description: 'Parâmetros de paginação.',
    //   required: false,
    //   schema: {
    //     type: 'object',
    //     properties: {
    //       pagina: { type: 'integer', description: 'Número da página' },
    //       limite: { type: 'integer', description: 'Quantidade de itens por página' }
    //     }
    //   }
    // }
    // #swagger.responses[200] = {
    //   description: 'Lista de vendas paginada ou completa.',
    //   schema: {
    //     status: true,
    //     vendas: { type: 'array', items: { type: 'object' } }
    //   }
    // }
    try {
        let { pagina, limite } = req.query;

        if (pagina && limite) {
            let result = await VendaDAO.listPage(pagina, limite);
            if (result)
                res.json(sucess(result, 'Vendas página'));
            else
                res.status(500).json(fail("Erro ao listar vendas"));
        } else {
            let result = await VendaDAO.list();
            if (result)
                res.json(sucess(result, 'Vendas'));
            else
                res.status(500).json(fail("Erro ao listar vendas"));
        }
    } catch (error) {
        res.status(500).json(fail("Erro no servidor: " + error.message));
    }
});

// Rota para obter uma venda pelo ID
router.get("/:id", auth.validaJWT, async (req, res) => {
    // #swagger.description = 'Obtém uma venda pelo ID.'
    // #swagger.parameters['id'] = { description: 'ID da venda a ser obtida.', type: 'string' }
    // #swagger.responses[200] = {
    //   description: 'Venda obtida com sucesso.',
    //   schema: {
    //     status: true,
    //     venda: { type: 'object' }
    //   }
    // }
    try {
        let venda = await VendaDAO.getById(req.params.id);

        if (venda) {
            res.json(sucess(venda, 'Venda'));
        } else {
            res.status(404).json(fail("Venda não encontrada"));
        }
    } catch (error) {
        res.status(500).json(fail("Erro no servidor: " + error.message));
    }
});

module.exports = router;
