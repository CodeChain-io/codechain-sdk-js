/// <reference types="node" />
import { AssetTransferAddress, H160 } from "codechain-primitives";
import { H256 } from "../core/H256";
import { AssetTransferTransaction, TransactionInputSigner } from "../core/transaction/AssetTransferTransaction";
import { NetworkId } from "../core/types";
import { SignatureTag } from "../utils";
import { KeyStore } from "./KeyStore";
/**
 * AssetAgent which supports P2PKH(Pay to Public Key Hash).
 */
export declare class P2PKH implements TransactionInputSigner {
    static getLockScript(): Buffer;
    static getLockScriptHash(): H160;
    private rawKeyStore;
    private networkId;
    constructor(params: {
        keyStore: KeyStore;
        networkId: NetworkId;
    });
    createAddress(options?: {
        passphrase?: string;
    }): Promise<AssetTransferAddress>;
    /**
     * @deprecated Use signTransactionInput
     */
    signInput(transaction: AssetTransferTransaction, index: number, options?: {
        passphrase?: string;
    }): Promise<void>;
    createUnlockScript(publicKeyHash: string, txhash: H256, options?: {
        passphrase?: string;
        signatureTag?: SignatureTag;
    }): Promise<Buffer>;
}
