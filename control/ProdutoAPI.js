const express = require("express");
const { validaProduto } = require('../validators/ProdutoValidator');
const router = express.Router();

const { sucess, fail } = require("../helpers/resposta");
const auth = require("../helpers/authUtils");
const ProdutoDAO = require('../services/ProdutoDAO.js');

router.post("/", auth.validaJWT, validaProduto, async (req, res) => {
    // #swagger.description = 'Cria um novo produto.'
    // #swagger.parameters['body'] = {
    //   in: 'body',
    //   description: 'Dados do novo produto.',
    //   required: true,
    //   schema: {
    //     type: 'object',
    //     properties: {
    //       descricao: { type: 'string', description: 'Descrição do produto' },
    //       custo: { type: 'number', description: 'Custo do produto' },
    //       valor: { type: 'number', description: 'Valor de venda do produto' },
    //       estoque: { type: 'number', description: 'Quantidade em estoque do produto' }
    //     }
    //   }
    // }
    // #swagger.responses[200] = {
    //   description: 'Produto criado com sucesso.',
    //   schema: {
    //     status: true,
    //     data: { type: 'object' },
    //     message: { type: 'string', example: 'Produto' }
    //   }
    // }
    // #swagger.responses[500] = {
    //   description: 'Falha ao salvar o novo produto.',
    //   schema: {
    //     status: false,
    //     message: { type: 'string', example: 'Falha ao salvar o novo produto' }
    //   }
    // }
    try {
        let obj = await ProdutoDAO.create(req.body);
        if (obj) {
            res.json(sucess(obj, 'Produto'));
        } else {
            res.status(500).json(fail("Falha ao salvar o novo produto"));
        }
    } catch (error) {
        res.status(500).json(fail("Erro no servidor: " + error.message));
    }
});

router.put("/:id", auth.validaJWT, validaProduto, async (req, res) => {
    // #swagger.description = 'Atualiza um produto existente.'
    // #swagger.parameters['id'] = { description: 'ID do produto a ser atualizado.', type: 'string' }
    // #swagger.parameters['body'] = {
    //   in: 'body',
    //   description: 'Dados atualizados do produto.',
    //   required: true,
    //   schema: {
    //     type: 'object',
    //     properties: {
    //       descricao: { type: 'string', description: 'Descrição do produto' },
    //       custo: { type: 'number', description: 'Custo do produto' },
    //       valor: { type: 'number', description: 'Valor de venda do produto' },
    //       estoque: { type: 'number', description: 'Quantidade em estoque do produto' }
    //     }
    //   }
    // }
    // #swagger.responses[200] = {
    //   description: 'Produto atualizado com sucesso.',
    //   schema: {
    //     status: true,
    //     message: { type: 'string', example: 'Produto atualizado com sucesso' }
    //   }
    // }
    // #swagger.responses[400] = {
    //   description: 'Produto não encontrado.',
    //   schema: {
    //     status: false,
    //     message: { type: 'string', example: 'Produto não encontrado' }
    //   }
    // }
    // #swagger.responses[500] = {
    //   description: 'Nenhuma alteração realizada.',
    //   schema: {
    //     status: false,
    //     message: { type: 'string', example: 'Nenhuma alteração realizada' }
    //   }
    // }
    try {
        let existente = await ProdutoDAO.getById(req.params.id);

        if (!existente) {
            return res.status(400).json(fail("Produto não encontrado")); 
        }

        let [result] = await ProdutoDAO.update(req.params.id, req.body);
        if (result)
            res.json(sucess('Produto atualizado com sucesso', 'message'));
        else
            res.status(500).json(fail("Nenhuma alteração realizada"));
    } catch (error) {
        res.status(500).json(fail("Erro no servidor: " + error.message));
    }
});

router.delete("/:id", auth.validaJWT, auth.verificaAcesso(2), async (req, res) => {
    // #swagger.description = 'Exclui um produto pelo ID.'
    // #swagger.parameters['id'] = { description: 'ID do produto a ser excluído.', type: 'string' }
    // #swagger.responses[200] = {
    //   description: 'Produto excluído com sucesso.',
    //   schema: {
    //     status: true,
    //     message: { type: 'string', example: 'Produto excluído com sucesso' }
    //   }
    // }
    // #swagger.responses[404] = {
    //   description: 'Produto não encontrado.',
    //   schema: {
    //     status: false,
    //     message: { type: 'string', example: 'Produto não encontrado' }
    //   }
    // }
    // #swagger.responses[500] = {
    //   description: 'Erro ao excluir produto.',
    //   schema: {
    //     status: false,
    //     message: { type: 'string', example: 'Erro ao excluir produto' }
    //   }
    // }
    try {
        let produto = await ProdutoDAO.getById(req.params.id);

        if (!produto) {
            return res.status(404).json(fail("Produto não encontrado"));
        }

        let result = await ProdutoDAO.delete(produto.codigo);
        if (result)
            res.json(sucess('Produto excluído com sucesso', 'message'));
        else
            res.status(500).json(fail("Erro ao excluir produto"));
    } catch (error) {
        res.status(500).json(fail("Erro no servidor: " + error.message));
    }
});

router.get("/list", auth.validaJWT, async (req, res) => {
    // #swagger.description = 'Lista todos os produtos com paginação ou lista completa.'
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
    //   description: 'Lista de produtos paginada ou completa.',
    //   schema: {
    //     status: true,
    //     data: { type: 'array', items: { type: 'object' } },
    //     message: { type: 'string', example: 'Produtos' }
    //   }
    // }
    // #swagger.responses[500] = {
    //   description: 'Erro ao listar produtos.',
    //   schema: {
    //     status: false,
    //     message: { type: 'string', example: 'Erro ao listar produtos' }
    //   }
    // }
    try {
        let { pagina, limite } = req.query;

        if (pagina && limite) {
            let result = await ProdutoDAO.listPage(pagina, limite);
            if (result)
                res.json(sucess(result, 'Produtos página'));
            else
                res.status(500).json(fail("Erro ao listar produtos"));
        } else {
            let result = await ProdutoDAO.list();
            if (result)
                res.json(sucess(result, 'Produtos'));
            else
                res.status(500).json(fail("Erro ao listar produtos"));
        }
    } catch (error) {
        res.status(500).json(fail("Erro no servidor: " + error.message));
    }
});

router.get("/:id", auth.validaJWT, async (req, res) => {
    // #swagger.description = 'Busca um produto pelo ID.'
    // #swagger.parameters['id'] = { description: 'ID do produto a ser buscado.', type: 'string' }
    // #swagger.responses[200] = {
    //   description: 'Produto encontrado com sucesso.',
    //   schema: {
    //     status: true,
    //     data: { type: 'object' },
    //     message: { type: 'string', example: 'Produto' }
    //   }
    // }
    // #swagger.responses[500] = {
    //   description: 'Produto não encontrado.',
    //   schema: {
    //     status: false,
    //     message: { type: 'string', example: 'Produto não encontrado' }
    //   }
    // }
    try {
        let produto = await ProdutoDAO.getById(req.params.id);
    
        if (produto) {
            res.json(sucess(produto, 'Produto'));
        } else {
            res.status(500).json(fail("Produto não encontrado"));
        }
    } catch (error) {
        res.status(500).json(fail("Erro no servidor: " + error.message));
    }
});

module.exports = router;
