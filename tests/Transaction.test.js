const Transaction = require('../core/Transaction')
const Wallet = require('../core/Wallet')
const {MINING_REWARD} = require('../config')

describe('Transaction', () => {
    it('outputs the `amount` subtracted from the wallet balance', () => {
        let wallet = new Wallet()
        let transaction = Transaction.newTransaction(wallet, 'RECIPIENT_ADDRESS', 50)
        let output = transaction.outputs.find(output => output.address === wallet.publicKey)

        expect(output.amount).toEqual(wallet.balance - 50)
    })

    it('outputs the `amount` added to the recipient', () => {
        let wallet = new Wallet()
        let transaction = Transaction.newTransaction(wallet, 'RECIPIENT_ADDRESS', 50)
        let output = transaction.outputs.find(output => output.address === 'RECIPIENT_ADDRESS')

        expect(output.amount).toEqual(50)
    })

    it('does not create a new transaction if amount exceeds the wallet balance', () => {
        let wallet = new Wallet()
        let transaction = Transaction.newTransaction(wallet, 'RECIPIENT_ADDRESS', 50000)

        expect(transaction).toEqual(undefined)
    })

    it('inputs the balance of the wallet', () => {
        let wallet = new Wallet()
        let transaction = Transaction.newTransaction(wallet, 'RECIPIENT_ADDRESS', 50)

        expect(transaction.input.amount).toEqual(wallet.balance)
    })

    it('validates a transaction', () => {
        let wallet = new Wallet()
        let transaction = Transaction.newTransaction(wallet, 'RECIPIENT_ADDRESS', 50)

        expect(Transaction.verifyTransaction(transaction)).toBe(true)
    })

    it('invalidates a corrupt transaction', () => {
        let wallet = new Wallet()
        let transaction = Transaction.newTransaction(wallet, 'RECIPIENT_ADDRESS', 50)

        transaction.outputs[0].amount = 50000;

        expect(Transaction.verifyTransaction(transaction)).toBe(false)
    })

    it("subtracts amount from the sender's output when updating a transaction", () => {
        let wallet = new Wallet()
        let transaction = Transaction.newTransaction(wallet, 'RECIPIENT_ADDRESS_A', 50)

        transaction.update(wallet, 'RECIPIENT_ADDRESS_B', 100)

        const senderOutput = transaction.outputs.find(output => output.address === wallet.publicKey)

        expect(senderOutput.amount).toEqual(wallet.balance - 150)
    })

    it('outputs an amount for the new recipient when updating a transaction', () => {
        let wallet = new Wallet()
        let transaction = Transaction.newTransaction(wallet, 'RECIPIENT_ADDRESS_A', 50)

        transaction.update(wallet, 'RECIPIENT_ADDRESS_B', 100)

        const recipientOutput = transaction.outputs.find(output => output.address === 'RECIPIENT_ADDRESS_B')

        expect(recipientOutput.amount).toEqual(100)
    })

    it('creates a reward transaction', () => {
        let wallet = new Wallet()
        let transaction = Transaction.rewardTransaction(wallet, Wallet.blockchainWallet())

        const output = transaction.outputs.find(output => output.address === wallet.publicKey)

        expect(output.amount).toEqual(MINING_REWARD)
    })
})