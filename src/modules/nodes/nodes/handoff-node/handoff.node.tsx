import { type Node, type NodeProps, Position } from "@xyflow/react";
import { memo, useMemo } from "react";

import type { HandoffNodeData } from "./types";

import CustomHandle from "~/modules/flow-builder/components/handles/custom-handle";
import { useDeleteNode } from "~/modules/flow-builder/hooks/use-delete-node";
import { BuilderNode, type RegisterNodeMetadata } from "~/modules/nodes/types";
import { getNodeDetail } from "~/modules/nodes/utils";
import HandoffNodePropertyPanel from "~/modules/sidebar/panels/node-properties/property-panels/handoff-node-property-panel";

import { cn } from "~@/utils/cn";

const NODE_TYPE = BuilderNode.HANDOFF;

export type { HandoffNodeData };

type HandoffNodeProps = NodeProps<Node<HandoffNodeData, typeof NODE_TYPE>>;

const ProviderLabels: Record<string, string> = {
    freshdesk: "Freshdesk",
    zoho: "Zoho Desk",
    intercom: "Intercom inbox",
    zendesk: "Zendesk Support",
    custom_webhook: "Custom CRM Webhook",
};

const ProviderIcons: Record<string, string> = {
    freshdesk: "i-mynaui:envelope",
    zoho: "i-mynaui:briefcase",
    intercom: "i-mynaui:chat",
    zendesk: "i-mynaui:info-triangle",
    custom_webhook: "i-mynaui:terminal",
};

export function HandoffNode({ id, isConnectable, selected, data }: HandoffNodeProps) {
    const meta = useMemo(() => getNodeDetail(NODE_TYPE), []);
    const deleteNode = useDeleteNode();

    const provider = data.destination || "custom_webhook";

    return (
        <div
            data-selected={selected}
            className="w-xs border border-dark-200 rounded-xl bg-dark-300/50 shadow-sm backdrop-blur-xl transition divide-y divide-dark-200 data-[selected=true]:(border-red-600 ring-1 ring-red-600/50)"
        >
            {/* Header */}
            <div className="relative overflow-clip rounded-t-xl bg-dark-300/50">
                <div className="absolute inset-0">
                    <div className="absolute h-full w-3/5 from-red-800/20 to-transparent bg-gradient-to-r" />
                </div>

                <div className="relative h-9 flex items-center justify-between gap-x-4 px-0.5 py-0.5">
                    <div className="flex grow items-center pl-0.5">
                        <div className="size-7 flex items-center justify-center">
                            <div className="size-6 flex items-center justify-center rounded-lg">
                                <div className={cn(meta.icon, "size-4 text-red-400")} />
                            </div>
                        </div>

                        <div className="ml-1 text-xs text-red-400 font-semibold leading-none tracking-wide uppercase op-80">
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
                {/* Provider details */}
                <div className="relative flex flex-col p-4">
                    <div className="text-[10px] text-light-900/40 font-semibold tracking-wider uppercase">
                        Escalation Target
                    </div>
                    <div className="mt-2.5 w-fit flex items-center gap-2 border border-red-500/20 rounded-lg bg-red-500/5 p-2">
                        <div className={cn(ProviderIcons[provider], "size-4.5 text-red-400 shrink-0")} />
                        <span className="text-xs text-light-50 font-semibold leading-none">
                            {ProviderLabels[provider]}
                        </span>
                    </div>

                    <div className="mt-4 text-[10px] text-light-900/40 font-semibold tracking-wider uppercase">
                        Automated Handoff Message
                    </div>
                    <p className="line-clamp-3 mt-1 text-xs text-light-900/80 leading-relaxed italic">
                        "
                        {data.message || "Connecting you to a live agent. Please hold for a moment."}
                        "
                    </p>

                    <CustomHandle
                        type="target"
                        position={Position.Left}
                        isConnectable={isConnectable}
                        className="top-6! hover:(important:ring-2 important:ring-red-500/50)"
                    />
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
export const metadata: RegisterNodeMetadata<HandoffNodeData> = {
    type: NODE_TYPE,
    node: memo(HandoffNode),
    propertyPanel: HandoffNodePropertyPanel,
    detail: {
        icon: "i-mynaui:users",
        title: "Human Handoff",
        description: "Bypass chatbot automated loops and escalate the user to a live support agent console.",
    },
    defaultData: {
        destination: "custom_webhook",
        message: "Connecting you to a live agent. Please hold for a moment.",
    },
};
