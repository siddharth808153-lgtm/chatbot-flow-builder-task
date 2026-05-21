import type { BaseNodeData } from "~/modules/nodes/types";

export interface VideoNodeData extends BaseNodeData {
    videoUrl: string;
    caption: string;
    autoplay: boolean;
}
