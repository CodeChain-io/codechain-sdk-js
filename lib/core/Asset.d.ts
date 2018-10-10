/// <reference types="node" />
import { AssetTransferAddress, H160 } from "codechain-primitives";
import { H256 } from "./H256";
import { AssetOutPoint } from "./transaction/AssetOutPoint";
import { AssetTransferInput } from "./transaction/AssetTransferInput";
import { AssetTransferTransaction } from "./transaction/AssetTransferTransaction";
import { NetworkId } from "./types";
export interface AssetData {
    assetType: H256;
    lockScriptHash: H160;
    parameters: Buffer[];
    amount: number;
    transactionHash: H256;
    transactionOutputIndex: number;
}
/**
 * Object created as an AssetMintTransaction or AssetTransferTransaction.
 */
export declare class Asset {
    static fromJSON(data: any): Asset;
    assetType: H256;
    lockScriptHash: H160;
    parameters: Buffer[];
    amount: number;
    outPoint: AssetOutPoint;
    constructor(data: AssetData);
    toJSON(): {
        asset_type: string;
        lock_script_hash: string;
        parameters: Buffer[];
        amount: number;
        transactionHash: string;
        transactionOutputIndex: number;
    };
    createTransferInput(): AssetTransferInput;
    createTransferTransaction(params: {
        recipients?: Array<{
            address: AssetTransferAddress | string;
            amount: number;
        }>;
        nonce?: number;
        networkId: NetworkId;
    }): AssetTransferTransaction;
}
