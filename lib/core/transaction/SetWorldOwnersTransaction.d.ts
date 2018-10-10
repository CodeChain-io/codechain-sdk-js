/// <reference types="node" />
import { PlatformAddress } from "codechain-primitives";
import { H256 } from "../H256";
import { NetworkId } from "../types";
export interface SetWorldOwnersData {
    networkId: NetworkId;
    shardId: number;
    worldId: number;
    nonce: number;
    owners: PlatformAddress[];
}
/**
 * Change the owners of the world
 */
export declare class SetWorldOwnersTransaction {
    static fromJSON(obj: any): SetWorldOwnersTransaction;
    readonly networkId: NetworkId;
    readonly shardId: number;
    readonly worldId: number;
    readonly nonce: number;
    readonly owners: PlatformAddress[];
    readonly type = "setWorldOwners";
    constructor(data: SetWorldOwnersData);
    toJSON(): {
        type: string;
        data: {
            networkId: string;
            shardId: number;
            worldId: number;
            nonce: number;
            owners: PlatformAddress[];
        };
    };
    toEncodeObject(): (string | number | PlatformAddress[])[];
    rlpBytes(): Buffer;
    hash(): H256;
}
