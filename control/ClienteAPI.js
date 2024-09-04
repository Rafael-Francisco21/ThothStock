const express = require("express");
const { validaCliente } = require('../validators/ClienteValidator');
const router = express.Router();

const { sucess, fail } = require("../helpers/resposta");
const auth = require("../helpers/authUtils");
const ClienteDAO = require('../services/ClienteDAO.js');

router.post("/", auth.validaJWT, validaCliente, async (req, res) => {
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

router.get("/:id", auth.validaJWT, async(req, res) =>{
    let cliente = await ClienteDAO.getById(req.params.id);
    
    if (cliente){
        res.json(sucess(cliente, 'Cliente'));
    }else
        res.status(500).json(fail("Cliente não encontrado"))
});

module.exports = router;
