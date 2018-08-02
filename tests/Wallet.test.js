const Wallet = require('../core/Wallet')
const TransactionPool = require('../core/TransactionPool')
const Blockchain = require('../core/Blockchain')

describe('Wallet', () => {
    let SUT, blockchain, transactionPool

    beforeEach(() => {
        SUT = new Wallet
        blockchain = new Blockchain
        transactionPool = new TransactionPool
    })

    it('can create a transaction', () => {
        const transaction = SUT.createTransaction('RECIPIENT_ADDRESS', 50, blockchain, transactionPool)

        const output = transaction.outputs.find(output => output.address === SUT.publicKey)

        expect(output.amount).toEqual(SUT.balance - 50)
        expect(transactionPool.transactions.length).toEqual(1)
    })

    it('doubles the amount subtracted from the wallet balance when transaction is created twice', () => {
        const transaction = SUT.createTransaction('RECIPIENT_ADDRESS', 50, blockchain, transactionPool)
        SUT.createTransaction('RECIPIENT_ADDRESS', 50, blockchain, transactionPool)

        const output = transaction.outputs.find(output => output.address === SUT.publicKey)

        expect(output.amount).toEqual(SUT.balance - 100)
        expect(transactionPool.transactions.length).toEqual(1)
    })

    it('clones transaction output for the recipient', () => {
        const transaction = SUT.createTransaction('RECIPIENT_ADDRESS', 50, blockchain, transactionPool)
        SUT.createTransaction('RECIPIENT_ADDRESS', 50, blockchain, transactionPool)

        const outputs = transaction.outputs.filter(output => output.address === 'RECIPIENT_ADDRESS')

        expect(outputs[0].amount).toEqual(50)
        expect(outputs[1].amount).toEqual(50)
    })

    it('calculates the wallet balance', () => {
        // TODO: Make this work
        // let walletA = new Wallet
        // let walletB = new Wallet
        //
        // walletA.createTransaction(walletB.publicKey, 50, blockchain, transactionPool)
        // walletA.createTransaction(walletB.publicKey, 100, blockchain, transactionPool)
        // walletB.createTransaction(walletA.publicKey, 20, blockchain, transactionPool)
        //
        // blockchain.addBlock(transactionPool.validTransactions())
        // transactionPool.clear()
        //
        // expect(walletA.calculateBalance(blockchain)).toEqual(370)
        // expect(walletB.calculateBalance(blockchain)).toEqual(630)
    })
})