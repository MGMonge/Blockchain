const Blockchain = require('../core/Blockchain')

describe('Blockchain', () => {
    let SUT

    beforeEach(() => {
        SUT = new Blockchain
    })

    it('starts with a genesis block', () => {
        expect(SUT.chain.length).toEqual(1)
        expect(SUT.lastBlock().hash).toEqual('GENESIS_HASH')
    })

    it('can add a block', () => {
        SUT.addBlock('Some block data...')

        expect(SUT.chain.length).toEqual(2)
        expect(SUT.lastBlock().data).toEqual('Some block data...')
    })

    it('returns the last block', () => {
        expect(SUT.lastBlock().data).toEqual([])

        SUT.addBlock('Some block data...')

        expect(SUT.lastBlock().data).toEqual('Some block data...')

        SUT.addBlock('Another block data...')

        expect(SUT.lastBlock().data).toEqual('Another block data...')
    })

    it('validates a valid chain', () => {
        let blockchain = new Blockchain

        blockchain.addBlock('Some block data...')

        expect(SUT.isValidChain(blockchain.chain)).toBe(true)
    })

    it('invalidates a chain with a corrupted genesis block', () => {
        let blockchain = new Blockchain

        blockchain.chain[0].data = 'Wrong genesis data'

        expect(SUT.isValidChain(blockchain.chain)).toBe(false)
    })

    it('invalidates a corrupt chain', () => {
        let blockchain = new Blockchain

        blockchain.addBlock('Some block data...')

        blockchain.chain[1].data = 'Different block data...'

        expect(SUT.isValidChain(blockchain.chain)).toBe(false)
    })

    it('does not replace the chain when given chain is not longer than current chain', () => {
        let blockchain = new Blockchain

        SUT.addBlock('Some block data...')

        SUT.replaceChain(blockchain.chain)

        expect(SUT.chain).not.toEqual(blockchain.chain);
    })

    it('does not replace the chain when given chain is invalid', () => {
        let blockchain = new Blockchain

        blockchain.addBlock('Some block data...')

        blockchain.chain[1].data = 'Different block data...'

        SUT.replaceChain(blockchain.chain)

        expect(SUT.chain).not.toEqual(blockchain.chain)
    })

    it('replaces the chain', () => {
        let blockchain = new Blockchain

        blockchain.addBlock('Some block data...')

        expect(SUT.chain).not.toEqual(blockchain.chain)

        SUT.replaceChain(blockchain.chain)

        expect(SUT.chain).toEqual(blockchain.chain)
    })
});