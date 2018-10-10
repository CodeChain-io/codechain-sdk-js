"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const codechain_primitives_1 = require("codechain-primitives");
const _ = require("lodash");
const utils_1 = require("../utils");
const H160_1 = require("./H160");
const H256_1 = require("./H256");
const H512_1 = require("./H512");
const Parcel_1 = require("./Parcel");
const U256_1 = require("./U256");
const RLP = require("rlp");
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
class SignedParcel {
    // FIXME: any
    /**
     * Create a SignedParcel from a SignedParcel JSON object.
     * @param data A SignedParcel JSON object.
     * @returns A SignedParcel.
     */
    static fromJSON(data) {
        const { sig, blockNumber, blockHash, parcelIndex } = data;
        if (typeof sig !== "string") {
            throw Error("Unexpected type of sig");
        }
        if (blockNumber) {
            return new SignedParcel(Parcel_1.Parcel.fromJSON(data), sig, blockNumber, new H256_1.H256(blockHash), parcelIndex);
        }
        else {
            return new SignedParcel(Parcel_1.Parcel.fromJSON(data), sig);
        }
    }
    /**
     * Convert r, s values of an Schnorr signature to a string.
     * @param params.r The r value of an Schnorr signature, which is up to 32 bytes of hexadecimal string.
     * @param params.s The s value of an Schnorr signature, which is up to 32 bytes of hexadecimal string.
     * @returns A 64 byte hexadecimal string.
     */
    static convertRsToSignatureString(params) {
        const { r, s } = params;
        return `0x${_.padStart(r, 64, "0")}${_.padStart(s, 64, "0")}`;
    }
    static convertSignatureStringToRs(signature) {
        if (signature.startsWith("0x")) {
            signature = signature.substr(2);
        }
        const r = `0x${signature.substr(0, 64)}`;
        const s = `0x${signature.substr(64, 64)}`;
        return { r, s };
    }
    /**
     * @param unsigned A Parcel.
     * @param sig An Schnorr signature which is a 64 byte hexadecimal string.
     * @param blockNumber The block number of the block that contains the parcel.
     * @param blockHash The hash of the block that contains the parcel.
     * @param parcelIndex The index(location) of the parcel within the block.
     */
    constructor(unsigned, sig, blockNumber, blockHash, parcelIndex) {
        this.unsigned = unsigned;
        const { r, s } = SignedParcel.convertSignatureStringToRs(sig);
        this.r = new U256_1.U256(r);
        this.s = new U256_1.U256(s);
        this.blockNumber = blockNumber === undefined ? null : blockNumber;
        this.blockHash = blockHash || null;
        this.parcelIndex = parcelIndex === undefined ? null : parcelIndex;
    }
    /**
     * Get the signature of a parcel.
     */
    signature() {
        const { r, s } = this;
        return { r, s };
    }
    /**
     * Convert to an object for RLP encoding.
     */
    toEncodeObject() {
        const { unsigned: { nonce, fee, action, networkId }, r, s } = this;
        const sig = `0x${_.padStart(r.value.toString(16), 64, "0")}${_.padStart(s.value.toString(16), 64, "0")}`;
        if (!nonce || !fee) {
            throw Error("Nonce and fee in the parcel must be present");
        }
        return [
            nonce.toEncodeObject(),
            fee.toEncodeObject(),
            networkId,
            action.toEncodeObject(),
            sig
        ];
    }
    /**
     * Convert to RLP bytes.
     */
    rlpBytes() {
        return RLP.encode(this.toEncodeObject());
    }
    /**
     * Get the hash of a parcel.
     * @returns A parcel hash.
     */
    hash() {
        return new H256_1.H256(utils_1.blake256(this.rlpBytes()));
    }
    /**
     * Get the account ID of a parcel's signer.
     * @returns An account ID.
     * @deprecated
     */
    getSignerAccountId() {
        const { r, s, unsigned } = this;
        const publicKey = utils_1.recoverSchnorr(unsigned.hash().value, {
            r: r.value.toString(16),
            s: s.value.toString(16)
        });
        return new H160_1.H160(utils_1.blake160(publicKey));
    }
    /**
     * Get the platform address of a parcel's signer.
     * @returns A PlatformAddress.
     * @deprecated
     */
    getSignerAddress() {
        return codechain_primitives_1.PlatformAddress.fromAccountId(this.getSignerAccountId());
    }
    /**
     * Get the public key of a parcel's signer.
     * @returns A public key.
     */
    getSignerPublic() {
        const { r, s, unsigned } = this;
        return new H512_1.H512(utils_1.recoverSchnorr(unsigned.hash().value, {
            r: r.value.toString(16),
            s: s.value.toString(16)
        }));
    }
    /**
     * Convert to a SignedParcel JSON object.
     * @returns A SignedParcel JSON object.
     */
    toJSON() {
        const { blockNumber, blockHash, parcelIndex, unsigned: { nonce, fee, networkId, action }, r, s } = this;
        const sig = SignedParcel.convertRsToSignatureString({
            r: r.value.toString(16),
            s: s.value.toString(16)
        });
        if (!nonce || !fee) {
            throw Error("Nonce and fee in the parcel must be present");
        }
        return {
            blockNumber,
            blockHash: blockHash === null ? null : blockHash.value,
            parcelIndex,
            nonce: nonce.value.toString(),
            fee: fee.value.toString(),
            networkId,
            action: action.toJSON(),
            sig,
            hash: this.hash().value
        };
    }
}
exports.SignedParcel = SignedParcel;
