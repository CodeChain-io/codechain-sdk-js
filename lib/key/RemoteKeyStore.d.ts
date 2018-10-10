import { KeyManagementAPI, KeyStore } from "./KeyStore";
export declare class RemoteKeyStore implements KeyStore {
    static create(keystoreURL: string): Promise<KeyStore>;
    static createUnsafe(keystoreURL: string): KeyStore;
    platform: KeyManagementAPI;
    asset: KeyManagementAPI;
    keystoreURL: string;
    mapping: {
        get: (params: {
            key: string;
        }) => Promise<string>;
    };
    private constructor();
    ping(): Promise<void>;
}
