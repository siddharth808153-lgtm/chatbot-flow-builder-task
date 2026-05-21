import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { listify } from "radash";
import { useMemo } from "react";

import type { HandoffNodeData } from "~/modules/nodes/nodes/handoff-node/types";
import type { BuilderNodeType } from "~/modules/nodes/types";

import { cn } from "~@/utils/cn";

type HandoffNodePropertyPanelProps = Readonly<{
    id: string;
    type: BuilderNodeType;
    data: HandoffNodeData;
    updateData: (data: Partial<HandoffNodeData>) => void;
}>;

const ProviderDetails = {
    freshdesk: {
        name: "Freshdesk Support",
        icon: "i-mynaui:envelope",
        desc: "Escalates to Freshdesk email and ticketing dashboard",
    },
    zoho: {
        name: "Zoho Desk",
        icon: "i-mynaui:briefcase",
        desc: "Routes chat interactions into Zoho Desk ticketing system",
    },
    intercom: {
        name: "Intercom inbox",
        icon: "i-mynaui:chat",
        desc: "Routes directly to Intercom Live Chat inbox",
    },
    zendesk: {
        name: "Zendesk Support",
        icon: "i-mynaui:info-triangle",
        desc: "Transfers user conversation into Zendesk agent dashboard",
    },
    custom_webhook: {
        name: "Custom CRM Webhook",
        icon: "i-mynaui:terminal",
        desc: "Triggers custom payload to your custom webhook CRM",
    },
};

export default function HandoffNodePropertyPanel({ id, data, updateData }: HandoffNodePropertyPanelProps) {
    const currentProviderDetail = useMemo(() => {
        const dest = data.destination || "custom_webhook";
        return ProviderDetails[dest];
    }, [data.destination]);

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

            {/* Provider Selector Dropdown */}
            <div className="flex flex-col">
                <div className="text-xs text-light-900/60 font-semibold">
                    Handoff Destination CRM
                </div>

                <div className="mt-2 flex">
                    <DropdownMenu.Root>
                        <DropdownMenu.Trigger asChild>
                            <button
                                type="button"
                                className="h-8 w-full flex items-center justify-between border border-dark-200 rounded-md bg-dark-400 px-2.5 shadow-sm outline-none transition active:(border-dark-200 bg-dark-400/50) data-[state=open]:(border-dark-200 bg-dark-500) data-[state=closed]:(hover:bg-dark-300/60)"
                            >
                                <div className="flex items-center">
                                    <div className={cn(currentProviderDetail.icon, "size-4 text-red-400")} />
                                    <div className="ml-2 text-sm font-medium leading-none tracking-wide">
                                        {currentProviderDetail.name}
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
                                {listify(ProviderDetails, (k, v) => (
                                    <DropdownMenu.Item
                                        key={k}
                                        className="cursor-pointer border border-transparent rounded-lg p-1.5 outline-none transition active:(border-dark-100 bg-dark-300/60) hover:bg-dark-100"
                                        onSelect={() => updateData({ destination: k as any })}
                                    >
                                        <div className="flex flex-col gap-y-0.5">
                                            <div className="flex items-center gap-x-2">
                                                <div className={cn(v.icon, "size-4 text-red-400")} />
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

            {/* Handoff Response Message */}
            <div className="flex flex-col">
                <div className="text-xs text-light-900/60 font-semibold">
                    Escalation Response Message
                </div>
                <div className="mt-2 flex">
                    <textarea
                        value={data.message || ""}
                        onChange={e => updateData({ message: e.target.value })}
                        placeholder="Connecting you to a live agent. Please hold for a moment."
                        className="min-h-24 w-full resize-none border border-dark-200 rounded-md bg-dark-400 px-2.5 py-2 text-sm font-medium shadow-sm outline-none transition focus:(border-red-800 bg-dark-500 ring-2 ring-red-800/50) hover:(bg-dark-300/60) placeholder:(text-light-900/50 font-normal italic)"
                    />
                </div>
                <div className="mt-1.5 text-[10px] text-light-900/40 leading-normal">
                    This message will automatically dispatch to the customer before disabling bot interactions and routing all forthcoming messages to the live inbox.
                </div>
            </div>

            {/* Compliance Alert */}
            <div className="mt-3 border border-red-800/20 rounded-lg bg-red-950/20 p-3">
                <div className="flex gap-2">
                    <div className="i-mynaui:info-triangle mt-0.5 size-4.5 shrink-0 text-red-400" />
                    <div className="flex flex-col">
                        <span className="text-[11px] text-red-300 font-semibold">
                            Meta CRM Compliance
                        </span>
                        <p className="mt-1 text-[10px] text-red-300/70 leading-normal">
                            WhatsApp Business API guidelines strictly require a human agent handoff capability when automated bots cannot resolve user queries or fail consecutive intents.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
