"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const buffer_1 = require("buffer");
const AssetOutPoint_1 = require("./AssetOutPoint");
/**
 * An AssetTransferInput consists of the following:
 *  - An AssetOutPoint, which points to the asset to be spent.
 *  - A lock script and an unlock script, that prove ownership of the asset
 *  - The hashed value(blake160) of a lock script must be identical to that of the pointed asset's lock script hash.
 *  - The results of running the script must return successful in order for the Asset's input to be valid.
 */
class AssetTransferInput {
    /**
     * Create an AssetTransferInput from an AssetTransferInput JSON object.
     * @param data An AssetTransferInput JSON object.
     * @returns An AssetTransferInput.
     */
    static fromJSON(data) {
        const { prevOut, lockScript, unlockScript } = data;
        return new this({
            prevOut: AssetOutPoint_1.AssetOutPoint.fromJSON(prevOut),
            lockScript,
            unlockScript
        });
    }
    /**
     * @param data.prevOut An AssetOutPoint of the input.
     * @param data.lockScript A lock script of the input.
     * @param data.unlockScript A unlock script of the input.
     */
    constructor(data) {
        const { prevOut, lockScript = buffer_1.Buffer.from([]), unlockScript = buffer_1.Buffer.from([]) } = data;
        this.prevOut = prevOut;
        this.lockScript = buffer_1.Buffer.from(lockScript);
        this.unlockScript = buffer_1.Buffer.from(unlockScript);
    }
    /**
     * Convert to an object for RLP encoding.
     */
    toEncodeObject() {
        const { prevOut, lockScript, unlockScript } = this;
        return [prevOut.toEncodeObject(), lockScript, unlockScript];
    }
    /**
     * Convert to an AssetTransferInput JSON object.
     * @returns An AssetTransferInput JSON object.
     */
    toJSON() {
        const { prevOut, lockScript, unlockScript } = this;
        return {
            prevOut: prevOut.toJSON(),
            lockScript: [...lockScript],
            unlockScript: [...unlockScript]
        };
    }
    /**
     * Clone a new AssetTransferInput that has empty lock script and empty
     * unlock script. The cloned object is used to sign a transaction.
     * @returns An AssetTransferInput.
     */
    withoutScript() {
        const { prevOut } = this;
        return new AssetTransferInput({
            prevOut,
            lockScript: buffer_1.Buffer.from([]),
            unlockScript: buffer_1.Buffer.from([])
        });
    }
    /**
     * Set a lock script.
     * @param lockScript A lock script.
     */
    setLockScript(lockScript) {
        this.lockScript = lockScript;
    }
    /**
     * Set a unlock script.
     * @param unlockScript A unlock script.
     */
    setUnlockScript(unlockScript) {
        this.unlockScript = unlockScript;
    }
}
exports.AssetTransferInput = AssetTransferInput;
