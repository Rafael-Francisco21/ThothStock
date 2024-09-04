const express = require("express");
const { validaVenda } = require('../validators/VendaValidator');
const router = express.Router();

const { sucess, fail } = require("../helpers/resposta");
const auth = require("../helpers/authUtils");
const VendaDAO = require('../services/VendaDAO.js');

router.post("/", auth.validaJWT, validaVenda, async (req, res) => {
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

router.put("/:id", auth.validaJWT, validaVenda, async (req, res) => {
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

router.delete("/:id", auth.validaJWT, auth.verificaAcesso(2), async (req, res) => {
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

router.get("/list", auth.validaJWT, async (req, res) => {
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

router.get("/:id", auth.validaJWT, async (req, res) => {
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
