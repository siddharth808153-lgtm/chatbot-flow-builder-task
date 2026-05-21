import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { type Node, type NodeProps, Position, useReactFlow } from "@xyflow/react";
import { produce } from "immer";
import { nanoid } from "nanoid";
import { memo, useCallback, useMemo, useState } from "react";

import type { ConditionalPathNodeData } from "./types";

import CustomHandle from "~/modules/flow-builder/components/handles/custom-handle";
import { useDeleteNode } from "~/modules/flow-builder/hooks/use-delete-node";
import { ConditionDropdownSelector } from "~/modules/nodes/nodes/conditional-path-node/components/condition-dropdown-selector";
import { NodePath } from "~/modules/nodes/nodes/conditional-path-node/components/node-path";
import { BuilderNode, type RegisterNodeMetadata } from "~/modules/nodes/types";
import { getNodeDetail } from "~/modules/nodes/utils";
import ConditionalPathPropertyPanel from "~/modules/sidebar/panels/node-properties/property-panels/conditional-path-property-panel";

import { cn } from "~@/utils/cn";

const conditionCases: Record<string, { id: string; value: string }[]> = {
    msg_type: [
        { id: "type_text", value: "Text Message" },
        { id: "type_image", value: "Image Attachment" },
        { id: "type_video", value: "Video Attachment" },
        { id: "type_document", value: "Document Attachment" },
        { id: "type_location", value: "Location Share" },
        { id: "type_contact", value: "Contact Card" },
    ],
    btn_click: [
        { id: "btn_yes", value: "Button 'Yes' Clicked" },
        { id: "btn_no", value: "Button 'No' Clicked" },
        { id: "btn_option_a", value: "Quick Reply: Option A" },
        { id: "btn_option_b", value: "Quick Reply: Option B" },
    ],
    keyword: [
        { id: "kw_help", value: "Contains 'help' or 'support'" },
        { id: "kw_start", value: "Matches 'start' or 'menu'" },
        { id: "kw_pricing", value: "Contains 'price' or 'pricing'" },
        { id: "kw_agent", value: "Matches 'agent' or 'talk to human'" },
    ],
    opt_in: [
        { id: "opt_subscribed", value: "Opt-in / Subscribed" },
        { id: "opt_unsubscribed", value: "Opt-out / Unsubscribed" },
    ],
    order_status: [
        { id: "status_paid", value: "Payment: Paid" },
        { id: "status_pending", value: "Payment: Pending" },
        { id: "status_failed", value: "Payment: Failed" },
        { id: "status_refunded", value: "Payment: Refunded" },
    ],
};

const NODE_TYPE = BuilderNode.CONDITIONAL_PATH;

export type { ConditionalPathNodeData };

type ConditionalPathNodeProps = NodeProps<Node<ConditionalPathNodeData, typeof NODE_TYPE>>;

export function ConditionalPathNode({ id, isConnectable, selected, data }: ConditionalPathNodeProps) {
    const meta = useMemo(() => getNodeDetail(NODE_TYPE), []);

    const [sourceHandleId] = useState<string>(nanoid());

    const { setNodes, setEdges } = useReactFlow();
    const deleteNode = useDeleteNode();

    const currentConditionId = data.condition?.id || "";

    const activeCaseList = useMemo(() => {
        if (!currentConditionId) return [];
        return conditionCases[currentConditionId] || [];
    }, [currentConditionId]);

    const onConditionChange = useCallback(
        (value: { id: string; condition: string } | null) => {
            setNodes(nodes => produce(nodes, (draft) => {
                const node = draft.find(n => n.id === id);

                if (node) {
                    node.data.condition = value;
                    node.data.paths = [];
                }
            }));
            setEdges(edges => edges.filter(edge => edge.source !== id));
        },
        [id, setNodes, setEdges],
    );

    const filteredCaseList = useMemo(() => {
        return activeCaseList.filter(c => !data.paths.some(p => p.case.value === c.value));
    }, [activeCaseList, data.paths]);

    const addNodePath = useCallback(
        (path: { id: string; value: string }) => {
            setNodes(nodes => produce(nodes, (draft) => {
                const node = draft.find(n => n.id === id);

                if (node) {
                    (node.data.paths as ConditionalPathNodeData["paths"]).push({
                        id: nanoid(),
                        case: path,
                    });
                }
            }));
        },
        [id, setNodes],
    );

    const removeNodePath = useCallback(
        (pathId: string) => {
            setNodes(nodes => produce(nodes, (draft) => {
                const node = draft.find(n => n.id === id);

                if (node) {
                    const paths = node.data.paths as ConditionalPathNodeData["paths"];
                    const pathIndex = paths.findIndex(p => p.id === pathId);
                    paths.splice(pathIndex, 1);
                }
            }));

            setEdges(edges => edges.filter(edge => edge.sourceHandle !== pathId));
        },
        [id, setEdges, setNodes],
    );

    return (
        <div
            data-selected={selected}
            className="w-xs border border-dark-200 rounded-xl bg-dark-300/50 shadow-sm backdrop-blur-xl transition divide-y divide-dark-200 data-[selected=true]:(border-purple-600 ring-1 ring-purple-600/50)"
        >
            <div className="relative overflow-clip rounded-t-xl bg-dark-300/50">
                <div className="absolute inset-0">
                    <div className="absolute h-full w-3/5 from-purple-800/20 to-transparent bg-gradient-to-r" />
                </div>

                <div className="relative h-9 flex items-center justify-between gap-x-4 px-0.5 py-0.5">
                    <div className="flex grow items-center pl-0.5">
                        <div className="size-7 flex items-center justify-center">
                            <div className="size-6 flex items-center justify-center rounded-lg">
                                <div className={cn(meta.icon, "size-4")} />
                            </div>
                        </div>

                        <div className="ml-1 text-xs font-medium leading-none tracking-wide uppercase op-80">
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

            <div className="flex flex-col divide-y divide-dark-200">
                <div className="relative min-h-10 flex flex-col">
                    <div className="flex flex-col p-4">
                        <div className="text-xs text-light-900/50 font-medium">
                            Condition Attribute
                        </div>

                        <div className="mt-2 flex">
                            <ConditionDropdownSelector value={data.condition} onChange={onConditionChange} />
                        </div>
                    </div>

                    <CustomHandle
                        type="target"
                        id={sourceHandleId}
                        position={Position.Left}
                        isConnectable={isConnectable}
                        className="top-6! hover:(important:ring-2 important:ring-purple-500/50)"
                    />
                </div>

                <div className="flex flex-col p-4">
                    <div className="text-xs text-light-900/50 font-medium">
                        Paths to Follow
                    </div>

                    {data.paths.length > 0 && (
                        <div className="mt-2 flex flex-col">
                            {data.paths.map(path => (
                                <NodePath
                                    key={path.id}
                                    id={path.id}
                                    path={path.case}
                                    onRemove={_id => removeNodePath(_id)}
                                    isConnectable={isConnectable}
                                />
                            ))}
                        </div>
                    )}

                    {filteredCaseList.length > 0 && (
                        <div className="mt-2 flex">
                            <DropdownMenu.Root>
                                <DropdownMenu.Trigger asChild>
                                    <button type="button" className="h-8 w-full flex items-center justify-center border border-dark-50 rounded-md bg-dark-300 px-2.5 outline-none transition active:(border-dark-200 bg-dark-400/50)">
                                        <div className="flex items-center">
                                            <div className="text-xs font-medium leading-none tracking-wide">
                                                Add Path
                                            </div>
                                        </div>

                                        <div className="i-lucide:plus ml-1 size-4.5 text-white op-50" />
                                    </button>
                                </DropdownMenu.Trigger>

                                <DropdownMenu.Portal>
                                    <DropdownMenu.Content
                                        sideOffset={5}
                                        className={cn(
                                            "min-w-40 select-none border border-dark-100 rounded-lg bg-dark-200/90 p-0.5 text-light-50 shadow-xl backdrop-blur-lg transition",
                                            "animate-in data-[side=top]:slide-in-bottom-0.5 data-[side=bottom]:slide-in-bottom--0.5 data-[side=bottom]:fade-in-40 data-[side=top]:fade-in-40",
                                        )}
                                    >
                                        {filteredCaseList.map(path => (
                                            <DropdownMenu.Item
                                                key={path.id}
                                                className="h-8 flex cursor-pointer items-center border border-transparent rounded-lg p-1.5 pr-6 outline-none transition active:(border-dark-100 bg-dark-300) hover:bg-dark-100"
                                                onSelect={() => addNodePath({ id: path.id, value: path.value })}
                                            >
                                                <div className="flex items-center gap-x-2">
                                                    <div className="text-xs font-medium leading-none tracking-wide">
                                                        {path.value}
                                                    </div>
                                                </div>
                                            </DropdownMenu.Item>
                                        ))}
                                    </DropdownMenu.Content>
                                </DropdownMenu.Portal>
                            </DropdownMenu.Root>
                        </div>
                    )}
                </div>

                <div className="px-4 py-2">
                    <div className="text-[10px] text-purple-400/80 leading-snug italic">
                        {data.condition
                            ? `Routes flow dynamically based on: ${data.condition.condition}.`
                            : "Select a condition to configure message routing rules."}
                    </div>
                </div>

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
export const metadata: RegisterNodeMetadata<ConditionalPathNodeData> = {
    type: NODE_TYPE,
    node: memo(ConditionalPathNode),
    propertyPanel: ConditionalPathPropertyPanel,
    detail: {
        icon: "i-mynaui:git-branch",
        title: "Conditional Path",
        description: "Check a condition and take different paths based on the result.",
    },
    defaultData: {
        condition: null,
        paths: [],
    },
};
