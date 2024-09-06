const express = require("express");
const { validaCliente } = require('../validators/ClienteValidator');
const router = express.Router();

const { sucess, fail } = require("../helpers/resposta");
const auth = require("../helpers/authUtils");
const ClienteDAO = require('../services/ClienteDAO.js');



router.post("/", auth.validaJWT, validaCliente, async (req, res) => {
    // #swagger.description = 'Cria um novo cliente.'
    // #swagger.parameters['body'] = {
    //   in: 'body',
    //   description: 'Dados do novo cliente.',
    //   required: true,
    //   schema: {
    //     type: 'object',
    //     properties: {
    //       nome: { type: 'string', description: 'Nome do cliente' },
    //       telefone: { type: 'string', description: 'Telefone do cliente' },
    //       email: { type: 'string', description: 'Email do cliente' },
    //       endereco: { type: 'string', description: 'Endereço do cliente' },
    //       cidade: { type: 'string', description: 'Cidade do cliente' },
    //       bairro: { type: 'string', description: 'Bairro do cliente' },
    //       cep: { type: 'string', description: 'CEP do cliente' },
    //       uf: { type: 'string', description: 'UF do cliente' }
    //     }
    //   }
    // }
    // #swagger.responses[200] = {
    //   description: 'Cliente criado com sucesso.',
    //   schema: {
    //     status: true,
    //     cliente: { type: 'object' }
    //   }
    // }
    try {
        let obj = await ClienteDAO.create(req.body);
        if (obj) {
            res.json(sucess(obj, 'Cliente'));
        } else {
            res.status(500).json(fail("Falha ao salvar o novo cliente"));
        }
    } catch (error) {
        res.status(500).json(fail("Erro no servidor: " + error.message));
    }
});

router.put("/:id", auth.validaJWT, validaCliente, async (req, res) => {
    // #swagger.description = 'Atualiza os dados de um cliente pelo ID.'
    // #swagger.parameters['id'] = { description: 'ID do cliente a ser atualizado.', type: 'string' }
    // #swagger.parameters['body'] = {
    //   in: 'body',
    //   description: 'Dados atualizados do cliente.',
    //   required: true,
    //   schema: {
    //     type: 'object',
    //     properties: {
    //       nome: { type: 'string', description: 'Nome do cliente' },
    //       telefone: { type: 'string', description: 'Telefone do cliente' },
    //       email: { type: 'string', description: 'Email do cliente' },
    //       endereco: { type: 'string', description: 'Endereço do cliente' },
    //       cidade: { type: 'string', description: 'Cidade do cliente' },
    //       bairro: { type: 'string', description: 'Bairro do cliente' },
    //       cep: { type: 'string', description: 'CEP do cliente' },
    //       uf: { type: 'string', description: 'UF do cliente' }
    //     }
    //   }
    // }
    // #swagger.responses[200] = {
    //   description: 'Cliente atualizado com sucesso.',
    //   schema: {
    //     status: true,
    //     message: { type: 'string', description: 'Mensagem de sucesso.' }
    //   }
    // }
    try {
        let existente = await ClienteDAO.getByEmail(req.body.email);

        if (!existente)
            return res.status(400).json(fail("Cliente não encontrado")); 

        let [result] = await ClienteDAO.update(req.params.id, req.body);
        if (result)
            res.json(sucess('Cliente atualizado com sucesso', 'message'));
        else
            res.status(500).json(fail("Nenhuma alteração realizada"));
    } catch (error) {
        res.status(500).json(fail("Erro no servidor: " + error.message));
    }
});

router.delete("/:id", auth.validaJWT, auth.verificaAcesso(2), async (req, res) => {
    // #swagger.description = 'Exclui um cliente pelo ID.'
    // #swagger.parameters['id'] = { description: 'ID do cliente a ser excluído.', type: 'string' }
    // #swagger.responses[200] = {
    //   description: 'Cliente excluído com sucesso.',
    //   schema: {
    //     status: true,
    //     message: { type: 'string', description: 'Mensagem de sucesso.' }
    //   }
    // }
    try {
        let cliente = await ClienteDAO.getById(req.params.id);

        if (!cliente) {
            return res.status(404).json(fail("Cliente não encontrado"));
        }

        let result = await ClienteDAO.delete(cliente.codigo);
        if (result)
            res.json(sucess('Cliente excluído com sucesso', 'message'));
        else
            res.status(500).json(fail("Erro ao excluir cliente"));
    } catch (error) {
        res.status(500).json(fail("Erro no servidor: " + error.message));
    }
});

router.get("/list", auth.validaJWT, async (req, res) => {
    // #swagger.description = 'Lista todos os clientes com paginação ou lista completa.'
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
    //   description: 'Lista de clientes paginada ou completa.',
    //   schema: {
    //     status: true,
    //     clientes: { type: 'array', items: { type: 'object' } }
    //   }
    // }
    try {
        let { pagina, limite } = req.query;

        if (pagina && limite) {
            let result = await ClienteDAO.listPage(pagina, limite);
            if (result)
                res.json(sucess(result, 'Clientes página'));
            else
                res.status(500).json(fail("Erro ao listar clientes"));
        } else {
            let result = await ClienteDAO.list();
            if (result)
                res.json(sucess(result, 'Clientes'));
            else
                res.status(500).json(fail("Erro ao listar clientes"));
        }
    } catch (error) {
        res.status(500).json(fail("Erro no servidor: " + error.message));
    }
});

router.get("/:id", auth.validaJWT, async (req, res) => {
    // #swagger.description = 'Busca um cliente pelo ID.'
    // #swagger.parameters['id'] = { description: 'ID do cliente a ser buscado.', type: 'string' }
    // #swagger.responses[200] = {
    //   description: 'Cliente encontrado com sucesso.',
    //   schema: {
    //     status: true,
    //     cliente: { type: 'object' }
    //   }
    // }
    try {
        let cliente = await ClienteDAO.getById(req.params.id);
    
        if (cliente) {
            res.json(sucess(cliente, 'Cliente'));
        } else {
            res.status(500).json(fail("Cliente não encontrado"));
        }
    } catch (error) {
        res.status(500).json(fail("Erro no servidor: " + error.message));
    }
});


module.exports = router;
