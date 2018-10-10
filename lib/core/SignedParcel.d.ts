/// <reference types="node" />
import { PlatformAddress } from "codechain-primitives";
import { H160 } from "./H160";
import { H256 } from "./H256";
import { H512 } from "./H512";
import { Parcel } from "./Parcel";
import { U256 } from "./U256";
/**
 * A [Parcel](parcel.html) signed by a private key. It is possible to request
 * the CodeChain network to process this parcel with the
 * [sendSignedParcel](chainrpc.html#sendsignedparcel) function.
 *
 * Parcels signed with a regular key has the same effect as those signed with
 * the original key. The original key is the key of the account that registered
 * the regular key.
 *
 * If any of the following is true, the Parcel will not be processed:
 * - The Parcel's processing fee is less than 10.
 * - A network ID is not identical.
 * - A nonce is not identical to the signer's nonce.
 */
export declare class SignedParcel {
    /**
     * Create a SignedParcel from a SignedParcel JSON object.
     * @param data A SignedParcel JSON object.
     * @returns A SignedParcel.
     */
    static fromJSON(data: any): SignedParcel;
    /**
     * Convert r, s values of an Schnorr signature to a string.
     * @param params.r The r value of an Schnorr signature, which is up to 32 bytes of hexadecimal string.
     * @param params.s The s value of an Schnorr signature, which is up to 32 bytes of hexadecimal string.
     * @returns A 64 byte hexadecimal string.
     */
    static convertRsToSignatureString(params: {
        r: string;
        s: string;
    }): string;
    private static convertSignatureStringToRs;
    unsigned: Parcel;
    r: U256;
    s: U256;
    blockNumber: number | null;
    blockHash: H256 | null;
    parcelIndex: number | null;
    /**
     * @param unsigned A Parcel.
     * @param sig An Schnorr signature which is a 64 byte hexadecimal string.
     * @param blockNumber The block number of the block that contains the parcel.
     * @param blockHash The hash of the block that contains the parcel.
     * @param parcelIndex The index(location) of the parcel within the block.
     */
    constructor(unsigned: Parcel, sig: string, blockNumber?: number, blockHash?: H256, parcelIndex?: number);
    /**
     * Get the signature of a parcel.
     */
    signature(): {
        r: U256;
        s: U256;
    };
    /**
     * Convert to an object for RLP encoding.
     */
    toEncodeObject(): any[];
    /**
     * Convert to RLP bytes.
     */
    rlpBytes(): Buffer;
    /**
     * Get the hash of a parcel.
     * @returns A parcel hash.
     */
    hash(): H256;
    /**
     * Get the account ID of a parcel's signer.
     * @returns An account ID.
     * @deprecated
     */
    getSignerAccountId(): H160;
    /**
     * Get the platform address of a parcel's signer.
     * @returns A PlatformAddress.
     * @deprecated
     */
    getSignerAddress(): PlatformAddress;
    /**
     * Get the public key of a parcel's signer.
     * @returns A public key.
     */
    getSignerPublic(): H512;
    /**
     * Convert to a SignedParcel JSON object.
     * @returns A SignedParcel JSON object.
     */
    toJSON(): {
        blockNumber: number | null;
        blockHash: string | null;
        parcelIndex: number | null;
        nonce: string;
        fee: string;
        networkId: string;
        action: {
            action: string;
        };
        sig: string;
        hash: string;
    };
}
