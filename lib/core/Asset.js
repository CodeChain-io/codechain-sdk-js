"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const buffer_1 = require("buffer");
const codechain_primitives_1 = require("codechain-primitives");
const H256_1 = require("./H256");
const AssetOutPoint_1 = require("./transaction/AssetOutPoint");
const AssetTransferInput_1 = require("./transaction/AssetTransferInput");
const AssetTransferOutput_1 = require("./transaction/AssetTransferOutput");
const AssetTransferTransaction_1 = require("./transaction/AssetTransferTransaction");
/**
 * Object created as an AssetMintTransaction or AssetTransferTransaction.
 */
class Asset {
    static fromJSON(data) {
        // FIXME: use camelCase for all
        const { asset_type, lock_script_hash, parameters, amount, transactionHash, transactionOutputIndex } = data;
        return new Asset({
            assetType: new H256_1.H256(asset_type),
            lockScriptHash: new codechain_primitives_1.H160(lock_script_hash),
            parameters: parameters.map((p) => buffer_1.Buffer.from(p)),
            amount,
            transactionHash: new H256_1.H256(transactionHash),
            transactionOutputIndex
        });
    }
    constructor(data) {
        const { transactionHash, transactionOutputIndex, assetType, amount, lockScriptHash, parameters } = data;
        this.assetType = data.assetType;
        this.lockScriptHash = data.lockScriptHash;
        this.parameters = data.parameters;
        this.amount = data.amount;
        this.outPoint = new AssetOutPoint_1.AssetOutPoint({
            transactionHash,
            index: transactionOutputIndex,
            assetType,
            amount,
            lockScriptHash,
            parameters
        });
    }
    toJSON() {
        const { assetType, lockScriptHash, parameters, amount, outPoint } = this;
        const { transactionHash, index } = outPoint;
        return {
            asset_type: assetType.value,
            lock_script_hash: lockScriptHash.value,
            parameters,
            amount,
            transactionHash: transactionHash.value,
            transactionOutputIndex: index
        };
    }
    createTransferInput() {
        return new AssetTransferInput_1.AssetTransferInput({
            prevOut: this.outPoint
        });
    }
    createTransferTransaction(params) {
        const { outPoint, assetType } = this;
        const { recipients = [], nonce = 0, networkId } = params;
        return new AssetTransferTransaction_1.AssetTransferTransaction({
            burns: [],
            inputs: [
                new AssetTransferInput_1.AssetTransferInput({
                    prevOut: outPoint,
                    lockScript: buffer_1.Buffer.from([]),
                    unlockScript: buffer_1.Buffer.from([])
                })
            ],
            outputs: recipients.map(recipient => new AssetTransferOutput_1.AssetTransferOutput({
                recipient: codechain_primitives_1.AssetTransferAddress.ensure(recipient.address),
                assetType,
                amount: recipient.amount
            })),
            networkId,
            nonce
        });
    }
}
exports.Asset = Asset;
