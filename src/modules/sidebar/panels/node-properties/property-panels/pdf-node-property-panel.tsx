import { useMemo, useRef } from "react";
import { toast } from "sonner";

import type { PdfNodeData } from "~/modules/nodes/nodes/pdf-node/types";
import type { BuilderNodeType } from "~/modules/nodes/types";

import { cn } from "~@/utils/cn";

type PdfNodePropertyPanelProps = Readonly<{
    id: string;
    type: BuilderNodeType;
    data: PdfNodeData;
    updateData: (data: Partial<PdfNodeData>) => void;
}>;

export default function PdfNodePropertyPanel({ id, data, updateData }: PdfNodePropertyPanelProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const hasPdf = useMemo(() => {
        return data.pdfUrl && data.pdfUrl.length > 0;
    }, [data.pdfUrl]);

    const onPdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Meta guideline: PDF document size limit is 100MB
        if (file.size > 100 * 1024 * 1024) {
            toast.error("PDF file size exceeds the Meta guideline limit of 100 MB.");
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            const dataUrl = event.target?.result as string;
            updateData({ pdfUrl: dataUrl, pdfName: file.name });
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="flex flex-col gap-4.5 p-4">
            <div className="flex flex-col">
                <div className="text-xs text-light-900/60 font-semibold">
                    Unique Identifier
                </div>

                <div className="mt-2 flex">
                    <input type="text" value={id} readOnly className="h-8 w-full border border-dark-200 rounded-md bg-dark-400 px-2.5 text-sm font-medium shadow-sm outline-none transition hover:(bg-dark-300/60) read-only:(text-light-900/80 op-80 hover:bg-dark-300/30)" />
                </div>
            </div>

            <div className="flex flex-col">
                <div className="text-xs text-light-900/60 font-semibold">
                    PDF Document
                </div>

                <div className="mt-2 flex flex-col gap-2">
                    {hasPdf
                        ? (
                                <div className="relative overflow-clip border border-dark-200 rounded-md bg-dark-400 p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="i-mynaui:file size-8 text-red-500" />
                                        <div className="flex flex-col flex-1 min-w-0">
                                            <span className="text-sm font-medium text-light-900 truncate">{data.pdfName || "Document.pdf"}</span>
                                            <span className="text-xs text-light-900/50">PDF Document</span>
                                        </div>
                                    </div>
                                    <div className="mt-4 flex gap-2">
                                        <button
                                            type="button"
                                            className="h-7 flex-1 flex items-center justify-center gap-1.5 border border-dark-100 rounded-md bg-dark-300/90 px-2.5 text-xs font-medium shadow-sm outline-none backdrop-blur-sm transition active:(bg-dark-400) hover:(bg-dark-200)"
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            <div className="i-mynaui:edit size-3.5" />
                                            Replace
                                        </button>
                                        <button
                                            type="button"
                                            className="h-7 flex-1 flex items-center justify-center gap-1.5 border border-dark-100 rounded-md bg-dark-300/90 px-2.5 text-xs text-red-400 font-medium shadow-sm outline-none backdrop-blur-sm transition active:(bg-dark-400) hover:(bg-dark-200)"
                                            onClick={() => updateData({ pdfUrl: "", pdfName: "" })}
                                        >
                                            <div className="i-mynaui:trash size-3.5" />
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            )
                        : (
                                <button
                                    type="button"
                                    className={cn(
                                        "w-full flex flex-col items-center justify-center border border-dashed border-dark-100 rounded-md bg-dark-400/30 p-8 transition cursor-pointer",
                                        "hover:(border-amber-600/50 bg-dark-400/50)",
                                    )}
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <div className="i-mynaui:file size-10 text-light-900/20" />
                                    <span className="mt-3 text-xs text-light-900/50">
                                        Click to upload a PDF
                                    </span>
                                    <span className="mt-1 text-[10px] text-light-900/30">
                                        PDF only
                                    </span>
                                </button>
                            )}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="application/pdf"
                        className="hidden"
                        onChange={onPdfUpload}
                    />
                </div>
            </div>

            <div className="flex flex-col">
                <div className="text-xs text-light-900/60 font-semibold">
                    PDF URL
                </div>

                <div className="mt-2 flex">
                    <input
                        type="text"
                        value={data.pdfUrl}
                        onChange={e => updateData({ pdfUrl: e.target.value })}
                        placeholder="https://example.com/document.pdf"
                        className="h-8 w-full border border-dark-200 rounded-md bg-dark-400 px-2.5 text-sm font-medium shadow-sm outline-none transition focus:(border-amber-800 bg-dark-500 ring-2 ring-amber-800/50) hover:(bg-dark-300/60) placeholder:(text-light-900/50 font-normal italic)"
                    />
                </div>
            </div>

            <div className="flex flex-col">
                <div className="text-xs text-light-900/60 font-semibold">
                    Caption
                </div>

                <div className="mt-2 flex">
                    <textarea
                        value={data.caption}
                        onChange={e => updateData({ caption: e.target.value })}
                        placeholder="Optional caption for the PDF..."
                        className="min-h-20 w-full resize-none border border-dark-200 rounded-md bg-dark-400 px-2.5 py-2 text-sm font-medium shadow-sm outline-none transition focus:(border-amber-800 bg-dark-500 ring-2 ring-amber-800/50) hover:(bg-dark-300/60) placeholder:(text-light-900/50 font-normal italic read-only:text-light-900/80)"
                    />
                </div>
            </div>
        </div>
    );
}
