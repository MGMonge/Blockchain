const Websocket = require('ws')

const P2P_PORT = process.env.P2P_PORT || 5001
const peers = process.env.PEERS ? process.env.PEERS.split(',') : []

class P2PServer {
    constructor(blockchain, transactionPool) {
        this.blockchain = blockchain
        this.transactionPool = transactionPool
        this.sockets = []
    }

    listen() {
        const server = new Websocket.Server({port: P2P_PORT})

        server.on('connection', (socket) => this.connectSocket(socket))

        this.connectToPeers()

        console.log(`Listening for peer-to-peer connections on port: ${P2P_PORT}`)
    }

    connectToPeers() {
        peers.forEach((peer) => {
            const socket = new Websocket(peer)

            socket.on('open', () => this.connectSocket(socket))
        })
    }

    connectSocket(socket) {
        this.sockets.push(socket)

        console.log('Socket connected')

        this.messageHandler(socket)
        this.sendChain(socket)
    }

    messageHandler(socket) {
        socket.on('message', (message) => {
            const data = JSON.parse(message)

            switch (data.type) {
                case 'chain':
                    this.blockchain.replaceChain(data.payload)
                    break;

                case 'transaction':
                    this.transactionPool.updateOrAddTransaction(data.payload)
                    break;

                case 'clear_transaction':
                    this.transactionPool.clear()
                    break;
            }
        })
    }

    sendChain(socket) {
        socket.send(JSON.stringify({type: 'chain', payload: this.blockchain.chain}))
    }

    syncChains() {
        this.sockets.forEach((socket) => {
            this.sendChain(socket)
        })
    }

    sendTransaction(socket, transaction) {
        socket.send(JSON.stringify({type: 'transaction', payload: transaction}))
    }

    broadcastTransaction(transaction) {
        this.sockets.forEach((socket) => {
            this.sendTransaction(socket, transaction)
        })
    }

    broadcastClearTransactions() {
        this.sockets.forEach((socket) => {
            socket.send(JSON.stringify({type: 'clear_transactions'}))
        })
    }
}

module.exports = P2PServer;