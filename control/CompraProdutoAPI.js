const express = require("express");
const router = express.Router();
const { validaCompraProduto } = require('../validators/CompraProdutoValidator');
const { sucess, fail } = require("../helpers/resposta");
const CompraProdutoDAO = require('../services/CompraProdutoDAO');
const auth = require("../helpers/authUtils");

router.post("/", auth.validaJWT, validaCompraProduto, async (req, res) => {
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
