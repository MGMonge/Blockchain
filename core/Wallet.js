const {INITIAL_BALANCE} = require('../config')
const Transaction = require('./Transaction')
const Util = require('../Util')

class Wallet {
    constructor() {
        this.balance = INITIAL_BALANCE
        this.keyPair = Util.generateKeyPair()
        this.publicKey = this.keyPair.getPublic().encode('hex')
    }

    sign(dataHash) {
        return this.keyPair.sign(dataHash)
    }

    createTransaction(recipient, amount, blockhain, transactionPool) {
        this.balance = this.calculateBalance(blockhain)

        if (amount > this.balance) {
            return console.log(`Amount: ${amount} exceeds current balance: ${this.balance}`)
        }

        let transaction = transactionPool.findByAddress(this.publicKey)

        if (transaction) {
            transaction.update(this, recipient, amount)
        } else {
            transaction = Transaction.newTransaction(this, recipient, amount)
            transactionPool.updateOrAddTransaction(transaction)
        }

        return transaction
    }

    static blockchainWallet() {
        let wallet = new this()

        wallet.address = 'BLOCKCHAIN_WALLET'

        return wallet
    }

    mostRecentInput(transactions) {
        const walletInputs = transactions.filter((transaction) => transaction.input.address === this.publicKey)

        if (walletInputs.length > 0) {
            return walletInputs.reduce((previous, current) => {
                previous.input.timestamp > current.input.timestamp ? previous : current
            })
        }

        return null
    }

    calculateBalance(blockchain) {
        let balance = this.balance
        let transactions = blockchain.transactions()

        const mostRecentInput = this.mostRecentInput(transactions)

        let startTime = 0

        if (mostRecentInput) {
            balance = mostRecentInput.outputs.find((output) => output.address === this.publicKey).amount
            startTime = mostRecentInput.input.timestamp
        }

        transactions.forEach(transaction => {
            if (transaction.input.timestamp > startTime) {
                transaction.outputs.find(output => {
                    if (output.address == this.publicKey) {
                        balance += output.amount
                    }
                })
            }
        })

        return balance
    }
}

module.exports = Wallet