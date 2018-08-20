import { Buffer } from "buffer";

import { H256 } from "../core/H256";
import { AssetTransferTransaction, TransactionInputSigner } from "../core/transaction/AssetTransferTransaction";
import { Script } from "../core/Script";
import { blake256 } from "../utils";

import { AssetTransferAddress } from "./AssetTransferAddress";
import { KeyStore } from "./KeyStore";

type NetworkId = string;

/**
 * AssetAgent which supports P2PKH(Pay to Public Key Hash).
 */
export class P2PKH implements TransactionInputSigner {
    private rawKeyStore: KeyStore;
    private networkId: NetworkId;
    private publicKeyMap: { [publicKeyHash: string]: string } = {};

    // FIXME: rename keyStore to rawKeyStore
    constructor(params: { keyStore: KeyStore, networkId: NetworkId }) {
        const { keyStore, networkId } = params;
        this.rawKeyStore = keyStore;
        this.networkId = networkId;
    }

    async createAddress(): Promise<AssetTransferAddress> {
        const publicKey = await this.rawKeyStore.createKey();
        const publicKeyHash = H256.ensure(blake256(publicKey));
        this.publicKeyMap[publicKeyHash.value] = publicKey;
        return AssetTransferAddress.fromTypeAndPayload(1, publicKeyHash, { networkId: this.networkId });
    }

    async signInput(transaction: AssetTransferTransaction, index: number): Promise<void> {
        if (index >= transaction.inputs.length) {
            throw "Invalid input index";
        }
        const { lockScriptHash, parameters } = transaction.inputs[index].prevOut;
        if (lockScriptHash === undefined || parameters === undefined) {
            throw "Invalid transaction input";
        }
        if (lockScriptHash.value !== P2PKH.getLockScriptHash().value) {
            throw "Unexpected lock script hash";
        }
        if (parameters.length !== 1) {
            throw "Unexpected length of parameters";
        }
        const publicKeyHash = Buffer.from(parameters[0]).toString("hex");
        const publicKey = this.publicKeyMap[publicKeyHash];
        if (!publicKey) {
            throw `Unable to get original key from the given public key hash: ${publicKeyHash}`;
        }

        transaction.inputs[index].setLockScript(P2PKH.getLockScript());
        transaction.inputs[index].setUnlockScript(await this.getUnlockScript(publicKey, transaction.hashWithoutScript()));
    }

    private async getUnlockScript(publicKey: string, txhash: H256): Promise<Buffer> {
        const signature = await this.rawKeyStore.sign({ publicKey, message: txhash.value });
        const { PUSHB } = Script.Opcode;
        return Buffer.from([
            PUSHB,
            65,
            ...Buffer.from(signature, "hex"),
            PUSHB,
            64,
            ...Buffer.from(publicKey, "hex")
        ]);
    }

    static getLockScript(): Buffer {
        const { COPY, BLAKE256, EQ, JZ, CHKSIG } = Script.Opcode;
        return Buffer.from([COPY, 0x01, BLAKE256, EQ, JZ, 0xFF, CHKSIG]);
    }

    static getLockScriptHash(): H256 {
        return new H256("f42a65ea518ba236c08b261c34af0521fa3cd1aa505e1c18980919cb8945f8f3");
    }
}
