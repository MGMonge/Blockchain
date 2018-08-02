const Util = require('../Util')
const {MINE_RATE} = require('../config')

class Block {
    constructor(timestamp, lastHash, hash, data, nonce, difficulty = 0) {
        this.timestamp = timestamp
        this.lastHash = lastHash
        this.hash = hash
        this.data = data
        this.nonce = nonce
        this.difficulty = difficulty
    }

    static genesis() {
        return new this(0, null, 'GENESIS_HASH', [], 0, 0)
    }

    static mine(lastBlock, data) {
        let timestamp, difficulty, hash
        let lastHash = lastBlock.hash
        let nonce = 0

        do {
            nonce++
            timestamp = Date.now()
            difficulty = Block.adjustDifficulty(lastBlock, timestamp)
            hash = Block.hash(timestamp, lastHash, data, nonce, difficulty);
        } while (hash.substring(0, difficulty) !== '0'.repeat(difficulty))

        return new this(timestamp, lastHash, hash, data, nonce, difficulty)
    }

    static adjustDifficulty(block, currentTime) {
        let difficulty = block.difficulty

        if (block.timestamp + MINE_RATE > currentTime) {
            return difficulty + 1
        }

        return difficulty > 1 ? difficulty - 1 : 0
    }

    static hash(timestamp, lastHash, data, nonce, difficulty) {
        return Util.hash(timestamp + lastHash + data + nonce + difficulty)
    }

    static blockHash(block) {
        return Block.hash(block.timestamp, block.lastHash, block.data, block.nonce, block.difficulty);
    }
}

module.exports = Block