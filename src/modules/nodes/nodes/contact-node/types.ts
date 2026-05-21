import type { BaseNodeData } from "~/modules/nodes/types";

export interface ContactNodeData extends BaseNodeData {
    formattedName: string;
    firstName: string;
    lastName: string;
    phone: string;
    waId: string;
    company?: string;
    title?: string;
    email?: string;
    url?: string;
}
