import type { BaseNodeData } from "~/modules/nodes/types";

export interface InteractiveNodeData extends BaseNodeData {
    interactiveType: "button" | "list" | "cta_url";
    bodyText: string;
    // Reply Buttons (max 3 buttons)
    buttons: { id: string; title: string }[];
    // List Message (max 10 rows)
    listButtonText: string;
    listRows: { id: string; title: string; description?: string }[];
    // CTA Link Button
    ctaText: string;
    ctaUrl: string;
}
