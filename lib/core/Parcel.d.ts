/// <reference types="node" />
import { PlatformAddress } from "codechain-primitives";
import { Action } from "./action/Action";
import { H256 } from "./H256";
import { H512 } from "./H512";
import { SignedParcel } from "./SignedParcel";
import { Transaction } from "./transaction/Transaction";
import { NetworkId } from "./types";
import { U256 } from "./U256";
/**
 * A unit that collects transactions and requests processing to the network. A parsel signer pays for CCC processing fees.
 *
 * - The fee must be at least 10. The higher the fee, the higher the priority for the parcel to be processed.
 * - It contains the network ID. This must be identical to the network ID to which the parcel is being sent to.
 * - Its nonce must be identical to the nonce of the account that will sign the parcel.
 * - It contains the list of transactions to process. After signing the Parcel's size must not exceed 1 MB.
 * - After signing with the sign() function, it can be sent to the network.
 */
export declare class Parcel {
    /**
     * @deprecated
     */
    static transactions(networkId: NetworkId, ...transactions: Transaction[]): Parcel;
    /**
     * @deprecated
     */
    static payment(networkId: NetworkId, receiver: PlatformAddress, value: U256): Parcel;
    /**
     * @deprecated
     */
    static setRegularKey(networkId: NetworkId, key: H512): Parcel;
    /**
     * @deprecated
     */
    static createShard(networkId: NetworkId): Parcel;
    static fromJSON(result: any): Parcel;
    nonce: U256 | null;
    fee: U256 | null;
    readonly networkId: NetworkId;
    readonly action: Action;
    constructor(networkId: NetworkId, action: Action);
    setNonce(nonce: U256 | string | number): void;
    setFee(fee: U256 | string | number): void;
    toEncodeObject(): any[];
    rlpBytes(): Buffer;
    hash(): H256;
    sign(params: {
        secret: H256 | string;
        nonce: U256 | string | number;
        fee: U256 | string | number;
    }): SignedParcel;
    toJSON(): any;
}
