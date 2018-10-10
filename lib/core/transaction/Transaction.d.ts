import { AssetMintTransaction } from "./AssetMintTransaction";
import { AssetTransferTransaction } from "./AssetTransferTransaction";
import { CreateWorldTransaction } from "./CreateWorldTransaction";
import { SetWorldOwnersTransaction } from "./SetWorldOwnersTransaction";
import { SetWorldUsersTransaction } from "./SetWorldUsersTransaction";
export declare type Transaction = CreateWorldTransaction | SetWorldOwnersTransaction | SetWorldUsersTransaction | AssetMintTransaction | AssetTransferTransaction;
/**
 * Create a transaction from either an AssetMintTransaction JSON object or an
 * AssetTransferTransaction JSON object.
 * @param params Either an AssetMintTransaction JSON object or an AssetTransferTransaction JSON object.
 * @returns A Transaction.
 */
export declare const getTransactionFromJSON: (params: {
    type: string;
    data: object;
}) => AssetTransferTransaction | AssetMintTransaction | CreateWorldTransaction | SetWorldOwnersTransaction | SetWorldUsersTransaction;
