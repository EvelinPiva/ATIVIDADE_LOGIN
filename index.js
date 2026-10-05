const express = require('express')
const app = express()
const cors = require('cors')

const conn = require('./db/conn')

const produtoController = require('./controller/produto.controller')
const usuarioController = require('./controller/usuario.controller')
const movimentoController = require('./controller/movimento.controller')
const relatVwController = require('./controller/relatVW.controller')
const authController = require('./controller/auth.controller')

const authMiddleware = require('./middleware/auth.middleware')

const hostname = 'localhost'
const PORT = 3000

// ------------ Middleware ----------
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())

//--------------- Rotas --------------

// ===== USUÁRIO =====

// Cadastro do usuário fica livre
app.post('/usuario', usuarioController.cadastrar)

// Rotas protegidas
app.get('/usuarios', authMiddleware, usuarioController.listar)
app.get('/usuario/:id', authMiddleware, usuarioController.buscarPorCod)
app.get('/usuario/buscar/:nome', authMiddleware, usuarioController.buscarPorNome)
app.delete('/usuario/:id', authMiddleware, usuarioController.excluir)
app.put('/usuario/:id', authMiddleware, usuarioController.atualizar)


// ===== LOGIN =====

// Login fica livre para que o usuário possa receber o token
app.post('/login', authController.login)


// ===== PRODUTO =====

app.post('/produto', authMiddleware, produtoController.cadastrar)
app.get('/produtos', authMiddleware, produtoController.listar)
app.get('/produto/:id', authMiddleware, produtoController.buscarPorCod)
app.get('/produto/buscar/:nome', authMiddleware, produtoController.buscarPorNome)
app.delete('/produto/:id', authMiddleware, produtoController.excluir)
app.put('/produto/:id', authMiddleware, produtoController.atualizar)


// ===== MOVIMENTO =====

app.post('/movimento', authMiddleware, movimentoController.cadastrar)
app.get('/movimentos', authMiddleware, movimentoController.listar)


// ===== RELATÓRIOS =====

app.get(
    '/relatorio/categorias',
    authMiddleware,
    relatVwController.listarPorCategorias
)

app.get(
    '/relatorio/saidas',
    authMiddleware,
    relatVwController.listarHistoricoSaidas
)


// ===== TESTE DA API =====

app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Aplicação rodando!!!'
    })
})


// -------------- Server -------------

conn.sync()
    .then(() => {
        app.listen(PORT, hostname, () => {
            console.log(`Servidor rodando em http://${hostname}:${PORT}`)
        })
    })
    .catch((err) => {
        console.error('Erro de conexão com o banco de dados!', err)
    })