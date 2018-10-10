"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AssetMintTransaction_1 = require("./AssetMintTransaction");
const AssetTransferTransaction_1 = require("./AssetTransferTransaction");
const CreateWorldTransaction_1 = require("./CreateWorldTransaction");
const SetWorldOwnersTransaction_1 = require("./SetWorldOwnersTransaction");
const SetWorldUsersTransaction_1 = require("./SetWorldUsersTransaction");
/**
 * Create a transaction from either an AssetMintTransaction JSON object or an
 * AssetTransferTransaction JSON object.
 * @param params Either an AssetMintTransaction JSON object or an AssetTransferTransaction JSON object.
 * @returns A Transaction.
 */
exports.getTransactionFromJSON = (params) => {
    const { type } = params;
    switch (type) {
        case "createWorld":
            return CreateWorldTransaction_1.CreateWorldTransaction.fromJSON(params);
        case "setWorldOwners":
            return SetWorldOwnersTransaction_1.SetWorldOwnersTransaction.fromJSON(params);
        case "setWorldUsers":
            return SetWorldUsersTransaction_1.SetWorldUsersTransaction.fromJSON(params);
        case "assetMint":
            return AssetMintTransaction_1.AssetMintTransaction.fromJSON(params);
        case "assetTransfer":
            return AssetTransferTransaction_1.AssetTransferTransaction.fromJSON(params);
        default:
            throw Error(`Unexpected transaction type: ${type}`);
    }
};
