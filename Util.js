const EC = require('elliptic').ec;
const sha256 = require('crypto-js/sha256')
const uuid = require('uuid/v1');
const ec = new EC('secp256k1');

class Util {
    static generateKeyPair() {
        return ec.genKeyPair();
    }

    static generateUniqueId() {
        return uuid();
    }

    static hash(data) {
        return sha256(JSON.stringify(data)).toString();
    }

    static verifySignature(publicKey, signature, dataHash) {
        return ec.keyFromPublic(publicKey, 'hex').verify(dataHash, signature);
    }
}

module.exports = Util;