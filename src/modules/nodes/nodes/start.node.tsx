import { type Node, type NodeProps, Position } from "@xyflow/react";
import { nanoid } from "nanoid";
import { memo, useCallback, useMemo, useState } from "react";

import CustomHandle from "~/modules/flow-builder/components/handles/custom-handle";
import { type BaseNodeData, BuilderNode, type RegisterNodeMetadata } from "~/modules/nodes/types";
import { getNodeDetail } from "~/modules/nodes/utils";
import StartNodePropertyPanel from "~/modules/sidebar/panels/node-properties/property-panels/start-node-property-panel";
import { useApplicationState } from "~/stores/application-state";

import { cn } from "~@/utils/cn";

export interface StartNodeData extends BaseNodeData {
    label?: string;
    triggerType?: "exact" | "contains";
    triggerKeywords?: string;
}

const NODE_TYPE = BuilderNode.START;

type StartNodeProps = NodeProps<Node<StartNodeData, typeof NODE_TYPE>>;

const TriggerRuleLabels = {
    exact: "Exact keyword match",
    contains: "Contains keywords",
};

const TriggerRuleIcons = {
    exact: "i-mynaui:hash",
    contains: "i-mynaui:search",
};

export function StartNode({ id, data, selected, isConnectable }: StartNodeProps) {
    const meta = useMemo(() => getNodeDetail(NODE_TYPE), []);

    const [showNodePropertiesOf] = useApplicationState(s => [s.actions.sidebar.showNodePropertiesOf]);
    const [sourceHandleId] = useState<string>(nanoid());

    const showNodeProperties = useCallback(() => {
        showNodePropertiesOf({ id, type: NODE_TYPE });
    }, [id, showNodePropertiesOf]);

    const activeTriggerRule = data.triggerType || "exact";

    const keywordList = useMemo(() => {
        if (!data.triggerKeywords) return [];
        return data.triggerKeywords
            .split(",")
            .map(k => k.trim())
            .filter(Boolean);
    }, [data.triggerKeywords]);

    return (
        <>
            <div
                data-selected={selected}
                className="w-xs overflow-clip border border-dark-200 rounded-xl bg-dark-300/50 shadow-sm backdrop-blur-xl transition divide-y divide-dark-200 data-[selected=true]:(border-emerald-600 ring-1 ring-emerald-600/50)"
                onDoubleClick={showNodeProperties}
            >
                <div className="relative bg-dark-300/50">
                    <div className="absolute inset-0">
                        <div className="absolute h-full w-3/5 from-emerald-900/20 to-transparent bg-gradient-to-r" />
                    </div>

                    <div className="relative h-9 flex items-center justify-between gap-x-4 px-0.5 py-0.5">
                        <div className="flex grow items-center pl-0.5">
                            <div className="size-7 flex items-center justify-center">
                                <div className="size-6 flex items-center justify-center rounded-lg bg-emerald-500/10">
                                    <div className={cn(meta.icon, "size-4 text-emerald-400")} />
                                </div>
                            </div>

                            <div className="ml-1 text-xs text-emerald-400/90 font-semibold leading-none tracking-wide uppercase op-80">
                                <span className="translate-y-px">
                                    {data.label || meta.title}
                                </span>
                            </div>
                        </div>

                        <div className="flex shrink-0 items-center gap-x-0.5 pr-0.5">
                            <button
                                type="button"
                                className="size-7 flex items-center justify-center border border-transparent rounded-lg bg-transparent outline-none transition active:(border-dark-200 bg-dark-400/50) hover:(bg-dark-100)"
                                onClick={() => showNodeProperties()}
                            >
                                <div className="i-mynaui:cog size-4 text-emerald-400" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col divide-y divide-dark-200">
                    <div className="flex flex-col p-4">
                        <div className="text-[10px] text-light-900/40 font-semibold tracking-wider uppercase">
                            WhatsApp Trigger Config
                        </div>

                        <div className="mt-1.5 text-xs text-light-900/60 font-medium">
                            Rule:
                            {" "}
                            <span className="text-light-50 font-semibold">{TriggerRuleLabels[activeTriggerRule]}</span>
                        </div>

                        <div className="mt-2.5">
                            <div className="flex flex-col gap-1.5">
                                <div className="text-[10px] text-light-900/40">
                                    Keywords:
                                </div>
                                {keywordList.length === 0
                                    ? (
                                            <div className="text-xs text-red-400/80 italic">
                                                No triggers configured yet. Double click node to edit.
                                            </div>
                                        )
                                    : (
                                            <div className="flex flex-wrap gap-1">
                                                {keywordList.map((kw, i) => (
                                                    <span
                                                        // eslint-disable-next-line react/no-array-index-key
                                                        key={i}
                                                        className="flex items-center gap-x-1 border border-emerald-500/20 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-400 font-medium"
                                                    >
                                                        <div className={cn(TriggerRuleIcons[activeTriggerRule], "size-3 op-70")} />
                                                        <span>{kw}</span>
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                            </div>
                        </div>
                    </div>

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
                type="source"
                id={sourceHandleId}
                position={Position.Right}
                isConnectable={isConnectable}
            />
        </>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export const metadata: RegisterNodeMetadata<StartNodeData> = {
    type: NODE_TYPE,
    node: memo(StartNode),
    detail: {
        icon: "i-mynaui:play",
        title: "Start Trigger",
        description: "Start the chatbot flow based on WhatsApp message rules",
    },
    available: false,
    defaultData: {
        label: "Start Trigger",
        deletable: false,
        triggerType: "exact",
        triggerKeywords: "",
    },
    propertyPanel: StartNodePropertyPanel,
};
