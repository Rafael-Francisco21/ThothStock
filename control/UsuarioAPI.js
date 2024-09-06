const express = require("express");
const { validaUsuario, validaLogin } = require('../validators/UsuarioValidator');
const router = express.Router();

const { sucess, fail } = require("../helpers/resposta");
const auth = require("../helpers/authUtils");
const UsuarioDAO = require('../services/UsuarioDAO.js');

// Rota para criar um novo usuário
router.post("/", auth.validaJWT, validaUsuario, async (req, res) => {
    // #swagger.description = 'Cria um novo usuário.'
    // #swagger.parameters['body'] = {
    //   in: 'body',
    //   description: 'Informações do novo usuário.',
    //   required: true,
    //   schema: {
    //     type: 'object',
    //     properties: {
    //       nome: { type: 'string', description: 'Nome do usuário' },
    //       email: { type: 'string', description: 'Email do usuário' },
    //       senha: { type: 'string', description: 'Senha do usuário' },
    //       acesso: { type: 'integer', description: 'Nível de acesso do usuário' }
    //     }
    //   }
    // }
    // #swagger.responses[200] = {
    //   description: 'Usuário criado com sucesso.',
    //   schema: {
    //     status: true,
    //     user: { type: 'object' }
    //   }
    // }
    try {
        if (req.acesso > req.body.acesso) {
            return res.status(400).json(fail("Usuário não tem permissão de criar outro usuário com esse nível de acesso"));
        }

        let existente = await UsuarioDAO.getByEmail(req.body.email);

        if (existente) {
            return res.status(400).json(fail("E-mail já existente"));
        }

        let obj = await UsuarioDAO.create(req.body);
        delete obj.dataValues.senha; // Remove a senha da resposta
        if (obj) {
            res.json(sucess(obj, 'Usuário'));
        } else {
            res.status(500).json(fail("Falha ao salvar o novo usuário"));
        }
    } catch (error) {
        res.status(500).json(fail("Erro no servidor: " + error.message));
    }
});

// Rota para realizar o login do usuário
router.post("/login", validaLogin, async (req, res) => {
    // #swagger.description = 'Realiza o login do usuário.'
    // #swagger.parameters['body'] = {
    //   in: 'body',
    //   description: 'Credenciais do usuário para login.',
    //   required: true,
    //   schema: {
    //     type: 'object',
    //     properties: {
    //       email: { type: 'string', description: 'Email do usuário' },
    //       senha: { type: 'string', description: 'Senha do usuário' }
    //     }
    //   }
    // }
    // #swagger.responses[200] = {
    //   description: 'Login bem-sucedido.',
    //   schema: {
    //     status: true,
    //     token: { type: 'string', description: 'Token JWT gerado' },
    //     user: { type: 'object' }
    //   }
    // }
    try {
        const { email, senha } = req.body;
        if (!email || !senha) {
            return res.status(400).json(fail("Email e senha são obrigatórios."));
        }

        const existente = await UsuarioDAO.login(email, senha);

        if (existente) {
            delete existente.dataValues.senha; // Remove a senha da resposta
            let resp = existente.dataValues;
            const token = await auth.criaJWT(existente.dataValues);
            resp.token = token;
            return res.json(sucess(resp));
        } else {
            return res.status(401).json(fail("Usuário ou senha inválidos"));
        }
    } catch (error) {
        return res.status(500).json(fail("Erro no servidor: " + error.message));
    }
});

// Rota para atualizar os dados de um usuário pelo ID
router.put("/:id", auth.validaJWT, validaUsuario, async (req, res) => {
    // #swagger.description = 'Atualiza os dados de um usuário pelo ID.'
    // #swagger.parameters['id'] = { description: 'ID do usuário a ser atualizado.', type: 'string' }
    // #swagger.parameters['body'] = {
    //   in: 'body',
    //   description: 'Dados atualizados do usuário.',
    //   required: true,
    //   schema: {
    //     type: 'object',
    //     properties: {
    //       nome: { type: 'string', description: 'Nome do usuário' },
    //       email: { type: 'string', description: 'Email do usuário' },
    //       acesso: { type: 'integer', description: 'Nível de acesso do usuário' }
    //     }
    //   }
    // }
    // #swagger.responses[200] = {
    //   description: 'Usuário atualizado com sucesso.',
    //   schema: {
    //     status: true,
    //     message: { type: 'string', description: 'Mensagem de sucesso.' }
    //   }
    // }
    try {
        if (req.acesso >= req.body.acesso && req.acesso != 1 && req.params.id != req.user || req.acesso >= req.body.acesso && req.acesso != 1) {
            return res.status(400).json(fail("Usuário não tem permissão de editar outro usuário com esse nível de acesso"));
        }

        let existente = await UsuarioDAO.getByEmail(req.body.email);

        if (!existente)
            return res.status(400).json(fail("Usuário não encontrado"));
        if (existente.dataValues.codigo != req.params.id) {
            return res.status(400).json(fail("E-mail já existente"));
        }

        let [result] = await UsuarioDAO.update(req.params.id, req.body);
        if (result)
            res.json(sucess('Usuário atualizado com sucesso', 'message'));
        else
            res.status(500).json(fail("Nenhuma alteração realizada"));
    } catch (error) {
        res.status(500).json(fail("Erro no servidor: " + error.message));
    }
});

// Rota para excluir um usuário pelo ID
router.delete("/:id", auth.validaJWT, async (req, res) => {
    // #swagger.description = 'Exclui um usuário pelo ID.'
    // #swagger.parameters['id'] = { description: 'ID do usuário a ser excluído.', type: 'string' }
    // #swagger.responses[200] = {
    //   description: 'Usuário excluído com sucesso.',
    //   schema: {
    //     status: true,
    //     message: { type: 'string', description: 'Mensagem de sucesso.' }
    //   }
    // }
    try {
        let usuario = await UsuarioDAO.getById(req.params.id);

        if (req.acesso >= usuario.acesso && req.acesso != 1 && req.params.id != usuario.codigo) {
            return res.status(400).json(fail("Usuário não tem permissão de excluir outro usuário com esse nível de acesso"));
        }

        if (usuario.acesso == 1) {
            let quantAdm = await UsuarioDAO.quantAdm();
            if (quantAdm == 1)
                return res.status(400).json(fail("Usuário não pode ser excluído por ser o último administrador"));
        }

        let result = await UsuarioDAO.delete(usuario.codigo);
        if (result)
            res.json(sucess('Usuário excluído com sucesso', 'message'));
        else
            res.status(500).json(fail("Erro ao excluir usuário"));
    } catch (error) {
        res.status(500).json(fail("Erro no servidor: " + error.message));
    }
});

// Rota para listar os usuários com paginação ou lista completa
router.get("/list", auth.validaJWT, auth.verificaAcesso(2), async (req, res) => {
    // #swagger.description = 'Lista os usuários com paginação ou lista completa.'
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
    //   description: 'Lista de usuários paginada ou completa.',
    //   schema: {
    //     status: true,
    //     users: { type: 'array', items: { type: 'object' } }
    //   }
    // }
    try {
        let { pagina, limite } = req.query;

        if (pagina && limite) {
            let result = await UsuarioDAO.listPage(pagina, limite);
            if (result)
                res.json(sucess(result, 'Usuários pagina'));
            else
                res.status(500).json(fail("Erro ao listar usuários"));
        } else {
            let result = await UsuarioDAO.list();
            if (result)
                res.json(sucess(result, 'Usuários'));
            else
                res.status(500).json(fail("Erro ao listar usuários"));
        }
    } catch (error) {
        res.status(500).json(fail("Erro no servidor: " + error.message));
    }
});

router.get("/qtdlogin", auth.validaJWT, async (req, res) => {
    // #swagger.description = 'Exclui um usuário pelo ID.'
    // #swagger.parameters['id'] = { description: 'ID do usuário a ser excluído.', type: 'string' }
    // #swagger.responses[200] = {
    //   description: 'Usuário excluído com sucesso.',
    //   schema: {
    //     status: true,
    //     message: { type: 'string', description: 'Mensagem de sucesso.' }
    //   }
    // }
    try {
        let usuario = await UsuarioDAO.getById(req.params.id);

        if (req.acesso >= usuario.acesso && req.acesso != 1 && req.params.id != usuario.codigo) {
            return res.status(400).json(fail("Usuário não tem permissão de excluir outro usuário com esse nível de acesso"));
        }

        if (usuario.acesso == 1) {
            let quantAdm = await UsuarioDAO.quantAdm();
            if (quantAdm == 1)
                return res.status(400).json(fail("Usuário não pode ser excluído por ser o último administrador"));
        }

        let result = await UsuarioDAO.delete(usuario.codigo);
        if (result)
            res.json(sucess('Usuário excluído com sucesso', 'message'));
        else
            res.status(500).json(fail("Erro ao excluir usuário"));
    } catch (error) {
        res.status(500).json(fail("Erro no servidor: " + error.message));
    }
})

// Rota para buscar um usuário pelo ID
router.get("/:id", auth.validaJWT, async(req, res) =>{
    let usuario = await UsuarioDAO.getById(req.params.id);
    
    if (usuario){
        if (req.acesso >= usuario.acesso && req.acesso != 1 && req.params.id != usuario.codigo) {
            return res.status(400).json(fail("Usuário não tem permissão de consultar outro usuário com esse nível de acesso"));
        }
        delete usuario.dataValues.senha;
        res.json(sucess(usuario, 'Usuário'));
    }else
        res.status(500).json(fail("Usuário não encontrado"))
});

// Rota para buscar um quantidade de acessos de um usuário
router.get("/cont/:id", auth.validaJWT, async(req, res) =>{
    let usuario = await UsuarioDAO.getById(req.params.id);
    
    if (usuario){
        delete usuario.dataValues.senha;
        res.json(sucess(usuario.dataValues.contLogin, 'Quantidade de acessos'));
    }else
        res.status(500).json(fail("Usuário não encontrado"))
});

module.exports = router;
