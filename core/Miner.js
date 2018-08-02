const Transaction = require('./Transaction')
const Wallet = require('./Wallet')

class Miner {
    constructor(server, blockchain, transactionPool, wallet) {
        this.server = server
        this.blockchain = blockchain
        this.transactionPool = transactionPool
        this.wallet = wallet
    }

    mine() {
        const validTransactions = this.transactionPool.validTransactions()
        validTransactions.push(Transaction.rewardTransaction(this.wallet, Wallet.blockchainWallet()))
        const block = this.blockchain.addBlock(validTransactions)
        this.server.syncChains()
        this.transactionPool.clear()
        this.server.broadcastClearTransactions()

        return block
    }
}

module.exports = Miner