import type { BaseNodeData } from "~/modules/nodes/types";

export interface LocationNodeData extends BaseNodeData {
    latitude: string;
    longitude: string;
    name: string;
    address: string;
}
