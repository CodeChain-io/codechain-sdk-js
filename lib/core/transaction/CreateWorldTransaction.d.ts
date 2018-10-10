/// <reference types="node" />
import { PlatformAddress } from "codechain-primitives";
import { H256 } from "../H256";
import { NetworkId } from "../types";
export interface CreateWorldData {
    networkId: NetworkId;
    shardId: number;
    nonce: number;
    owners: PlatformAddress[];
}
/**
 * Creates a world
 *
 * - Transaction hash can be changed by changing nonce.
 * - If an identical transaction hash already exists, then the change fails. In this situation, a transaction can be created again by arbitrarily changing the nonce.
 */
export declare class CreateWorldTransaction {
    static fromJSON(obj: any): CreateWorldTransaction;
    readonly networkId: NetworkId;
    readonly shardId: number;
    readonly nonce: number;
    readonly owners: PlatformAddress[];
    readonly type = "createWorld";
    constructor(data: CreateWorldData);
    toJSON(): {
        type: string;
        data: {
            networkId: string;
            shardId: number;
            nonce: number;
            owners: PlatformAddress[];
        };
    };
    toEncodeObject(): (string | number | string[])[];
    rlpBytes(): Buffer;
    hash(): H256;
}
