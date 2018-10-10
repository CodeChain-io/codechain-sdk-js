/// <reference types="node" />
import { AssetTransferAddress, H160, PlatformAddress } from "codechain-primitives";
import { Asset } from "../Asset";
import { AssetScheme } from "../AssetScheme";
import { H256 } from "../H256";
import { NetworkId } from "../types";
export interface AssetMintTransactionData {
    networkId: NetworkId;
    shardId: number;
    worldId: number;
    metadata: string;
    output: {
        lockScriptHash: H160;
        parameters: Buffer[];
        amount: number | null;
    };
    registrar: PlatformAddress | null;
    nonce: number;
}
export interface AssetMintTransactionAddressData {
    networkId: NetworkId;
    shardId: number;
    worldId: number;
    metadata: string;
    output: {
        recipient: AssetTransferAddress;
        amount: number | null;
    };
    registrar: PlatformAddress | null;
    nonce: number;
}
/**
 * Creates a new asset type and that asset itself.
 *
 * The owner of the new asset created can be assigned by a lock script hash and parameters.
 *  - A metadata is a string that explains the asset's type.
 *  - Amount defines the quantity of asset to be created. If set as null, it
 *  will be set as the maximum value of a 64-bit unsigned integer by default.
 *  - If registrar exists, the registrar must be the Signer of the Parcel when
 *  sending the created asset through AssetTransferTransaction.
 *  - A transaction hash can be changed by changing nonce.
 *  - If an identical transaction hash already exists, then the change fails. In
 *  this situation, a transaction can be created again by arbitrarily changing
 *  the nonce.
 */
export declare class AssetMintTransaction {
    /**
     * Create an AssetMintTransaction from an AssetMintTransaction JSON object.
     * @param data An AssetMintTransaction JSON object.
     * @returns An AssetMintTransaction.
     */
    static fromJSON(data: any): AssetMintTransaction;
    readonly networkId: NetworkId;
    readonly shardId: number;
    readonly worldId: number;
    readonly metadata: string;
    readonly output: {
        lockScriptHash: H160;
        parameters: Buffer[];
        amount: number | null;
    };
    readonly registrar: PlatformAddress | null;
    readonly nonce: number;
    readonly type = "assetMint";
    /**
     * @param data.networkId A network ID of the transaction.
     * @param data.shardId A shard ID of the transaction.
     * @param data.metadata A metadata of the asset.
     * @param data.output.lockScriptHash A lock script hash of the output.
     * @param data.output.parameters Parameters of the output.
     * @param data.output.amount Asset amount of the output.
     * @param data.registrar A registrar of the asset.
     * @param data.nonce A nonce of the transaction.
     */
    constructor(data: AssetMintTransactionData | AssetMintTransactionAddressData);
    /**
     * Convert to an AssetMintTransaction JSON object.
     * @returns An AssetMintTransaction JSON object.
     */
    toJSON(): {
        type: string;
        data: {
            networkId: string;
            shardId: number;
            worldId: number;
            metadata: string;
            output: {
                lockScriptHash: string;
                parameters: number[][];
                amount: number | null;
            };
            registrar: string | null;
            nonce: number;
        };
    };
    /**
     * Convert to an object for RLP encoding.
     */
    toEncodeObject(): (string | number | string[] | number[] | Buffer[])[];
    /**
     * Convert to RLP bytes.
     */
    rlpBytes(): Buffer;
    /**
     * Get the hash of an AssetMintTransaction.
     * @returns A transaction hash.
     */
    hash(): H256;
    /**
     * Get the output of this transaction.
     * @returns An Asset.
     */
    getMintedAsset(): Asset;
    /**
     * Get the asset scheme of this transaction.
     * @return An AssetScheme.
     */
    getAssetScheme(): AssetScheme;
    /**
     * Get the address of the asset scheme. An asset scheme address equals to an
     * asset type value.
     * @returns An asset scheme address which is H256.
     */
    getAssetSchemeAddress(): H256;
    /**
     * Get the asset address of the output.
     * @returns An asset address which is H256.
     */
    getAssetAddress(): H256;
}
