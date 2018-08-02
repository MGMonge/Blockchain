const Util = require('../Util')
const {MINING_REWARD} = require('../config')

class Transaction {
    constructor() {
        this.id = Util.generateUniqueId()
        this.input = null;
        this.outputs = []
    }

    update(senderWallet, recipient, amount) {
        const senderOutput = this.outputs.find(output => output.address === senderWallet.publicKey)

        if (amount > senderOutput.amount) {
            return console.log(`Amount: ${amount} exceeds balance.`);
        }

        senderOutput.amount = senderOutput.amount - amount
        this.outputs.push({amount, address: recipient})
        Transaction.sign(this, senderWallet)

        return this
    }

    static newTransaction(senderWallet, recipient, amount) {
        const transaction = new this()

        if (amount > senderWallet.balance) {
            return console.log(`Amount: ${amount} exceeds balance.`);
        }

        transaction.outputs.push(...[
            { amount: senderWallet.balance - amount, address: senderWallet.publicKey},
            { amount, address: recipient}
        ])

        Transaction.sign(transaction, senderWallet)

        return transaction
    }

    static rewardTransaction(minerWaller, blockchainWallet) {
        const transaction = new this()

        transaction.outputs.push(...[
            { amount: MINING_REWARD, address: minerWaller.publicKey},
        ])

        Transaction.sign(transaction, blockchainWallet)

        return transaction
    }

    static sign(transaction, senderWallet) {
        transaction.input = {
            timestamp: Date.now(),
            amount: senderWallet.balance,
            address: senderWallet.publicKey,
            signature: senderWallet.sign(Util.hash(transaction.outputs))
        }
    }

    static verifyTransaction(transaction) {
        return Util.verifySignature(transaction.input.address, transaction.input.signature, Util.hash(transaction.outputs))
    }
}

module.exports = Transaction