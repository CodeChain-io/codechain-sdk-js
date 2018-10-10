"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const Action_1 = require("./action/Action");
const AssetTransactionGroup_1 = require("./action/AssetTransactionGroup");
const CreateShard_1 = require("./action/CreateShard");
const Payment_1 = require("./action/Payment");
const SetReulgarKey_1 = require("./action/SetReulgarKey");
const H256_1 = require("./H256");
const SignedParcel_1 = require("./SignedParcel");
const U256_1 = require("./U256");
const RLP = require("rlp");
/**
 * A unit that collects transactions and requests processing to the network. A parsel signer pays for CCC processing fees.
 *
 * - The fee must be at least 10. The higher the fee, the higher the priority for the parcel to be processed.
 * - It contains the network ID. This must be identical to the network ID to which the parcel is being sent to.
 * - Its nonce must be identical to the nonce of the account that will sign the parcel.
 * - It contains the list of transactions to process. After signing the Parcel's size must not exceed 1 MB.
 * - After signing with the sign() function, it can be sent to the network.
 */
class Parcel {
    /**
     * @deprecated
     */
    static transactions(networkId, ...transactions) {
        const action = new AssetTransactionGroup_1.AssetTransactionGroup({ transactions });
        return new Parcel(networkId, action);
    }
    /**
     * @deprecated
     */
    static payment(networkId, receiver, value) {
        const action = new Payment_1.Payment(receiver, value);
        return new Parcel(networkId, action);
    }
    /**
     * @deprecated
     */
    static setRegularKey(networkId, key) {
        const action = new SetReulgarKey_1.SetRegularKey(key);
        return new Parcel(networkId, action);
    }
    /**
     * @deprecated
     */
    static createShard(networkId) {
        const action = new CreateShard_1.CreateShard();
        return new Parcel(networkId, action);
    }
    static fromJSON(result) {
        const { nonce, fee, networkId, action } = result;
        const parcel = new Parcel(networkId, Action_1.getActionFromJSON(action));
        parcel.setNonce(nonce);
        parcel.setFee(fee);
        return parcel;
    }
    constructor(networkId, action) {
        this.nonce = null;
        this.fee = null;
        this.networkId = networkId;
        this.action = action;
    }
    setNonce(nonce) {
        this.nonce = U256_1.U256.ensure(nonce);
    }
    setFee(fee) {
        this.fee = U256_1.U256.ensure(fee);
    }
    toEncodeObject() {
        const { nonce, fee, action, networkId } = this;
        if (!nonce || !fee) {
            throw Error("Nonce and fee in the parcel must be present");
        }
        return [
            nonce.toEncodeObject(),
            fee.toEncodeObject(),
            networkId,
            action.toEncodeObject()
        ];
    }
    rlpBytes() {
        return RLP.encode(this.toEncodeObject());
    }
    hash() {
        return new H256_1.H256(utils_1.blake256(this.rlpBytes()));
    }
    sign(params) {
        const { secret, nonce, fee } = params;
        if (this.nonce !== null) {
            throw Error("The parcel nonce is already set");
        }
        this.nonce = U256_1.U256.ensure(nonce);
        if (this.fee !== null) {
            throw Error("The parcel fee is already set");
        }
        this.fee = U256_1.U256.ensure(fee);
        const { r, s } = utils_1.signSchnorr(this.hash().value, H256_1.H256.ensure(secret).value);
        const sig = SignedParcel_1.SignedParcel.convertRsToSignatureString({ r, s });
        return new SignedParcel_1.SignedParcel(this, sig);
    }
    toJSON() {
        const { nonce, fee, networkId, action } = this;
        if (!fee) {
            throw Error("Fee in the parcel must be present");
        }
        const result = {
            fee: fee.toEncodeObject(),
            networkId,
            action: action.toJSON()
        };
        if (nonce) {
            result.nonce = nonce.toEncodeObject();
        }
        return result;
    }
}
exports.Parcel = Parcel;
