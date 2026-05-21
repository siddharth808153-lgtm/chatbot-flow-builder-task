import { type Node, type NodeProps, Position, useReactFlow } from "@xyflow/react";
import { produce } from "immer";
import { memo, useCallback, useMemo } from "react";

import InteractiveNodePropertyPanel from "../../../sidebar/panels/node-properties/property-panels/interactive-node-property-panel";

import type { InteractiveNodeData } from "./types";

import CustomHandle from "~/modules/flow-builder/components/handles/custom-handle";
import { useDeleteNode } from "~/modules/flow-builder/hooks/use-delete-node";
import { BuilderNode, type RegisterNodeMetadata } from "~/modules/nodes/types";
import { getNodeDetail } from "~/modules/nodes/utils";

import { cn } from "~@/utils/cn";

const NODE_TYPE = BuilderNode.INTERACTIVE;

export type { InteractiveNodeData };

type InteractiveNodeProps = NodeProps<Node<InteractiveNodeData, typeof NODE_TYPE>>;

export function InteractiveNode({ id, isConnectable, selected, data }: InteractiveNodeProps) {
    const meta = useMemo(() => getNodeDetail(NODE_TYPE), []);
    const deleteNode = useDeleteNode();
    const { setNodes, setEdges } = useReactFlow();

    // Constant handle ID for CTA URL button next flow if desired
    const ctaSourceHandleId = "cta";

    const activeType = data.interactiveType || "button";

    const handleRemoveButton = useCallback(
        (btnId: string) => {
            setNodes(nodes => produce(nodes, (draft) => {
                const node = draft.find(n => n.id === id);
                if (node) {
                    const btns = node.data.buttons as InteractiveNodeData["buttons"];
                    const index = btns.findIndex(b => b.id === btnId);
                    if (index !== -1) btns.splice(index, 1);
                }
            }));
            setEdges(edges => edges.filter(edge => edge.sourceHandle !== btnId));
        },
        [id, setNodes, setEdges],
    );

    const handleRemoveListRow = useCallback(
        (rowId: string) => {
            setNodes(nodes => produce(nodes, (draft) => {
                const node = draft.find(n => n.id === id);
                if (node) {
                    const rows = node.data.listRows as InteractiveNodeData["listRows"];
                    const index = rows.findIndex(r => r.id === rowId);
                    if (index !== -1) rows.splice(index, 1);
                }
            }));
            setEdges(edges => edges.filter(edge => edge.sourceHandle !== rowId));
        },
        [id, setNodes, setEdges],
    );

    return (
        <div
            data-selected={selected}
            className="w-xs border border-dark-200 rounded-xl bg-dark-300/50 shadow-sm backdrop-blur-xl transition divide-y divide-dark-200 data-[selected=true]:(border-indigo-600 ring-1 ring-indigo-600/50)"
        >
            {/* Header */}
            <div className="relative overflow-clip rounded-t-xl bg-dark-300/50">
                <div className="absolute inset-0">
                    <div className="absolute h-full w-3/5 from-indigo-800/20 to-transparent bg-gradient-to-r" />
                </div>

                <div className="relative h-9 flex items-center justify-between gap-x-4 px-0.5 py-0.5">
                    <div className="flex grow items-center pl-0.5">
                        <div className="size-7 flex items-center justify-center">
                            <div className="size-6 flex items-center justify-center rounded-lg">
                                <div className={cn(meta.icon, "size-4 text-indigo-400")} />
                            </div>
                        </div>

                        <div className="ml-1 text-xs text-indigo-400 font-semibold leading-none tracking-wide uppercase op-80">
                            <span className="translate-y-px">
                                {meta.title}
                            </span>
                        </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-x-0.5 pr-0.5">
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

            {/* Content Body */}
            <div className="flex flex-col divide-y divide-dark-200">
                {/* Input handle (Target) */}
                <div className="relative min-h-12 flex flex-col p-4">
                    <div className="text-[10px] text-light-900/40 font-semibold tracking-wider uppercase">
                        Body Prompt Text
                    </div>
                    <div className="line-clamp-3 mt-1 text-xs text-light-50 font-medium leading-relaxed">
                        {data.bodyText || "Enter body prompts to guide users..."}
                    </div>

                    <CustomHandle
                        type="target"
                        position={Position.Left}
                        isConnectable={isConnectable}
                        className="top-6! hover:(important:ring-2 important:ring-indigo-500/50)"
                    />
                </div>

                {/* Guided Options (Buttons, List rows or CTA link) */}
                <div className="flex flex-col gap-2 p-4">
                    <div className="mb-1 text-[10px] text-light-900/40 font-semibold tracking-wider uppercase">
                        {activeType === "button" && "Reply Buttons"}
                        {activeType === "list" && `List Message (${data.listButtonText || "View Options"})`}
                        {activeType === "cta_url" && "Call-To-Action Button"}
                    </div>

                    {activeType === "button" && (
                        <div className="flex flex-col gap-2">
                            {data.buttons && data.buttons.length > 0
                                ? data.buttons.map(btn => (
                                    <div key={btn.id} className="relative h-8 flex items-center justify-between border border-dark-100 rounded-md bg-dark-400/30 px-3 pr-8">
                                        <span className="truncate text-xs text-light-900/80 font-medium">{btn.title}</span>
                                        <button
                                            type="button"
                                            className="absolute right-1 size-6 flex items-center justify-center rounded bg-transparent text-light-900/40 outline-none transition hover:(bg-dark-200/50 text-red-400)"
                                            onClick={() => handleRemoveButton(btn.id)}
                                        >
                                            <div className="i-mynaui:x size-3.5" />
                                        </button>
                                        <CustomHandle
                                            type="source"
                                            id={btn.id}
                                            position={Position.Right}
                                            isConnectable={isConnectable}
                                            className="top-4! hover:(important:ring-2 important:ring-indigo-500/50)"
                                        />
                                    </div>
                                ))
                                : (
                                        <div className="py-1 text-[11px] text-red-400/80 italic">
                                            No buttons configured. Add up to 3 buttons.
                                        </div>
                                    )}
                        </div>
                    )}

                    {activeType === "list" && (
                        <div className="flex flex-col gap-2">
                            {data.listRows && data.listRows.length > 0
                                ? data.listRows.map(row => (
                                    <div key={row.id} className="relative flex flex-col justify-center border border-dark-100 rounded-md bg-dark-400/30 px-3 py-1.5 pr-8">
                                        <span className="truncate text-xs text-light-900/90 font-semibold">{row.title}</span>
                                        {row.description && (
                                            <span className="truncate text-[10px] text-light-900/40">{row.description}</span>
                                        )}
                                        <button
                                            type="button"
                                            className="absolute right-1 top-2.5 size-6 flex items-center justify-center rounded bg-transparent text-light-900/40 outline-none transition hover:(bg-dark-200/50 text-red-400)"
                                            onClick={() => handleRemoveListRow(row.id)}
                                        >
                                            <div className="i-mynaui:x size-3.5" />
                                        </button>
                                        <CustomHandle
                                            type="source"
                                            id={row.id}
                                            position={Position.Right}
                                            isConnectable={isConnectable}
                                            className="top-6! hover:(important:ring-2 important:ring-indigo-500/50)"
                                        />
                                    </div>
                                ))
                                : (
                                        <div className="py-1 text-[11px] text-red-400/80 italic">
                                            No rows configured. Add up to 10 rows.
                                        </div>
                                    )}
                        </div>
                    )}

                    {activeType === "cta_url" && (
                        <div className="relative flex items-center justify-between border border-dark-100 rounded-md bg-dark-400/30 px-3 py-1.5">
                            <div className="flex flex-col gap-0.5 truncate">
                                <span className="truncate text-xs text-light-900/90 font-semibold">
                                    {data.ctaText || "Click Here"}
                                </span>
                                <span className="truncate text-[10px] text-indigo-400 underline">
                                    {data.ctaUrl || "https://..."}
                                </span>
                            </div>
                            <div className="i-mynaui:external-link ml-2 size-4 shrink-0 text-light-900/40" />
                            <CustomHandle
                                type="source"
                                id={ctaSourceHandleId}
                                position={Position.Right}
                                isConnectable={isConnectable}
                                className="top-5! hover:(important:ring-2 important:ring-indigo-500/50)"
                            />
                        </div>
                    )}
                </div>

                {/* Footer Info */}
                <div className="overflow-clip rounded-b-xl bg-dark-300/30 px-4 py-2 text-xs text-light-900/50">
                    Node:
                    {" "}
                    <span className="text-light-900/60 font-semibold">
                        #
                        {id}
                    </span>
                </div>
            </div>
        </div>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export const metadata: RegisterNodeMetadata<InteractiveNodeData> = {
    type: NODE_TYPE,
    node: memo(InteractiveNode),
    propertyPanel: InteractiveNodePropertyPanel,
    detail: {
        icon: "i-mynaui:chat-dots",
        title: "Interactive Menu",
        description: "Guide users with interactive reply buttons, menus, or external CTA links.",
    },
    defaultData: {
        interactiveType: "button",
        bodyText: "",
        buttons: [],
        listButtonText: "View Options",
        listRows: [],
        ctaText: "Open Page",
        ctaUrl: "",
    },
};
