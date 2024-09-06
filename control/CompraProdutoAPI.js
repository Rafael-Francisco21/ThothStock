const express = require("express");
const router = express.Router();
const { validaCompraProduto } = require('../validators/CompraProdutoValidator');
const { sucess, fail } = require("../helpers/resposta");
const CompraProdutoDAO = require('../services/CompraProdutoDAO');
const auth = require("../helpers/authUtils");

router.post("/", auth.validaJWT, validaCompraProduto, async (req, res) => {
    // #swagger.description = 'Cria um novo item de compra.'
    // #swagger.parameters['body'] = {
    //   in: 'body',
    //   description: 'Dados do novo item de compra.',
    //   required: true,
    //   schema: {
    //     type: 'object',
    //     properties: {
    //       compraId: { type: 'string', description: 'ID da compra associada' },
    //       produtoId: { type: 'string', description: 'ID do produto' },
    //       quantidade: { type: 'number', description: 'Quantidade comprada' },
    //       valor: { type: 'number', description: 'Valor unitário do produto' }
    //     }
    //   }
    // }
    // #swagger.responses[200] = {
    //   description: 'Item de compra criado com sucesso.',
    //   schema: {
    //     status: true,
    //     item: { type: 'object' }
    //   }
    // }
    try {
        let obj = await CompraProdutoDAO.create(req.body);
        if (obj) {
            res.json(sucess(obj, 'Item de compra criado com sucesso'));
        } else {
            res.status(500).json(fail("Falha ao criar o item de compra"));
        }
    } catch (error) {
        res.status(500).json(fail("Erro no servidor: " + error.message));
    }
});

router.put("/:id", auth.validaJWT, validaCompraProduto, async (req, res) => {
    // #swagger.description = 'Atualiza um item de compra pelo ID.'
    // #swagger.parameters['id'] = { description: 'ID do item de compra a ser atualizado.', type: 'string' }
    // #swagger.parameters['body'] = {
    //   in: 'body',
    //   description: 'Dados atualizados do item de compra.',
    //   required: true,
    //   schema: {
    //     type: 'object',
    //     properties: {
    //       produtoId: { type: 'string', description: 'ID do produto' },
    //       quantidade: { type: 'number', description: 'Quantidade comprada' },
    //       valor: { type: 'number', description: 'Valor unitário do produto' }
    //     }
    //   }
    // }
    // #swagger.responses[200] = {
    //   description: 'Item de compra atualizado com sucesso.',
    //   schema: {
    //     status: true,
    //     message: { type: 'string', description: 'Mensagem de sucesso.' }
    //   }
    // }
    try {
        let [result] = await CompraProdutoDAO.update(req.params.id, req.body);
        if (result) {
            res.json(sucess('Item de compra atualizado com sucesso', 'message'));
        } else {
            res.status(500).json(fail("Nenhuma alteração realizada"));
        }
    } catch (error) {
        res.status(500).json(fail("Erro no servidor: " + error.message));
    }
});

router.delete("/:id", auth.validaJWT, async (req, res) => {
    // #swagger.description = 'Exclui um item de compra pelo ID.'
    // #swagger.parameters['id'] = { description: 'ID do item de compra a ser excluído.', type: 'string' }
    // #swagger.responses[200] = {
    //   description: 'Item de compra excluído com sucesso.',
    //   schema: {
    //     status: true,
    //     message: { type: 'string', description: 'Mensagem de sucesso.' }
    //   }
    // }
    try {
        let result = await CompraProdutoDAO.delete(req.params.id);
        if (result) {
            res.json(sucess('Item de compra excluído com sucesso', 'message'));
        } else {
            res.status(500).json(fail("Erro ao excluir item de compra"));
        }
    } catch (error) {
        res.status(500).json(fail("Erro no servidor: " + error.message));
    }
});

router.get("/list", auth.validaJWT, async (req, res) => {
    // #swagger.description = 'Lista todos os itens de compra, com suporte à paginação.'
    // #swagger.parameters['query'] = {
    //   in: 'query',
    //   description: 'Parâmetros de paginação e ID da compra associada.',
    //   schema: {
    //     type: 'object',
    //     properties: {
    //       compraId: { type: 'string', description: 'ID da compra associada' },
    //       pagina: { type: 'integer', description: 'Número da página' },
    //       limite: { type: 'integer', description: 'Itens por página' }
    //     }
    //   }
    // }
    // #swagger.responses[200] = {
    //   description: 'Itens de compra listados com sucesso.',
    //   schema: {
    //     status: true,
    //     items: { type: 'array', items: { type: 'object' } }
    //   }
    // }
    try {
        let { compraId, pagina, limite } = req.query;

        if (pagina && limite) {
            let result = await CompraProdutoDAO.listPage(compraId, pagina, limite);
            if (result) {
                res.json(sucess(result, 'Itens de compra página'));
            } else {
                res.status(500).json(fail("Erro ao listar itens de compra"));
            }
        } else {
            let result = await CompraProdutoDAO.list(compraId);
            if (result) {
                res.json(sucess(result, 'Itens de compra'));
            } else {
                res.status(500).json(fail("Erro ao listar itens de compra"));
            }
        }
    } catch (error) {
        res.status(500).json(fail("Erro no servidor: " + error.message));
    }
});

router.get("/:id", auth.validaJWT, async (req, res) => {
    // #swagger.description = 'Busca um item de compra pelo ID.'
    // #swagger.parameters['id'] = { description: 'ID do item de compra a ser buscado.', type: 'string' }
    // #swagger.responses[200] = {
    //   description: 'Item de compra encontrado com sucesso.',
    //   schema: {
    //     status: true,
    //     item: { type: 'object' }
    //   }
    // }
    try {
        let item = await CompraProdutoDAO.getById(req.params.id);
        if (item) {
            res.json(sucess(item, 'Item de compra'));
        } else {
            res.status(404).json(fail("Item de compra não encontrado"));
        }
    } catch (error) {
        res.status(500).json(fail("Erro no servidor: " + error.message));
    }
});

module.exports = router;
