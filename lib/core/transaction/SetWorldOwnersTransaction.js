"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../utils");
const H256_1 = require("../H256");
const RLP = require("rlp");
/**
 * Change the owners of the world
 */
class SetWorldOwnersTransaction {
    constructor(data) {
        this.type = "setWorldOwners";
        const { networkId, shardId, worldId, nonce, owners } = data;
        this.networkId = networkId;
        this.shardId = shardId;
        this.worldId = worldId;
        this.nonce = nonce;
        this.owners = owners;
    }
    static fromJSON(obj) {
        const { data: { networkId, shardId, worldId, nonce, owners } } = obj;
        return new this({
            networkId,
            shardId,
            worldId,
            nonce,
            owners
        });
    }
    toJSON() {
        const { networkId, shardId, worldId, nonce, owners } = this;
        return {
            type: this.type,
            data: {
                networkId,
                shardId,
                worldId,
                nonce,
                owners
            }
        };
    }
    toEncodeObject() {
        const { networkId, shardId, worldId, nonce, owners } = this;
        return [2, networkId, shardId, worldId, nonce, owners];
    }
    rlpBytes() {
        return RLP.encode(this.toEncodeObject());
    }
    hash() {
        return new H256_1.H256(utils_1.blake256(this.rlpBytes()));
    }
}
exports.SetWorldOwnersTransaction = SetWorldOwnersTransaction;
