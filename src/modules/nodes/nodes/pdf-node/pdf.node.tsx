import { type Node, type NodeProps, Position, useReactFlow } from "@xyflow/react";
import { produce } from "immer";
import { nanoid } from "nanoid";
import { isEmpty } from "radash";
import { memo, useCallback, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import type { PdfNodeData } from "~/modules/nodes/nodes/pdf-node/types";

import CustomHandle from "~/modules/flow-builder/components/handles/custom-handle";
import { useDeleteNode } from "~/modules/flow-builder/hooks/use-delete-node";
import { BuilderNode, type RegisterNodeMetadata } from "~/modules/nodes/types";
import { getNodeDetail } from "~/modules/nodes/utils";
import PdfNodePropertyPanel from "~/modules/sidebar/panels/node-properties/property-panels/pdf-node-property-panel";
import { useApplicationState } from "~/stores/application-state";

import { cn } from "~@/utils/cn";

const NODE_TYPE = BuilderNode.PDF;

export type { PdfNodeData };

type PdfNodeProps = NodeProps<Node<PdfNodeData, typeof NODE_TYPE>>;

export function PdfNode({ id, isConnectable, selected, data }: PdfNodeProps) {
    const meta = useMemo(() => getNodeDetail(NODE_TYPE), []);

    const [showNodePropertiesOf] = useApplicationState(s => [s.actions.sidebar.showNodePropertiesOf]);
    const [sourceHandleId] = useState<string>(nanoid());
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { setNodes } = useReactFlow();
    const deleteNode = useDeleteNode();

    const onPdfUpload = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
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
                setNodes(nodes => produce(nodes, (draft) => {
                    const node = draft.find(node => node.id === id);
                    if (node) {
                        node.data.pdfUrl = dataUrl;
                        node.data.pdfName = file.name;
                    }
                }));
            };
            reader.readAsDataURL(file);
        },
        [id, setNodes],
    );

    const showNodeProperties = useCallback(() => {
        showNodePropertiesOf({ id, type: NODE_TYPE });
    }, [id, showNodePropertiesOf]);

    return (
        <>
            <div
                data-selected={selected}
                className="w-xs overflow-clip border border-dark-200 rounded-xl bg-dark-300/50 shadow-sm backdrop-blur-xl transition divide-y divide-dark-200 data-[selected=true]:(border-amber-600 ring-1 ring-amber-600/50)"
                onDoubleClick={showNodeProperties}
            >
                <div className="relative bg-dark-300/50">
                    <div className="absolute inset-0">
                        <div className="absolute h-full w-3/5 from-red-900/20 to-transparent bg-gradient-to-r" />
                    </div>

                    <div className="relative h-9 flex items-center justify-between gap-x-4 px-0.5 py-0.5">
                        <div className="flex grow items-center pl-0.5">
                            <div className="size-7 flex items-center justify-center">
                                <div className="size-6 flex items-center justify-center rounded-lg">
                                    <div className={cn(meta?.icon || "i-mynaui:file", "size-4 text-red-500")} />
                                </div>
                            </div>

                            <div className="ml-1 text-xs font-medium leading-none tracking-wide uppercase op-80">
                                <span className="translate-y-px">
                                    {meta?.title || "PDF"}
                                </span>
                            </div>
                        </div>

                        <div className="flex shrink-0 items-center gap-x-0.5 pr-0.5">
                            <button
                                type="button"
                                className="size-7 flex items-center justify-center border border-transparent rounded-lg bg-transparent outline-none transition active:(border-dark-200 bg-dark-400/50) hover:(bg-dark-100)"
                                onClick={() => showNodeProperties()}
                            >
                                <div className="i-mynaui:cog size-4" />
                            </button>

                            <button
                                type="button"
                                className="size-7 flex items-center justify-center border border-transparent rounded-lg bg-transparent text-red-400 outline-none transition active:(border-dark-200 bg-dark-400/50) hover:(bg-dark-100)"
                                onClick={() => deleteNode(id)}
                            >
                                <div className="i-mynaui:trash size-4" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col divide-y divide-dark-200">
                    <div className="flex flex-col p-4">
                        <div className="text-xs text-light-900/50 font-medium">
                            PDF Document
                        </div>

                        <div className="mt-2">
                            {isEmpty(data.pdfUrl)
                                ? (
                                        <button
                                            type="button"
                                            className="w-full flex flex-col cursor-pointer items-center justify-center border border-dark-100 rounded-lg border-dashed bg-dark-400/30 p-6 transition hover:(border-amber-600/50 bg-dark-400/50)"
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            <div className="i-mynaui:file size-8 text-light-900/30" />
                                            <span className="mt-2 text-xs text-light-900/50 italic">
                                                Click to upload a PDF
                                            </span>
                                        </button>
                                    )
                                : (
                                        <div className="relative overflow-clip rounded-lg border border-dark-200 bg-dark-400 p-3 flex items-center gap-3">
                                            <div className="i-mynaui:file size-8 text-red-500 shrink-0" />
                                            <div className="flex flex-col min-w-0 flex-1">
                                                <span className="text-sm font-medium truncate text-light-900">{data.pdfName || "Document.pdf"}</span>
                                            </div>
                                            <button
                                                type="button"
                                                className="shrink-0 size-6 flex items-center justify-center rounded-md bg-dark-300 text-light-900/70 transition hover:(bg-dark-200 text-light-900)"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    fileInputRef.current?.click();
                                                }}
                                            >
                                                <div className="i-mynaui:edit size-3.5" />
                                            </button>
                                        </div>
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

                    {!isEmpty(data.caption) && (
                        <div className="px-4 py-2">
                            <div className="text-xs text-light-900/50">
                                <b className="text-light-900/60 font-semibold">Caption:</b>
                                {" "}
                                {data.caption}
                            </div>
                        </div>
                    )}

                    <div className="bg-dark-300/30 px-4 py-2 text-xs text-light-900/50">
                        Node:
                        {" "}
                        <span className="text-light-900/60 font-semibold">
                            #
                            {id}
                        </span>
                    </div>
                </div>
            </div>

            <CustomHandle
                type="target"
                id={sourceHandleId}
                position={Position.Left}
                isConnectable={isConnectable}
            />

            <CustomHandle
                type="source"
                id={sourceHandleId}
                position={Position.Right}
                isConnectable={isConnectable}
            />
        </>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export const metadata: RegisterNodeMetadata<PdfNodeData> = {
    type: NODE_TYPE,
    node: memo(PdfNode),
    detail: {
        icon: "i-mynaui:file",
        title: "PDF",
        description: "Send a PDF document to the user.",
    },
    defaultData: {
        pdfUrl: "",
        pdfName: "",
        caption: "",
    },
    propertyPanel: PdfNodePropertyPanel,
};
