const TransactionPool = require('../core/TransactionPool')
const Transaction = require('../core/Transaction')
const Wallet = require('../core/Wallet')
const Blockchain = require('../core/Blockchain')

describe('TransactionPool', () => {
    let SUT, blockchain

    beforeEach(() => {
        blockchain = new Blockchain,
        SUT =  new TransactionPool
    })

    it('can add a transaction to the pool', () => {
        const wallet = new Wallet()
        const transaction = Transaction.newTransaction(wallet, 'RECIPIENT_ADDRESS', 50)

        expect(SUT.transactions.length).toEqual(0)

        SUT.updateOrAddTransaction(transaction)

        expect(SUT.transactions.length).toEqual(1)
        expect(SUT.transactions[0].id).toEqual(transaction.id)
    })

    it('can update a transaction in the pool', () => {
        const wallet = new Wallet()
        const transaction = Transaction.newTransaction(wallet, 'RECIPIENT_ADDRESS_A', 50)
        const oldTransaction = JSON.stringify(transaction)
        const newTransaction = transaction.update(wallet, 'RECIPIENT_ADDRESS_B', 20)

        SUT.updateOrAddTransaction(transaction)
        SUT.updateOrAddTransaction(newTransaction)

        expect(SUT.transactions.length).toEqual(1)
        expect(JSON.stringify(SUT.transactions[0])).not.toEqual(oldTransaction)
    })

    it('returns only valid transactions', () => {
        const walletA = new Wallet()
        const walletB = new Wallet()
        const walletC = new Wallet()
        const walletD = new Wallet()
        const transactionA = walletA.createTransaction('RECIPIENT_ADDRESS', 50, blockchain, SUT)
        const transactionB = walletB.createTransaction('RECIPIENT_ADDRESS', 20, blockchain, SUT)
        const transactionC = walletC.createTransaction('RECIPIENT_ADDRESS', 10, blockchain, SUT)
        const transactionD = walletD.createTransaction('RECIPIENT_ADDRESS', 10, blockchain, SUT)

        transactionC.input.amount = 9999
        transactionD.input.signature = {r: 'ABC', s: 'XYZ'}

        expect(SUT.transactions.length).toEqual(4)
        expect(SUT.validTransactions().length).toEqual(2)
        expect(SUT.validTransactions()[0].id).toEqual(transactionA.id)
        expect(SUT.validTransactions()[1].id).toEqual(transactionB.id)
    })

    it('clears the transactions', () => {
        const walletA = new Wallet()
        const walletB = new Wallet()
        walletA.createTransaction('RECIPIENT_ADDRESS', 50, blockchain, SUT)
        walletB.createTransaction('RECIPIENT_ADDRESS', 50, blockchain, SUT)

        expect(SUT.transactions.length).toEqual(2)

        SUT.clear()

        expect(SUT.transactions.length).toEqual(0)
    })
})