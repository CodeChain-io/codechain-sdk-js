"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const H256_1 = require("../H256");
class ChangeShard {
    constructor(obj) {
        this.shardId = obj.shardId;
        this.preRoot = obj.preRoot;
        this.postRoot = obj.postRoot;
    }
    toJSON() {
        const { shardId, preRoot, postRoot } = this;
        return {
            shardId,
            preRoot: preRoot.toEncodeObject(),
            postRoot: postRoot.toEncodeObject()
        };
    }
    toEncodeObject() {
        const { shardId, preRoot, postRoot } = this;
        return [shardId, preRoot.toEncodeObject(), postRoot.toEncodeObject()];
    }
}
exports.ChangeShard = ChangeShard;
class AssetTransactionGroup {
    constructor(input) {
        const ZERO = new H256_1.H256("0x0000000000000000000000000000000000000000000000000000000000000000");
        this.transactions = input.transactions;
        this.changes = [
            new ChangeShard({ shardId: 0, preRoot: ZERO, postRoot: ZERO })
        ];
        this.signatures = [];
    }
    addSignature(signature) {
        this.signatures.push(signature);
    }
    toEncodeObject() {
        const transactions = this.transactions.map(transaction => transaction.toEncodeObject());
        const changes = this.changes.map(c => c.toEncodeObject());
        const signatures = this.signatures;
        return [1, transactions, changes, signatures];
    }
    toJSON() {
        return {
            action: "assetTransactionGroup",
            transactions: this.transactions.map(t => t.toJSON()),
            changes: this.changes.map(c => c.toJSON()),
            signatures: this.signatures
        };
    }
}
exports.AssetTransactionGroup = AssetTransactionGroup;
