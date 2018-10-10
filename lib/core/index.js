"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const codechain_primitives_1 = require("codechain-primitives");
const AssetTransactionGroup_1 = require("./action/AssetTransactionGroup");
const CreateShard_1 = require("./action/CreateShard");
const Payment_1 = require("./action/Payment");
const SetReulgarKey_1 = require("./action/SetReulgarKey");
const SetShardOwners_1 = require("./action/SetShardOwners");
const SetShardUsers_1 = require("./action/SetShardUsers");
const Asset_1 = require("./Asset");
const AssetScheme_1 = require("./AssetScheme");
const Block_1 = require("./Block");
const H128_1 = require("./H128");
const H160_1 = require("./H160");
const H256_1 = require("./H256");
const H512_1 = require("./H512");
const Invoice_1 = require("./Invoice");
const Parcel_1 = require("./Parcel");
const Script_1 = require("./Script");
const SignedParcel_1 = require("./SignedParcel");
const AssetMintTransaction_1 = require("./transaction/AssetMintTransaction");
const AssetOutPoint_1 = require("./transaction/AssetOutPoint");
const AssetTransferInput_1 = require("./transaction/AssetTransferInput");
const AssetTransferOutput_1 = require("./transaction/AssetTransferOutput");
const AssetTransferTransaction_1 = require("./transaction/AssetTransferTransaction");
const CreateWorldTransaction_1 = require("./transaction/CreateWorldTransaction");
const SetWorldOwnersTransaction_1 = require("./transaction/SetWorldOwnersTransaction");
const SetWorldUsersTransaction_1 = require("./transaction/SetWorldUsersTransaction");
const Transaction_1 = require("./transaction/Transaction");
const U256_1 = require("./U256");
class Core {
    /**
     * @param params.networkId The network id of CodeChain.
     */
    constructor(params) {
        this.classes = Core.classes;
        const { networkId } = params;
        this.networkId = networkId;
    }
    /**
     * Creates Payment action which pays the value amount of CCC(CodeChain Coin)
     * from the parcel signer to the recipient. Who is signing the parcel will pay.
     * @param params.recipient The platform account who receives CCC
     * @param params.amount Amount of CCC to pay
     * @throws Given string for recipient is invalid for converting it to PlatformAddress
     * @throws Given number or string for amount is invalid for converting it to U256
     */
    createPaymentParcel(params) {
        const { recipient, amount } = params;
        checkPlatformAddressRecipient(recipient);
        checkAmount(amount);
        return new Parcel_1.Parcel(this.networkId, new Payment_1.Payment(codechain_primitives_1.PlatformAddress.ensure(recipient), U256_1.U256.ensure(amount)));
    }
    /**
     * Creates SetRegularKey action which sets the regular key of the parcel signer.
     * @param params.key The public key of a regular key
     * @throws Given string for key is invalid for converting it to H512
     */
    createSetRegularKeyParcel(params) {
        const { key } = params;
        checkKey(key);
        return new Parcel_1.Parcel(this.networkId, new SetReulgarKey_1.SetRegularKey(H512_1.H512.ensure(key)));
    }
    /**
     * Creates AssetTransactionGroup action which can mint or transfer assets through
     * AssetMintTransaction or AssetTransferTransaction.
     * @param params.transactions List of transaction
     */
    createAssetTransactionGroupParcel(params) {
        const { transactions } = params;
        checkTransactions(transactions);
        return new Parcel_1.Parcel(this.networkId, new AssetTransactionGroup_1.AssetTransactionGroup({ transactions }));
    }
    /**
     * Creates CreateShard action which can create new shard
     */
    createCreateShardParcel() {
        return new Parcel_1.Parcel(this.networkId, new CreateShard_1.CreateShard());
    }
    createSetShardOwnersParcel(params) {
        const { shardId, owners } = params;
        checkShardId(shardId);
        checkOwners(owners);
        return new Parcel_1.Parcel(this.networkId, new SetShardOwners_1.SetShardOwners({
            shardId,
            owners: owners.map(codechain_primitives_1.PlatformAddress.ensure)
        }));
    }
    /**
     * Create SetShardUser action which can change shard users
     * @param params.shardId
     * @param params.users
     */
    createSetShardUsersParcel(params) {
        const { shardId, users } = params;
        checkShardId(shardId);
        checkUsers(users);
        return new Parcel_1.Parcel(this.networkId, new SetShardUsers_1.SetShardUsers({
            shardId,
            users: users.map(codechain_primitives_1.PlatformAddress.ensure)
        }));
    }
    /**
     * Creates asset's scheme.
     * @param params.metadata Any string that describing the asset. For example,
     * stringified JSON containing properties.
     * @param params.amount Total amount of this asset
     * @param params.registrar Platform account or null. If account is present, the
     * parcel that includes AssetTransferTransaction of this asset must be signed by
     * the registrar account.
     * @throws Given string for registrar is invalid for converting it to paltform account
     */
    createAssetScheme(params) {
        const { shardId, worldId, metadata, amount, registrar = null } = params;
        checkShardId(shardId);
        checkWorldId(worldId);
        checkMetadata(metadata);
        checkAmountU64(amount);
        checkRegistrar(registrar);
        return new AssetScheme_1.AssetScheme({
            networkId: this.networkId,
            shardId,
            worldId,
            metadata,
            amount,
            registrar: registrar == null ? null : codechain_primitives_1.PlatformAddress.ensure(registrar)
        });
    }
    createCreateWorldTransaction(params) {
        const { networkId = this.networkId, shardId, owners, nonce = 0 } = params;
        checkNetworkId(networkId);
        checkShardId(shardId);
        checkOwners(owners);
        checkNonce(nonce);
        return new CreateWorldTransaction_1.CreateWorldTransaction({
            networkId,
            shardId,
            owners: owners.map(codechain_primitives_1.PlatformAddress.ensure),
            nonce
        });
    }
    createSetWorldOwnersTransaction(params) {
        const { networkId = this.networkId, shardId, worldId, owners, nonce } = params;
        checkNetworkId(networkId);
        checkShardId(shardId);
        checkWorldId(worldId);
        checkOwners(owners);
        checkNonce(nonce);
        return new SetWorldOwnersTransaction_1.SetWorldOwnersTransaction({
            networkId,
            shardId,
            worldId,
            owners: owners.map(codechain_primitives_1.PlatformAddress.ensure),
            nonce
        });
    }
    createSetWorldUsersTransaction(params) {
        const { networkId = this.networkId, shardId, worldId, users, nonce } = params;
        checkNetworkId(networkId);
        checkShardId(shardId);
        checkWorldId(worldId);
        checkUsers(users);
        checkNonce(nonce);
        return new SetWorldUsersTransaction_1.SetWorldUsersTransaction({
            networkId,
            shardId,
            worldId,
            users: users.map(codechain_primitives_1.PlatformAddress.ensure),
            nonce
        });
    }
    createAssetMintTransaction(params) {
        const { scheme, recipient, nonce = 0 } = params;
        if (scheme !== null && typeof scheme !== "object") {
            throw Error(`Expected scheme param to be either an AssetScheme or an object but found ${scheme}`);
        }
        const { networkId = this.networkId, shardId, worldId, metadata, registrar = null, amount } = scheme;
        checkAssetTransferAddressRecipient(recipient);
        checkNonce(nonce);
        checkNetworkId(networkId);
        checkShardId(shardId);
        checkWorldId(worldId);
        checkMetadata(metadata);
        checkRegistrar(registrar);
        if (amount !== null) {
            checkAmountU64(amount);
        }
        return new AssetMintTransaction_1.AssetMintTransaction({
            networkId,
            shardId,
            worldId,
            nonce,
            registrar: registrar == null ? null : codechain_primitives_1.PlatformAddress.ensure(registrar),
            metadata,
            output: {
                amount,
                recipient: codechain_primitives_1.AssetTransferAddress.ensure(recipient)
            }
        });
    }
    createAssetTransferTransaction(params) {
        const { burns = [], inputs = [], outputs = [], networkId = this.networkId, nonce = 0 } = params || {};
        checkTransferBurns(burns);
        checkTransferInputs(inputs);
        checkTransferOutputs(outputs);
        checkNetworkId(networkId);
        checkNonce(nonce);
        return new AssetTransferTransaction_1.AssetTransferTransaction({
            burns,
            inputs,
            outputs,
            networkId,
            nonce
        });
    }
    createAssetTransferInput(params) {
        const { assetOutPoint, lockScript, unlockScript } = params;
        if (assetOutPoint !== null && typeof assetOutPoint !== "object") {
            throw Error(`Expected assetOutPoint param to be either an AssetOutPoint or an object but found ${assetOutPoint}`);
        }
        const { transactionHash, index, assetType, amount, lockScriptHash, parameters } = assetOutPoint;
        checkTransactionHash(transactionHash);
        checkIndex(index);
        checkAssetType(assetType);
        checkAmountU64(amount);
        if (lockScriptHash) {
            checkLockScriptHash(lockScriptHash);
        }
        if (parameters) {
            checkParameters(parameters);
        }
        if (lockScript) {
            checkLockScript(lockScript);
        }
        if (unlockScript) {
            checkUnlockScript(unlockScript);
        }
        return new AssetTransferInput_1.AssetTransferInput({
            prevOut: assetOutPoint instanceof AssetOutPoint_1.AssetOutPoint
                ? assetOutPoint
                : new AssetOutPoint_1.AssetOutPoint({
                    transactionHash: H256_1.H256.ensure(transactionHash),
                    index,
                    assetType: H256_1.H256.ensure(assetType),
                    amount,
                    lockScriptHash: lockScriptHash
                        ? H160_1.H160.ensure(lockScriptHash)
                        : undefined,
                    parameters
                }),
            lockScript,
            unlockScript
        });
    }
    createAssetOutPoint(params) {
        const { transactionHash, index, assetType, amount } = params;
        checkTransactionHash(transactionHash);
        checkIndex(index);
        checkAssetType(assetType);
        checkAmountU64(amount);
        return new AssetOutPoint_1.AssetOutPoint({
            transactionHash: H256_1.H256.ensure(transactionHash),
            index,
            assetType: H256_1.H256.ensure(assetType),
            amount
        });
    }
    createAssetTransferOutput(params) {
        const { recipient, assetType, amount } = params;
        checkAssetTransferAddressRecipient(recipient);
        checkAssetType(assetType);
        checkAmountU64(amount);
        return new AssetTransferOutput_1.AssetTransferOutput({
            recipient: codechain_primitives_1.AssetTransferAddress.ensure(recipient),
            assetType: H256_1.H256.ensure(assetType),
            amount
        });
    }
    // FIXME: any
    getTransactionFromJSON(json) {
        return Transaction_1.getTransactionFromJSON(json);
    }
}
Core.classes = {
    // Data
    H128: H128_1.H128,
    H160: H160_1.H160,
    H256: H256_1.H256,
    H512: H512_1.H512,
    U256: U256_1.U256,
    Invoice: Invoice_1.Invoice,
    // Block
    Block: Block_1.Block,
    // Parcel
    Parcel: Parcel_1.Parcel,
    SignedParcel: SignedParcel_1.SignedParcel,
    // Action
    Payment: Payment_1.Payment,
    SetRegularKey: SetReulgarKey_1.SetRegularKey,
    AssetTransactionGroup: AssetTransactionGroup_1.AssetTransactionGroup,
    CreateShard: CreateShard_1.CreateShard,
    SetShardOwners: SetShardOwners_1.SetShardOwners,
    SetShardUsers: SetShardUsers_1.SetShardUsers,
    // Transaction
    AssetMintTransaction: AssetMintTransaction_1.AssetMintTransaction,
    AssetTransferTransaction: AssetTransferTransaction_1.AssetTransferTransaction,
    AssetTransferInput: AssetTransferInput_1.AssetTransferInput,
    AssetTransferOutput: AssetTransferOutput_1.AssetTransferOutput,
    AssetOutPoint: AssetOutPoint_1.AssetOutPoint,
    CreateWorldTransaction: CreateWorldTransaction_1.CreateWorldTransaction,
    SetWorldOwnersTransaction: SetWorldOwnersTransaction_1.SetWorldOwnersTransaction,
    SetWorldUsersTransaction: SetWorldUsersTransaction_1.SetWorldUsersTransaction,
    // Asset and AssetScheme
    Asset: Asset_1.Asset,
    AssetScheme: AssetScheme_1.AssetScheme,
    // Script
    Script: Script_1.Script,
    // Addresses
    PlatformAddress: codechain_primitives_1.PlatformAddress,
    AssetTransferAddress: codechain_primitives_1.AssetTransferAddress
};
exports.Core = Core;
function checkNetworkId(networkId) {
    if (typeof networkId !== "string" || networkId.length !== 2) {
        throw Error(`Expected networkId param to be a string of length 2 but found ${networkId}`);
    }
}
function checkNonce(nonce) {
    if (typeof nonce !== "number") {
        throw Error(`Expected nonce param to be a number but found ${nonce}`);
    }
}
function checkPlatformAddressRecipient(recipient) {
    if (!codechain_primitives_1.PlatformAddress.check(recipient)) {
        throw Error(`Expected recipient param to be a PlatformAddress but found ${recipient}`);
    }
}
function checkAssetTransferAddressRecipient(recipient) {
    if (!codechain_primitives_1.AssetTransferAddress.check(recipient)) {
        throw Error(`Expected recipient param to be a AssetTransferAddress but found ${recipient}`);
    }
}
function checkAmount(amount) {
    if (!U256_1.U256.check(amount)) {
        throw Error(`Expected amount param to be a U256 value but found ${amount}`);
    }
}
// FIXME: U64
function checkAmountU64(amount) {
    if (typeof amount !== "number" || !Number.isInteger(amount) || amount < 0) {
        throw Error(`Expected amount param to be a number but found ${amount}`);
    }
}
function checkKey(key) {
    if (!H512_1.H512.check(key)) {
        throw Error(`Expected key param to be an H512 value but found ${key}`);
    }
}
function checkShardId(shardId) {
    if (typeof shardId !== "number" ||
        !Number.isInteger(shardId) ||
        shardId < 0 ||
        shardId > 0xffff) {
        throw Error(`Expected shardId param to be a number but found ${shardId}`);
    }
}
function checkWorldId(worldId) {
    if (typeof worldId !== "number" ||
        !Number.isInteger(worldId) ||
        worldId < 0 ||
        worldId > 0xffff) {
        throw Error(`Expected worldId param to be a number but found ${worldId}`);
    }
}
function checkMetadata(metadata) {
    if (typeof metadata !== "string") {
        throw Error(`Expected metadata param to be a string but found ${metadata}`);
    }
}
function checkRegistrar(registrar) {
    if (registrar !== null && !codechain_primitives_1.PlatformAddress.check(registrar)) {
        throw Error(`Expected registrar param to be either null or a PlatformAddress value but found ${registrar}`);
    }
}
function checkTransactions(transactions) {
    if (!Array.isArray(transactions)) {
        throw Error(`Expected transactions param to be an array but found ${transactions}`);
    }
    // FIXME: check all transaction are valid
}
function checkOwners(owners) {
    if (!Array.isArray(owners)) {
        throw Error(`Expected owners param to be an array but found ${owners}`);
    }
    owners.forEach((owner, index) => {
        if (!codechain_primitives_1.PlatformAddress.check(owner)) {
            throw Error(`Expected an owner address to be a PlatformAddress value but found ${owner} at index ${index}`);
        }
    });
}
function checkUsers(users) {
    if (!Array.isArray(users)) {
        throw Error(`Expected users param to be an array but found ${users}`);
    }
    users.forEach((user, index) => {
        if (!codechain_primitives_1.PlatformAddress.check(user)) {
            throw Error(`Expected a user address to be a PlatformAddress value but found ${user} at index ${index}`);
        }
    });
}
function checkTransferBurns(burns) {
    if (!Array.isArray(burns)) {
        throw Error(`Expected burns param to be an array but found ${burns}`);
    }
    burns.forEach((burn, index) => {
        throw Error(`Expected an item of burns to be an AssetTransferInput but found ${burn} at index ${index}`);
    });
}
function checkTransferInputs(inputs) {
    if (!Array.isArray(inputs)) {
        throw Error(`Expected inputs param to be an array but found ${inputs}`);
    }
    inputs.forEach((input, index) => {
        throw Error(`Expected an item of inputs to be an AssetTransferInput but found ${input} at index ${index}`);
    });
}
function checkTransferOutputs(outputs) {
    if (!Array.isArray(outputs)) {
        throw Error(`Expected outputs param to be an array but found ${outputs}`);
    }
    outputs.forEach((output, index) => {
        throw Error(`Expected an item of outputs to be an AssetTransferOutput but found ${output} at index ${index}`);
    });
}
function checkTransactionHash(value) {
    if (!H256_1.H256.check(value)) {
        throw Error(`Expected transactionHash param to be an H256 value but found ${value}`);
    }
}
function checkIndex(index) {
    if (typeof index !== "number") {
        throw Error(`Expected index param to be a number but found ${index}`);
    }
}
function checkAssetType(value) {
    if (!H256_1.H256.check(value)) {
        throw Error(`Expected assetType param to be an H256 value but found ${value}`);
    }
}
function checkLockScriptHash(value) {
    if (!H160_1.H160.check(value)) {
        throw Error(`Expected lockScriptHash param to be an H160 value but found ${value}`);
    }
}
function checkParameters(parameters) {
    if (!Array.isArray(parameters)) {
        throw Error(`Expected parameters param to be an array but found ${parameters}`);
    }
    parameters.forEach((p, index) => {
        if (!(p instanceof Buffer)) {
            throw Error(`Expected an item of parameters to be a Buffer instance but found ${p} at index ${index}`);
        }
    });
}
function checkLockScript(lockScript) {
    if (!(lockScript instanceof Buffer)) {
        throw Error(`Expedted lockScript param to be an instance of Buffer but found ${lockScript}`);
    }
}
function checkUnlockScript(unlockScript) {
    if (!(unlockScript instanceof Buffer)) {
        throw Error(`Expected unlockScript param to be an instance of Buffer but found ${unlockScript}`);
    }
}
