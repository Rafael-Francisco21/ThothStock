const express = require("express");
const { validaCompra } = require('../validators/CompraValidator');
const router = express.Router();

const { sucess, fail } = require("../helpers/resposta");
const auth = require("../helpers/authUtils");
const CompraDAO = require('../services/CompraDAO');

router.post("/", auth.validaJWT, validaCompra, async (req, res) => {
    // #swagger.description = 'Cria uma nova compra.'
    // #swagger.parameters['body'] = {
    //   in: 'body',
    //   description: 'Dados da nova compra.',
    //   required: true,
    //   schema: {
    //     type: 'object',
    //     properties: {
    //       fornecedor: { type: 'string', description: 'Fornecedor da compra' },
    //       total: { type: 'number', description: 'Total da compra' },
    //       data: { type: 'string', format: 'date', description: 'Data da compra' },
    //       produtos: { 
    //         type: 'array',
    //         items: {
    //           type: 'object',
    //           properties: {
    //             codigo: { type: 'string', description: 'Código do produto' },
    //             quantidade: { type: 'number', description: 'Quantidade comprada' },
    //             valor: { type: 'number', description: 'Valor unitário do produto' }
    //           }
    //         }
    //       }
    //     }
    //   }
    // }
    // #swagger.responses[200] = {
    //   description: 'Compra criada com sucesso.',
    //   schema: {
    //     status: true,
    //     compra: { type: 'object' }
    //   }
    // }
    try {
        let obj = await CompraDAO.create(req.body);
        if (obj) {
            res.json(sucess(obj, 'Compra'));
        } else {
            res.status(500).json(fail("Falha ao salvar a nova compra"));
        }
    } catch (error) {
        res.status(500).json(fail("Erro no servidor: " + error.message));
    }
});

router.put("/:id", auth.validaJWT, validaCompra, async (req, res) => {
    // #swagger.description = 'Atualiza os dados de uma compra pelo ID.'
    // #swagger.parameters['id'] = { description: 'ID da compra a ser atualizada.', type: 'string' }
    // #swagger.parameters['body'] = {
    //   in: 'body',
    //   description: 'Dados atualizados da compra.',
    //   required: true,
    //   schema: {
    //     type: 'object',
    //     properties: {
    //       fornecedor: { type: 'string', description: 'Fornecedor da compra' },
    //       total: { type: 'number', description: 'Total da compra' },
    //       data: { type: 'string', format: 'date', description: 'Data da compra' },
    //       produtos: { 
    //         type: 'array',
    //         items: {
    //           type: 'object',
    //           properties: {
    //             codigo: { type: 'string', description: 'Código do produto' },
    //             quantidade: { type: 'number', description: 'Quantidade comprada' },
    //             valor: { type: 'number', description: 'Valor unitário do produto' }
    //           }
    //         }
    //       }
    //     }
    //   }
    // }
    // #swagger.responses[200] = {
    //   description: 'Compra atualizada com sucesso.',
    //   schema: {
    //     status: true,
    //     message: { type: 'string', description: 'Mensagem de sucesso.' }
    //   }
    // }
    try {
        let existente = await CompraDAO.getById(req.params.id);
        if (!existente) {
            return res.status(404).json(fail("Compra não encontrada"));
        }

        let [result] = await CompraDAO.update(req.params.id, req.body);
        if (result)
            res.json(sucess('Compra atualizada com sucesso', 'message'));
        else
            res.status(500).json(fail("Nenhuma alteração realizada"));
    } catch (error) {
        res.status(500).json(fail("Erro no servidor: " + error.message));
    }
});

router.delete("/:id", auth.validaJWT, auth.verificaAcesso(2), async (req, res) => {
    // #swagger.description = 'Exclui uma compra pelo ID.'
    // #swagger.parameters['id'] = { description: 'ID da compra a ser excluída.', type: 'string' }
    // #swagger.responses[200] = {
    //   description: 'Compra excluída com sucesso.',
    //   schema: {
    //     status: true,
    //     message: { type: 'string', description: 'Mensagem de sucesso.' }
    //   }
    // }
    try {
        let compra = await CompraDAO.getById(req.params.id);
        if (!compra) {
            return res.status(404).json(fail("Compra não encontrada"));
        }

        let result = await CompraDAO.delete(compra.codigo);
        if (result)
            res.json(sucess('Compra excluída com sucesso', 'message'));
        else
            res.status(500).json(fail("Erro ao excluir compra"));
    } catch (error) {
        res.status(500).json(fail("Erro no servidor: " + error.message));
    }
});

router.get("/list", auth.validaJWT, async (req, res) => {
    // #swagger.description = 'Lista todas as compras com paginação ou lista completa.'
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
    //   description: 'Lista de compras paginada ou completa.',
    //   schema: {
    //     status: true,
    //     compras: { type: 'array', items: { type: 'object' } }
    //   }
    // }
    try {
        let { pagina, limite } = req.query;

        if (pagina && limite) {
            let result = await CompraDAO.listPage(pagina, limite);
            if (result)
                res.json(sucess(result, 'Compras página'));
            else
                res.status(500).json(fail("Erro ao listar compras"));
        } else {
            let result = await CompraDAO.list();
            if (result)
                res.json(sucess(result, 'Compras'));
            else
                res.status(500).json(fail("Erro ao listar compras"));
        }
    } catch (error) {
        res.status(500).json(fail("Erro no servidor: " + error.message));
    }
});

router.get("/:id", auth.validaJWT, async (req, res) => {
    // #swagger.description = 'Busca uma compra pelo ID.'
    // #swagger.parameters['id'] = { description: 'ID da compra a ser buscada.', type: 'string' }
    // #swagger.responses[200] = {
    //   description: 'Compra encontrada com sucesso.',
    //   schema: {
    //     status: true,
    //     compra: { type: 'object' }
    //   }
    // }
    try {
        let compra = await CompraDAO.getById(req.params.id);
        if (compra) {
            res.json(sucess(compra, 'Compra'));
        } else {
            res.status(404).json(fail("Compra não encontrada"));
        }
    } catch (error) {
        res.status(500).json(fail("Erro no servidor: " + error.message));
    }
});

module.exports = router;
