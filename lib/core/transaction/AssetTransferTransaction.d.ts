/// <reference types="node" />
import { AssetTransferAddress } from "codechain-primitives";
import { SignatureTag } from "../../utils";
import { Asset } from "../Asset";
import { H256 } from "../H256";
import { NetworkId } from "../types";
import { AssetTransferInput } from "./AssetTransferInput";
import { AssetTransferOutput } from "./AssetTransferOutput";
export interface TransactionInputSigner {
    signInput: (transaction: AssetTransferTransaction, index: number, options?: {
        passphrase?: string;
    }) => Promise<void>;
}
export interface TransactionBurnSigner {
    signBurn: (transaction: AssetTransferTransaction, index: number, options?: {
        passphrase?: string;
    }) => Promise<void>;
}
export interface AssetTransferTransactionData {
    burns: AssetTransferInput[];
    inputs: AssetTransferInput[];
    outputs: AssetTransferOutput[];
    networkId: NetworkId;
    nonce?: number;
}
/**
 * Spends the existing asset and creates a new asset. Ownership can be transferred during this process.
 *
 * An AssetTransferTransaction consists of:
 *  - A list of AssetTransferInput to burn.
 *  - A list of AssetTransferInput to spend.
 *  - A list of AssetTransferOutput to create.
 *  - A network ID. This must be identical to the network ID of which the
 *  transaction is being sent to.
 *
 * All inputs must be valid for the transaction to be valid. When each asset
 * types' amount have been summed, the sum of inputs and the sum of outputs
 * must be identical. If an identical transaction hash already exists, then the
 * change fails. In this situation, a transaction can be created again by
 * arbitrarily changing the nonce.
 */
export declare class AssetTransferTransaction {
    /** Create an AssetTransferTransaction from an AssetTransferTransaction JSON object.
     * @param obj An AssetTransferTransaction JSON object.
     * @returns An AssetTransferTransaction.
     */
    static fromJSON(obj: any): AssetTransferTransaction;
    readonly burns: AssetTransferInput[];
    readonly inputs: AssetTransferInput[];
    readonly outputs: AssetTransferOutput[];
    readonly networkId: NetworkId;
    readonly nonce: number;
    readonly type = "assetTransfer";
    /**
     * @param params.burns An array of AssetTransferInput to burn.
     * @param params.inputs An array of AssetTransferInput to spend.
     * @param params.outputs An array of AssetTransferOutput to create.
     * @param params.networkId A network ID of the transaction.
     * @param params.nonce A nonce of the transaction.
     */
    constructor(params: AssetTransferTransactionData);
    /**
     * Convert to an object for RLP encoding.
     */
    toEncodeObject(): (string | number | ((string | number)[] | Buffer)[][] | (string | number | Buffer[])[][])[];
    /**
     * Convert to RLP bytes.
     */
    rlpBytes(): Buffer;
    /**
     * Get the hash of an AssetTransferTransaction.
     * @returns A transaction hash.
     */
    hash(): H256;
    /**
     * Add an AssetTransferInput to burn.
     * @param burns An array of either an AssetTransferInput or an Asset.
     * @returns The AssetTransferTransaction, which is modified by adding them.
     */
    addBurns(...burns: Array<AssetTransferInput | Asset>): AssetTransferTransaction;
    /**
     * Add an AssetTransferInput to spend.
     * @param inputs An array of either an AssetTransferInput or an Asset.
     * @returns The AssetTransferTransaction, which is modified by adding them.
     */
    addInputs(...inputs: Array<AssetTransferInput | Asset>): AssetTransferTransaction;
    /**
     * Add an AssetTransferOutput to create.
     * @param outputs An array of either an AssetTransferOutput or an object
     * that has amount, assetType and recipient values.
     * @param output.amount Asset amount of the output.
     * @param output.assetType An asset type of the output.
     * @param output.recipient A recipient of the output.
     */
    addOutputs(...outputs: Array<AssetTransferOutput | {
        amount: number;
        assetType: H256 | string;
        recipient: AssetTransferAddress | string;
    }>): AssetTransferTransaction;
    /**
     * Get the output of the given index, of this transaction.
     * @param index An index indicating an output.
     * @returns An Asset.
     */
    getTransferredAsset(index: number): Asset;
    /**
     * Get the outputs of this transaction.
     * @returns An array of an Asset.
     */
    getTransferredAssets(): Asset[];
    /**
     * Get a hash of the transaction that doesn't contain the scripts. The hash
     * is used as a message to create a signature for a transaction.
     * @returns A hash.
     */
    hashWithoutScript(params?: {
        tag: SignatureTag;
        type: "input" | "burn";
        index: number;
    }): H256;
    /**
     * Set a burn's lock script and an input's unlock script so that the
     * burn become burnable.
     * @param index An index indicating the burn to sign.
     * @param params.signer A TransactionSigner. Currently, P2PKH is available.
     * @returns A promise that resolves when setting is done.
     * @deprecated Use signTransactionBurn in the Key module
     */
    signBurn(index: number, params: {
        signer: TransactionBurnSigner;
        passphrase?: string;
    }): Promise<void>;
    /**
     * Set an input's lock script and an input's unlock script so that the
     * input become spendable.
     * @param index An index indicating the input to sign.
     * @param params.signer A TransactionSigner. Currently, P2PKH is available.
     * @returns A promise that resolves when setting is done.
     * @deprecated Use signTransactionInput in the Key module
     */
    signInput(index: number, params: {
        signer: TransactionInputSigner;
        passphrase?: string;
    }): Promise<void>;
    /**
     * Get the asset address of an output.
     * @param index An index indicating the output.
     * @returns An asset address which is H256.
     */
    getAssetAddress(index: number): H256;
    /**
     * Convert to an AssetTransferTransaction JSON object.
     * @returns An AssetTransferTransaction JSON object.
     */
    toJSON(): {
        type: string;
        data: {
            networkId: string;
            burns: {
                prevOut: {
                    transactionHash: string;
                    index: number;
                    assetType: string;
                    amount: number; /**
                     * @param params.burns An array of AssetTransferInput to burn.
                     * @param params.inputs An array of AssetTransferInput to spend.
                     * @param params.outputs An array of AssetTransferOutput to create.
                     * @param params.networkId A network ID of the transaction.
                     * @param params.nonce A nonce of the transaction.
                     */
                };
                lockScript: number[];
                unlockScript: number[];
            }[];
            inputs: {
                prevOut: {
                    transactionHash: string;
                    index: number;
                    assetType: string;
                    amount: number; /**
                     * @param params.burns An array of AssetTransferInput to burn.
                     * @param params.inputs An array of AssetTransferInput to spend.
                     * @param params.outputs An array of AssetTransferOutput to create.
                     * @param params.networkId A network ID of the transaction.
                     * @param params.nonce A nonce of the transaction.
                     */
                };
                lockScript: number[];
                unlockScript: number[];
            }[];
            outputs: {
                lockScriptHash: string;
                parameters: number[][];
                assetType: string;
                amount: number;
            }[];
            nonce: number;
        };
    };
}
