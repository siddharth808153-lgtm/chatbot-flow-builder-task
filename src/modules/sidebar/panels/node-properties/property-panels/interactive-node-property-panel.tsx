import { useReactFlow } from "@xyflow/react";
import { nanoid } from "nanoid";

import type { InteractiveNodeData } from "~/modules/nodes/nodes/interactive-node/types";
import type { BuilderNodeType } from "~/modules/nodes/types";

import { cn } from "~@/utils/cn";

type InteractiveNodePropertyPanelProps = Readonly<{
    id: string;
    type: BuilderNodeType;
    data: InteractiveNodeData;
    updateData: (data: Partial<InteractiveNodeData>) => void;
}>;

export default function InteractiveNodePropertyPanel({ id, data, updateData }: InteractiveNodePropertyPanelProps) {
    const { setEdges } = useReactFlow();

    const activeType = data.interactiveType || "button";

    const handleTypeChange = (typeVal: InteractiveNodeData["interactiveType"]) => {
        updateData({
            interactiveType: typeVal,
        });
        // Clear all outgoing edges from this node since handles will rebuild
        setEdges(edges => edges.filter(edge => edge.source !== id));
    };

    // Button builder helpers
    const handleAddButton = () => {
        const currentButtons = data.buttons || [];
        if (currentButtons.length >= 3) return;

        const newButtons = [
            ...currentButtons,
            {
                id: nanoid(),
                title: `Button ${currentButtons.length + 1}`,
            },
        ];
        updateData({ buttons: newButtons });
    };

    const handleUpdateButtonTitle = (btnId: string, titleVal: string) => {
        const updated = (data.buttons || []).map((btn) => {
            if (btn.id === btnId) {
                return { ...btn, title: titleVal };
            }
            return btn;
        });
        updateData({ buttons: updated });
    };

    const handleRemoveButton = (btnId: string) => {
        const updated = (data.buttons || []).filter(btn => btn.id !== btnId);
        updateData({ buttons: updated });
        // Clean up the edge connected to this button
        setEdges(edges => edges.filter(edge => edge.sourceHandle !== btnId));
    };

    // List row builder helpers
    const handleAddListRow = () => {
        const currentRows = data.listRows || [];
        if (currentRows.length >= 10) return;

        const newRows = [
            ...currentRows,
            {
                id: nanoid(),
                title: `Option ${currentRows.length + 1}`,
                description: "",
            },
        ];
        updateData({ listRows: newRows });
    };

    const handleUpdateRowField = (rowId: string, field: "title" | "description", val: string) => {
        const updated = (data.listRows || []).map((row) => {
            if (row.id === rowId) {
                return { ...row, [field]: val };
            }
            return row;
        });
        updateData({ listRows: updated });
    };

    const handleRemoveListRow = (rowId: string) => {
        const updated = (data.listRows || []).filter(row => row.id !== rowId);
        updateData({ listRows: updated });
        // Clean up the edge connected to this row
        setEdges(edges => edges.filter(edge => edge.sourceHandle !== rowId));
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

            {/* Menu Type Tab Selectors */}
            <div className="flex flex-col">
                <div className="mb-2 text-xs text-light-900/60 font-semibold">
                    Interactive Message Type
                </div>
                <div className="flex border border-dark-100 rounded-lg bg-dark-500 p-0.5">
                    <button
                        type="button"
                        className={cn(
                            "flex-1 text-center py-1 text-xs font-semibold rounded-md transition outline-none cursor-pointer",
                            activeType === "button"
                                ? "bg-indigo-600 text-white shadow-sm"
                                : "bg-transparent text-light-900/60 hover:text-light-50",
                        )}
                        onClick={() => handleTypeChange("button")}
                    >
                        Buttons (Max 3)
                    </button>
                    <button
                        type="button"
                        className={cn(
                            "flex-1 text-center py-1 text-xs font-semibold rounded-md transition outline-none cursor-pointer",
                            activeType === "list"
                                ? "bg-indigo-600 text-white shadow-sm"
                                : "bg-transparent text-light-900/60 hover:text-light-50",
                        )}
                        onClick={() => handleTypeChange("list")}
                    >
                        List Menu
                    </button>
                    <button
                        type="button"
                        className={cn(
                            "flex-1 text-center py-1 text-xs font-semibold rounded-md transition outline-none cursor-pointer",
                            activeType === "cta_url"
                                ? "bg-indigo-600 text-white shadow-sm"
                                : "bg-transparent text-light-900/60 hover:text-light-50",
                        )}
                        onClick={() => handleTypeChange("cta_url")}
                    >
                        Link URL
                    </button>
                </div>
            </div>

            {/* Prompt Text / Body Prompt */}
            <div className="flex flex-col">
                <div className="text-xs text-light-900/60 font-semibold">
                    Body Text Prompt
                </div>
                <div className="mt-2 flex">
                    <textarea
                        value={data.bodyText || ""}
                        onChange={e => updateData({ bodyText: e.target.value })}
                        placeholder="Choose an option below to continue..."
                        className="min-h-20 w-full resize-none border border-dark-200 rounded-md bg-dark-400 px-2.5 py-2 text-sm font-medium shadow-sm outline-none transition focus:(border-indigo-800 bg-dark-500 ring-2 ring-indigo-800/50) hover:(bg-dark-300/60) placeholder:(text-light-900/50 font-normal italic)"
                    />
                </div>
            </div>

            {/* Dynamic Controls based on selected interactive type */}
            {activeType === "button" && (
                <div className="flex flex-col gap-3">
                    <div className="text-xs text-light-900/60 font-semibold">
                        Configure Reply Buttons
                    </div>
                    <div className="flex flex-col gap-2.5">
                        {(data.buttons || []).map((btn, idx) => (
                            <div key={btn.id} className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={btn.title}
                                    maxLength={20}
                                    onChange={e => handleUpdateButtonTitle(btn.id, e.target.value)}
                                    placeholder={`Button ${idx + 1}`}
                                    className="h-8 w-full border border-dark-200 rounded-md bg-dark-400 px-2.5 text-sm font-medium shadow-sm outline-none transition focus:(border-indigo-800 bg-dark-500 ring-2 ring-indigo-800/50) hover:(bg-dark-300/60)"
                                />
                                <button
                                    type="button"
                                    className="size-8 flex shrink-0 items-center justify-center border border-dark-100 rounded-md bg-dark-300 text-red-400 outline-none transition hover:(border-red-500/30 bg-dark-200)"
                                    onClick={() => handleRemoveButton(btn.id)}
                                >
                                    <div className="i-mynaui:trash size-4" />
                                </button>
                            </div>
                        ))}
                    </div>

                    {(!data.buttons || data.buttons.length < 3) && (
                        <button
                            type="button"
                            className="mt-1 h-8 w-full flex items-center justify-center border border-dark-50 rounded-md bg-dark-300 px-2.5 outline-none transition hover:(border-indigo-500/30 bg-dark-200)"
                            onClick={handleAddButton}
                        >
                            <div className="text-xs text-light-900/80 font-semibold">Add Reply Button</div>
                            <div className="i-lucide:plus ml-1.5 size-4 text-indigo-400" />
                        </button>
                    )}
                </div>
            )}

            {activeType === "list" && (
                <div className="flex flex-col gap-3">
                    <div className="text-xs text-light-900/60 font-semibold">
                        List Action Button Label
                    </div>
                    <input
                        type="text"
                        value={data.listButtonText || ""}
                        maxLength={20}
                        onChange={e => updateData({ listButtonText: e.target.value })}
                        placeholder="View Options"
                        className="h-8 w-full border border-dark-200 rounded-md bg-dark-400 px-2.5 text-sm font-medium shadow-sm outline-none transition focus:(border-indigo-800 bg-dark-500 ring-2 ring-indigo-800/50) hover:(bg-dark-300/60)"
                    />

                    <div className="mt-1 text-xs text-light-900/60 font-semibold">
                        List Menu Options (Max 10)
                    </div>
                    <div className="flex flex-col gap-3">
                        {(data.listRows || []).map((row, idx) => (
                            <div key={row.id} className="flex items-start gap-2 border-b border-dark-100/30 pb-3">
                                <div className="flex flex-1 flex-col gap-2">
                                    <input
                                        type="text"
                                        value={row.title}
                                        maxLength={24}
                                        onChange={e => handleUpdateRowField(row.id, "title", e.target.value)}
                                        placeholder={`Option ${idx + 1} Label`}
                                        className="h-8 w-full border border-dark-200 rounded-md bg-dark-400 px-2.5 text-xs font-semibold shadow-sm outline-none transition focus:(border-indigo-800 bg-dark-500 ring-2 ring-indigo-800/50) hover:(bg-dark-300/60)"
                                    />
                                    <input
                                        type="text"
                                        value={row.description || ""}
                                        maxLength={72}
                                        onChange={e => handleUpdateRowField(row.id, "description", e.target.value)}
                                        placeholder="Optional subtitle / description"
                                        className="h-7 w-full border border-dark-200 rounded-md bg-dark-400 px-2.5 text-[11px] font-medium shadow-sm outline-none transition focus:(border-indigo-800 bg-dark-500 ring-2 ring-indigo-800/50) hover:(bg-dark-300/60)"
                                    />
                                </div>
                                <button
                                    type="button"
                                    className="mt-0.5 size-8 flex shrink-0 items-center justify-center border border-dark-100 rounded-md bg-dark-300 text-red-400 outline-none transition hover:(border-red-500/30 bg-dark-200)"
                                    onClick={() => handleRemoveListRow(row.id)}
                                >
                                    <div className="i-mynaui:trash size-4" />
                                </button>
                            </div>
                        ))}
                    </div>

                    {(!data.listRows || data.listRows.length < 10) && (
                        <button
                            type="button"
                            className="mt-1 h-8 w-full flex items-center justify-center border border-dark-50 rounded-md bg-dark-300 px-2.5 outline-none transition hover:(border-indigo-500/30 bg-dark-200)"
                            onClick={handleAddListRow}
                        >
                            <div className="text-xs text-light-900/80 font-semibold">Add List Option</div>
                            <div className="i-lucide:plus ml-1.5 size-4 text-indigo-400" />
                        </button>
                    )}
                </div>
            )}

            {activeType === "cta_url" && (
                <div className="flex flex-col gap-3">
                    <div className="flex flex-col">
                        <div className="text-xs text-light-900/60 font-semibold">
                            CTA Button Text
                        </div>
                        <input
                            type="text"
                            value={data.ctaText || ""}
                            maxLength={20}
                            onChange={e => updateData({ ctaText: e.target.value })}
                            placeholder="Open Link"
                            className="mt-2 h-8 w-full border border-dark-200 rounded-md bg-dark-400 px-2.5 text-sm font-medium shadow-sm outline-none transition focus:(border-indigo-800 bg-dark-500 ring-2 ring-indigo-800/50) hover:(bg-dark-300/60)"
                        />
                    </div>
                    <div className="flex flex-col">
                        <div className="text-xs text-light-900/60 font-semibold">
                            Button Action URL
                        </div>
                        <input
                            type="url"
                            value={data.ctaUrl || ""}
                            onChange={e => updateData({ ctaUrl: e.target.value })}
                            placeholder="https://yoursite.com/invoice/123"
                            className="mt-2 h-8 w-full border border-dark-200 rounded-md bg-dark-400 px-2.5 text-sm font-medium shadow-sm outline-none transition focus:(border-indigo-800 bg-dark-500 ring-2 ring-indigo-800/50) hover:(bg-dark-300/60) placeholder:italic"
                        />
                    </div>
                </div>
            )}

            {/* Guided Flows Accent Card */}
            <div className="mt-3 border border-indigo-800/20 rounded-lg bg-indigo-950/20 p-3">
                <div className="flex gap-2">
                    <div className="i-mynaui:check-double mt-0.5 size-4 shrink-0 text-indigo-400" />
                    <div className="flex flex-col">
                        <span className="text-[11px] text-indigo-300 font-semibold">
                            Guided Flows & Buttons
                        </span>
                        <p className="mt-1 text-[10px] text-indigo-300/70 leading-normal">
                            Interactive Reply Buttons and menus reduce user typing friction. Direct responses flow down to designated subsequent nodes by linking each handle individually.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
