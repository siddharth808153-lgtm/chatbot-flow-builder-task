import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useReactFlow } from "@xyflow/react";
import { nanoid } from "nanoid";
import { useMemo } from "react";

import type { ConditionalPathNodeData } from "~/modules/nodes/nodes/conditional-path-node/types";
import type { BuilderNodeType } from "~/modules/nodes/types";

import { ConditionDropdownSelector } from "~/modules/nodes/nodes/conditional-path-node/components/condition-dropdown-selector";

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

type ConditionalPathNodePropertyPanelProps = Readonly<{
    id: string;
    type: BuilderNodeType;
    data: ConditionalPathNodeData;
    updateData: (data: Partial<ConditionalPathNodeData>) => void;
}>;

export default function ConditionalPathNodePropertyPanel({ id, data, updateData }: ConditionalPathNodePropertyPanelProps) {
    const { setEdges } = useReactFlow();

    const currentConditionId = data.condition?.id || "";

    const activeCaseList = useMemo(() => {
        if (!currentConditionId) return [];
        return conditionCases[currentConditionId] || [];
    }, [currentConditionId]);

    const filteredCaseList = useMemo(() => {
        return activeCaseList.filter(c => !data.paths.some(p => p.case.value === c.value));
    }, [activeCaseList, data.paths]);

    const handleConditionChange = (value: { id: string; condition: string } | null) => {
        updateData({
            condition: value,
            paths: [],
        });
        // Clear all outgoing edges from this node as the paths are reset
        setEdges(edges => edges.filter(edge => edge.source !== id));
    };

    const handleRemovePath = (pathId: string) => {
        const remainingPaths = data.paths.filter(p => p.id !== pathId);
        updateData({
            paths: remainingPaths,
        });
        // Clear the edge connected to this path handle
        setEdges(edges => edges.filter(edge => edge.sourceHandle !== pathId));
    };

    const handleAddPath = (pathCase: { id: string; value: string }) => {
        const newPaths = [
            ...(data.paths || []),
            {
                id: nanoid(),
                case: pathCase,
            },
        ];
        updateData({
            paths: newPaths,
        });
    };

    return (
        <div className="flex flex-col gap-4.5 p-4">
            {/* Unique Identifier */}
            <div className="flex flex-col">
                <div className="text-xs text-light-900/60 font-semibold">
                    Unique Identifier
                </div>

                <div className="mt-2 flex">
                    <input
                        type="text"
                        value={id}
                        readOnly
                        className="h-8 w-full border border-dark-200 rounded-md bg-dark-400 px-2.5 text-sm font-medium shadow-sm outline-none transition hover:(bg-dark-300/60) read-only:(text-light-900/80 op-80 hover:bg-dark-300/30)"
                    />
                </div>
            </div>

            {/* Condition Attribute Selector */}
            <div className="flex flex-col">
                <div className="text-xs text-light-900/60 font-semibold">
                    Condition Attribute
                </div>

                <div className="mt-2 flex">
                    <ConditionDropdownSelector value={data.condition} onChange={handleConditionChange} />
                </div>

                <div className="mt-1.5 text-[10px] text-light-900/40 leading-snug">
                    Select a WhatsApp chatbot trigger (e.g., matching text, button payloads, or purchase events) to fork the user conversation.
                </div>
            </div>

            {/* Configured Paths / Branches */}
            <div className="flex flex-col">
                <div className="text-xs text-light-900/60 font-semibold">
                    Paths to Follow
                </div>

                {data.paths.length > 0
                    ? (
                            <div className="mt-2 flex flex-col gap-2">
                                {data.paths.map(path => (
                                    <div key={path.id} className="relative flex items-center gap-x-2">
                                        <input
                                            type="text"
                                            value={path.case.value}
                                            readOnly
                                            className="h-8 w-full border border-dark-200 rounded-md bg-dark-400 px-2.5 text-xs font-medium shadow-sm outline-none transition hover:bg-dark-300/30 read-only:text-light-900/80"
                                        />
                                        <button
                                            type="button"
                                            className="size-8 flex shrink-0 items-center justify-center border border-dark-100 rounded-md bg-dark-300 text-red-400 outline-none transition hover:(border-red-500/30 bg-dark-200)"
                                            onClick={() => handleRemovePath(path.id)}
                                        >
                                            <div className="i-mynaui:trash size-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )
                    : (
                            <div className="mt-2 border border-dark-100 rounded-lg border-dashed bg-dark-400/10 p-4 text-center">
                                <div className="text-[11px] text-light-900/40 italic">
                                    {data.condition
                                        ? "No routing branches configured yet. Add a branch path below."
                                        : "Select a condition attribute first to configure branch paths."}
                                </div>
                            </div>
                        )}

                {/* Add Path Button */}
                {filteredCaseList.length > 0 && (
                    <div className="mt-3 flex">
                        <DropdownMenu.Root>
                            <DropdownMenu.Trigger asChild>
                                <button
                                    type="button"
                                    className="h-8 w-full flex items-center justify-center border border-dark-50 rounded-md bg-dark-300 px-2.5 outline-none transition hover:(border-purple-500/30 bg-dark-200) active:(bg-dark-400)"
                                >
                                    <div className="flex items-center">
                                        <div className="text-xs text-light-900/80 font-semibold leading-none tracking-wide">
                                            Add Routing Branch
                                        </div>
                                    </div>

                                    <div className="i-lucide:plus ml-1.5 size-4 text-purple-400" />
                                </button>
                            </DropdownMenu.Trigger>

                            <DropdownMenu.Portal>
                                <DropdownMenu.Content
                                    sideOffset={5}
                                    className={cn(
                                        "min-w-48 select-none border border-dark-100 rounded-lg bg-dark-200/95 p-0.5 text-light-50 shadow-xl backdrop-blur-lg transition",
                                        "animate-in data-[side=top]:slide-in-bottom-0.5 data-[side=bottom]:slide-in-bottom--0.5 data-[side=bottom]:fade-in-40 data-[side=top]:fade-in-40",
                                    )}
                                >
                                    {filteredCaseList.map(path => (
                                        <DropdownMenu.Item
                                            key={path.id}
                                            className="h-8 flex cursor-pointer items-center border border-transparent rounded-md p-1.5 pr-6 outline-none transition active:bg-dark-300 hover:bg-dark-100/60"
                                            onSelect={() => handleAddPath({ id: path.id, value: path.value })}
                                        >
                                            <div className="text-xs text-light-900/90 font-medium leading-none">
                                                {path.value}
                                            </div>
                                        </DropdownMenu.Item>
                                    ))}
                                </DropdownMenu.Content>
                            </DropdownMenu.Portal>
                        </DropdownMenu.Root>
                    </div>
                )}
            </div>

            {/* Dynamic Accents & Information Banner */}
            <div className="mt-4 border border-purple-800/20 rounded-lg bg-purple-950/20 p-3">
                <div className="flex gap-2">
                    <div className="i-mynaui:git-branch mt-0.5 size-4 shrink-0 text-purple-400" />
                    <div className="flex flex-col">
                        <span className="text-[11px] text-purple-300 font-semibold">
                            WhatsApp Chatbot Router
                        </span>
                        <p className="mt-1 text-[10px] text-purple-300/70 leading-normal">
                            This node splits the conversation flow dynamically based on recipient attributes or message variables. Make sure all branch handles are connected to subsequent message cards.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
