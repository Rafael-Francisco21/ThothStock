const express = require("express");
const { validaVendaProduto } = require('../validators/VendaProdutoValidator');
const router = express.Router();

const { sucess, fail } = require("../helpers/resposta");
const auth = require("../helpers/authUtils");
const VendaProdutoDAO = require('../services/VendaProdutoDAO.js');  

router.post("/", auth.validaJWT, validaVendaProduto, async (req, res) => {
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

router.put("/:id", auth.validaJWT, validaVendaProduto, async (req, res) => {
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

router.delete("/:id", auth.validaJWT, auth.verificaAcesso(2), async (req, res) => {
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

router.get("/list", auth.validaJWT, async (req, res) => {
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

router.get("/:id", auth.validaJWT, async (req, res) => {
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
