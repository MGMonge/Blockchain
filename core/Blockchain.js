const Block = require('./Block')

class Blockchain {
    constructor() {
        this.chain = [Block.genesis()]
    }

    addBlock(data) {
        const block = Block.mine(this.lastBlock(), data)

        this.chain.push(block)

        return block
    }

    lastBlock() {
        return this.chain[this.chain.length - 1];
    }

    isValidChain(chain) {
        if (JSON.stringify(Block.genesis()) !== JSON.stringify(chain[0])) {
            return false
        }

        for (let i = 1; i < chain.length; i++) {
            const block = chain[i]
            const lastBlock = chain[i - 1]

            if (block.lastHash !== lastBlock.hash || block.hash !== Block.blockHash(block) ) {
                return false
            }
        }

        return true
    }

    transactions() {
        let transactions = []

        this.chain.forEach((block) => {
            block.data.forEach((transaction) => {
                transactions.push(transaction)
            })
        })

        return transactions
    }

    replaceChain(newChain) {
        if (newChain.length <= this.chain.length ) {
            return console.log('Given chain is not longer than the current chain')
        }

        if (! this.isValidChain(newChain)) {
            return console.log('Given chain is invalid')
        }

        this.chain = newChain

        console.log('Blockchain replaced with the new chain')
    }
}

module.exports = Blockchain