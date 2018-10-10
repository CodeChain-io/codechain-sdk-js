/// <reference types="node" />
import { PlatformAddress } from "codechain-primitives";
import { H256 } from "../H256";
import { NetworkId } from "../types";
export interface SetWorldUsersData {
    networkId: NetworkId;
    shardId: number;
    worldId: number;
    nonce: number;
    users: PlatformAddress[];
}
/**
 * Change the users of the world
 */
export declare class SetWorldUsersTransaction {
    static fromJSON(obj: any): SetWorldUsersTransaction;
    readonly networkId: NetworkId;
    readonly shardId: number;
    readonly worldId: number;
    readonly nonce: number;
    readonly users: PlatformAddress[];
    readonly type = "setWorldUsers";
    constructor(data: SetWorldUsersData);
    toJSON(): {
        type: string;
        data: {
            networkId: string;
            shardId: number;
            worldId: number;
            nonce: number;
            users: PlatformAddress[];
        };
    };
    toEncodeObject(): (string | number | PlatformAddress[])[];
    rlpBytes(): Buffer;
    hash(): H256;
}
