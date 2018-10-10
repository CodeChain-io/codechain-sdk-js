import { AssetTransactionGroup } from "./AssetTransactionGroup";
import { CreateShard } from "./CreateShard";
import { Payment } from "./Payment";
import { SetRegularKey } from "./SetReulgarKey";
import { SetShardOwners } from "./SetShardOwners";
import { SetShardUsers } from "./SetShardUsers";
export declare type Action = AssetTransactionGroup | Payment | SetRegularKey | CreateShard | SetShardOwners | SetShardUsers;
export declare function getActionFromJSON(json: any): Action;
