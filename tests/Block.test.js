const Block = require('../core/Block')

describe('Block', () => {
    it('generates the genesis block', () => {
        let block = Block.genesis()

        expect(block.constructor.name).toEqual('Block')
        expect(block.timestamp).toEqual(0)
        expect(block.lastHash).toEqual(null)
        expect(block.hash).toEqual('GENESIS_HASH')
        expect(block.data).toEqual([])
        expect(block.nonce).toEqual(0)
    })

    it('stores the last block hash', () => {
        let blockA = Block.genesis()
        let blockB = Block.mine(blockA, 'Some block data...')

        expect(blockB.constructor.name).toEqual('Block')
        expect(blockB.lastHash).toEqual(blockA.hash)
        expect(blockB.data).toEqual('Some block data...')
    })

    it('generates a unique hash', () => {
        expect(Block.hash('TIMESTAMP', 'LAST_BLOCK_HASH', 'BLOCK 1 DATA', 'NONCE', 0)).toEqual('591724ff2a43cfd587643c14a0f8edbdf9cba70a70ba652787f6400a6a9002c7')
        expect(Block.hash('TIMESTAMP', 'LAST_BLOCK_HASH', 'BLOCK 1 DATA', 'NONCE', 0)).toEqual('591724ff2a43cfd587643c14a0f8edbdf9cba70a70ba652787f6400a6a9002c7')
        expect(Block.hash('TIMESTAMP', 'LAST_BLOCK_HASH', 'BLOCK 2 DATA', 'NONCE', 0)).toEqual('0eaa2105b0e16dc0b712b2523ac31707309753516b8ac0cf6dbc6f989f18ce10')
        expect(Block.hash('TIMESTAMP', 'LAST_BLOCK_HASH', 'BLOCK 2 DATA', 'NONCE', 0)).toEqual('0eaa2105b0e16dc0b712b2523ac31707309753516b8ac0cf6dbc6f989f18ce10')
    })

    it('regenerates the hash from a given block', () => {
        let block = new Block('TIMESTAMP', 'LAST_BLOCK_HASH', 'BLOCK HASH', 'BLOCK 1 DATA', 'NONCE', 0)

        expect(Block.blockHash(block)).toEqual('591724ff2a43cfd587643c14a0f8edbdf9cba70a70ba652787f6400a6a9002c7')
    })

    it('generates hash that matches the difficulty', () => {
        let difficulty = 3
        let blockA = new Block(Date.now(), 'LAST_BLOCK_HASH', 'BLOCK HASH', 'BLOCK 1 DATA', 'NONCE', difficulty)
        let blockB = Block.mine(blockA, 'Some block data...')

        expect(blockB.hash.startsWith('00')).toBe(true)
    })

    it('lowers the difficulty for slowly mined blocks', () => {
        let difficulty = 1
        let block = new Block(Date.now(), 'LAST_BLOCK_HASH', 'BLOCK HASH', 'BLOCK 1 DATA', 'NONCE', difficulty)

        expect(Block.adjustDifficulty(block, block.timestamp + 360000)).toEqual(0)
    })

    it('raises the difficulty for quickly mined blocks', () => {
        let difficulty = 0
        let block = new Block(Date.now(), 'LAST_BLOCK_HASH', 'BLOCK HASH', 'BLOCK 1 DATA', 'NONCE', difficulty)

        expect(Block.adjustDifficulty(block, block.timestamp + 1)).toEqual(1)
    })

    it('does not lower the difficulty less than zero', () => {
        let difficulty = 0
        let block = new Block(Date.now(), 'LAST_BLOCK_HASH', 'BLOCK HASH', 'BLOCK 1 DATA', 'NONCE', difficulty)

        expect(Block.adjustDifficulty(block, block.timestamp + 360000)).toEqual(0)
    })
});