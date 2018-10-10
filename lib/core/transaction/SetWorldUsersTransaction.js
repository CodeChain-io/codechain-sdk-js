"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../utils");
const H256_1 = require("../H256");
const RLP = require("rlp");
/**
 * Change the users of the world
 */
class SetWorldUsersTransaction {
    constructor(data) {
        this.type = "setWorldUsers";
        const { networkId, shardId, worldId, nonce, users } = data;
        this.networkId = networkId;
        this.shardId = shardId;
        this.worldId = worldId;
        this.nonce = nonce;
        this.users = users;
    }
    static fromJSON(obj) {
        const { data: { networkId, shardId, worldId, nonce, users } } = obj;
        return new this({
            networkId,
            shardId,
            worldId,
            nonce,
            users
        });
    }
    toJSON() {
        const { networkId, shardId, worldId, nonce, users } = this;
        return {
            type: this.type,
            data: {
                networkId,
                shardId,
                worldId,
                nonce,
                users
            }
        };
    }
    toEncodeObject() {
        const { networkId, shardId, worldId, nonce, users } = this;
        return [2, networkId, shardId, worldId, nonce, users];
    }
    rlpBytes() {
        return RLP.encode(this.toEncodeObject());
    }
    hash() {
        return new H256_1.H256(utils_1.blake256(this.rlpBytes()));
    }
}
exports.SetWorldUsersTransaction = SetWorldUsersTransaction;
