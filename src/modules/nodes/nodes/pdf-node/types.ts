import type { BaseNodeData } from "~/modules/nodes/types";

export interface PdfNodeData extends BaseNodeData {
    pdfUrl: string;
    pdfName?: string;
    caption: string;
}
