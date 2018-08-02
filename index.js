const express = require('express')
const bodyParser = require('body-parser')
const Blockchain = require('./core/Blockchain')
const P2PServer = require('./p2p-server')
const Wallet = require('./core/Wallet')
const TransactionPool = require('./core/TransactionPool')
const Miner = require('./core/Miner')

const HTTP_PORT = process.env.HTTP_PORT || 3001

const app = express()
const blockchain = new Blockchain
const wallet = new Wallet
const transactionPool = new TransactionPool
const server = new P2PServer(blockchain, transactionPool)
const miner = new Miner(server, blockchain, transactionPool, wallet)

app.use(bodyParser.json())

app.get('/blocks', (request, response) => {
    return response.json(blockchain.chain)
})

app.get('/transactions', (request, response) => {
    return response.json(transactionPool.transactions)
})

app.post('/mine', (request, response) => {
    let block = blockchain.addBlock(request.body.data)

    console.log(`New block added: ${block.hash}`)

    server.syncChains()

    return response.redirect('/blocks')
})

app.post('/send', (request, response) => {
    const {recipient, amount} = request.body

    let transaction = wallet.createTransaction(recipient, amount, blockchain, transactionPool)

    server.broadcastTransaction(transaction)

    return response.redirect('/transactions')
})

app.get('/address', (request, response) => {
    return response.json({publicKey: wallet.publicKey})
})

app.get('/min-transactions', (request, response) => {
    const block = miner.mine()

    console.log(`New block added: ${block.hash}`)

    return response.redirect('/blocks')
})

app.listen(HTTP_PORT, () => console.log(`Listening on port ${HTTP_PORT}`))
server.listen()