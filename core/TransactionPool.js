const Transaction = require('./Transaction')

class TransactionPool {
    constructor() {
        this.transactions = []
    }

    updateOrAddTransaction(transaction) {
        let foundTransaction = this.transactions.find(item => item.id === transaction.id)

        if (foundTransaction) {
            this.transactions[this.transactions.indexOf(foundTransaction)] = transaction
        } else {
            this.transactions.push(transaction)
        }
    }

    findByAddress(address) {
        return this.transactions.find(transaction => transaction.input.address === address)
    }

    validTransactions() {
        return this.transactions.filter((transaction) => {
            const outputTotal = transaction.outputs.reduce((total, output) => {
                return total + output.amount
            }, 0)

            if (transaction.input.amount !== outputTotal) {
                 console.log(`Invalid transaction from ${transaction.input.address}`)

                return false
            }

            if (!Transaction.verifyTransaction(transaction)) {
                console.log(`Invalid signature from ${transaction.input.address}`)

                return false
            }

            return true
        })
    }

    clear() {
        this.transactions = []
    }
}

module.exports = TransactionPool