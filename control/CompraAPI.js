const express = require("express");
const { validaCompra } = require('../validators/CompraValidator');
const router = express.Router();

const { sucess, fail } = require("../helpers/resposta");
const auth = require("../helpers/authUtils");
const CompraDAO = require('../services/CompraDAO');

router.post("/", auth.validaJWT, validaCompra, async (req, res) => {
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
