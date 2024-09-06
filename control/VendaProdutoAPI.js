const express = require("express");
const { validaVendaProduto } = require('../validators/VendaProdutoValidator');
const router = express.Router();

const { sucess, fail } = require("../helpers/resposta");
const auth = require("../helpers/authUtils");
const VendaProdutoDAO = require('../services/VendaProdutoDAO.js');  

// Rota para criar um novo item de venda
router.post("/", auth.validaJWT, validaVendaProduto, async (req, res) => {
    // #swagger.description = 'Cria um novo item de venda.'
    // #swagger.parameters['body'] = {
    //   in: 'body',
    //   description: 'Informações do novo item de venda.',
    //   required: true,
    //   schema: {
    //     type: 'object',
    //     properties: {
    //       vendaId: { type: 'integer', description: 'ID da venda' },
    //       produtoId: { type: 'integer', description: 'ID do produto' },
    //       quantidade: { type: 'integer', description: 'Quantidade do produto' },
    //       valorUnitario: { type: 'number', description: 'Valor unitário do produto' }
    //     }
    //   }
    // }
    // #swagger.responses[200] = {
    //   description: 'Item de venda criado com sucesso.',
    //   schema: {
    //     status: true,
    //     item: { type: 'object' }
    //   }
    // }
    try {
        let obj = await VendaProdutoDAO.create(req.body);
        if (obj) {
            res.json(sucess(obj, 'VendaProduto'));
        } else {
            res.status(500).json(fail("Falha ao salvar o novo item de venda"));
        }
    } catch (error) {
        res.status(500).json(fail("Erro no servidor: " + error.message));
    }
});

// Rota para atualizar um item de venda
router.put("/:id", auth.validaJWT, validaVendaProduto, async (req, res) => {
    // #swagger.description = 'Atualiza os dados de um item de venda pelo ID.'
    // #swagger.parameters['id'] = { description: 'ID do item de venda a ser atualizado.', type: 'integer' }
    // #swagger.parameters['body'] = {
    //   in: 'body',
    //   description: 'Dados atualizados do item de venda.',
    //   required: true,
    //   schema: {
    //     type: 'object',
    //     properties: {
    //       vendaId: { type: 'integer', description: 'ID da venda' },
    //       produtoId: { type: 'integer', description: 'ID do produto' },
    //       quantidade: { type: 'integer', description: 'Quantidade do produto' },
    //       valorUnitario: { type: 'number', description: 'Valor unitário do produto' }
    //     }
    //   }
    // }
    // #swagger.responses[200] = {
    //   description: 'Item de venda atualizado com sucesso.',
    //   schema: {
    //     status: true,
    //     message: { type: 'string', description: 'Mensagem de sucesso.' }
    //   }
    // }
    try {
        let existente = await VendaProdutoDAO.getById(req.params.id);

        if (!existente) {
            return res.status(404).json(fail("Item de venda não encontrado"));
        }

        let [result] = await VendaProdutoDAO.update(req.params.id, req.body);
        if (result)
            res.json(sucess('Item de venda atualizado com sucesso', 'message'));
        else
            res.status(500).json(fail("Nenhuma alteração realizada"));
    } catch (error) {
        res.status(500).json(fail("Erro no servidor: " + error.message));
    }
});

// Rota para excluir um item de venda
router.delete("/:id", auth.validaJWT, auth.verificaAcesso(2), async (req, res) => {
    // #swagger.description = 'Exclui um item de venda pelo ID.'
    // #swagger.parameters['id'] = { description: 'ID do item de venda a ser excluído.', type: 'integer' }
    // #swagger.responses[200] = {
    //   description: 'Item de venda excluído com sucesso.',
    //   schema: {
    //     status: true,
    //     message: { type: 'string', description: 'Mensagem de sucesso.' }
    //   }
    // }
    try {
        let item = await VendaProdutoDAO.getById(req.params.id);

        if (!item) {
            return res.status(404).json(fail("Item de venda não encontrado"));
        }

        let result = await VendaProdutoDAO.delete(req.params.id);
        if (result)
            res.json(sucess('Item de venda excluído com sucesso', 'message'));
        else
            res.status(500).json(fail("Erro ao excluir item de venda"));
    } catch (error) {
        res.status(500).json(fail("Erro no servidor: " + error.message));
    }
});

// Rota para listar itens de venda com paginação ou lista completa
router.get("/list", auth.validaJWT, async (req, res) => {
    // #swagger.description = 'Lista itens de venda com paginação ou lista completa.'
    // #swagger.parameters['query'] = {
    //   in: 'query',
    //   description: 'Parâmetros de paginação e filtro.',
    //   required: true,
    //   schema: {
    //     type: 'object',
    //     properties: {
    //       vendaId: { type: 'integer', description: 'ID da venda' },
    //       pagina: { type: 'integer', description: 'Número da página' },
    //       limite: { type: 'integer', description: 'Quantidade de itens por página' }
    //     }
    //   }
    // }
    // #swagger.responses[200] = {
    //   description: 'Lista de itens de venda paginada ou completa.',
    //   schema: {
    //     status: true,
    //     items: { type: 'array', items: { type: 'object' } }
    //   }
    // }
    try {
        const vendaId = req.query.vendaId;
        if (!vendaId) {
            return res.status(400).json(fail("O parâmetro vendaId é obrigatório."));
        }

        let { pagina, limite } = req.query;

        if (pagina && limite) {
            let result = await VendaProdutoDAO.listPage(vendaId, pagina, limite);
            if (result)
                res.json(sucess(result, 'Itens de venda página'));
            else
                res.status(500).json(fail("Erro ao listar itens de venda"));
        } else {
            let result = await VendaProdutoDAO.list(vendaId);
            if (result)
                res.json(sucess(result, 'Itens de venda'));
            else
                res.status(500).json(fail("Erro ao listar itens de venda"));
        }
    } catch (error) {
        res.status(500).json(fail("Erro no servidor: " + error.message));
    }
}); 

// Rota para obter um item de venda pelo ID
router.get("/:id", auth.validaJWT, async (req, res) => {
    // #swagger.description = 'Obtém um item de venda pelo ID.'
    // #swagger.parameters['id'] = { description: 'ID do item de venda a ser recuperado.', type: 'integer' }
    // #swagger.responses[200] = {
    //   description: 'Item de venda recuperado com sucesso.',
    //   schema: {
    //     status: true,
    //     item: { type: 'object' }
    //   }
    // }
    try {
        let item = await VendaProdutoDAO.getById(req.params.id);

        if (item) {
            res.json(sucess(item, 'Item de venda'));
        } else {
            res.status(404).json(fail("Item de venda não encontrado"));
        }
    } catch (error) {
        res.status(500).json(fail("Erro no servidor: " + error.message));
    }
});

module.exports = router;
