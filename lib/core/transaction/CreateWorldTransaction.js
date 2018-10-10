"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../utils");
const H256_1 = require("../H256");
const RLP = require("rlp");
/**
 * Creates a world
 *
 * - Transaction hash can be changed by changing nonce.
 * - If an identical transaction hash already exists, then the change fails. In this situation, a transaction can be created again by arbitrarily changing the nonce.
 */
class CreateWorldTransaction {
    constructor(data) {
        this.type = "createWorld";
        const { networkId, shardId, nonce, owners } = data;
        this.networkId = networkId;
        this.shardId = shardId;
        this.nonce = nonce;
        this.owners = owners;
    }
    static fromJSON(obj) {
        const { data: { networkId, shardId, nonce, owners } } = obj;
        return new this({
            networkId,
            shardId,
            nonce,
            owners
        });
    }
    toJSON() {
        const { networkId, shardId, nonce, owners } = this;
        return {
            type: this.type,
            data: {
                networkId,
                shardId,
                nonce,
                owners
            }
        };
    }
    toEncodeObject() {
        const { networkId, shardId, nonce, owners } = this;
        return [
            1,
            networkId,
            shardId,
            nonce,
            owners.map(owner => owner.getAccountId().toEncodeObject())
        ];
    }
    rlpBytes() {
        return RLP.encode(this.toEncodeObject());
    }
    hash() {
        return new H256_1.H256(utils_1.blake256(this.rlpBytes()));
    }
}
exports.CreateWorldTransaction = CreateWorldTransaction;
