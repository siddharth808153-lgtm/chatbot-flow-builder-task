import type { BaseNodeData } from "~/modules/nodes/types";

export interface ConditionalPathNodeData extends BaseNodeData {
    condition: {
        id: string;
        condition: string;
    } | null;
    paths: { id: string; case: { id: string; value: string } }[];
}
