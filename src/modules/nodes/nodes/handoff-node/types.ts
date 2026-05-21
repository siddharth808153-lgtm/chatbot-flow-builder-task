import type { BaseNodeData } from "~/modules/nodes/types";

export interface HandoffNodeData extends BaseNodeData {
    destination: "freshdesk" | "zoho" | "intercom" | "zendesk" | "custom_webhook";
    message: string;
}
