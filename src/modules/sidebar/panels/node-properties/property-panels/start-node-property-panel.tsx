import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { listify } from "radash";
import { useMemo } from "react";

import type { StartNodeData } from "~/modules/nodes/nodes/start.node";
import type { BuilderNodeType } from "~/modules/nodes/types";

import { cn } from "~@/utils/cn";

type StartNodePropertyPanelProps = Readonly<{
    id: string;
    type: BuilderNodeType;
    data: StartNodeData;
    updateData: (data: Partial<StartNodeData>) => void;
}>;

const TriggerTypes = {
    exact: {
        name: "Exact Keyword Match",
        icon: "i-mynaui:hash",
        desc: "Triggers on exact match of keywords",
    },
    contains: {
        name: "Contains Keywords",
        icon: "i-mynaui:search",
        desc: "Triggers if message contains keywords",
    },
};

export default function StartNodePropertyPanel({ id, data, updateData }: StartNodePropertyPanelProps) {
    const currentTriggerDetail = useMemo(() => {
        const triggerType = data.triggerType || "exact";
        return TriggerTypes[triggerType];
    }, [data.triggerType]);

    return (
        <div className="flex flex-col gap-4.5 p-4">
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

            <div className="flex flex-col">
                <div className="text-xs text-light-900/60 font-semibold">
                    Node Label
                </div>

                <div className="mt-2 flex">
                    <input
                        type="text"
                        value={data.label || ""}
                        onChange={e => updateData({ label: e.target.value })}
                        placeholder="Start Trigger"
                        className="h-8 w-full border border-dark-200 rounded-md bg-dark-400 px-2.5 text-sm font-medium shadow-sm outline-none transition focus:(border-teal-800 bg-dark-500 ring-2 ring-teal-800/50) hover:(bg-dark-300/60) placeholder:(text-light-900/50 font-normal italic)"
                    />
                </div>
            </div>

            <div className="flex flex-col">
                <div className="text-xs text-light-900/60 font-semibold">
                    WhatsApp Trigger Rule
                </div>

                <div className="mt-2 flex">
                    <DropdownMenu.Root>
                        <DropdownMenu.Trigger asChild>
                            <button
                                type="button"
                                className="h-8 w-full flex items-center justify-between border border-dark-200 rounded-md bg-dark-400 px-2.5 shadow-sm outline-none transition active:(border-dark-200 bg-dark-400/50) data-[state=open]:(border-dark-200 bg-dark-500) data-[state=closed]:(hover:bg-dark-300/60)"
                            >
                                <div className="flex items-center">
                                    <div className={cn(currentTriggerDetail.icon, "size-4 text-emerald-400")} />

                                    <div className="ml-2 text-sm font-medium leading-none tracking-wide">
                                        {currentTriggerDetail.name}
                                    </div>
                                </div>

                                <div className="i-lucide:chevrons-up-down ml-1 size-3 op-50" />
                            </button>
                        </DropdownMenu.Trigger>

                        <DropdownMenu.Portal>
                            <DropdownMenu.Content
                                sideOffset={5}
                                align="start"
                                className={cn(
                                    "[width:var(--radix-popper-anchor-width)] select-none border border-dark-100 rounded-lg bg-dark-200/90 p-0.5 text-light-50 shadow-xl backdrop-blur-lg transition",
                                    "animate-in data-[side=top]:slide-in-bottom-0.5 data-[side=bottom]:slide-in-bottom--0.5 data-[side=bottom]:fade-in-40 data-[side=top]:fade-in-40",
                                )}
                            >
                                {listify(TriggerTypes, (k, v) => (
                                    <DropdownMenu.Item
                                        key={k}
                                        className="cursor-pointer border border-transparent rounded-lg p-1.5 outline-none transition active:(border-dark-100 bg-dark-300/60) hover:bg-dark-100"
                                        onSelect={() => updateData({ triggerType: k as any })}
                                    >
                                        <div className="flex flex-col gap-y-0.5">
                                            <div className="flex items-center gap-x-2">
                                                <div className={cn(v.icon, "size-4 text-emerald-400")} />

                                                <div className="text-xs text-light-50 font-semibold leading-none tracking-wide">
                                                    {v.name}
                                                </div>
                                            </div>
                                            <div className="pl-6 text-[10px] text-light-900/50 leading-none">
                                                {v.desc}
                                            </div>
                                        </div>
                                    </DropdownMenu.Item>
                                ))}
                            </DropdownMenu.Content>
                        </DropdownMenu.Portal>
                    </DropdownMenu.Root>
                </div>
            </div>

            <div className="flex flex-col">
                <div className="text-xs text-light-900/60 font-semibold">
                    Keywords (Comma Separated)
                </div>

                <div className="mt-2 flex">
                    <textarea
                        value={data.triggerKeywords || ""}
                        onChange={e => updateData({ triggerKeywords: e.target.value })}
                        placeholder="hello, hi, start, menu"
                        className="min-h-24 w-full resize-none border border-dark-200 rounded-md bg-dark-400 px-2.5 py-2 text-sm font-medium shadow-sm outline-none transition focus:(border-teal-800 bg-dark-500 ring-2 ring-teal-800/50) hover:(bg-dark-300/60) placeholder:(text-light-900/50 font-normal italic) read-only:(text-light-900/80)"
                    />
                </div>

                <div className="mt-1.5 text-[10px] text-light-900/40 leading-normal">
                    <span>
                        Separate multiple keywords with commas. E.g.
                        {" "}
                        <code className="rounded bg-dark-400 px-1 py-0.5 text-emerald-400 font-mono">
                            hello, hi, start
                        </code>
                    </span>
                </div>
            </div>
        </div>
    );
}
