import { AssetTransferAddress, PlatformAddress } from "codechain-primitives";
import { AssetMintTransaction } from "./transaction/AssetMintTransaction";
import { NetworkId } from "./types";
export interface AssetSchemeData {
    networkId: NetworkId;
    shardId: number;
    worldId: number;
    metadata: string;
    amount: number;
    registrar: PlatformAddress | null;
}
/**
 * Object that contains information about the Asset when performing AssetMintTransaction.
 */
export declare class AssetScheme {
    static fromJSON(data: any): AssetScheme;
    networkId: NetworkId;
    shardId: number;
    worldId: number;
    metadata: string;
    amount: number;
    registrar: PlatformAddress | null;
    constructor(data: AssetSchemeData);
    toJSON(): {
        networkId: string;
        metadata: string;
        amount: number;
        registrar: string | null;
    };
    createMintTransaction(params: {
        recipient: AssetTransferAddress | string;
        nonce?: number;
    }): AssetMintTransaction;
}
