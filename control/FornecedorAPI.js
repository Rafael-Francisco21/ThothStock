const express = require("express");
const { validaFornecedor } = require('../validators/FornecedorValidator');
const router = express.Router();

const { sucess, fail } = require("../helpers/resposta");
const auth = require("../helpers/authUtils");
const FornecedorDAO = require('../services/FornecedorDAO');

router.post("/", auth.validaJWT, validaFornecedor, async (req, res) => {
    // #swagger.description = 'Cria um novo fornecedor.'
    // #swagger.parameters['body'] = {
    //   in: 'body',
    //   description: 'Dados do novo fornecedor.',
    //   required: true,
    //   schema: {
    //     type: 'object',
    //     properties: {
    //       nome: { type: 'string', description: 'Nome do fornecedor' },
    //       telefone: { type: 'string', description: 'Telefone do fornecedor' },
    //       email: { type: 'string', description: 'Email do fornecedor' },
    //       endereco: { type: 'string', description: 'Endereço do fornecedor' },
    //       bairro: { type: 'string', description: 'Bairro do fornecedor' },
    //       cidade: { type: 'string', description: 'Cidade do fornecedor' },
    //       uf: { type: 'string', description: 'Unidade federativa' },
    //       cep: { type: 'string', description: 'CEP do fornecedor' }
    //     }
    //   }
    // }
    // #swagger.responses[200] = {
    //   description: 'Fornecedor criado com sucesso.',
    //   schema: { status: true, item: { type: 'object' } }
    // }
    try {
        let obj = await FornecedorDAO.create(req.body);
        if (obj) {
            res.json(sucess(obj, 'Fornecedor'));
        } else {
            res.status(500).json(fail("Falha ao salvar o novo fornecedor"));
        }
    } catch (error) {
        res.status(500).json(fail("Erro no servidor: " + error.message));
    }
});

router.put("/:id", auth.validaJWT, validaFornecedor, async (req, res) => {
    // #swagger.description = 'Atualiza um fornecedor existente pelo ID.'
    // #swagger.parameters['id'] = { description: 'ID do fornecedor a ser atualizado.', type: 'string' }
    // #swagger.parameters['body'] = {
    //   in: 'body',
    //   description: 'Dados atualizados do fornecedor.',
    //   required: true,
    //   schema: {
    //     type: 'object',
    //     properties: {
    //       nome: { type: 'string', description: 'Nome do fornecedor' },
    //       telefone: { type: 'string', description: 'Telefone do fornecedor' },
    //       email: { type: 'string', description: 'Email do fornecedor' },
    //       endereco: { type: 'string', description: 'Endereço do fornecedor' },
    //       bairro: { type: 'string', description: 'Bairro do fornecedor' },
    //       cidade: { type: 'string', description: 'Cidade do fornecedor' },
    //       uf: { type: 'string', description: 'Unidade federativa' },
    //       cep: { type: 'string', description: 'CEP do fornecedor' }
    //     }
    //   }
    // }
    // #swagger.responses[200] = {
    //   description: 'Fornecedor atualizado com sucesso.',
    //   schema: { status: true, message: 'Fornecedor atualizado com sucesso.' }
    // }
    try {
        let existente = await FornecedorDAO.getById(req.params.id);
        if (!existente) {
            return res.status(404).json(fail("Fornecedor não encontrado"));
        }

        let [result] = await FornecedorDAO.update(req.params.id, req.body);
        if (result)
            res.json(sucess('Fornecedor atualizado com sucesso', 'message'));
        else
            res.status(500).json(fail("Nenhuma alteração realizada"));
    } catch (error) {
        res.status(500).json(fail("Erro no servidor: " + error.message));
    }
});

router.delete("/:id", auth.validaJWT, auth.verificaAcesso(2), async (req, res) => {
    // #swagger.description = 'Exclui um fornecedor pelo ID.'
    // #swagger.parameters['id'] = { description: 'ID do fornecedor a ser excluído.', type: 'string' }
    // #swagger.responses[200] = {
    //   description: 'Fornecedor excluído com sucesso.',
    //   schema: { status: true, message: 'Fornecedor excluído com sucesso.' }
    // }
    try {
        let fornecedor = await FornecedorDAO.getById(req.params.id);
        if (!fornecedor) {
            return res.status(404).json(fail("Fornecedor não encontrado"));
        }

        let result = await FornecedorDAO.delete(fornecedor.codigo);
        if (result)
            res.json(sucess('Fornecedor excluído com sucesso', 'message'));
        else
            res.status(500).json(fail("Erro ao excluir fornecedor"));
    } catch (error) {
        res.status(500).json(fail("Erro no servidor: " + error.message));
    }
});

router.get("/list", auth.validaJWT, async (req, res) => {
    // #swagger.description = 'Lista todos os fornecedores, com suporte à paginação.'
    // #swagger.parameters['query'] = {
    //   in: 'query',
    //   description: 'Parâmetros de paginação (opcionais).',
    //   schema: {
    //     type: 'object',
    //     properties: {
    //       pagina: { type: 'integer', description: 'Número da página' },
    //       limite: { type: 'integer', description: 'Itens por página' }
    //     }
    //   }
    // }
    // #swagger.responses[200] = {
    //   description: 'Fornecedores listados com sucesso.',
    //   schema: { status: true, items: { type: 'array', items: { type: 'object' } } }
    // }
    try {
        let { pagina, limite } = req.query;

        if (pagina && limite) {
            let result = await FornecedorDAO.listPage(pagina, limite);
            if (result)
                res.json(sucess(result, 'Fornecedores página'));
            else
                res.status(500).json(fail("Erro ao listar fornecedores"));
        } else {
            let result = await FornecedorDAO.list();
            if (result)
                res.json(sucess(result, 'Fornecedores'));
            else
                res.status(500).json(fail("Erro ao listar fornecedores"));
        }
    } catch (error) {
        res.status(500).json(fail("Erro no servidor: " + error.message));
    }
});

router.get("/:id", auth.validaJWT, async (req, res) => {
    // #swagger.description = 'Busca um fornecedor pelo ID.'
    // #swagger.parameters['id'] = { description: 'ID do fornecedor a ser buscado.', type: 'string' }
    // #swagger.responses[200] = {
    //   description: 'Fornecedor encontrado com sucesso.',
    //   schema: { status: true, item: { type: 'object' } }
    // }
    try {
        let fornecedor = await FornecedorDAO.getById(req.params.id);
        if (fornecedor) {
            res.json(sucess(fornecedor, 'Fornecedor'));
        } else {
            res.status(404).json(fail("Fornecedor não encontrado"));
        }
    } catch (error) {
        res.status(500).json(fail("Erro no servidor: " + error.message));
    }
});

module.exports = router;
