import type { BaseNodeData } from "~/modules/nodes/types";

export interface ImageNodeData extends BaseNodeData {
    imageUrl: string;
    altText: string;
    caption: string;
}
