"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const codechain_primitives_1 = require("codechain-primitives");
const AssetMintTransaction_1 = require("./transaction/AssetMintTransaction");
/**
 * Object that contains information about the Asset when performing AssetMintTransaction.
 */
class AssetScheme {
    static fromJSON(data) {
        return new AssetScheme(data);
    }
    constructor(data) {
        this.networkId = data.networkId;
        this.shardId = data.shardId;
        this.worldId = data.worldId;
        this.metadata = data.metadata;
        this.registrar = data.registrar;
        this.amount = data.amount;
    }
    toJSON() {
        const { networkId, metadata, amount, registrar } = this;
        return {
            networkId,
            metadata,
            amount,
            registrar: registrar === null ? null : registrar.toString()
        };
    }
    createMintTransaction(params) {
        const { recipient, nonce = 0 } = params;
        const { networkId, shardId, worldId, metadata, amount, registrar } = this;
        return new AssetMintTransaction_1.AssetMintTransaction({
            networkId,
            shardId,
            worldId,
            metadata,
            output: {
                amount,
                recipient: codechain_primitives_1.AssetTransferAddress.ensure(recipient)
            },
            registrar,
            nonce
        });
    }
}
exports.AssetScheme = AssetScheme;
