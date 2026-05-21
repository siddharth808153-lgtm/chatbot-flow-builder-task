import { type Node, type NodeProps, Position } from "@xyflow/react";
import { nanoid } from "nanoid";
import { memo, useCallback, useMemo, useState } from "react";

import type { LocationNodeData } from "./types";

import CustomHandle from "~/modules/flow-builder/components/handles/custom-handle";
import { useDeleteNode } from "~/modules/flow-builder/hooks/use-delete-node";
import { BuilderNode, type RegisterNodeMetadata } from "~/modules/nodes/types";
import { getNodeDetail } from "~/modules/nodes/utils";
import LocationNodePropertyPanel from "~/modules/sidebar/panels/node-properties/property-panels/location-node-property-panel";
import { useApplicationState } from "~/stores/application-state";

import { cn } from "~@/utils/cn";

const NODE_TYPE = BuilderNode.LOCATION;

export type { LocationNodeData };

type LocationNodeProps = NodeProps<Node<LocationNodeData, typeof NODE_TYPE>>;

export function LocationNode({ id, isConnectable, selected, data }: LocationNodeProps) {
    const meta = useMemo(() => getNodeDetail(NODE_TYPE), []);

    const [showNodePropertiesOf] = useApplicationState(s => [s.actions.sidebar.showNodePropertiesOf]);
    const [sourceHandleId] = useState<string>(nanoid());
    const deleteNode = useDeleteNode();

    const showNodeProperties = useCallback(() => {
        showNodePropertiesOf({ id, type: NODE_TYPE });
    }, [id, showNodePropertiesOf]);

    const hasLocation = useMemo(() => {
        return !!(data.name || data.address || data.latitude || data.longitude);
    }, [data.name, data.address, data.latitude, data.longitude]);

    return (
        <>
            <div
                data-selected={selected}
                className="w-xs overflow-clip border border-dark-200 rounded-xl bg-dark-300/50 shadow-sm backdrop-blur-xl transition divide-y divide-dark-200 data-[selected=true]:(border-sky-600 ring-1 ring-sky-600/50)"
                onDoubleClick={showNodeProperties}
            >
                {/* Node Header */}
                <div className="relative bg-dark-300/50">
                    <div className="absolute inset-0">
                        <div className="absolute h-full w-3/5 from-sky-900/20 to-transparent bg-gradient-to-r" />
                    </div>

                    <div className="relative h-9 flex items-center justify-between gap-x-4 px-0.5 py-0.5">
                        <div className="flex grow items-center pl-0.5">
                            <div className="size-7 flex items-center justify-center">
                                <div className="size-6 flex items-center justify-center rounded-lg bg-sky-500/10 text-sky-400">
                                    <div className={cn(meta.icon, "size-4")} />
                                </div>
                            </div>

                            <div className="ml-1 text-xs text-sky-400 font-semibold leading-none tracking-wide uppercase op-80">
                                <span className="translate-y-px">
                                    {meta.title}
                                </span>
                            </div>
                        </div>

                        <div className="flex shrink-0 items-center gap-x-0.5 pr-0.5">
                            <button
                                type="button"
                                className="size-7 flex items-center justify-center border border-transparent rounded-lg bg-transparent text-sky-400 outline-none transition active:(border-dark-200 bg-dark-400/50) hover:(bg-dark-100)"
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

                {/* Node Body Content */}
                <div className="flex flex-col divide-y divide-dark-200">
                    <div className="flex flex-col gap-y-2 p-4">
                        {hasLocation
                            ? (
                                    <div className="flex flex-col gap-y-1.5">
                                        {/* Name & Address */}
                                        <div className="flex items-center gap-x-2">
                                            <div className="size-8 flex shrink-0 items-center justify-center border border-sky-500/20 rounded-full bg-sky-500/10 text-sky-400">
                                                <div className="i-mynaui:location size-4" />
                                            </div>
                                            <div className="min-w-0 flex flex-col">
                                                <div className="truncate text-xs text-light-50 font-bold">
                                                    {data.name || "Unnamed Location"}
                                                </div>
                                                {data.address && (
                                                    <div className="truncate text-[10px] text-light-900/50 leading-normal">
                                                        {data.address}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Coordinates Detail */}
                                        {(data.latitude || data.longitude) && (
                                            <div className="mt-1 flex flex-col gap-y-1 border border-dark-100/50 rounded-lg bg-dark-400/30 p-2">
                                                <div className="flex items-center gap-x-1.5 text-xs text-light-900/70">
                                                    <div className="i-mynaui:compass size-3 text-sky-400 op-80" />
                                                    <span className="text-[10px] font-mono">
                                                        Lat: {data.latitude || "0"} | Lng: {data.longitude || "0"}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )
                            : (
                                    <button
                                        type="button"
                                        className="w-full flex flex-col cursor-pointer items-center justify-center border border-dark-100 rounded-lg border-dashed bg-dark-400/30 p-6 transition hover:(border-sky-600/50 bg-dark-400/50)"
                                        onClick={showNodeProperties}
                                    >
                                        <div className="i-mynaui:location size-8 text-light-900/30" />
                                        <span className="mt-2 text-xs text-light-900/50 italic">
                                            Double click to add location info
                                        </span>
                                    </button>
                                )}
                    </div>

                    {/* Node Footer */}
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

            {/* Connection Handles */}
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
export const metadata: RegisterNodeMetadata<LocationNodeData> = {
    type: NODE_TYPE,
    node: memo(LocationNode),
    detail: {
        icon: "i-mynaui:location",
        title: "Location",
        description: "Send a physical location (coordinates, name, address) to users via WhatsApp.",
    },
    defaultData: {
        latitude: "",
        longitude: "",
        name: "",
        address: "",
    },
    propertyPanel: LocationNodePropertyPanel,
};
